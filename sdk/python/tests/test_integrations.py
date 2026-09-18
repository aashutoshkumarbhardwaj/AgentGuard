import pytest
import respx
import httpx
from agentguard import AgentGuard, AgentGuardBlocked, ApprovalRequired

@respx.mock
def test_decorator_allow():
    guard = AgentGuard(agent_id="test-agent", server="http://localhost:8000")
    
    respx.post("http://localhost:8000/v1/authorize").mock(return_value=httpx.Response(
        status_code=200, 
        json={
            "allowed": True, "blocked": False, "requires_approval": False,
            "decision": "ALLOW", "risk": {"level": "LOW", "score": 10, "factors": []},
            "policy": {"id": "DEFAULT_ALLOW"}, "reason": "Safe action"
        }
    ))
    
    @guard.protect(tool="calendar", action="read")
    def do_work(a, b):
        return a + b
        
    assert do_work(1, 2) == 3

@respx.mock
def test_decorator_block():
    guard = AgentGuard(agent_id="test-agent", server="http://localhost:8000")
    
    respx.post("http://localhost:8000/v1/authorize").mock(return_value=httpx.Response(
        status_code=200, 
        json={
            "allowed": False, "blocked": True, "requires_approval": False,
            "decision": "BLOCK", "risk": {"level": "CRITICAL", "score": 100, "factors": []},
            "policy": {"id": "BLOCK"}, "reason": "Dangerous"
        }
    ))
    
    executed = False
    @guard.protect(tool="system", action="rm")
    def do_work():
        nonlocal executed
        executed = True
        
    with pytest.raises(AgentGuardBlocked, match="Dangerous"):
        do_work()
        
    assert executed is False

@respx.mock
def test_decorator_arguments_passed():
    guard = AgentGuard(agent_id="test-agent", server="http://localhost:8000")
    
    def check_request(request):
        payload = request.read().decode("utf-8")
        import json
        data = json.loads(payload)
        # Ensure kwargs and args are serialized correctly
        assert data["action"]["arguments"] == {"x": 10, "y": "test"}
        return httpx.Response(status_code=200, json={
            "allowed": True, "blocked": False, "requires_approval": False,
            "decision": "ALLOW", "risk": {"level": "LOW", "score": 0, "factors": []},
            "policy": {"id": "1"}, "reason": "Ok"
        })
        
    respx.post("http://localhost:8000/v1/authorize").mock(side_effect=check_request)
    
    @guard.protect(tool="calc", action="add")
    def do_work(x, y="default"):
        return True
        
    do_work(10, y="test")

@respx.mock
def test_protect_tool():
    guard = AgentGuard(agent_id="test-agent", server="http://localhost:8000")
    
    respx.post("http://localhost:8000/v1/authorize").mock(return_value=httpx.Response(
        status_code=200, 
        json={
            "allowed": True, "blocked": False, "requires_approval": False,
            "decision": "ALLOW", "risk": {"level": "LOW", "score": 10, "factors": []},
            "policy": {"id": "1"}, "reason": "Ok"
        }
    ))
    
    def raw_func(name):
        return f"Hello {name}"
        
    protected_func = guard.protect_tool(raw_func, tool="greeter", action="greet")
    assert protected_func("World") == "Hello World"
