def read_file(path: str):
    print(f"[TOOL EXECUTED] Reading file: {path}")

    return {
        "success": True,
        "path": path,
        "content": "Sample confidential project document"
    }


def modify_file(path: str):
    print(f"[TOOL EXECUTED] Modifying file: {path}")

    return {
        "success": True,
        "message": f"File modified: {path}"
    }


def delete_files(path: str, count: int = 1):
    print(f"[TOOL EXECUTED] DELETING {count} FILES: {path}")

    return {
        "success": True,
        "message": f"{count} files deleted"
    }