from app.core.guard import evaluate_action


def authorize_mcp_tool_call(
    agent_id: str,
    user_id: str,
    tool: str,
    arguments: dict,
    context: dict | None = None,
):
    """
    AgentGuard security boundary for MCP tool calls.

    MCP tool calls are normalized into the same
    tool.operation format used by AgentGuard.
    """

    context = context or {}

    # Never mutate the original MCP arguments.
    tool_arguments = dict(arguments)

    operation = tool_arguments.pop(
        "_operation",
        "call",
    )

    resource = context.get(
        "resource",
        "unknown-resource",
    )

    return evaluate_action(
        tool=tool,
        action=operation,
        arguments=tool_arguments,
        context=context,
        agent_id=agent_id,
        user_id=user_id,
        resource=resource,
    )