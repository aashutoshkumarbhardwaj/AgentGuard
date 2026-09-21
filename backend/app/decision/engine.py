import os
import logging
from typing import Any, List
from .base import DecisionProvider
from .models import Decision, DecisionResult
from .typesafe_jev import TypeSafeJevProvider
from .openjev import OpenJevProvider
from .deterministic import DeterministicProvider

logger = logging.getLogger(__name__)


class DecisionEngine:
    def __init__(
        self,
        primary: DecisionProvider | None = None,
        fallback: DecisionProvider | None = None,
        failsafe: DecisionProvider | None = None,
    ):
        self.primary = primary or TypeSafeJevProvider()
        self.fallback = fallback or OpenJevProvider()
        self.failsafe = failsafe or DeterministicProvider()

        self.enabled = os.environ.get("AGENTGUARD_DECISION_ENABLED", "true").lower() in ("true", "1", "yes")
        self.allow_threshold = float(os.environ.get("AGENTGUARD_DECISION_ALLOW_THRESHOLD", "0.85"))
        self.block_threshold = float(os.environ.get("AGENTGUARD_DECISION_BLOCK_THRESHOLD", "0.85"))

    async def evaluate(self, state: dict[str, Any]) -> DecisionResult:
        """
        Evaluate tool call through the provider chain:
        1. TypeSafe Jev (Primary)
        2. OpenJev-compatible (Fallback)
        3. Deterministic (Fail-Safe)
        
        Security Invariants:
        - If decision engine is disabled, runs deterministic failsafe immediately.
        - High uncertainty (confidence < threshold on ALLOW) escalates to APPROVE.
        - Failures in upstream AI providers cascade down to fail-safe, never failing open.
        """
        if not self.enabled:
            res = await self.failsafe.evaluate(state)
            res.metadata["engine_status"] = "disabled"
            return res

        fallback_chain: List[str] = []

        # 1. Try Primary: TypeSafe Jev
        try:
            res = await self.primary.evaluate(state)
            res.fallback_chain = fallback_chain
            return self._apply_security_thresholds(res)
        except Exception as e:
            msg = f"Primary ({self.primary.name}) failed: {str(e)}"
            logger.info(msg)
            fallback_chain.append(msg)

        # 2. Try Fallback: OpenJev
        try:
            res = await self.fallback.evaluate(state)
            res.fallback_used = True
            res.fallback_chain = fallback_chain
            return self._apply_security_thresholds(res)
        except Exception as e:
            msg = f"Fallback ({self.fallback.name}) failed: {str(e)}"
            logger.info(msg)
            fallback_chain.append(msg)

        # 3. Final Fail-Safe: Deterministic rules
        res = await self.failsafe.evaluate(state)
        res.fallback_used = True
        res.fallback_chain = fallback_chain
        res.metadata["failsafe_active"] = True
        return res

    def _apply_security_thresholds(self, res: DecisionResult) -> DecisionResult:
        """
        Apply uncertainty escalation:
        If an AI provider predicts ALLOW but confidence is below allow_threshold,
        escalate decision to APPROVE (human verification required).
        """
        if res.decision == Decision.ALLOW and res.confidence < self.allow_threshold:
            res.decision = Decision.APPROVE
            res.metadata["escalation"] = (
                f"Confidence {res.confidence:.2f} < threshold {self.allow_threshold:.2f} -> Escalated to APPROVE"
            )
        return res


_ENGINE_INSTANCE: DecisionEngine | None = None


def get_decision_engine() -> DecisionEngine:
    global _ENGINE_INSTANCE
    if _ENGINE_INSTANCE is None:
        _ENGINE_INSTANCE = DecisionEngine()
    return _ENGINE_INSTANCE
