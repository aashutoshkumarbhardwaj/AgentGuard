from pathlib import Path

from cedarpy import (
    Decision,
    PolicySet,
    is_authorized,
)


BASE_DIR = Path(__file__).resolve().parent

POLICY_FILE = BASE_DIR / "policies.cedar"


with open(POLICY_FILE, "r", encoding="utf-8") as f:
    POLICY_TEXT = f.read()


# Parse once at startup.
# Reusing a PolicySet avoids reparsing policies on every request.
POLICIES = PolicySet.from_str(POLICY_TEXT)


def cedar_authorize(
    principal_id: str,
    principal_type: str,
    action: str,
    resource_id: str,
    resource_type: str,
    context: dict | None = None,
):
    request = {
        "principal": {
            "type": principal_type,
            "id": principal_id,
        },
        "action": {
            "type": "Action",
            "id": action,
        },
        "resource": {
            "type": resource_type,
            "id": resource_id,
        },
        "context": context or {},
    }

    entities = [
        {
            "uid": {
                "__entity": {
                    "type": principal_type,
                    "id": principal_id,
                }
            },
            "attrs": {},
            "parents": [],
        },
        {
            "uid": {
                "__entity": {
                    "type": resource_type,
                    "id": resource_id,
                }
            },
            "attrs": {},
            "parents": [],
        },
    ]

    result = is_authorized(
        request=request,
        policies=POLICIES,
        entities=entities,
    )

    return {
        "allowed": result.decision == Decision.Allow,
        "decision": str(result.decision),
        "diagnostics": result.diagnostics,
    }