"""
Generic Tool Action Classifier for AgentGuard MCP Gateway.

Because upstream MCP servers expose arbitrary tools with custom names,
descriptions, and input schemas, this classifier normalizes arbitrary
tool invocations into canonical AgentGuard action categories (READ, MODIFY,
DELETE, EXECUTE, CREDENTIAL/EXPORT, or UNKNOWN).

Cedar remains the authoritative authorization decision maker;
this classifier provides normalization and risk signals to the engine.
"""

import re
from typing import Dict, Any, Tuple

# Verbs associated with read/inspect operations
READ_VERBS = {
    "get", "read", "list", "search", "fetch", "describe", "query",
    "find", "lookup", "view", "show", "inspect", "check", "scan",
    "ping", "status", "health", "metric", "metrics"
}

# Verbs associated with write/modify/send operations
MODIFY_VERBS = {
    "create", "write", "update", "modify", "post", "send", "put",
    "patch", "add", "insert", "append", "edit", "save", "upload", "set"
}

# Verbs associated with destructive delete operations
DELETE_VERBS = {
    "delete", "remove", "destroy", "revoke", "drop", "purge",
    "cancel", "terminate", "kill", "erase", "uninstall"
}

# Verbs associated with execution/command operations
EXECUTE_VERBS = {
    "execute", "run", "command", "deploy", "invoke", "trigger",
    "bash", "sh", "exec", "eval", "call", "start"
}

# Keywords associated with sensitive credentials/secrets/exports
CREDENTIAL_KEYWORDS = {
    "secret", "credential", "password", "token", "api_key", "apikey",
    "private_key", "export", "dump", "auth", "key"
}


def tokenize_name(name: str) -> list[str]:
    """
    Splits camelCase, snake_case, kebab-case, or colon:separated tool names.
    e.g. 'github:create_issue' -> ['github', 'create', 'issue']
         'secretExport' -> ['secret', 'export']
    """
    cleaned = re.sub(r"[:\-_/.]", " ", name)
    cleaned = re.sub(r"([a-z])([A-Z])", r"\1 \2", cleaned)
    return [t.lower() for t in cleaned.split() if t]


def classify_tool_action(
    tool_name: str,
    description: str = "",
    schema: Dict[str, Any] | None = None,
    arguments: Dict[str, Any] | None = None,
    context: Dict[str, Any] | None = None,
) -> Tuple[str, str, str]:
    """
    Classifies an arbitrary tool into:
      (canonical_domain, canonical_operation, category)

    Returns:
      domain: e.g. 'file', 'email', 'credential', 'data', 'item', 'command'
      operation: e.g. 'read', 'modify', 'send', 'delete', 'export', 'execute'
      category: READ | MODIFY | SEND | DELETE | EXECUTE | CREDENTIAL | UNKNOWN
    """
    tokens = tokenize_name(tool_name)
    desc_tokens = set(tokenize_name(description)) if description else set()
    all_tokens = set(tokens) | desc_tokens
    
    # 1. Check for credential/secret/export keywords
    if any(k in all_tokens for k in CREDENTIAL_KEYWORDS):
        if "export" in all_tokens or "dump" in all_tokens:
            return "data", "export", "CREDENTIAL"
        return "credential", "read", "CREDENTIAL"

    # 2. Check for delete verbs
    if any(v in all_tokens for v in DELETE_VERBS):
        domain = _extract_domain(tokens, default="file")
        return domain, "delete", "DELETE"

    # 3. Check for execution verbs
    if any(v in all_tokens for v in EXECUTE_VERBS):
        domain = _extract_domain(tokens, default="command")
        return domain, "execute", "EXECUTE"

    # 4. Check for send / external communication
    if "send" in all_tokens or "email" in all_tokens or "message" in all_tokens or "slack" in all_tokens:
        return "email", "send", "SEND"

    # 5. Check for modify / create verbs
    if any(v in all_tokens for v in MODIFY_VERBS):
        domain = _extract_domain(tokens, default="file")
        return domain, "modify", "MODIFY"

    # 6. Check for read / inspect verbs
    if any(v in all_tokens for v in READ_VERBS):
        domain = _extract_domain(tokens, default="file")
        return domain, "read", "READ"

    # Fallback: unknown tool
    domain = _extract_domain(tokens, default="unknown")
    return domain, "unknown", "UNKNOWN"


def _extract_domain(tokens: list[str], default: str = "file") -> str:
    """Helper to guess a tool domain from tokens."""
    known_domains = {"file", "calendar", "email", "item", "data", "system", "github", "slack", "database"}
    for t in tokens:
        if t in known_domains:
            if t == "item":
                return "file"
            return t
    return default
