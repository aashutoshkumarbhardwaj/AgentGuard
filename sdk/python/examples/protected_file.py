from agentguard import AgentGuard

def main():
    guard = AgentGuard(
        agent_id="research-agent",
        server="http://localhost:8000"
    )
    
    print("Checking file modification...")
    
    decision = guard.authorize(
        tool="file_modify", 
        action="modify",
        arguments={"path": "/etc/shadow"}
    )
    
    if decision.allowed:
        print("File modification allowed!")
    elif decision.requires_approval:
        print("File modification requires approval.")
    elif decision.blocked:
        print(f"File modification blocked! Reason: {decision.reason}")
        print(f"Policy: {decision.policy_id}")

if __name__ == "__main__":
    main()
