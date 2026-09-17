from app.security.engine import authorize


print("CALENDAR:")
print(
    authorize(
        agent_id="research-agent",
        action="calendar.read",
        resource="user-calendar",
        context={}
    )
)

print("\nFILE DELETE:")
print(
    authorize(
        agent_id="research-agent",
        action="file.delete",
        resource="important-file",
        context={}
    )
)

print("\nEXTERNAL EMAIL:")
print(
    authorize(
        agent_id="research-agent",
        action="email.send",
        resource="email-service",
        context={
            "destination": "external"
        }
    )
)

print("\nINTERNAL EMAIL:")
print(
    authorize(
        agent_id="research-agent",
        action="email.send",
        resource="email-service",
        context={
            "destination": "internal"
        }
    )
)
