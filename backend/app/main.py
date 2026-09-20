import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.agents import init_db, seed_agents
from app.db.audit import init_audit_db
from app.api.actions import router as action_router
from app.api.approvals import router as approval_router
from app.api.simulation import router as simulation_router
from app.api.audit import router as audit_router
from app.api.authorize import router as authorize_router
from app.api.agents import router as agents_router
from app.api.mcp import router as mcp_router
from app.api.policies import router as policies_router

logger = logging.getLogger("agentguard.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Core DB initialisation ──────────────────────────────────────────────
    init_db()
    seed_agents()
    init_audit_db()

    # ── MCP upstream connection ─────────────────────────────────────────────
    # Import here to avoid heavyweight MCP SDK import at module level when
    # running tests that don't exercise the HTTP gateway.
    from app.mcp.mcp_server import load_upstream_config
    from app.mcp.upstream import UpstreamManager

    configs = load_upstream_config()
    upstream_manager = UpstreamManager(configs)

    try:
        await upstream_manager.connect_all()
        n = len(upstream_manager.sessions)
        logger.info(f"MCP Gateway: connected to {n} upstream server(s). Tools available: {n > 0}")
    except Exception as exc:
        logger.warning(f"MCP Gateway: upstream connection failed at startup ({exc}). Gateway will start with no upstream tools.")

    app.state.mcp_upstream = upstream_manager

    yield

    # ── Cleanup ─────────────────────────────────────────────────────────────
    await upstream_manager.close()


# ── Application ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="AgentGuard",
    description="Runtime security and governance layer for AI agents",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
origins_str = (
    os.environ.get("AGENTGUARD_ALLOWED_ORIGINS")
    or os.environ.get("AGENTGUARD_CORS_ORIGINS")
    or "http://localhost:3000,http://127.0.0.1:3000"
)
origins = [origin.strip() for origin in origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── REST API routers ─────────────────────────────────────────────────────────
app.include_router(action_router)
app.include_router(approval_router)
app.include_router(simulation_router)
app.include_router(audit_router)
app.include_router(audit_router, prefix="/v1")
app.include_router(authorize_router)
app.include_router(agents_router)
app.include_router(mcp_router)
app.include_router(policies_router)
app.include_router(policies_router, prefix="/v1")

# ── MCP Streamable HTTP gateway at /mcp ─────────────────────────────────────
# The gateway is mounted as a sub-ASGI app.  It shares the UpstreamManager
# created in `lifespan` above via app.state.mcp_upstream.
# Mounting must happen at module level (before uvicorn starts accepting
# requests); the upstream_manager is passed lazily via a closure so that
# the connect_all() call in lifespan runs first.

from app.mcp.mcp_server import load_upstream_config, create_gateway_http_app  # noqa: E402
from app.mcp.upstream import UpstreamManager  # noqa: E402

_mcp_upstream_manager = UpstreamManager(load_upstream_config())
_mcp_http_app = create_gateway_http_app(_mcp_upstream_manager)

# We re-use the same manager in lifespan via a module-level reference so
# connect_all() / close() are called exactly once on it.
_SHARED_MCP_MANAGER = _mcp_upstream_manager


@asynccontextmanager
async def _patched_lifespan(app: FastAPI):
    """
    Overrides the lifespan defined above so the shared MCP manager
    is connected before requests arrive and closed on shutdown.
    """
    init_db()
    seed_agents()
    init_audit_db()

    try:
        await _SHARED_MCP_MANAGER.connect_all()
        n = len(_SHARED_MCP_MANAGER.sessions)
        logger.info(f"MCP Gateway: connected to {n} upstream server(s).")
    except Exception as exc:
        logger.warning(f"MCP Gateway: upstream init failed ({exc}). Running with no upstream tools.")

    app.state.mcp_upstream = _SHARED_MCP_MANAGER
    yield
    await _SHARED_MCP_MANAGER.close()


# Replace the lifespan with the patched one that initialises the shared manager
app.router.lifespan_context = _patched_lifespan

app.mount("/mcp", _mcp_http_app)


# ── Root / health ────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "name": "AgentGuard",
        "status": "online",
        "message": "AI agent control layer is running",
        "mcp_gateway": "available at /mcp",
    }


@app.get("/health")
def health():
    try:
        from app.db.agents import get_connection
        conn = get_connection()
        conn.execute("SELECT 1")
        conn.close()
        db_status = "online"
    except Exception:
        db_status = "offline"

    bedrock_configured = bool(os.environ.get("BEDROCK_GUARDRAIL_ID", "").strip())
    bedrock_required = os.environ.get("BEDROCK_REQUIRED", "false").lower() in ("true", "1", "yes")
    bedrock_ready = False

    if bedrock_configured:
        try:
            from app.services.bedrock_guardrail import get_bedrock_client
            client = get_bedrock_client()
            bedrock_ready = client is not None
        except Exception:
            bedrock_ready = False

    mcp_upstream_count = len(_SHARED_MCP_MANAGER.sessions) if _SHARED_MCP_MANAGER else 0
    mcp_tools_count = len(_SHARED_MCP_MANAGER.discovered_tools) if _SHARED_MCP_MANAGER else 0

    is_healthy = (db_status == "online") and (not bedrock_required or bedrock_ready)

    return {
        "status": "healthy" if is_healthy else "degraded",
        "service": "agentguard",
        "version": "1.0.0",
        "bedrock": bedrock_ready,
        "database": db_status,
        "authorization_engine": "online",
        "risk_engine": "online",
        "threat_detector": "online",
        "audit": db_status,
        "mcp_gateway": "online",
        "mcp_upstream_servers": mcp_upstream_count,
        "mcp_tools_discovered": mcp_tools_count,
    }
