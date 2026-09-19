from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db.agents import init_db, seed_agents
from app.db.audit import init_audit_db
from app.api.actions import router as action_router
from app.api.approvals import router as approval_router
from app.api.simulation import router as simulation_router
from app.api.audit import router as audit_router
from app.api.authorize import router as authorize_router
from app.api.agents import router as agents_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_agents()
    init_audit_db()
    yield


from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="AgentGuard",
    description="Runtime security and governance layer for AI agents",
    version="1.0.0",
    lifespan=lifespan
)

origins = os.environ.get("AGENTGUARD_CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(action_router)
app.include_router(approval_router)
app.include_router(simulation_router)
app.include_router(audit_router)
app.include_router(authorize_router)
app.include_router(agents_router)


@app.get("/")
def root():
    return {
        "name": "AgentGuard",
        "status": "online",
        "message": "AI agent control layer is running"
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

    return {
        "status": "healthy" if db_status == "online" else "degraded",
        "authorization_engine": "online",
        "risk_engine": "online",
        "threat_detector": "online",
        "audit": db_status
    }
