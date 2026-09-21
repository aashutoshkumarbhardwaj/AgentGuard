import os
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.decision import get_decision_engine, DecisionResult
from app.db.agents import get_config_val, set_config_val, delete_config_val

router = APIRouter(prefix="/v1/decision", tags=["Decision Engine"])


def _mask_key(key: Optional[str]) -> Optional[str]:
    if not key or not isinstance(key, str):
        return None
    k = key.strip()
    if len(k) <= 8:
        return "••••••••"
    return f"{k[:4]}••••••••{k[-4:]}"


class DecisionTestRequest(BaseModel):
    tool: str = Field("create_item", description="Tool name to evaluate")
    action: str = Field("modify", description="Action type")
    risk_score: int = Field(70, description="Risk score 0-100")
    risk_level: str = Field("HIGH", description="Risk level")
    agent: Optional[str] = Field("playground", description="Agent ID")
    external: Optional[bool] = Field(False, description="Whether destination is external")


class DecisionKeysUpdateRequest(BaseModel):
    typesafe_api_key: Optional[str] = Field(None, description="TypeSafe Jev API Key")
    openjev_api_key: Optional[str] = Field(None, description="OpenJev / Codiv API Key")
    openjev_base_url: Optional[str] = Field(None, description="Custom OpenJev endpoint URL")


@router.get("/status")
def get_decision_status() -> Dict[str, Any]:
    engine = get_decision_engine()

    ts_key = getattr(engine.primary, "api_key", "")
    oj_key = getattr(engine.fallback, "api_key", "")
    oj_url = getattr(engine.fallback, "base_url", "https://api.codiv.ai")

    ts_db = bool(get_config_val("typesafe_api_key"))
    oj_db = bool(get_config_val("openjev_api_key"))

    return {
        "enabled": engine.enabled,
        "primary": {
            "name": "typesafe",
            "displayName": "TypeSafe Jev",
            "model": getattr(engine.primary, "model", "jev-latest"),
            "configured": bool(ts_key),
            "maskedKey": _mask_key(ts_key),
            "source": "database" if ts_db else ("env" if os.environ.get("TYPESAFE_API_KEY") else "none"),
        },
        "fallback": {
            "name": "openjev",
            "displayName": "OpenJev (Jev-compatible)",
            "model": getattr(engine.fallback, "model", "openjev-latest"),
            "configured": bool(oj_key),
            "maskedKey": _mask_key(oj_key),
            "endpoint": oj_url,
            "source": "database" if oj_db else ("env" if os.environ.get("OPENJEV_API_KEY") else "none"),
        },
        "failsafe": {
            "name": "deterministic",
            "displayName": "Deterministic Rules",
            "model": "deterministic-rules",
            "configured": True,
        },
        "allow_threshold": engine.allow_threshold,
        "block_threshold": engine.block_threshold,
    }


@router.post("/keys")
def update_decision_keys(req: DecisionKeysUpdateRequest) -> Dict[str, Any]:
    engine = get_decision_engine()
    updated = []

    if req.typesafe_api_key is not None:
        val = req.typesafe_api_key.strip()
        if val:
            set_config_val("typesafe_api_key", val)
            engine.primary.api_key = val
            updated.append("typesafe_api_key")
        else:
            delete_config_val("typesafe_api_key")
            engine.primary.api_key = None
            updated.append("typesafe_api_key (cleared)")

    if req.openjev_api_key is not None:
        val = req.openjev_api_key.strip()
        if val:
            set_config_val("openjev_api_key", val)
            engine.fallback.api_key = val
            updated.append("openjev_api_key")
        else:
            delete_config_val("openjev_api_key")
            engine.fallback.api_key = None
            updated.append("openjev_api_key (cleared)")

    if req.openjev_base_url is not None:
        val = req.openjev_base_url.strip()
        if val:
            set_config_val("openjev_base_url", val)
            engine.fallback.base_url = val
            updated.append("openjev_base_url")
        else:
            delete_config_val("openjev_base_url")
            engine.fallback.base_url = None
            updated.append("openjev_base_url (reset)")

    return {
        "status": "success",
        "updated": updated,
        "message": "Decision Engine keys updated successfully. Available immediately for all tool calls.",
        "decision_status": get_decision_status(),
    }


@router.delete("/keys/{provider}")
def clear_decision_key(provider: str) -> Dict[str, Any]:
    engine = get_decision_engine()
    prov = provider.lower().strip()
    if prov in ("typesafe", "typesafe_jev", "primary"):
        delete_config_val("typesafe_api_key")
        engine.primary.api_key = None
        return {"status": "cleared", "provider": "typesafe", "decision_status": get_decision_status()}
    elif prov in ("openjev", "codiv", "fallback"):
        delete_config_val("openjev_api_key")
        engine.fallback.api_key = None
        return {"status": "cleared", "provider": "openjev", "decision_status": get_decision_status()}
    else:
        raise HTTPException(status_code=400, detail=f"Unknown provider '{provider}'. Choose 'typesafe' or 'openjev'.")


@router.post("/evaluate", response_model=DecisionResult)
async def test_evaluate_decision(req: DecisionTestRequest) -> DecisionResult:
    engine = get_decision_engine()
    state = {
        "tool": req.tool,
        "action": req.action,
        "risk_score": req.risk_score,
        "risk_level": req.risk_level,
        "agent": req.agent,
        "external": req.external,
        "source": "api_test",
    }
    return await engine.evaluate(state)
