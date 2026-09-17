from dataclasses import dataclass
from typing import Any


@dataclass
class Risk:
    level: str
    score: int


@dataclass
class Decision:
    decision: str
    risk: Risk
    reason: str
    policy_id: str
    factors: list[str]
    raw: dict[str, Any]

    @property
    def allowed(self) -> bool:
        return self.decision == "ALLOW"

    @property
    def blocked(self) -> bool:
        return self.decision == "BLOCK"

    @property
    def requires_approval(self) -> bool:
        return self.decision == "APPROVE"