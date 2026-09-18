import requests
import json
import time

BASE_URL = "http://127.0.0.1:8001"

print("--- Testing API ---")
try:
    # 1. Allow Permission
    print("1. Allowing permission...")
    r = requests.post(f"{BASE_URL}/agents/research-agent/permissions/allow?action=test.action")
    print(r.status_code, r.json())
    
    # 2. Deny Permission
    print("2. Denying permission...")
    r = requests.post(f"{BASE_URL}/agents/research-agent/permissions/deny?action=test.action")
    print(r.status_code, r.json())
    
    # 3. Create a pending approval (authorize block)
    print("3. Attempting blocked action...")
    r = requests.post(f"{BASE_URL}/authorize", json={
        "agent_id": "research-agent",
        "tool": "system",
        "action": "dangerous_action",
        "parameters": {}
    })
    print(r.status_code, r.json())
    
    # Get Approvals
    print("4. Getting Approvals...")
    r = requests.get(f"{BASE_URL}/approvals")
    approvals = r.json().get("approvals", [])
    print("Approvals count:", len(approvals))
    
    if approvals:
        app_id = approvals[0]["id"]
        # 5. Reject
        print("5. Rejecting approval...")
        r = requests.post(f"{BASE_URL}/approvals/{app_id}/reject")
        print(r.status_code, r.json())
        
    # 6. Audit Verification
    print("6. Audit verify...")
    r = requests.get(f"{BASE_URL}/audit/verify")
    print(r.status_code, r.json())

except Exception as e:
    print("Error:", e)
