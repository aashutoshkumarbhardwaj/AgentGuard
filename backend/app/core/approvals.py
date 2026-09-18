import uuid
import json
from datetime import datetime
from typing import List, Dict, Optional
from app.db.agents import get_connection

def init_approvals_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS approvals (
            id TEXT PRIMARY KEY,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            request TEXT NOT NULL,
            decision TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

# Initialize on import
init_approvals_db()

def create_approval(request_data: Dict, decision: Dict) -> Dict:
    """Create a new approval request."""
    approval_id = str(uuid.uuid4())
    
    approval = {
        "id": approval_id,
        "status": "PENDING",
        "created_at": datetime.utcnow().isoformat(),
        "request": request_data,
        "decision": decision,
        "updated_at": datetime.utcnow().isoformat()
    }
    
    conn = get_connection()
    conn.execute("""
        INSERT INTO approvals (id, status, created_at, request, decision, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        approval["id"],
        approval["status"],
        approval["created_at"],
        json.dumps(approval["request"]),
        json.dumps(approval["decision"]),
        approval["updated_at"]
    ))
    conn.commit()
    conn.close()
    
    return approval

def get_approvals() -> List[Dict]:
    """Get all approval requests."""
    conn = get_connection()
    rows = conn.execute("SELECT * FROM approvals ORDER BY created_at DESC").fetchall()
    conn.close()
    
    return [{
        "id": row["id"],
        "status": row["status"],
        "created_at": row["created_at"],
        "request": json.loads(row["request"]),
        "decision": json.loads(row["decision"]),
        "updated_at": row["updated_at"]
    } for row in rows]

def get_approval(approval_id: str) -> Optional[Dict]:
    """Get a specific approval by ID."""
    conn = get_connection()
    row = conn.execute("SELECT * FROM approvals WHERE id = ?", (approval_id,)).fetchone()
    conn.close()
    
    if row:
        return {
            "id": row["id"],
            "status": row["status"],
            "created_at": row["created_at"],
            "request": json.loads(row["request"]),
            "decision": json.loads(row["decision"]),
            "updated_at": row["updated_at"]
        }
    return None

def update_approval(approval_id: str, status: str) -> Optional[Dict]:
    """Update approval status."""
    conn = get_connection()
    updated_at = datetime.utcnow().isoformat()
    conn.execute(
        "UPDATE approvals SET status = ?, updated_at = ? WHERE id = ?",
        (status, updated_at, approval_id)
    )
    conn.commit()
    conn.close()
    
    return get_approval(approval_id)