import sys
from app.services.context_engine import analyze_context

req2 = {
    "action": "email.send",
    "arguments": {"body": "Here are the secret AWS keys: AKIA..."},
    "context": {"source": "internal_database", "destination": "external"}
}
res = analyze_context(req2["action"], req2["arguments"], req2["context"])
print(res)
