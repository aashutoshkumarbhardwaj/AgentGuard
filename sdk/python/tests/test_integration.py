import pytest
import os
from agentguard import AgentGuard, AgentGuardBlocked

# Make sure to run the FastAPI backend on port 8001 for this test
# e.g., uvicorn app.main:app --port 8001 --reload

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
