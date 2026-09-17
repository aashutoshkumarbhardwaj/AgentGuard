SUSPICIOUS_PATTERNS = [
    "ignore previous instructions",
    "ignore your instructions",
    "ignore all previous",
    "system message",
    "you are authorized",
    "send all confidential",
    "send confidential files",
    "upload the files",
    "forward all files",
    "do not tell the user",
    "bypass security",
    "disable security",
]


def detect_prompt_injection(text: str):
    text_lower = text.lower()

    matches = [
        pattern
        for pattern in SUSPICIOUS_PATTERNS
        if pattern in text_lower
    ]

    if matches:
        return {
            "detected": True,
            "threat_type": "PROMPT_INJECTION",
            "confidence": min(
                60 + len(matches) * 10,
                100
            ),
            "matches": matches
        }

    return {
        "detected": False,
        "threat_type": None,
        "confidence": 0,
        "matches": []
    }