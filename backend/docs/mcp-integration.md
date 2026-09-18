# AgentGuard MCP Integration

AgentGuard provides a secure, fully-managed gateway for Model Context Protocol (MCP) clients.

By configuring your AI agents (MCP clients) to connect to the AgentGuard MCP Gateway rather than connecting them directly to the underlying tools, every tool call is transparently evaluated by the AgentGuard security pipeline.

## Architecture

```mermaid
flowchart TD
    Client[AI Agent / MCP Client]
    Gateway[AgentGuard MCP Gateway]
    Tool1[calendar_read]
    Tool2[file_modify]
    Engine[AgentGuard Security Pipeline\n(evaluate_action)]
    DB[(AgentGuard SQLite Ledger)]

    Client -->|MCP Tool Request| Gateway
    Gateway <-->|Authorize?| Engine
    Engine -->|Persistent Audit Log| DB

    Gateway -- ALLOW --> Tool1
    Gateway -- BLOCK --> Client
    Gateway -- APPROVE --> Client
```

## Running the Gateway

The MCP gateway runs as a standard `mcp` server. It requires access to the AgentGuard Python environment and database.

Start the gateway locally using the official Python MCP Server protocol:
```bash
python -m app.mcp.mcp_server
```

## Connecting an MCP Client

Configure your MCP Client to spawn the `python` process and connect via `stdio`:

```python
from mcp.client.session import ClientSession
from mcp.client.stdio import stdio_client, StdioServerParameters
import asyncio

async def run():
    server_params = StdioServerParameters(
        command=".venv/bin/python",
        args=["-m", "app.mcp.mcp_server"],
        env=None
    )

    async with stdio_client(server_params) as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            
            # Call a protected tool
            result = await session.call_tool("calendar_read", arguments={
                "agent_id": "research-agent",
                "user_id": "user123"
            })
            
            print(result.content[0].text)

asyncio.run(run())
```

## Security Flow and Responses

When an MCP client attempts to call a tool, AgentGuard evaluates the request against:
- Agent Identity and Registration
- Agent Tool Permissions
- Cedar Authorization Policies
- ML Threat Detection (e.g. Prompt Injection)
- Data Classification

AgentGuard will respond to the MCP client in one of three ways:

### 1. ALLOW
If the action is permitted, the tool executes immediately, and the MCP client receives the real output.

**Example Client Output:**
```
Events: 10:00 AM Team Sync, 2:00 PM Project Review
```

### 2. BLOCK
If the action is forbidden (due to Cedar policy, critical risk, or prompt injection), the tool **does not execute**. The MCP client receives a standard result containing an error/block string so the Agent knows it was blocked.

**Example Client Output:**
```
AgentGuard BLOCKED this action.
Reason: Destructive file operations are blocked.
Risk: CRITICAL
```

### 3. APPROVE
If the action requires human approval (e.g., sending an external email), the tool **does not execute**. AgentGuard intercepts it and creates an approval request in the queue. The MCP client receives an approval ID.

**Example Client Output:**
```
AgentGuard REQUIRES APPROVAL for this action.
Approval ID: 5ef7d511-d25c-422a-b3c1-eb9dfe66c9e6
Reason: External communication requires human approval.
```

## Verification & Audit

Every single MCP tool attempt, regardless of whether it was `ALLOW`, `BLOCK`, or `APPROVE`, is permanently recorded in the AgentGuard Audit Ledger. 

You can view the logs in the AgentGuard TUI (Press `6`) and cryptographically verify the integrity of the audit chain (Press `v`).
