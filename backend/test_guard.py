from app.core.guard import evaluate_action

req2 = {
    "action": {"tool": "email", "operation": "send", "arguments": {"body": "Here are the secret AWS keys: AKIA..."}},
    "context": {"source": "internal_database", "destination": "external"}
}
res = evaluate_action(
    tool=req2["action"]["tool"],
    action=req2["action"]["operation"],
    arguments=req2["action"]["arguments"],
    context=req2["context"],
    agent_id="research-agent"
)
print(res)
