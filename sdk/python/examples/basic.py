from agentguard import AgentGuard, AgentGuardBlocked

def main():
    guard = AgentGuard(
        agent_id="research-agent",
        server="http://localhost:8000"
    )
    
    print("Checking if we can read calendar...")
    try:
        guard.require("calendar_read", "read")
        print("Success! Agent is allowed to read the calendar.")
    except AgentGuardBlocked as e:
        print(f"Blocked! {e.reason}")

if __name__ == "__main__":
    main()
