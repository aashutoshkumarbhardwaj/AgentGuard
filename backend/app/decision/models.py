from enum import Enum
from typing import Any
from pydantic import BaseModel, Field


class Decision(str, Enum):
    ALLOW = "ALLOW"
    APPROVE = "APPROVE"
    BLOCK = "BLOCK"


class DecisionResult(BaseModel):
    decision: Decision
    probabilities: dict[str, float] = Field(default_factory=dict)
    confidence: float = 0.0
    provider: str
    model: str | None = None
    latency_ms: float | None = None
    fallback_used: bool = False
    fallback_chain: list[str] = Field(default_factory=list)
    error: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
