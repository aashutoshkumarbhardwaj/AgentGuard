from pathlib import Path
from cedarpy import is_authorized, PolicySet, Schema, Decision


POLICY_PATH = Path(__file__).parent / "policies.cedar"
SCHEMA_PATH = Path(__file__).parent / "schema.cedarschema"

with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
    SCHEMA_TEXT = f.read()

with open(POLICY_PATH, "r", encoding="utf-8") as f:
    POLICY_TEXT = f.read()

# Parse once at startup for performance
SCHEMA = Schema.from_str(SCHEMA_TEXT)
POLICY_SET = PolicySet.from_str(POLICY_TEXT)


def authorize(
    agent_id: str,
    action: str,
    resource: str,
    context: dict | None = None,
):
    context = context or {}

    # Cedar entity format - simple uid format
    entities = [
        {
            "uid": {"type": "Agent", "id": agent_id},
            "attrs": {},
            "parents": []
        },
        {
            "uid": {"type": "Resource", "id": resource},
            "attrs": {},
            "parents": []
        }
    ]

    # Request format with explicit Cedar EntityUID format
    # Cedar EntityUID format: Entity::"id"
    request = {
        "principal": f'Agent::"{agent_id}"',
        "action": f'Action::"{action}"',
        "resource": f'Resource::"{resource}"',
        "context": context,
    }

    result = is_authorized(
        request=request,
        policies=POLICY_SET,
        entities=entities,
        schema=SCHEMA,
    )

    return {
        "allowed": result.allowed,
        "decision": str(result.decision),
    }
