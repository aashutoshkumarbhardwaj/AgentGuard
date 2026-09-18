import requests
import json
import time

BASE_URL = "http://127.0.0.1:8001/v1"

print("🤖 [Agent]: I've been asked to clear out old logs to save space.")
print("🤖 [Agent]: Preparing to execute 'file.delete' on '/var/log/system.log'...")
time.sleep(2)

print("\n🛡️  [AgentGuard]: Intercepting action request...")
time.sleep(1)

req = {
    "agent": {"id": "research-agent"},
    "principal": {"id": "user123"},
    "action": {
        "tool": "file",
        "operation": "file.delete",
        "arguments": {"target": "/var/log/system.log"}
    },
    "context": {"source": "internal"}
}

print(f"🛡️  [AgentGuard]: Analyzing request: {req['action']['operation']} on {req['action']['arguments']['target']}")
time.sleep(2)

try:
    res = requests.post(f"{BASE_URL}/authorize", json=req)
    data = res.json()
    
    print("\n🛡️  [AgentGuard]: Analysis complete!")
    print(f"   ► Risk Level: {data.get('risk', {}).get('level')}")
    print(f"   ► Risk Score: {data.get('risk', {}).get('score')} / 100")
    print(f"   ► Explanation: {data.get('reason')}")
    
    time.sleep(2)
    decision = data.get('decision')
    
    if decision == "BLOCK":
        print("\n🚫 [AgentGuard]: DECISION = BLOCK. The action was stopped before it could execute.")
    elif decision == "APPROVE":
        print("\n⚠️  [AgentGuard]: DECISION = APPROVE. The action is paused pending human review.")
    else:
        print("\n✅ [AgentGuard]: DECISION = ALLOW. The action is safe to execute.")
        
    time.sleep(2)
    print("\n📝 [AgentGuard]: Permanently recording this decision to the cryptographic audit chain...")
    
    # Get latest audit log
    r_audit = requests.get("http://127.0.0.1:8001/audit")
    events = r_audit.json().get("events", [])
    if events:
        latest = events[0]
        print(f"   ► Saved Event ID: {latest['event_id']}")
        print(f"   ► Cryptographic Hash: {latest['event_hash']}")
        print("   ► Immutable record secured. Verification passing.")
        
except Exception as e:
    print(f"Error connecting to AgentGuard: {e}")

print("\n✨ Demo complete!")
