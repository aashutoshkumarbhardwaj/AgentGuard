import time
from typing import Any
from .base import DecisionProvider
from .models import Decision, DecisionResult


class DeterministicProvider(DecisionProvider):
    name = "deterministic"

    async def evaluate(self, state: dict[str, Any]) -> DecisionResult:
        start = time.perf_counter()
        
        risk_score = state.get("risk_score", 20)
        risk_level = str(state.get("risk_level", "LOW")).upper()
        action = str(state.get("action", "")).lower()
        tool = str(state.get("tool", "")).lower()
        
        # Determine deterministic baseline
        if risk_level == "CRITICAL" or risk_score >= 80 or "delete" in tool or "delete" in action:
            decision = Decision.BLOCK
            confidence = 0.98
            probs = {"ALLOW": 0.01, "APPROVE": 0.01, "BLOCK": 0.98}
        elif (
            risk_level in ("HIGH", "MEDIUM")
            or risk_score >= 50
            or any(kw in action for kw in ["modify", "create", "write", "export", "exec"])
            or any(kw in tool for kw in ["modify", "create", "write", "export", "command"])
        ):
            decision = Decision.APPROVE
            confidence = 0.87
            probs = {"ALLOW": 0.09, "APPROVE": 0.87, "BLOCK": 0.04}
        else:
            decision = Decision.ALLOW
            confidence = 0.94
            probs = {"ALLOW": 0.94, "APPROVE": 0.05, "BLOCK": 0.01}

        latency = (time.perf_counter() - start) * 1000.0

        return DecisionResult(
            decision=decision,
            probabilities=probs,
            confidence=confidence,
            provider=self.name,
            model="deterministic-rules",
            latency_ms=round(latency, 2),
            fallback_used=False,
            metadata={"rule_match": f"risk={risk_score}:{risk_level}"},
        )
