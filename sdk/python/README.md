# AgentGuard Python SDK

A production-quality Python SDK for integrating AI agents with the AgentGuard security system.

## What is AgentGuard?
AgentGuard is an end-to-end security pipeline for autonomous AI agents. It protects your tools and systems by strictly mediating agent actions through an approval pipeline involving Cedar authorization policies, dynamic ML threat detection (like prompt injection), and a human-in-the-loop approval workflow.

## Why it exists?
AI agents are increasingly given access to sensitive systems (email, file systems, internal APIs). Without a robust gateway, a compromised agent or prompt-injected LLM can exfiltrate data, perform destructive operations, or perform unauthorized actions. AgentGuard provides a transparent security layer to prevent this.

## Installation

You can install the SDK locally from the project root:

```bash
pip install -e sdk/python/
```

## Basic Usage

The SDK defaults to a fail-closed behavior, meaning if the AgentGuard server is unreachable, actions are securely `BLOCKED`.

### Initialization
```python
import os
from agentguard import AgentGuard, AgentGuardBlocked, ApprovalRequired

# Initialize with explicit parameters or environment variables 
# (AGENTGUARD_AGENT_ID, AGENTGUARD_URL, AGENTGUARD_USER_ID)
guard = AgentGuard(
    agent_id="research-agent",
    server="http://localhost:8000"
)
```

### require() wrapper (Recommended)
The `.require()` method abstracts the decision handling into standard exceptions.

```python
try:
    # If ALLOW, execution continues normally.
    guard.require("file_read", "read", arguments={"path": "report.pdf"})
    print("Action allowed! Executing tool...")
    
except ApprovalRequired as e:
    # If APPROVE, an approval is created and human operator must review.
    print(f"Action requires human approval: {e.reason}")
    
except AgentGuardBlocked as e:
    # If BLOCK, execution is halted immediately.
    print(f"Action was strictly blocked: {e.reason}")
```

## ALLOW / APPROVE / BLOCK Semantics
AgentGuard evaluates all requests and returns one of three decisions:
1. `ALLOW`: The action is safe according to permissions, policies, and threat detection.
2. `APPROVE`: The action is sensitive (e.g. external communication) and requires a human operator to review it via the AgentGuard TUI or API.
3. `BLOCK`: The action is explicitly prohibited or highly dangerous (e.g. prompt injection, unauthorized agent).

## Fail-Closed Behavior
If the AgentGuard server is down, unreachable, or returns a 500 error, the SDK gracefully defaults to a **fail-closed** posture. The decision returned will be `BLOCK`, and `.require()` will raise an `AgentGuardConnectionError`. This ensures AI agents do not bypass security during outages.

## MCP Integration
If you are exposing your tools using the **Model Context Protocol (MCP)**, you can integrate this SDK into your MCP Gateway to strictly enforce AgentGuard decisions over the JSONRPC streams. See the `agentguard/backend/app/mcp/mcp_server.py` file for a full implementation.

## Architecture
```
AI Agent / MCP Client
        |
        | Tool Call (e.g., email_send)
        v
    AgentGuard SDK  --> HTTP POST /v1/authorize --> [ AgentGuard Server ]
        |                                           [ - Cedar Policy    ]
        |                                           [ - Risk Engine     ]
        v                                           [ - ML Threat Detect]
   ALLOW / BLOCK / APPROVE                          [ - Persistent Audit]
        |
        v
 Protected Tool
```
