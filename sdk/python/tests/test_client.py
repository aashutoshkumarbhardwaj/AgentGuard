import os
import pytest
import httpx
import respx

from agentguard import (
    AgentGuard, 
    Decision, 
    AgentGuardBlocked, 
    ApprovalRequired, 
    AgentGuardConnectionError
)

@pytest.fixture
def clean_env():
    # Remove env vars before tests
    env_vars = ["AGENTGUARD_AGENT_ID", "AGENTGUARD_URL", "AGENTGUARD_USER_ID"]
    old_vars = {k: os.environ.get(k) for k in env_vars}
    
    for k in env_vars:
        if k in os.environ:
            del os.environ[k]
            
    yield
    
    for k, v in old_vars.items():
        if v is not None:
            os.environ[k] = v

def test_init_with_env_vars(clean_env):
    os.environ["AGENTGUARD_AGENT_ID"] = "env-agent"
    os.environ["AGENTGUARD_URL"] = "http://env-server:8000"
    os.environ["AGENTGUARD_USER_ID"] = "env-user"
    
    guard = AgentGuard()
    assert guard.agent_id == "env-agent"
    assert guard.server == "http://env-server:8000"
    assert guard.user_id == "env-user"

def test_init_missing_agent_id(clean_env):
    with pytest.raises(ValueError, match="agent_id must be provided"):
        AgentGuard()

@respx.mock
def test_authorize_allow(clean_env):
    guard = AgentGuard(agent_id="test-agent")
    
    respx.post("http://localhost:8000/v1/authorize").mock(return_value=httpx.Response(
        status_code=200, 
        json={
            "allowed": True,
            "blocked": False,
            "requires_approval": False,
            "decision": "ALLOW",
            "risk": {"level": "LOW", "score": 10, "factors": []},
            "policy": {"id": "DEFAULT_ALLOW"},
            "reason": "Safe action"
        }
    ))
    
    decision = guard.authorize("calendar_read", "read")
    assert decision.allowed is True
    assert decision.blocked is False
    assert decision.decision == "ALLOW"

@respx.mock
def test_require_allow(clean_env):
    guard = AgentGuard(agent_id="test-agent")
    
    respx.post("http://localhost:8000/v1/authorize").mock(return_value=httpx.Response(
        status_code=200, 
        json={
            "allowed": True,
            "blocked": False,
            "requires_approval": False,
            "decision": "ALLOW",
            "risk": {"level": "LOW", "score": 10, "factors": []},
            "policy": {"id": "DEFAULT_ALLOW"},
            "reason": "Safe action"
        }
    ))
    
    # Should not raise any exception
    guard.require("calendar_read", "read")

@respx.mock
def test_require_block(clean_env):
    guard = AgentGuard(agent_id="test-agent")
    
    respx.post("http://localhost:8000/v1/authorize").mock(return_value=httpx.Response(
        status_code=200, 
        json={
            "allowed": False,
            "blocked": True,
            "requires_approval": False,
            "decision": "BLOCK",
            "risk": {"level": "CRITICAL", "score": 90, "factors": []},
            "policy": {"id": "DEFAULT_BLOCK"},
            "reason": "Malicious action"
        }
    ))
    
    with pytest.raises(AgentGuardBlocked, match="Malicious action"):
        guard.require("file_delete", "delete")

@respx.mock
def test_require_approve(clean_env):
    guard = AgentGuard(agent_id="test-agent")
    
    respx.post("http://localhost:8000/v1/authorize").mock(return_value=httpx.Response(
        status_code=200, 
        json={
            "allowed": False,
            "blocked": False,
            "requires_approval": True,
            "decision": "APPROVE",
            "risk": {"level": "MEDIUM", "score": 50, "factors": []},
            "policy": {"id": "EMAIL_POLICY"},
            "reason": "External communication"
        }
    ))
    
    with pytest.raises(ApprovalRequired, match="External communication"):
        guard.require("email_send", "send")

@respx.mock
def test_fail_closed_connection_error(clean_env):
    guard = AgentGuard(agent_id="test-agent")
    
    # Mock a timeout/connection error
    respx.post("http://localhost:8000/v1/authorize").mock(side_effect=httpx.ConnectError)
    
    # authorize should return a BLOCK decision
    decision = guard.authorize("calendar_read", "read")
    assert decision.allowed is False
    assert decision.blocked is True
    assert decision.decision == "BLOCK"
    assert "unreachable" in decision.reason
    
    # require should raise AgentGuardConnectionError (not standard blocked)
    with pytest.raises(AgentGuardConnectionError, match="unreachable"):
        guard.require("calendar_read", "read")

@respx.mock
def test_fail_closed_http_error(clean_env):
    guard = AgentGuard(agent_id="test-agent")
    
    # Mock a 500 internal server error
    respx.post("http://localhost:8000/v1/authorize").mock(return_value=httpx.Response(status_code=500))
    
    decision = guard.authorize("calendar_read", "read")
    assert decision.blocked is True
    
    with pytest.raises(AgentGuardConnectionError, match="returned HTTP 500"):
        guard.require("calendar_read", "read")
