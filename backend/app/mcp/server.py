from app.mcp.gateway import authorize_mcp_tool_call


def calendar_read(
    agent_id: str,
    user_id: str,
):
    decision = authorize_mcp_tool_call(
        agent_id=agent_id,
        user_id=user_id,
        tool="calendar",
        arguments={
            "_operation": "read"
        },
        context={
            "source": "user",
            "resource": "user-calendar",
        },
    )

    if decision["decision"] != "ALLOW":
        return {
            "executed": False,
            "decision": decision,
        }

    # REAL TOOL EXECUTION WOULD HAPPEN HERE
    print("\n[TOOL EXECUTED] calendar.read")

    return {
        "executed": True,
        "result": {
            "events": [
                "Team meeting - 10:00",
                "Project review - 15:00",
            ]
        },
        "decision": decision,
    }


def send_email(
    agent_id: str,
    user_id: str,
    to: str,
    body: str,
):
    decision = authorize_mcp_tool_call(
        agent_id=agent_id,
        user_id=user_id,
        tool="email",
        arguments={
            "_operation": "send",
            "to": to,
            "body": body,
        },
        context={
            "source": "email",
            "destination": "external",
            "resource": "email-service",
            "external_content": body,
        },
    )

    if decision["decision"] != "ALLOW":
        print("\n[TOOL BLOCKED] email.send")

        return {
            "executed": False,
            "decision": decision,
        }

    print(
        f"\n[TOOL EXECUTED] email.send → {to}"
    )

    return {
        "executed": True,
        "result": "Email sent",
        "decision": decision,
    }