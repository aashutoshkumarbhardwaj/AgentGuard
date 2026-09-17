import requests


BASE_URL = "http://127.0.0.1:8001"

def get_agents():
    return get("/agents")


def get_agent_permissions(agent_id: str):
    return get(
        f"/agents/{agent_id}/permissions"
    )


def allow_permission(
    agent_id: str,
    action: str,
):
    response = requests.post(
        f"{BASE_URL}/agents/"
        f"{agent_id}/permissions/allow",
        params={"action": action},
        timeout=10,
    )

    response.raise_for_status()

    return response.json()


def deny_permission(
    agent_id: str,
    action: str,
):
    response = requests.post(
        f"{BASE_URL}/agents/"
        f"{agent_id}/permissions/deny",
        params={"action": action},
        timeout=10,
    )

    response.raise_for_status()

    return response.json()

def get(path: str):

    response = requests.get(
        f"{BASE_URL}{path}",
        timeout=10,
    )

    response.raise_for_status()

    return response.json()


def post(path: str):

    response = requests.post(
        f"{BASE_URL}{path}",
        timeout=30,
    )

    response.raise_for_status()

    return response.json()


def get_approvals():

    return get("/approvals")


def approve(approval_id: str):

    return post(
        f"/approvals/{approval_id}/approve"
    )


def reject(approval_id: str):

    return post(
        f"/approvals/{approval_id}/reject"
    )


def get_audit():

    return get("/audit")


def verify_audit():

    return get("/audit/verify")