from agentguard import AgentGuard, AgentGuardBlocked, ApprovalRequired

def main():
    guard = AgentGuard(
        agent_id="research-agent",
        server="http://localhost:8000"
    )
    
    print("Attempting to send an email...")
    
    try:
        guard.require(
            tool="email_send", 
            action="send",
            arguments={"to": "external@hacker.com", "body": "Secret data"}
        )
        print("Email sent successfully!")
        
    except ApprovalRequired as e:
        print(f"[PENDING] Email requires human approval.")
        print(f"Reason: {e.reason}")
        print(f"Risk Score: {e.risk_score} ({e.risk_level})")
        
    except AgentGuardBlocked as e:
        print(f"[BLOCKED] Email blocked: {e.reason}")

if __name__ == "__main__":
    main()
