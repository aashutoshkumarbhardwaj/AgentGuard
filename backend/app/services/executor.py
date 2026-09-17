from app.tools.registry import TOOLS


def execute_tool(tool: str, action: str, arguments: dict):

    tool_key = f"{tool}.{action}"

    function = TOOLS.get(tool_key)

    if not function:
        return {
            "success": False,
            "error": f"Tool not found: {tool_key}"
        }

    try:
        result = function(**arguments)

        return {
            "success": True,
            "tool": tool_key,
            "result": result
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }