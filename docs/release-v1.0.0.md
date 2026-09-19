# AgentGuard v1.0.0

AgentGuard is a universal runtime security and authorization control plane for AI agents. It acts as an independent security gateway that intercepts AI agent tool invocations, evaluates them against organizational security policies, and blocks malicious, destructive, or unauthorized actions before they execute.

## Major Capabilities

- **Runtime Authorization**: Decouple authorization logic from AI intelligence.
- **Cedar Policy Enforcement**: Powerful, verifiable ABAC/RBAC rules via AWS Cedar.
- **Dynamic Risk Evaluation**: Context-aware heuristics for assessing data sensitivity and operational risk.
- **Prompt Injection Detection**: Built-in ML pipeline to halt adversarial inputs before they reach critical tools.
- **Sensitive-Data Detection**: Stop PII and credential exfiltration out of the box.
- **Human Approval Workflow**: Cryptographically secure human-in-the-loop approvals for high-risk actions.
- **JIT Approval Re-Evaluation**: Pending approvals are re-evaluated just-in-time before execution.
- **Persistent Audit Chain**: Tamper-evident ledger using SQLite hash-chains.
- **MCP Gateway**: Native Model Context Protocol support to proxy any agent tool.
- **Python SDK**: Seamless integration with a comprehensive SDK.
- **Framework Support**: Drop-in integrations for LangChain and CrewAI.
- **TUI**: Rich terminal UI for monitoring live traffic and approving actions.
- **Docker Deployment**: Single-command containerized production deployment.

## Testing Summary

- 100% pass rate for Core Security Regression Suite.
- 100% pass rate for SDK and Integrations Test Suite.
- Evaluated end-to-end MCP capabilities with real agent execution logic.

## Known Limitations

- Prompt injection detectors operate probabilistically and may exhibit false positives/negatives on novel adversarial patterns.
- AgentGuard cannot protect tools invoked directly without the SDK decorators or MCP gateway.

## Installation

You can install the SDK directly via pip:

```bash
pip install agentguard
```

To run the backend server natively:

```bash
docker-compose up -d
```

## Example Usage

Using the SDK to protect a sensitive action:

```python
from agentguard import AgentGuard

# Initialize guard against your backend server
guard = AgentGuard(agent_id="research-agent", server="http://localhost:8000")

# Decorate any function to automatically intercept execution
@guard.protect(tool="email", action="send")
def send_email(to: str, body: str):
    print(f"Email securely sent to {to}")

send_email(to="internal@company.com", body="Hello team!")
```
