import pytest
import asyncio
from unittest.mock import AsyncMock
import anyio
import httpx

from app.main import app, _SHARED_MCP_MANAGER
from app.decision.models import Decision, DecisionResult
from app.decision.deterministic import DeterministicProvider
from app.decision.typesafe_jev import TypeSafeJevProvider
from app.decision.openjev import OpenJevProvider
from app.decision.engine import DecisionEngine
from app.core.audit import get_last_audit_log, verify_audit_chain
from app.mcp.upstream import UpstreamServerConfig
from tests.mock_upstream_mcp import create_mock_server, EXECUTION_COUNTS, reset_counts


@pytest.fixture(autouse=True)
def clean_test_state():
    reset_counts()
    yield
    reset_counts()


# --------------------------------------------------------------------------
# 1. Deterministic Provider Tests
# --------------------------------------------------------------------------
@pytest.mark.anyio
async def test_deterministic_provider_actions():
    prov = DeterministicProvider()
    
    # Safe read
    res_read = await prov.evaluate({"tool": "get_item", "action": "read", "risk_score": 20, "risk_level": "LOW"})
    assert res_read.decision == Decision.ALLOW
    assert res_read.confidence >= 0.85
    assert res_read.probabilities["ALLOW"] > 0.8
    assert res_read.provider == "deterministic"

    # High-risk modify
    res_mod = await prov.evaluate({"tool": "create_item", "action": "modify", "risk_score": 70, "risk_level": "HIGH"})
    assert res_mod.decision == Decision.APPROVE
    assert res_mod.probabilities["APPROVE"] > 0.8

    # Destructive delete
    res_del = await prov.evaluate({"tool": "delete_item", "action": "delete", "risk_score": 100, "risk_level": "CRITICAL"})
    assert res_del.decision == Decision.BLOCK
    assert res_del.probabilities["BLOCK"] > 0.9


# --------------------------------------------------------------------------
# 2. TypeSafe Jev Provider Parsing
# --------------------------------------------------------------------------
@pytest.mark.anyio
async def test_typesafe_jev_parsing():
    prov = TypeSafeJevProvider(api_key="test-key", base_url="https://mock.typesafe.ai")
    
    mock_data = {
        "model": "jev-latest",
        "answers": {
            "decision": {
                "choice": "APPROVE",
                "probabilities": {"ALLOW": 0.11, "APPROVE": 0.87, "BLOCK": 0.02},
                "confidence": 0.87,
            }
        }
    }
    
    res = prov._parse_response(mock_data, latency_ms=45.2)
    assert res.decision == Decision.APPROVE
    assert res.confidence == 0.87
    assert res.probabilities["APPROVE"] == 0.87
    assert res.model == "jev-latest"
    assert res.provider == "typesafe"
    assert res.latency_ms == 45.2


# --------------------------------------------------------------------------
# 3. OpenJev Provider Parsing
# --------------------------------------------------------------------------
@pytest.mark.anyio
async def test_openjev_parsing():
    prov = OpenJevProvider(api_key="test-key", base_url="https://api.codiv.ai")
    
    mock_data = {
        "model": "openjev-latest",
        "answers": {
            "decision": {
                "choice": "ALLOW",
                "probabilities": {"ALLOW": 0.91, "APPROVE": 0.07, "BLOCK": 0.02},
                "confidence": 0.91,
            }
        }
    }
    
    res = prov._parse_response(mock_data, latency_ms=120.5)
    assert res.decision == Decision.ALLOW
    assert res.confidence == 0.91
    assert res.provider == "openjev"
    assert res.fallback_used is True


