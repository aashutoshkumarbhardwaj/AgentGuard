def assess_risk(action: str, arguments: dict, context: dict):
    factors = []
    score = 0

    if action == "read":
        score += 10

    if action == "send":
        score += 40
        factors.append("External communication")

    if action == "modify":
        score += 50
        factors.append("Data modification")

    if action == "delete":
        score += 80
        factors.append("Destructive operation")

    if "password" in str(arguments).lower():
        score += 30
        factors.append("Credential-related data")

    if "secret" in str(arguments).lower():
        score += 30
        factors.append("Sensitive information")

    source = context.get("source", "")

    if source in ["email", "webpage", "external_document"]:
        score += 20
        factors.append("Untrusted external content")

    score = min(score, 100)

    if score >= 90:
        level = "CRITICAL"
    elif score >= 70:
        level = "HIGH"
    elif score >= 40:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "score": score,
        "level": level,
        "factors": factors
    }
    