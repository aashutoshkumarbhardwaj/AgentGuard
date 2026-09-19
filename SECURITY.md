# Security Architecture and Guarantees

## Trust Boundaries
AgentGuard assumes the execution environment of the SDK and the MCP Gateway are within your trusted network. The agent itself (e.g., an LLM reasoning loop) is considered **untrusted**.

## Enforcement Points
Execution halting occurs natively in the SDK adapters or the MCP Gateway via thrown exceptions, ensuring that tool execution cannot bypass the authorization layer natively.

## Fail-Closed Behavior
AgentGuard guarantees that if the security enforcement server is unreachable or times out, the corresponding SDK adapters and MCP Gateways will default to a `BLOCK` decision. AI Agents will be halted rather than bypassing security.

## Approval Lifecycle
When a human operator approves a pending action, AgentGuard fetches the *original* arguments and context, and re-evaluates the action just-in-time against the current permissions and threat models. If the agent's permissions were revoked in the interim, or the approval has expired (24 hours), the execution is strictly blocked.

## Audit Integrity
AgentGuard maintains a persistent SQLite ledger where every authorization decision contains `previous_hash` and `event_hash` properties to cryptographically verify that audit trails have not been manipulated. Any database tampering instantly invalidates the chain.

## Threat Detection Limitations
The prompt injection module currently relies on pattern matching and lightweight ML heuristics. It is an additional layer of defense-in-depth, not a silver bullet. You should always configure your Cedar policies with least-privilege principles.

## Responsible Disclosure
If you discover a vulnerability that allows an agent to bypass an AgentGuard policy, please do not file a public issue. Instead, report it privately via the [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) feature on this repository.
