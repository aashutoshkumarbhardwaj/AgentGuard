import os
import time
from typing import Any
import httpx
from app.db.agents import get_config_val
from .base import DecisionProvider
from .models import Decision, DecisionResult


class TypeSafeJevProvider(DecisionProvider):
    name = "typesafe"

    def __init__(
        self,
        api_key: str | None = None,
        base_url: str | None = None,
        model: str | None = None,
        timeout_sec: float = 2.0,
    ):
        self._api_key_param = api_key
        self.base_url = (base_url or os.environ.get("TYPESAFE_BASE_URL", "https://api.typesafe.ai")).rstrip("/")
        self.model = model or os.environ.get("TYPESAFE_MODEL", "jev-latest")
        self.timeout_sec = float(os.environ.get("AGENTGUARD_DECISION_TIMEOUT_MS", int(timeout_sec * 1000))) / 1000.0

    @property
    def api_key(self) -> str:
        return self._api_key_param or get_config_val("typesafe_api_key") or os.environ.get("TYPESAFE_API_KEY", "")

    @api_key.setter
    def api_key(self, val: str | None):
        self._api_key_param = val

    async def evaluate(self, state: dict[str, Any]) -> DecisionResult:
        if not self.api_key:
            raise ValueError("TYPESAFE_API_KEY is not configured")

        start = time.perf_counter()
        payload = {
            "model": self.model,
            "state": state,
            "questions": {
                "decision": {
                    "type": "choice",
                    "instructions": "Determine whether this AI agent tool call should execute automatically, require human approval, or be blocked.",
                    "criteria": {
                        "ALLOW": "Safe to execute automatically.",
                        "APPROVE": "Potentially risky but legitimate; require human approval.",
                        "BLOCK": "Dangerous, unauthorized, malicious, or prohibited.",
                    },
                }
            },
        }

        url = f"{self.base_url}/v1/systemone"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=self.timeout_sec) as client:
            resp = await client.post(url, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()

        latency = (time.perf_counter() - start) * 1000.0
        return self._parse_response(data, latency)

    def _parse_response(self, data: dict[str, Any], latency_ms: float) -> DecisionResult:
        # Flexible parser for Jev System One response
        answers = data.get("answers", {})
        dec_ans = answers.get("decision", {}) if isinstance(answers, dict) else {}

        raw_decision = dec_ans.get("choice") or data.get("choice") or data.get("decision")
        probs = dec_ans.get("probabilities") or data.get("probabilities") or {}

        # Parse probabilities
        clean_probs = {}
        for k in ("ALLOW", "APPROVE", "BLOCK"):
            if k in probs:
                clean_probs[k] = float(probs[k])
            elif k.lower() in probs:
                clean_probs[k] = float(probs[k.lower()])

        # Normalize if missing or empty
        if not clean_probs:
            if raw_decision and raw_decision.upper() in ("ALLOW", "APPROVE", "BLOCK"):
                d_up = raw_decision.upper()
                clean_probs = {d_up: 0.90}
                others = [k for k in ("ALLOW", "APPROVE", "BLOCK") if k != d_up]
                clean_probs[others[0]] = 0.07
                clean_probs[others[1]] = 0.03
            else:
                clean_probs = {"ALLOW": 0.33, "APPROVE": 0.34, "BLOCK": 0.33}

        # Resolve decision
        if not raw_decision:
            raw_decision = max(clean_probs, key=clean_probs.get)

        decision_str = str(raw_decision).upper()
        if decision_str not in ("ALLOW", "APPROVE", "BLOCK"):
            decision_str = "APPROVE"  # Fail safe

        confidence = dec_ans.get("confidence") or data.get("confidence") or clean_probs.get(decision_str, 0.5)

        return DecisionResult(
            decision=Decision(decision_str),
            probabilities=clean_probs,
            confidence=float(confidence),
            provider=self.name,
            model=data.get("model", self.model),
            latency_ms=round(latency_ms, 2),
            fallback_used=False,
            metadata={"systemone": True},
        )
