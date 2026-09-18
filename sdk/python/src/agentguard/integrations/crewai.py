from typing import Any, Dict
from ..client import AgentGuard

def wrap_crewai_tool(guard: AgentGuard, tool: Any, agentguard_tool: str, agentguard_action: str) -> Any:
    """
    Wraps a CrewAI BaseTool, injecting AgentGuard security checks.
    Raises an ImportError if crewai is not installed.
    """
    try:
        # CrewAI tools often inherit from LangChain's BaseTool or have a similar interface.
        from crewai.tools import BaseTool
    except ImportError:
        raise ImportError(
            "crewai is not installed. "
            "Please install it using 'pip install agentguard-sdk[crewai]'."
        )

    if not isinstance(tool, BaseTool):
        raise ValueError("Provided tool is not a valid CrewAI BaseTool")

    original_run = getattr(tool, "_run", None)
    if not original_run:
        raise ValueError("Provided tool does not have a _run method")

    def secured_run(*args, **kwargs):
        eval_args: Dict[str, Any] = dict(kwargs)
        if args:
            eval_args["_args"] = list(args)

        guard.require(
            tool=agentguard_tool,
            action=agentguard_action,
            arguments=eval_args
        )
        return original_run(*args, **kwargs)

    tool._run = secured_run

    return tool
