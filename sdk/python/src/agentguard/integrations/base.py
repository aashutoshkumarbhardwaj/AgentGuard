from typing import Any, Protocol, runtime_checkable

@runtime_checkable
class AgentGuardIntegration(Protocol):
    """
    Protocol for AgentGuard framework integrations.
    Any custom framework adapter should implement wrap_tool.
    """
    
    def wrap_tool(self, tool: Any, agentguard_tool: str, agentguard_action: str) -> Any:
        """
        Wraps a framework-specific tool, enforcing AgentGuard security before execution.
        """
        ...
