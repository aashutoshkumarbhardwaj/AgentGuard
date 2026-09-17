POLICIES = {
    "calendar.read": {
        "decision": "ALLOW",
        "risk_level": "LOW",
        "risk_score": 10,
        "policy_id": "CALENDAR_READ_001",
        "reason": "Reading calendar data is permitted."
    },

    "email.read": {
        "decision": "ALLOW",
        "risk_level": "LOW",
        "risk_score": 15,
        "policy_id": "EMAIL_READ_001",
        "reason": "Reading email is permitted."
    },

    "email.send": {
        "decision": "APPROVE",
        "risk_level": "HIGH",
        "risk_score": 65,
        "policy_id": "EMAIL_SEND_001",
        "reason": "External communication requires human approval."
    },

    "file.read": {
        "decision": "ALLOW",
        "risk_level": "LOW",
        "risk_score": 20,
        "policy_id": "FILE_READ_001",
        "reason": "File read access is permitted."
    },

    "file.modify": {
        "decision": "APPROVE",
        "risk_level": "HIGH",
        "risk_score": 70,
        "policy_id": "FILE_MODIFY_001",
        "reason": "File modification requires human approval."
    },

    "file.delete": {
        "decision": "BLOCK",
        "risk_level": "CRITICAL",
        "risk_score": 98,
        "policy_id": "FILE_DELETE_001",
        "reason": "Destructive file operations are blocked."
    },

    "credential.read": {
        "decision": "BLOCK",
        "risk_level": "CRITICAL",
        "risk_score": 100,
        "policy_id": "CREDENTIAL_ACCESS_001",
        "reason": "Credential access is never permitted."
    }
}