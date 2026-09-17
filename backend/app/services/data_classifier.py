SENSITIVE_PATTERNS = [
    "confidential",
    "customer data",
    "customer records",
    "password",
    "credential",
    "secret",
    "api key",
    "private key",
    "financial",
    "ssn",
    "aadhaar",
]


def classify_data(text: str):

    text_lower = text.lower()

    matches = [
        pattern
        for pattern in SENSITIVE_PATTERNS
        if pattern in text_lower
    ]

    if matches:
        return {
            "sensitive": True,
            "classification": "CONFIDENTIAL",
            "matches": matches
        }

    return {
        "sensitive": False,
        "classification": "PUBLIC",
        "matches": []
    }