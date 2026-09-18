# AgentGuard Integrations

AgentGuard provides universal integration wrappers so you can secure any AI agent framework (LangChain, CrewAI, Autogen) without duplicating security logic.

## Architecture
AgentGuard serves as a proxy decorator layer over your tools. 
When an AI agent invokes a tool, the invocation is suspended while the `AgentGuard SDK` requests an authorization decision. If allowed, the invocation continues. If blocked, an exception is thrown natively into the agent's execution loop.

## Generic Decorator
```python
from agentguard import AgentGuard

guard = AgentGuard(agent_id="my-agent")

@guard.protect(tool="email", action="send")
def send_email(to, body):
    pass
```

## LangChain Integration
```bash
pip install "agentguard-sdk[langchain]"
```
```python
from agentguard.integrations.langchain import wrap_langchain_tool
safe_tool = wrap_langchain_tool(guard, my_langchain_tool, "email", "send")
```

## CrewAI Integration
```bash
pip install "agentguard-sdk[crewai]"
```
```python
from agentguard.integrations.crewai import wrap_crewai_tool
safe_tool = wrap_crewai_tool(guard, my_crewai_tool, "email", "send")
```

## Security Guarantee
AgentGuard guarantees that **no tool execution occurs** until the server explicitly returns an `ALLOW` decision. If the server is offline or times out, the tool defaults to a fail-closed `BLOCK`.
