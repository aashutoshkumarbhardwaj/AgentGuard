import uuid
from datetime import datetime
from typing import List, Dict, Optional

# In-memory approval store (in production, use a database)
_approvals: Dict[str, Dict] = {}


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
    
    _approvals[approval_id] = approval
    return approval


def get_approvals() -> List[Dict]:
    """Get all approval requests."""
    return list(_approvals.values())


def get_approval(approval_id: str) -> Optional[Dict]:
    """Get a specific approval by ID."""
    return _approvals.get(approval_id)


def update_approval(approval_id: str, status: str) -> Optional[Dict]:
    """Update approval status."""
    if approval_id in _approvals:
        _approvals[approval_id]["status"] = status
        _approvals[approval_id]["updated_at"] = datetime.utcnow().isoformat()
        return _approvals[approval_id]
    return None