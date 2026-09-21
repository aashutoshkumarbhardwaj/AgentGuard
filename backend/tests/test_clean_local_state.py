"""
Test suite validating clean local state, zero fake/seeded runtime data,
and proper persistence semantics for AgentGuard local-first product.

Verifies:
1. Fresh database has zero runtime requests.
2. Fresh database has zero pending approvals.
3. Fresh database has zero fake audit events.
4. Adding an MCP server does not create fake requests.
5. Listing tools does not create fake requests.
6. A real tool call creates exactly one real request.
7. Disconnecting MCP removes active server/tools.
8. Disconnecting MCP does not erase historical audit events.
9. Restarting AgentGuard preserves real persisted data.
10. Only registered agent schemas exist (zero fabricated activity).
"""

import sys
import os
import json
import asyncio
from pathlib import Path
from contextlib import asynccontextmanager
import pytest
import anyio
from starlette.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app, _SHARED_MCP_MANAGER
from app.db.agents import get_connection, init_db, seed_agents
from app.db.audit import init_audit_db
from app.core.approvals import init_approvals_db, get_approvals
from app.core.audit import get_all_audit_logs, verify_audit_chain
from app.mcp.mcp_server import save_upstream_config, get_upstream_config_path
from app.mcp.upstream import UpstreamServerConfig
from tests.mock_upstream_mcp import create_mock_server

client = TestClient(app)


@asynccontextmanager
async def setup_memory_server(server_id: str = "mock"):
    """Helper for cleanly registering an in-memory MCP server without OS process overhead."""
    c2s_send, c2s_recv = anyio.create_memory_object_stream(50)
    s2c_send, s2c_recv = anyio.create_memory_object_stream(50)
    mock = create_mock_server(server_id)
    t = asyncio.create_task(mock.run(c2s_recv, s2c_send, mock.create_initialization_options()))
    cfg = UpstreamServerConfig(
        id=server_id,
        name=f"Mock {server_id}",
        transport="memory",
        memory_read_stream=s2c_recv,
        memory_write_stream=c2s_send,
    )
    try:
        yield cfg
    finally:
        t.cancel()


@pytest.fixture(autouse=True)
def clean_database_state():
    """Ensure every test in this module starts with a fresh, clean database."""
    conn = get_connection()
    conn.execute("DELETE FROM audit_logs")
    conn.execute("DELETE FROM approvals")
    conn.commit()
    conn.close()

    init_db()
    seed_agents()
    init_audit_db()
    init_approvals_db()

    # Reset MCP configuration to empty
    save_upstream_config([], str(get_upstream_config_path()))
    _SHARED_MCP_MANAGER.configs.clear()
    _SHARED_MCP_MANAGER.sessions.clear()
    _SHARED_MCP_MANAGER.discovered_tools.clear()
    yield


def test_1_fresh_database_has_zero_runtime_requests():
    """Fresh installation/startup must report 0 runtime requests."""
    resp = client.get("/v1/audit")
    assert resp.status_code == 200
    events = resp.json().get("events", [])
    assert len(events) == 0, f"Expected 0 runtime requests, got {len(events)}"


def test_2_fresh_database_has_zero_pending_approvals():
    """Fresh installation/startup must have 0 pending approvals."""
    resp = client.get("/approvals")
    assert resp.status_code == 200
    approvals = resp.json().get("approvals", [])
    pending = [a for a in approvals if a.get("status") == "PENDING"]
    assert len(pending) == 0, f"Expected 0 pending approvals, got {len(pending)}"


def test_3_fresh_database_has_zero_fake_audit_events():
    """Fresh database must have an empty audit log and a valid chain (GENESIS)."""
    logs = get_all_audit_logs()
    assert len(logs) == 0
    assert verify_audit_chain() is True


@pytest.mark.anyio
async def test_4_adding_mcp_does_not_create_fake_requests():
    """Registering an MCP server must NOT synthesize fake tool requests."""
    async with setup_memory_server("clean_test") as cfg:
        # Add server to shared manager
        await _SHARED_MCP_MANAGER.add_server(cfg)

        # Verify tools are registered
        tools = _SHARED_MCP_MANAGER.list_all_tools()
        assert len(tools) == 5

        # Verify audit requests remain exactly zero
        audit_resp = client.get("/v1/audit")
        assert len(audit_resp.json().get("events", [])) == 0

        await _SHARED_MCP_MANAGER.remove_server("clean_test")


