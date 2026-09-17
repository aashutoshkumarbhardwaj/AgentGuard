from app.services.threat_detector import detect_prompt_injection
from app.services.data_classifier import classify_data


def analyze_context(
    action: str,
    arguments: dict,
    context: dict
):

    text = " ".join(
        str(value)
        for value in arguments.values()
    )

    external_content = context.get(
        "external_content",
        ""
    )

    combined_text = f"{text} {external_content}"

    injection = detect_prompt_injection(
        combined_text
    )

    data = classify_data(
        combined_text
    )

    factors = []

    if injection["detected"]:
        factors.append(
            "Prompt injection indicators detected"
        )

    if data["sensitive"]:
        factors.append(
            "Sensitive data involved"
        )

    if context.get("source") in [
        "email",
        "webpage",
        "external_document"
    ]:
        factors.append(
            "Action influenced by untrusted content"
        )

    destination = context.get(
        "destination",
        ""
    )

    if destination == "external":
        factors.append(
            "External destination"
        )

    return {
        "prompt_injection": injection,
        "data_classification": data,
        "factors": factors
    }