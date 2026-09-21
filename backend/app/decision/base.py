from abc import ABC, abstractmethod
from typing import Any
from .models import DecisionResult


class DecisionProvider(ABC):
    name: str = "unknown"

    @abstractmethod
    async def evaluate(
        self,
        state: dict[str, Any],
    ) -> DecisionResult:
        """Evaluate agent tool call state and return a structured decision result."""
        ...
