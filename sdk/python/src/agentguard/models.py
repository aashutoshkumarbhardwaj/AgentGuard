from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class Risk(BaseModel):
    level: str
    score: int
    factors: List[str] = Field(default_factory=list)

class Policy(BaseModel):
    id: str

class Decision(BaseModel):
    decision: str
    allowed: bool
    blocked: bool
    requires_approval: bool
    reason: str
    risk: Risk
    policy: Policy
    authorization: Dict[str, Any] = Field(default_factory=dict)
    security: Dict[str, Any] = Field(default_factory=dict)
    
    @property
    def risk_score(self) -> int:
        return self.risk.score
        
    @property
    def risk_level(self) -> str:
        return self.risk.level
        
    @property
    def policy_id(self) -> str:
        return self.policy.id
        
    @property
    def factors(self) -> List[str]:
        return self.risk.factors
