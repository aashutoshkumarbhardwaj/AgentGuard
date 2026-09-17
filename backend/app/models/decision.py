from pydantic import BaseModel
from typing import List


class DecisionResponse(BaseModel):
    decision: str
    risk_level: str
    risk_score: int
    policy_id: str
    reason: str
    factors: List[str] = []