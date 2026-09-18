import requests

r_audit = requests.get("http://127.0.0.1:8001/audit")
events = r_audit.json().get("events", [])
print("--- AUDIT LOG ---")
print(f"Total events recorded: {len(events)}")
for e in events[:5]:
    print(f"[{e['event_id']}] {e['action']} -> {e['decision']} (Hash: {e['event_hash'][:8]}...)")
print()

r_verify = requests.get("http://127.0.0.1:8001/audit/verify")
print("--- CHAIN VERIFICATION ---")
print(r_verify.json())
