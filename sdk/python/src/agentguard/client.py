import os
import httpx
import functools
import inspect
from typing import Optional, Dict, Any, Callable

from .models import Decision, Risk, Policy
from .exceptions import AgentGuardConnectionError, AgentGuardBlocked, ApprovalRequired

class AgentGuard:
    """Production-quality Python SDK for integrating AI agents with AgentGuard."""
    
    def __init__(self, agent_id: Optional[str] = None, server: Optional[str] = None, user_id: Optional[str] = None):
        self.agent_id = agent_id or os.environ.get("AGENTGUARD_AGENT_ID")
        self.server = server or os.environ.get("AGENTGUARD_URL", "http://localhost:8000")
        self.user_id = user_id or os.environ.get("AGENTGUARD_USER_ID", "default-user")
        
        if not self.agent_id:
            raise ValueError("agent_id must be provided or AGENTGUARD_AGENT_ID must be set")
            
        self.client = httpx.Client(
            base_url=self.server.rstrip("/"),
            timeout=10.0
        )
        
    def authorize(
        self, 
        tool: str, 
        action: str, 
        arguments: Optional[Dict[str, Any]] = None, 
        context: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None,
        resource: Optional[str] = None
    ) -> Decision:
        """
        Request authorization from AgentGuard for an action.
        Defaults to fail-closed behavior (BLOCK) if the server is unreachable.
        """
        payload = {
            "agent": {
                "id": self.agent_id,
                "type": "autonomous",
                "framework": "unknown"
            },
            "principal": {
                "id": user_id or self.user_id
            },
            "action": {
                "tool": tool,
                "operation": action,
                "resource": resource,
                "arguments": arguments or {}
            },
            "context": context or {}
        }
        
        try:
            response = self.client.post("/v1/authorize", json=payload)
            response.raise_for_status()
            data = response.json()
            return Decision(**data)
            
        except httpx.RequestError as e:
            # Default fail-closed if unreachable
            return Decision(
                decision="BLOCK",
                allowed=False,
                blocked=True,
                requires_approval=False,
                reason=f"AgentGuard server unreachable: {str(e)}. Defaulting to fail-closed.",
                risk=Risk(level="CRITICAL", score=100, factors=["Server unreachable"]),
                policy=Policy(id="FAIL_CLOSED"),
            )
        except httpx.HTTPStatusError as e:
            # Default fail-closed if internal server error
            return Decision(
                decision="BLOCK",
                allowed=False,
                blocked=True,
                requires_approval=False,
                reason=f"AgentGuard server returned HTTP {e.response.status_code}. Defaulting to fail-closed.",
                risk=Risk(level="CRITICAL", score=100, factors=["Server error"]),
                policy=Policy(id="FAIL_CLOSED"),
            )

    def check(self, *args, **kwargs) -> Decision:
        """Alias for authorize()."""
        return self.authorize(*args, **kwargs)
        
    def is_allowed(self, *args, **kwargs) -> bool:
        """
        Returns True only if the decision is strictly ALLOW.
        Returns False for APPROVE, BLOCK, or network failures.
        """
        decision = self.authorize(*args, **kwargs)
        return decision.allowed
        
    def require(self, *args, **kwargs) -> None:
        """
        Requests authorization.
        Returns normally if ALLOW.
        Raises AgentGuardBlocked if BLOCK or network failure.
        Raises ApprovalRequired if APPROVE.
        """
        decision = self.authorize(*args, **kwargs)
        
        if decision.allowed:
            return
            
        if decision.requires_approval:
            raise ApprovalRequired(
                reason=decision.reason,
                risk_level=decision.risk_level,
                risk_score=decision.risk_score,
                factors=decision.factors
            )
            
        if decision.blocked:
            if decision.policy_id == "FAIL_CLOSED":
                raise AgentGuardConnectionError(decision.reason)
                
            raise AgentGuardBlocked(
                reason=decision.reason,
                risk_level=decision.risk_level,
                risk_score=decision.risk_score,
                policy_id=decision.policy_id,
                factors=decision.factors
            )

    def protect(self, tool: str, action: str, context: Optional[Dict[str, Any]] = None, resource: Optional[str] = None):
        """
        Decorator to protect a function with AgentGuard.
        Arguments passed to the function are forwarded to AgentGuard for analysis.
        """
        def decorator(func: Callable):
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                sig = inspect.signature(func)
                bound_args = sig.bind(*args, **kwargs)
                bound_args.apply_defaults()
                
                self.require(
                    tool=tool,
                    action=action,
                    arguments=bound_args.arguments,
                    context=context,
                    resource=resource
                )
                
                return func(*args, **kwargs)
            return wrapper
        return decorator
        
    def protect_tool(self, callable: Callable, tool: str, action: str, context: Optional[Dict[str, Any]] = None, resource: Optional[str] = None) -> Callable:
        """
        Returns a protected version of the callable without using the decorator syntax.
        """
        return self.protect(tool, action, context, resource)(callable)
