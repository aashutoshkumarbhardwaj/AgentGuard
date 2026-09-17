from pydantic import BaseModel, Field
from typing import Any, Dict, Optional


class ActionRequest(BaseModel):
    agent_id: str
    user_id: str
    tool: str
    action: str
    resource: Optional[str] = None
    arguments: Dict[str, Any] = Field(default_factory=dict)
    context: Dict[str, Any] = Field(default_factory=dict)