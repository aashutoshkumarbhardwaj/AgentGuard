import re
import sys


# --------------------------------------------------
# 1. Deterministic rule-based detection
# --------------------------------------------------

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


# --------------------------------------------------
# 2. Hugging Face ML detector
# --------------------------------------------------

_ml_detector = None


def get_ml_detector():
    global _ml_detector

    if _ml_detector is None:
        try:
            from transformers import pipeline
            print("[AgentGuard] Loading prompt injection ML model...", file=sys.stderr)

            _ml_detector = pipeline(
                "text-classification",
                model="protectai/deberta-v3-base-prompt-injection-v2",
                max_length=512,
                truncation=True,
            )

            print("[AgentGuard] ML detector loaded.", file=sys.stderr)
        except Exception as e:
            print(f"[AgentGuard] Could not load transformers ML model: {e}", file=sys.stderr)
            raise

    return _ml_detector


# --------------------------------------------------
# 3. Hybrid detection
# --------------------------------------------------

def detect_prompt_injection(text: str):
    text_lower = text.lower()

    # ---------- Rule detection ----------

    matches = [
        pattern
        for pattern in SUSPICIOUS_PATTERNS
        if pattern in text_lower
    ]

    rule_detected = len(matches) > 0

    rule_confidence = 0

    if rule_detected:
        rule_confidence = min(
            60 + len(matches) * 10,
            100
        )

    # ---------- ML detection ----------

    ml_detected = False
    ml_confidence = 0
    ml_label = None

    try:
        detector = get_ml_detector()

        result = detector(
            text[:4000],
            truncation=True
        )[0]

        ml_label = result["label"]
        ml_confidence = round(
            result["score"] * 100,
            2
        )

        # The model's label names may vary.
        # Treat injection/malicious labels as threats.
        ml_detected = any(
            keyword in ml_label.lower()
            for keyword in [
                "inject",
                "malicious",
                "attack",
                "unsafe",
            ]
        )

    except Exception as e:
        print(
            f"[AgentGuard] ML detector unavailable: {e}"
        )

    # --------------------------------------------------
    # Combine both detectors
    # --------------------------------------------------

    detected = rule_detected or ml_detected

    confidence = max(
        rule_confidence,
        ml_confidence if ml_detected else 0
    )

    if detected:
        return {
            "detected": True,
            "threat_type": "PROMPT_INJECTION",
            "confidence": confidence,
            "matches": matches,
            "detection_methods": {
                "rules": rule_detected,
                "ml": ml_detected,
            },
            "ml_label": ml_label,
            "ml_confidence": ml_confidence,
        }

    return {
        "detected": False,
        "threat_type": None,
        "confidence": 0,
        "matches": [],
        "detection_methods": {
            "rules": False,
            "ml": False,
        },
        "ml_label": ml_label,
        "ml_confidence": ml_confidence,
    }