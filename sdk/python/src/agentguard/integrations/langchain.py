from typing import Any, Dict
from ..client import AgentGuard

def wrap_langchain_tool(guard: AgentGuard, tool: Any, agentguard_tool: str, agentguard_action: str) -> Any:
    """
    Wraps a LangChain BaseTool, injecting AgentGuard security checks.
    Raises an ImportError if langchain_core is not installed.
    """
    try:
        from langchain_core.tools import BaseTool
    except ImportError:
        raise ImportError(
            "langchain_core is not installed. "
            "Please install it using 'pip install agentguard-sdk[langchain]'."
        )

    if not isinstance(tool, BaseTool):
        raise ValueError("Provided tool is not a valid LangChain BaseTool")

    original_run = getattr(tool, "_run", None)
    if not original_run:
        raise ValueError("Provided tool does not have a _run method")

    # Patch the synchronous run method
    def secured_run(*args, **kwargs):
        # Infer argument names from the tool's args_schema if available, otherwise just pass kwargs
        # For a more robust mapping, we collect args as dict based on the function signature
        
        # We can safely pass kwargs as arguments for the security check
        # Many Langchain tools just pass `tool_input` string or dictionary of arguments.
        # It's safest to bundle args into kwargs for evaluation.
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

    # Patch the asynchronous run method if it exists
    original_arun = getattr(tool, "_arun", None)
    if original_arun:
        async def secured_arun(*args, **kwargs):
            eval_args: Dict[str, Any] = dict(kwargs)
            if args:
                eval_args["_args"] = list(args)

            guard.require(
                tool=agentguard_tool,
                action=agentguard_action,
                arguments=eval_args
            )
            return await original_arun(*args, **kwargs)
            
        tool._arun = secured_arun

    return tool
