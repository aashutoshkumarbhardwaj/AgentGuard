"""
Comprehensive Test Suite for AgentGuard Playground & Real MCP Execution Path.

Verifies:
1. Real tool call reaches Guard
2. ALLOW executes upstream
3. APPROVE creates approval and does NOT execute upstream
4. APPROVE ONCE executes after approval
5. BLOCK does NOT execute upstream
6. Audit records each decision
7. No fake data is returned for empty state
8. MCP disconnect removes active tools
9. Historical audit remains after disconnect
10. Existing security tests remain green
"""

import sys
import os
import asyncio
from pathlib import Path
from contextlib import asynccontextmanager
import pytest
import anyio
import httpx

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app, _SHARED_MCP_MANAGER
from app.db.agents import get_connection, init_db, seed_agents
from app.db.audit import init_audit_db
from app.core.approvals import init_approvals_db, get_approvals
from app.core.audit import get_all_audit_logs, verify_audit_chain
from app.mcp.upstream import UpstreamServerConfig
from tests.mock_upstream_mcp import create_mock_server, EXECUTION_COUNTS, reset_counts


@asynccontextmanager
async def setup_memory_server(server_id: str = "demo-mcp"):
    """Helper to run an in-memory mock MCP server cleanly."""
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
def clean_state():
    """Ensure clean database and execution counters before each test."""
    reset_counts()
    conn = get_connection()
    conn.execute("DELETE FROM audit_logs")
    conn.execute("DELETE FROM approvals")
    conn.commit()
    conn.close()
    yield
    reset_counts()


@pytest.mark.anyio
async def test_7_empty_state_returns_zero_data():
    """7. No fake data is returned for empty state."""
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        res_req = await ac.get("/audit")
        assert res_req.status_code == 200
        assert len(res_req.json().get("events", [])) == 0

        res_app = await ac.get("/approvals")
        assert res_app.status_code == 200
        assert len(res_app.json().get("approvals", [])) == 0


@pytest.mark.anyio
async def test_1_and_2_allow_executes_upstream():
    """1. Real tool call reaches Guard. 2. ALLOW executes upstream."""
    server_id = "demo-mcp"
    async with setup_memory_server(server_id) as cfg:
        await _SHARED_MCP_MANAGER.add_server(cfg)
        try:
            assert EXECUTION_COUNTS["get_item"] == 0

            async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
                res = await ac.post(
                    f"/v1/mcp/servers/{server_id}/tools/get_item/call",
                    json={"arguments": {"item_id": "demo-001"}},
                )
                assert res.status_code == 200
                data = res.json()

                assert data["decision"] == "ALLOW"
                assert data["risk_score"] == 20
                assert data["risk_level"] == "LOW"
                assert data["status"] == "EXECUTED"
                assert data["upstream_called"] is True
                assert "Item demo-001" in data["result"]
                assert EXECUTION_COUNTS["get_item"] == 1
        finally:
            await _SHARED_MCP_MANAGER.remove_server(server_id)


@pytest.mark.anyio
async def test_3_and_4_approve_pauses_then_executes_on_approval():
    """3. APPROVE creates approval and does NOT execute upstream. 4. APPROVE ONCE executes after approval."""
    server_id = "demo-mcp"
    async with setup_memory_server(server_id) as cfg:
        await _SHARED_MCP_MANAGER.add_server(cfg)
        try:
            assert EXECUTION_COUNTS["create_item"] == 0

            async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
                # 3. Call create_item (state modifying -> requires approval)
                res = await ac.post(
                    f"/v1/mcp/servers/{server_id}/tools/create_item/call",
                    json={"arguments": {"name": "Test Project", "content": "Sensitive notes"}},
                )
                assert res.status_code == 200
                data = res.json()

                assert data["decision"] == "APPROVE"
                assert data["risk_score"] == 70
                assert data["risk_level"] == "HIGH"
                assert data["status"] == "PENDING_APPROVAL"
                assert data["upstream_called"] is False
                assert data["approval_id"] is not None
                # Upstream must NOT have executed yet
                assert EXECUTION_COUNTS["create_item"] == 0

                # Verify pending approval in approvals list
                res_app = await ac.get("/approvals")
                approvals = res_app.json().get("approvals", [])
                assert len(approvals) == 1
                assert approvals[0]["id"] == data["approval_id"]
                assert approvals[0]["status"] == "PENDING"

                # 4. Human approves the action: /approvals/{id}/approve
                res_approve = await ac.post(f"/approvals/{data['approval_id']}/approve")
                assert res_approve.status_code == 200
                approve_data = res_approve.json()

                assert approve_data["status"] == "APPROVED"
                assert approve_data["executed"] is True
                assert EXECUTION_COUNTS["create_item"] == 1
                assert "successfully created" in str(approve_data["result"])
        finally:
            await _SHARED_MCP_MANAGER.remove_server(server_id)


