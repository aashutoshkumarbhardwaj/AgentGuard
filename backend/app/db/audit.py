from app.db.agents import get_connection
import json

def init_audit_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS audit_logs (
            event_id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            agent_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            tool TEXT NOT NULL,
            action TEXT NOT NULL,
            decision TEXT NOT NULL,
            risk_level TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            policy_id TEXT NOT NULL,
            reason TEXT NOT NULL,
            factors TEXT NOT NULL,
            bedrock TEXT,
            decision_engine TEXT,
            previous_hash TEXT NOT NULL,
            event_hash TEXT NOT NULL
        )
    """)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(audit_logs)")
    columns = [col[1] for col in cursor.fetchall()]
    if "bedrock" not in columns:
        conn.execute("ALTER TABLE audit_logs ADD COLUMN bedrock TEXT")
    if "decision_engine" not in columns:
        conn.execute("ALTER TABLE audit_logs ADD COLUMN decision_engine TEXT")
    conn.commit()
    conn.close()

def insert_audit_log(event: dict) -> dict:
    conn = get_connection()
    cursor = conn.cursor()
    bedrock_data = json.dumps(event["bedrock"]) if "bedrock" in event and event["bedrock"] is not None else None
    decision_engine_data = json.dumps(event["decision_engine"]) if "decision_engine" in event and event["decision_engine"] is not None else None
    cursor.execute("""
        INSERT INTO audit_logs (
            timestamp, agent_id, user_id, tool, action, decision,
            risk_level, risk_score, policy_id, reason, factors,
            bedrock, decision_engine, previous_hash, event_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        event["timestamp"],
        event["agent_id"],
        event["user_id"],
        event["tool"],
        event["action"],
        event["decision"],
        event["risk_level"],
        event["risk_score"],
        event["policy_id"],
        event["reason"],
        json.dumps(event["factors"]),
        bedrock_data,
        decision_engine_data,
        event["previous_hash"],
        event["event_hash"]
    ))
    event_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    event_with_id = event.copy()
    event_with_id["event_id"] = event_id
    return event_with_id

def get_all_audit_logs() -> list:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM audit_logs ORDER BY event_id ASC").fetchall()
    conn.close()
    
    result = []
    for row in rows:
        row_keys = row.keys()
        item = {
            "event_id": row["event_id"],
            "timestamp": row["timestamp"],
            "agent_id": row["agent_id"],
            "user_id": row["user_id"],
            "tool": row["tool"],
            "action": row["action"],
            "decision": row["decision"],
            "risk_level": row["risk_level"],
            "risk_score": row["risk_score"],
            "policy_id": row["policy_id"],
            "reason": row["reason"],
            "factors": json.loads(row["factors"]),
        }
        if "bedrock" in row_keys and row["bedrock"]:
            try:
                item["bedrock"] = json.loads(row["bedrock"])
            except Exception:
                pass
        if "decision_engine" in row_keys and row["decision_engine"]:
            try:
                item["decision_engine"] = json.loads(row["decision_engine"])
            except Exception:
                pass
        item["previous_hash"] = row["previous_hash"]
        item["event_hash"] = row["event_hash"]
        result.append(item)
    return result

def get_last_audit_log() -> dict:
    conn = get_connection()
    row = conn.execute("SELECT * FROM audit_logs ORDER BY event_id DESC LIMIT 1").fetchone()
    conn.close()
    
    if not row:
        return None

    row_keys = row.keys()
    item = {
        "event_id": row["event_id"],
        "timestamp": row["timestamp"],
        "agent_id": row["agent_id"],
        "user_id": row["user_id"],
        "tool": row["tool"],
        "action": row["action"],
        "decision": row["decision"],
        "risk_level": row["risk_level"],
        "risk_score": row["risk_score"],
        "policy_id": row["policy_id"],
        "reason": row["reason"],
        "factors": json.loads(row["factors"]),
    }
    if "bedrock" in row_keys and row["bedrock"]:
        try:
            item["bedrock"] = json.loads(row["bedrock"])
        except Exception:
            pass
    if "decision_engine" in row_keys and row["decision_engine"]:
        try:
            item["decision_engine"] = json.loads(row["decision_engine"])
        except Exception:
            pass
    item["previous_hash"] = row["previous_hash"]
    item["event_hash"] = row["event_hash"]
    return item
