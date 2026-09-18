from agentguard import AgentGuard
try:
    from crewai.tools import tool
    from agentguard.integrations.crewai import wrap_crewai_tool

    guard = AgentGuard(agent_id="research-agent")

    @tool("Divide numbers")
    def divide(a: int, b: int) -> float:
        """Divide two numbers."""
        return a / b

    safe_divide = wrap_crewai_tool(guard, divide, "math", "divide")

    if __name__ == "__main__":
        print(safe_divide.invoke({"a": 10, "b": 2}))
except ImportError:
    print("CrewAI not installed.")