@pytest.mark.anyio
async def test_5_block_does_not_execute_upstream():
    """5. BLOCK does NOT execute upstream."""
    server_id = "demo-mcp"
    async with setup_memory_server(server_id) as cfg:
        await _SHARED_MCP_MANAGER.add_server(cfg)
        try:
            assert EXECUTION_COUNTS["delete_item"] == 0

            async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
                res = await ac.post(
                    f"/v1/mcp/servers/{server_id}/tools/delete_item/call",
                    json={"arguments": {"item_id": "critical-001"}},
                )
                assert res.status_code == 200
                data = res.json()

                assert data["decision"] == "BLOCK"
                assert data["risk_score"] == 100
                assert data["risk_level"] == "CRITICAL"
                assert data["status"] == "BLOCKED"
                assert data["upstream_called"] is False
                # Upstream must NOT have executed
                assert EXECUTION_COUNTS["delete_item"] == 0
        finally:
            await _SHARED_MCP_MANAGER.remove_server(server_id)


@pytest.mark.anyio
async def test_6_audit_records_each_decision():
    """6. Audit records each decision with hash-chain integrity."""
    server_id = "demo-mcp"
    async with setup_memory_server(server_id) as cfg:
        await _SHARED_MCP_MANAGER.add_server(cfg)
        try:
            async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
                # Run get_item (ALLOW)
                await ac.post(
                    f"/v1/mcp/servers/{server_id}/tools/get_item/call",
                    json={"arguments": {"item_id": "1"}},
                )
                # Run delete_item (BLOCK)
                await ac.post(
                    f"/v1/mcp/servers/{server_id}/tools/delete_item/call",
                    json={"arguments": {"item_id": "2"}},
                )

                res = await ac.get("/audit")
                logs = res.json().get("events", [])
                assert len(logs) == 2

                decisions = {l["decision"] for l in logs}
                assert "ALLOW" in decisions
                assert "BLOCK" in decisions

                assert verify_audit_chain() is True
        finally:
            await _SHARED_MCP_MANAGER.remove_server(server_id)


@pytest.mark.anyio
async def test_8_and_9_disconnect_removes_tools_and_keeps_audit():
    """8. MCP disconnect removes active tools. 9. Historical audit remains after disconnect."""
    server_id = "demo-mcp"
    async with setup_memory_server(server_id) as cfg:
        await _SHARED_MCP_MANAGER.add_server(cfg)
        
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
            # Verify tools are registered
            tools_res = await ac.get("/v1/mcp/tools")
            assert len(tools_res.json().get("tools", [])) >= 5

            # Execute a tool to record audit
            await ac.post(
                f"/v1/mcp/servers/{server_id}/tools/get_item/call",
                json={"arguments": {"item_id": "audit-test"}},
            )

            # 8. Disconnect server
            del_res = await ac.delete(f"/v1/mcp/servers/{server_id}")
            assert del_res.status_code == 200

            # Discovered tools for server must be 0
            tools_res_after = await ac.get("/v1/mcp/tools")
            server_tools = [t for t in tools_res_after.json().get("tools", []) if t.get("server") == server_id]
            assert len(server_tools) == 0

            # 9. Historical audit remains intact
            audit_res = await ac.get("/audit")
            logs = audit_res.json().get("events", [])
            assert len(logs) == 1
            assert logs[0]["decision"] == "ALLOW"