def test_5_listing_tools_does_not_create_fake_requests():
    """Discovering or listing tools must never log artificial execution events."""
    resp = client.get("/v1/mcp/tools")
    assert resp.status_code == 200

    audit_resp = client.get("/v1/audit")
    assert len(audit_resp.json().get("events", [])) == 0


def test_6_real_tool_call_creates_exactly_one_real_request():
    """A real tool invocation must create exactly 1 request in the audit ledger."""
    payload = {
        "agent_id": "research-agent",
        "user_id": "user-001",
        "tool": "calendar",
        "action": "read",
        "arguments": {"day": "today"},
        "context": {},
    }
    resp = client.post("/agent/action", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["decision"] == "ALLOW"

    audit_resp = client.get("/v1/audit")
    events = audit_resp.json().get("events", [])
    assert len(events) == 1, f"Expected exactly 1 audit event, got {len(events)}"
    assert events[0]["tool"] == "calendar"
    assert events[0]["action"] == "read"
    assert events[0]["decision"] == "ALLOW"


@pytest.mark.anyio
async def test_7_disconnecting_mcp_removes_active_server_and_tools():
    """Removing an MCP server unregisters it and clears its tools from the catalog."""
    async with setup_memory_server("server_to_remove") as cfg:
        # 1. Add server
        await _SHARED_MCP_MANAGER.add_server(cfg)
        assert "server_to_remove" in _SHARED_MCP_MANAGER.configs
        assert len(_SHARED_MCP_MANAGER.list_all_tools()) >= 5

        # 2. Remove server
        await _SHARED_MCP_MANAGER.remove_server("server_to_remove")

        # 3. Verify server and tools are gone
        assert "server_to_remove" not in _SHARED_MCP_MANAGER.configs
        assert len(_SHARED_MCP_MANAGER.list_all_tools()) == 0


@pytest.mark.anyio
async def test_8_disconnecting_mcp_does_not_erase_historical_audit_events():
    """Removing an MCP server preserves all historical audit events previously logged."""
    # 1. Log a real action
    payload = {
        "agent_id": "research-agent",
        "user_id": "user-001",
        "tool": "calendar",
        "action": "read",
        "arguments": {},
        "context": {},
    }
    client.post("/agent/action", json=payload)
    assert len(get_all_audit_logs()) == 1

    # 2. Add and then remove an MCP server
    async with setup_memory_server("temp_server") as cfg:
        await _SHARED_MCP_MANAGER.add_server(cfg)
        await _SHARED_MCP_MANAGER.remove_server("temp_server")

    # 3. Verify audit history is STILL intact
    logs = get_all_audit_logs()
    assert len(logs) == 1
    assert logs[0]["tool"] == "calendar"
    assert verify_audit_chain() is True


def test_9_restarting_agentguard_preserves_real_persisted_data():
    """Restarting AgentGuard (re-running lifespan/init) preserves real persisted state."""
    # 1. Create a real action
    payload = {
        "agent_id": "research-agent",
        "user_id": "user-001",
        "tool": "calendar",
        "action": "read",
        "arguments": {},
        "context": {},
    }
    client.post("/agent/action", json=payload)
    assert len(get_all_audit_logs()) == 1

    # 2. Simulate server restart by re-running init without dropping
    init_db()
    seed_agents()
    init_audit_db()
    init_approvals_db()

    # 3. Data still persists
    logs = get_all_audit_logs()
    assert len(logs) == 1
    assert logs[0]["tool"] == "calendar"
    assert verify_audit_chain() is True


def test_10_only_actual_registered_agents_exist():
    """Agents list should only contain registered schemas, not fabricated activity."""
    resp = client.get("/agents")
    assert resp.status_code == 200
    agents = resp.json().get("agents", [])
    agent_ids = [a["id"] for a in agents]
    # Default registered schemas
    assert "research-agent" in agent_ids
    assert "support-agent" in agent_ids
    assert len(agents) == 2
