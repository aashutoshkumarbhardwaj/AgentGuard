from agentguard import AgentGuard

guard = AgentGuard(agent_id="research-agent")

def unsafe_function(x):
    return x * 2

safe_function = guard.protect_tool(unsafe_function, tool="math", action="double")

if __name__ == "__main__":
    print(safe_function(10))
