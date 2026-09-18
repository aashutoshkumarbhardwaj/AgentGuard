class AgentGuardException(Exception):
    """Base exception for AgentGuard SDK."""
    pass

class AgentGuardConnectionError(AgentGuardException):
    """Raised when AgentGuard server is unreachable (fail-closed)."""
    pass

class AgentGuardBlocked(AgentGuardException):
    """Raised when an action is strictly BLOCKED by AgentGuard."""
    def __init__(self, reason: str, risk_level: str, risk_score: int, policy_id: str, factors: list):
        super().__init__(f"AgentGuard blocked action: {reason} (Risk: {risk_level} {risk_score}, Policy: {policy_id})")
        self.reason = reason
        self.risk_level = risk_level
        self.risk_score = risk_score
        self.policy_id = policy_id
        self.factors = factors

class ApprovalRequired(AgentGuardException):
    """Raised when an action requires explicit human approval."""
    def __init__(self, reason: str, risk_level: str, risk_score: int, factors: list):
        super().__init__(f"AgentGuard requires approval: {reason} (Risk: {risk_level} {risk_score})")
        self.reason = reason
        self.risk_level = risk_level
        self.risk_score = risk_score
        self.factors = factors