# --------------------------------------------------------------------------
# 4. Fallback Chain: Primary fails -> Fallback succeeds
# --------------------------------------------------------------------------
@pytest.mark.anyio
async def test_fallback_chain_primary_fails_fallback_succeeds():
    mock_primary = AsyncMock(spec=TypeSafeJevProvider)
    mock_primary.name = "typesafe"
    mock_primary.evaluate.side_effect = Exception("TypeSafe rate limit / timeout")

    mock_fallback = AsyncMock(spec=OpenJevProvider)
    mock_fallback.name = "openjev"
    mock_fallback.evaluate.return_value = DecisionResult(
        decision=Decision.APPROVE,
        probabilities={"ALLOW": 0.10, "APPROVE": 0.85, "BLOCK": 0.05},
        confidence=0.85,
        provider="openjev",
        model="openjev-latest",
        fallback_used=True,
    )

    failsafe = DeterministicProvider()
    engine = DecisionEngine(primary=mock_primary, fallback=mock_fallback, failsafe=failsafe)

    res = await engine.evaluate({"tool": "create_item", "action": "modify", "risk_score": 70})
    assert res.decision == Decision.APPROVE
    assert res.provider == "openjev"
    assert res.fallback_used is True
    assert any("Primary (typesafe) failed" in msg for msg in res.fallback_chain)


# --------------------------------------------------------------------------
# 5. Fail-Safe: Both LLMs fail -> Deterministic fail-safe succeeds without error
# --------------------------------------------------------------------------
@pytest.mark.anyio
async def test_failsafe_when_both_ai_providers_fail():
    mock_primary = AsyncMock(spec=TypeSafeJevProvider)
    mock_primary.name = "typesafe"
    mock_primary.evaluate.side_effect = ValueError("No API key")

    mock_fallback = AsyncMock(spec=OpenJevProvider)
    mock_fallback.name = "openjev"
    mock_fallback.evaluate.side_effect = ValueError("No API key")

    failsafe = DeterministicProvider()
    engine = DecisionEngine(primary=mock_primary, fallback=mock_fallback, failsafe=failsafe)

    res = await engine.evaluate({"tool": "get_item", "action": "read", "risk_score": 20, "risk_level": "LOW"})
    assert res.decision == Decision.ALLOW
    assert res.provider == "deterministic"
    assert res.fallback_used is True
    assert res.metadata.get("failsafe_active") is True


# --------------------------------------------------------------------------
# 6. Uncertainty Escalation: ALLOW with low confidence escalates to APPROVE
# --------------------------------------------------------------------------
@pytest.mark.anyio
async def test_uncertainty_escalates_to_approve():
    mock_primary = AsyncMock(spec=TypeSafeJevProvider)
    mock_primary.name = "typesafe"
    # Low confidence ALLOW (0.65 < threshold 0.85)
    mock_primary.evaluate.return_value = DecisionResult(
        decision=Decision.ALLOW,
        probabilities={"ALLOW": 0.65, "APPROVE": 0.25, "BLOCK": 0.10},
        confidence=0.65,
        provider="typesafe",
        model="jev-latest",
    )

    engine = DecisionEngine(primary=mock_primary)
    res = await engine.evaluate({"tool": "read_profile", "action": "read", "risk_score": 30})
    assert res.decision == Decision.APPROVE
    assert "Escalated to APPROVE" in res.metadata.get("escalation", "")


# --------------------------------------------------------------------------
# 7. CRITICAL: Cedar hard policy cannot be overridden by AI
# --------------------------------------------------------------------------
@pytest.mark.anyio
async def test_cedar_hard_policy_cannot_be_overridden_by_ai():
    c2s_send, c2s_recv = anyio.create_memory_object_stream(50)
    s2c_send, s2c_recv = anyio.create_memory_object_stream(50)
    mock = create_mock_server("demo-mcp")
    t = asyncio.create_task(mock.run(c2s_recv, s2c_send, mock.create_initialization_options()))
    cfg = UpstreamServerConfig(
        id="demo-mcp",
        name="Mock Demo MCP",
        transport="memory",
        memory_read_stream=s2c_recv,
        memory_write_stream=c2s_send,
    )

    try:
        await _SHARED_MCP_MANAGER.add_server(cfg)
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as ac:
            # delete_item is a hard Cedar policy violation (delete prohibited)
            # Even if Jev were to say ALLOW, it must return BLOCK!
            call_resp = await ac.post(
                "/v1/mcp/servers/demo-mcp/tools/delete_item/call",
                json={"arguments": {"item_id": "item-999"}, "agent_id": "research-agent"},
            )
            assert call_resp.status_code == 200
            data = call_resp.json()
            assert data["decision"] == "BLOCK"
            assert data["status"] == "BLOCKED"
            assert data["upstream_called"] is False
            assert data["decision_engine"]["hard_policy_enforced"] is True
    finally:
        t.cancel()
        await _SHARED_MCP_MANAGER.remove_server("demo-mcp")


