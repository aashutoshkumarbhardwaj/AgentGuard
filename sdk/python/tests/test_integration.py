import pytest
import os
import socket
from agentguard import AgentGuard, AgentGuardBlocked

def _server_reachable(host="localhost", port=8001):
    try:
        with socket.create_connection((host, port), timeout=0.5):
            return True
    except OSError:
        return False

# Make sure to run the FastAPI backend on port 8001 for this test
# e.g., uvicorn app.main:app --port 8001 --reload

@pytest.mark.skipif(not _server_reachable(), reason="Live backend not running on port 8001")
def test_integration_calendar_allow():
    guard = AgentGuard(
        agent_id="research-agent",
        server="http://localhost:8001",
        user_id="user-001"
    )
    
    # Expected: ALLOW for a calendar read by research-agent
    decision = guard.authorize("calendar", "read")
    assert decision.allowed is True
    assert decision.decision == "ALLOW"
    
    # require should not raise
    guard.require("calendar", "read")

@pytest.mark.skipif(not _server_reachable(), reason="Live backend not running on port 8001")
def test_integration_unauthorized_agent_block():
    guard = AgentGuard(
        agent_id="unauthorized-agent",
        server="http://localhost:8001",
        user_id="user-001"
    )
    
    # Expected: BLOCK for an unregistered agent
    with pytest.raises(AgentGuardBlocked) as exc_info:
        guard.require("calendar", "read")
        
    assert "Agent is not registered" in str(exc_info.value)
