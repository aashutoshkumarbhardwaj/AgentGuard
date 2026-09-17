from fastapi import FastAPI
from app.api.actions import router as action_router
from app.api.approvals import router as approval_router
from app.api.simulation import router as simulation_router
from app.api.audit import router as audit_router


app = FastAPI(
    title="AgentGuard",
    description="Runtime security and governance layer for AI agents",
    version="0.1.0"
)
app.include_router(action_router)
app.include_router(approval_router)
app.include_router(simulation_router)
app.include_router(audit_router)


@app.get("/")
def root():
    return {
        "name": "AgentGuard",
        "status": "online",
        "message": "AI agent control layer is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }