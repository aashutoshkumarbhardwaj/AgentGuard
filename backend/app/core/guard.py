from app.core.policies import POLICIES
from app.services.risk_engine import assess_risk
from app.services.context_engine import analyze_context
from app.security.cedar.engine import cedar_authorize
from app.security.normalize import normalize_action


def evaluate_action(
    tool: str,
    action: str,
    arguments: dict,
    context: dict,
    agent_id: str = "unknown-agent",
    user_id: str = "unknown-user",
    resource: str = "unknown-resource",
):

    policy_key = normalize_action(
        tool,
        action
    )

    policy = POLICIES.get(policy_key)

    if not policy:
        return {
            "decision": "BLOCK",
            "risk_level": "CRITICAL",
            "risk_score": 100,
            "policy_id": "DEFAULT_DENY_001",
            "reason": "No AgentGuard policy exists for this action.",
            "factors": ["Unknown action"],
            "authorization": {
                "cedar_allowed": False
            }
        }

    # --------------------------------------------------
    # 1. Cedar authorization
    # --------------------------------------------------

    cedar_result = cedar_authorize(
        principal_id=agent_id,
        principal_type="Agent",
        action=policy_key,
        resource_id=resource or "unknown",
        resource_type="Resource",
        context=context,
    )

    # --------------------------------------------------
    # 2. Risk analysis
    # --------------------------------------------------

    risk = assess_risk(
        action,
        arguments,
        context
    )

    # --------------------------------------------------
    # 3. Context / threat analysis
    # --------------------------------------------------

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

    # --------------------------------------------------
    # 4. Security escalation
    # --------------------------------------------------

    prompt_injection_detected = (
        context_analysis["prompt_injection"]["detected"]
    )

    if prompt_injection_detected:
        score = max(score, 90)
        factors.append(
            "Prompt injection detected by security layer"
        )
        if (
            context_analysis["data_classification"]["highly_sensitive"]
        ):
            score = 100

            factors.append(
                "Highly sensitive data exposure"
            )

        if (
            context_analysis["data_classification"]["sensitive"]
            and context.get("destination") == "external"
        ):
            score = max(score, 95)

            factors.append(
                "Potential data exfiltration"
            )

    # Cedar denial is a hard security boundary.
    if not cedar_result["allowed"]:
        score = 100

        factors.append(
            "Cedar authorization denied"
        )

    score = min(score, 100)

    # --------------------------------------------------
    # 5. Risk level
    # --------------------------------------------------

    if score >= 90:
        risk_level = "CRITICAL"

    elif score >= 70:
        risk_level = "HIGH"

    elif score >= 40:
        risk_level = "MEDIUM"

    else:
        risk_level = "LOW"

    # --------------------------------------------------
    # 6. Final AgentGuard decision
    # --------------------------------------------------

    decision = policy["decision"]

    if not cedar_result["allowed"]:
        decision = "BLOCK"

    elif prompt_injection_detected:
        decision = "BLOCK"

    elif risk_level == "CRITICAL":
        decision = "BLOCK"

    return {
        "decision": decision,
        "risk_level": risk_level,
        "risk_score": score,
        "policy_id": policy["policy_id"],
        "reason": policy["reason"],
        "factors": list(set(factors)),

        "authorization": {
            "cedar_allowed": cedar_result["allowed"],
            "cedar_decision": cedar_result["decision"],
        },

        "security": {
            "prompt_injection": context_analysis[
                "prompt_injection"
            ],
            "data_classification": context_analysis[
                "data_classification"
            ],
        }
    }