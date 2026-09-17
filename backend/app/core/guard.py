from app.core.policies import POLICIES
from app.services.risk_engine import assess_risk
from app.services.context_engine import analyze_context


def evaluate_action(
    tool: str,
    action: str,
    arguments: dict,
    context: dict
):

    policy_key = f"{tool}.{action}"

    policy = POLICIES.get(policy_key)

    if not policy:
        return {
            "decision": "BLOCK",
            "risk_level": "CRITICAL",
            "risk_score": 100,
            "policy_id": "DEFAULT_DENY_001",
            "reason": "No policy exists for this action.",
            "factors": ["Unknown action"]
        }

    risk = assess_risk(
        action,
        arguments,
        context
    )

    context_analysis = analyze_context(
        action,
        arguments,
        context
    )

    factors = list(risk["factors"])

    factors.extend(
        context_analysis["factors"]
    )

    score = max(
        policy["risk_score"],
        risk["score"]
    )

    # Prompt injection automatically escalates risk
    if context_analysis[
        "prompt_injection"
    ]["detected"]:

        score = max(score, 90)

    # Sensitive data + external destination
    if (
        context_analysis[
            "data_classification"
        ]["sensitive"]
        and
        context.get("destination") == "external"
    ):
        score = max(score, 95)

        factors.append(
            "Potential data exfiltration"
        )

    score = min(score, 100)

    if score >= 90:
        risk_level = "CRITICAL"
    elif score >= 70:
        risk_level = "HIGH"
    elif score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    decision = policy["decision"]

    if risk_level == "CRITICAL":
        decision = "BLOCK"

    return {
        "decision": decision,
        "risk_level": risk_level,
        "risk_score": score,
        "policy_id": policy["policy_id"],
        "reason": policy["reason"],
        "factors": list(set(factors)),
        "security": {
            "prompt_injection": context_analysis[
                "prompt_injection"
            ],
            "data_classification": context_analysis[
                "data_classification"
            ]
        }
    }