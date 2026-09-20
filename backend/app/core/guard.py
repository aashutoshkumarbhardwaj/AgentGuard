from app.core.policies import POLICIES
from app.services.risk_engine import assess_risk
from app.services.context_engine import analyze_context
from app.services.bedrock_guardrail import evaluate_bedrock_guardrail, extract_evaluation_text
from app.security.cedar.engine import cedar_authorize
from app.security.normalize import normalize_action
from app.db.agents import get_agent, can_use_tool


def evaluate_action(
    tool: str,
    action: str,
    arguments: dict,
    context: dict,
    agent_id: str = "unknown-agent",
    user_id: str = "unknown-user",
    resource: str = "unknown-resource",
):
    # Check if agent is registered
    agent = get_agent(agent_id)
    if not agent:
        return {
            "decision": "BLOCK",
            "risk_level": "CRITICAL", 
            "risk_score": 100,
            "policy_id": "UNKNOWN_AGENT_001",
            "reason": "Agent is not registered with AgentGuard.",
            "factors": ["Unknown agent identity"],
            "authorization": {
                "cedar_allowed": False,
                "agent_registered": False,
            },
            "security": {},
            "bedrock": {
                "available": False,
                "blocked": False,
                "prompt_attack_detected": False,
                "sensitive_information_detected": False,
            },
        }

    policy_key = normalize_action(tool, action)
    
    # Check if agent can use this tool
    if not can_use_tool(agent_id, policy_key):
        return {
            "decision": "BLOCK",
            "risk_level": "CRITICAL",
            "risk_score": 100,
            "policy_id": "AGENT_PERMISSION_001",
            "reason": "Agent is not permitted to perform this action.",
            "factors": [f"Agent {agent_id} is not authorized for {policy_key}"],
            "authorization": {
                "cedar_allowed": False,
                "agent_registered": True,
                "agent_permission": False,
            },
            "security": {},
            "bedrock": {
                "available": False,
                "blocked": False,
                "prompt_attack_detected": False,
                "sensitive_information_detected": False,
            },
        }

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
            },
            "security": {},
            "bedrock": {
                "available": False,
                "blocked": False,
                "prompt_attack_detected": False,
                "sensitive_information_detected": False,
            },
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
    # 2. Amazon Bedrock Guardrail assessment
    # --------------------------------------------------

    eval_text = extract_evaluation_text(arguments=arguments, context=context, action=action)
    bedrock_result = evaluate_bedrock_guardrail(eval_text)

    # --------------------------------------------------
    # 3. Existing risk analysis
    # --------------------------------------------------

    risk = assess_risk(
        action,
        arguments,
        context
    )

    # --------------------------------------------------
    # 4. Context / threat analysis (Prompt Injection + Data Classifier)
    # --------------------------------------------------

    context_analysis = analyze_context(
        action,
        arguments,
        context
    )

    factors = list(risk["factors"])
    factors.extend(context_analysis["factors"])

    score = max(
        policy["risk_score"],
        risk["score"]
    )

    # --------------------------------------------------
    # 5. Combine security signals & escalation
    # --------------------------------------------------

    bedrock_prompt_attack = bedrock_result.get("prompt_attack_detected", False)
    bedrock_sensitive = bedrock_result.get("sensitive_information_detected", False)
    bedrock_blocked = bedrock_result.get("blocked", False)

    if bedrock_prompt_attack:
        score = max(score, 90)
        factors.append("Amazon Bedrock detected prompt attack")

    if bedrock_sensitive:
        factors.append("Amazon Bedrock detected sensitive information")
        if context.get("destination") == "external":
            score = max(score, 95)
            factors.append("Bedrock sensitive data directed to external destination")
        else:
            score = max(score, 70)

    if bedrock_blocked and not (bedrock_prompt_attack or bedrock_sensitive):
        score = max(score, 90)
        factors.append("Amazon Bedrock Guardrail policy violation")

    prompt_injection_detected = (
        context_analysis["prompt_injection"]["detected"]
    )

    if prompt_injection_detected:
        score = max(score, 90)
        factors.append("Prompt injection detected by security layer")
        
    if context_analysis["data_classification"]["sensitive"]:
        score = max(score, 100)
        factors.append("Sensitive data exposure")

    if (
        context_analysis["data_classification"]["sensitive"]
        and context.get("destination") == "external"
    ):
        score = max(score, 95)
        factors.append("Potential data exfiltration")

    # Cedar denial is a hard security boundary.
    if not cedar_result["allowed"]:
        score = 100
        factors.append("Cedar authorization denied")

    score = min(score, 100)

    # --------------------------------------------------
    # 6. Risk level
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
    # 7. Final AgentGuard decision
    # --------------------------------------------------

    decision = policy["decision"]

    # Cedar DENY is an unconditional BLOCK
    if not cedar_result["allowed"]:
        decision = "BLOCK"
    elif prompt_injection_detected or bedrock_prompt_attack:
        decision = "BLOCK"
    elif bedrock_sensitive and context.get("destination") == "external":
        decision = "BLOCK"
    elif bedrock_blocked:
        decision = "BLOCK"
    elif risk_level == "CRITICAL":
        decision = "BLOCK"

    # Determine primary reason if blocked by security
    reason = policy["reason"]
    if decision == "BLOCK":
        if not cedar_result["allowed"]:
            reason = "Cedar authorization denied"
        elif prompt_injection_detected or bedrock_prompt_attack:
            reason = "Prompt injection attack detected"
        elif bedrock_sensitive and context.get("destination") == "external":
            reason = "Sensitive data exfiltration detected"
        elif bedrock_blocked:
            reason = bedrock_result.get("reason", "Amazon Bedrock Guardrail intervened")

    bedrock_audit = {
        "available": bedrock_result.get("available", False),
        "blocked": bedrock_result.get("blocked", False),
        "prompt_attack_detected": bedrock_prompt_attack,
        "sensitive_information_detected": bedrock_sensitive,
        "assessments": bedrock_result.get("assessments", []),
    }

    return {
        "decision": decision,
        "risk_level": risk_level,
        "risk_score": score,
        "policy_id": policy["policy_id"],
        "reason": reason,
        "factors": list(set(factors)),

        "authorization": {
            "cedar_allowed": cedar_result["allowed"],
            "cedar_decision": cedar_result["decision"],
        },

        "security": {
            "prompt_injection": context_analysis["prompt_injection"],
            "data_classification": context_analysis["data_classification"],
            "bedrock": bedrock_audit,
        },

        "bedrock": bedrock_audit,
    }