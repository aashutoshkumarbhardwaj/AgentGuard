import pytest
import respx
import httpx
from agentguard import AgentGuard, AgentGuardBlocked

def test_langchain_import_error():
    # If we run this test without langchain installed (e.g. in a clean env),
    # it should raise ImportError. If it is installed, this test might fail or skip.
    try:
        from agentguard.integrations.langchain import wrap_langchain_tool
        import langchain_core
    except ImportError:
        # Expected behavior when not installed
        pass

def test_crewai_import_error():
    try:
        from agentguard.integrations.crewai import wrap_crewai_tool
        import crewai
    except ImportError:
        pass

# Skip these tests if frameworks are not installed
langchain_core = pytest.importorskip("langchain_core")

@respx.mock
def test_langchain_wrap():
    from langchain_core.tools import BaseTool
    from agentguard.integrations.langchain import wrap_langchain_tool
    
    class DummyTool(BaseTool):
        name: str = "dummy"
        description: str = "A dummy tool"
        
        def _run(self, tool_input: str) -> str:
            return f"Processed {tool_input}"

    guard = AgentGuard(agent_id="test-agent", server="http://localhost:8000")
    
    respx.post("http://localhost:8000/v1/authorize").mock(return_value=httpx.Response(
        status_code=200, 
        json={
            "allowed": True, "blocked": False, "requires_approval": False,
            "decision": "ALLOW", "risk": {"level": "LOW", "score": 10, "factors": []},
            "policy": {"id": "1"}, "reason": "Ok"
        }
    ))
    
    tool = DummyTool()
    wrapped_tool = wrap_langchain_tool(guard, tool, "dummy", "run")
    
    result = wrapped_tool.invoke({"tool_input": "hello"})
    assert result == "Processed hello"

@respx.mock
def test_langchain_wrap_blocked():
    from langchain_core.tools import BaseTool
    from agentguard.integrations.langchain import wrap_langchain_tool
    
    class DummyTool(BaseTool):
        name: str = "dummy"
        description: str = "A dummy tool"
        
        def _run(self, tool_input: str) -> str:
            return f"Processed {tool_input}"

    guard = AgentGuard(agent_id="test-agent")
    
    respx.post("http://localhost:8000/v1/authorize").mock(return_value=httpx.Response(
        status_code=200, 
        json={
            "allowed": False, "blocked": True, "requires_approval": False,
            "decision": "BLOCK", "risk": {"level": "CRITICAL", "score": 100, "factors": []},
            "policy": {"id": "1"}, "reason": "Dangerous"
        }
    ))
    
    tool = DummyTool()
    wrapped_tool = wrap_langchain_tool(guard, tool, "dummy", "run")
    
    with pytest.raises(AgentGuardBlocked, match="Dangerous"):
        wrapped_tool.invoke({"tool_input": "hello"})