# --------------------------------------------------------------------------
# 8. Audit Records Decision Engine Telemetry
# --------------------------------------------------------------------------
@pytest.mark.anyio
async def test_audit_records_decision_engine_telemetry():
    c2s_send, c2s_recv = anyio.create_memory_object_stream(50)
    s2c_send, s2c_recv = anyio.create_memory_object_stream(50)
    mock = create_mock_server("demo-mcp")
    t = asyncio.create_task(mock.run(c2s_recv, s2c_send, mock.create_initialization_options()))
    cfg = UpstreamServerConfig(
        id="demo-mcp",
        name="Mock Demo MCP",
        transport="memory",
        memory_read_stream=s2c_recv,
        memory_write_stream=c2s_send,
    )

    try:
        await _SHARED_MCP_MANAGER.add_server(cfg)
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as ac:
            call_resp = await ac.post(
                "/v1/mcp/servers/demo-mcp/tools/get_item/call",
                json={"arguments": {"item_id": "demo-001"}, "agent_id": "research-agent"},
            )
            assert call_resp.status_code == 200
            data = call_resp.json()
            assert "decision_engine" in data
            assert "provider" in data["decision_engine"]
            assert "probabilities" in data["decision_engine"]

            # Verify audit log contains decision_engine block
            last_log = get_last_audit_log()
            assert last_log is not None
            assert "decision_engine" in last_log
            assert last_log["decision_engine"]["provider"] is not None

            # Verify SHA-256 chain integrity
            chain_status = verify_audit_chain()
            assert chain_status is True
    finally:
        t.cancel()
        await _SHARED_MCP_MANAGER.remove_server("demo-mcp")


# --------------------------------------------------------------------------
# 9. Diagnostic Endpoints: GET /v1/decision/status and POST /v1/decision/evaluate
# --------------------------------------------------------------------------
@pytest.mark.anyio
async def test_decision_status_and_evaluate_endpoints():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as ac:
        status_resp = await ac.get("/v1/decision/status")
        assert status_resp.status_code == 200
        status_data = status_resp.json()
        assert status_data["enabled"] is True
        assert status_data["primary"]["name"] == "typesafe"
        assert status_data["fallback"]["name"] == "openjev"
        assert status_data["failsafe"]["name"] == "deterministic"

        eval_resp = await ac.post(
            "/v1/decision/evaluate",
            json={
                "tool": "create_item",
                "action": "modify",
                "risk_score": 70,
                "risk_level": "HIGH",
            },
        )
        assert eval_resp.status_code == 200
        eval_data = eval_resp.json()
        assert eval_data["decision"] in ("ALLOW", "APPROVE", "BLOCK")
        assert "probabilities" in eval_data
        assert "confidence" in eval_data
        assert "provider" in eval_data

        # Test updating keys via API
        keys_resp = await ac.post(
            "/v1/decision/keys",
            json={
                "typesafe_api_key": "ts_live_key_9988776655",
                "openjev_api_key": "cd_live_key_1122334455",
                "openjev_base_url": "https://custom.openjev.ai",
            },
        )
        assert keys_resp.status_code == 200
        keys_data = keys_resp.json()
        assert keys_data["status"] == "success"
        assert keys_data["decision_status"]["primary"]["configured"] is True
        assert keys_data["decision_status"]["fallback"]["configured"] is True
        assert "ts_l" in keys_data["decision_status"]["primary"]["maskedKey"]

        # Test clearing key
        del_resp = await ac.delete("/v1/decision/keys/typesafe")
        assert del_resp.status_code == 200
        del_data = del_resp.json()
        assert del_data["decision_status"]["primary"]["configured"] is False

        # Reset openjev key
        await ac.delete("/v1/decision/keys/openjev")

