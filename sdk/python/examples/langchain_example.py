from agentguard import AgentGuard
try:
    from langchain_core.tools import tool
    from agentguard.integrations.langchain import wrap_langchain_tool

    guard = AgentGuard(agent_id="research-agent")

    @tool
    def multiply(a: int, b: int) -> int:
        """Multiply two numbers."""
        return a * b

    safe_multiply = wrap_langchain_tool(guard, multiply, "math", "multiply")

    if __name__ == "__main__":
        print(safe_multiply.invoke({"a": 5, "b": 10}))
except ImportError:
    print("LangChain not installed.")
