import requests

from .models import Decision, Risk


class AgentGuard:
    def __init__(
        self,
        url: str = "http://localhost:8000",
        timeout: int = 10,
    ):
        self.url = url.rstrip("/")
        self.timeout = timeout

    def authorize(
        self,
        agent: str,
        tool: str,
        operation: str,
        resource: str = "unknown-resource",
        arguments: dict | None = None,
        context: dict | None = None,
        user_id: str = "unknown-user",
    ) -> Decision:

        payload = {
            "agent": {
                "id": agent,
                "type": "autonomous",
                "framework": "unknown",
            },
            "principal": {
                "id": user_id,
            },
            "action": {
                "tool": tool,
                "operation": operation,
                "resource": resource,
                "arguments": arguments or {},
            },
            "context": context or {},
        }

        response = requests.post(
            f"{self.url}/v1/authorize",
            json=payload,
            timeout=self.timeout,
        )

        response.raise_for_status()

        data = response.json()

        return Decision(
            decision=data["decision"],
            risk=Risk(
                level=data["risk"]["level"],
                score=data["risk"]["score"],
            ),
            reason=data.get("reason", ""),
            policy_id=data.get("policy", {}).get(
                "id",
                ""
            ),
            factors=data.get("factors", []),
            raw=data,
        )