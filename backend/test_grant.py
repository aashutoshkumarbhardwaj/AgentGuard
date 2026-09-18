import requests
BASE = "http://127.0.0.1:8001"
# Give permission so that the action reaches the inner layers (Cedar, Risk Engine)
requests.post(f"{BASE}/agents/research-agent/permissions/allow?action=email.send")
requests.post(f"{BASE}/agents/research-agent/permissions/allow?action=file.delete")
