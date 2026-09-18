from agentguard import AgentGuard, AgentGuardBlocked

guard = AgentGuard(agent_id="research-agent")

@guard.protect(tool="calendar", action="read")
def fetch_calendar(date: str):
    return f"Fetching calendar for {date}"

if __name__ == "__main__":
    try:
        result = fetch_calendar(date="2023-10-01")
        print(f"Success: {result}")
    except AgentGuardBlocked as e:
        print(f"Blocked: {e.reason}")
