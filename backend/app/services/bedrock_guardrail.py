import os
import sys
import logging
from typing import Any, Dict, List, Optional
import boto3
from botocore.config import Config
from botocore.exceptions import BotoCoreError, ClientError

logger = logging.getLogger("agentguard.bedrock")

# Configurable environment variables
AWS_REGION = os.environ.get("AWS_REGION", "ap-south-1")
BEDROCK_GUARDRAIL_ID = os.environ.get("BEDROCK_GUARDRAIL_ID", "")
BEDROCK_GUARDRAIL_VERSION = os.environ.get("BEDROCK_GUARDRAIL_VERSION", "1")
BEDROCK_REQUIRED = os.environ.get("BEDROCK_REQUIRED", "false").lower() in ("true", "1", "yes")

_bedrock_client = None


def get_bedrock_client():
    global _bedrock_client
    if _bedrock_client is None:
        try:
            # 2 second connect timeout and 3 second read timeout for fast guardrail evaluation
            boto_config = Config(
                region_name=os.environ.get("AWS_REGION", AWS_REGION),
                connect_timeout=2,
                read_timeout=3,
                retries={"max_attempts": 1}
            )
            _bedrock_client = boto3.client("bedrock-runtime", config=boto_config)
        except Exception as e:
            logger.warning(f"Failed to initialize boto3 bedrock-runtime client: {e}")
            _bedrock_client = None
    return _bedrock_client


def extract_evaluation_text(
    arguments: Dict[str, Any],
    context: Dict[str, Any],
    action: str = ""
) -> str:
    """
    Extracts relevant textual content before tool execution:
    - prompt / action context
    - tool arguments (e.g. body, query, message, path, code)
    - email body
    - external document content when available
    """
    parts: List[str] = []

    if action:
        parts.append(f"Action: {action}")

    # Tool arguments
    if arguments:
        for key, value in arguments.items():
            if value is not None:
                parts.append(f"{key}: {value}")

    # Email body or direct prompt in context
    if "prompt" in context and context["prompt"]:
        parts.append(f"Prompt: {context['prompt']}")
    if "email_body" in context and context["email_body"]:
        parts.append(f"Email Body: {context['email_body']}")
    if "external_content" in context and context["external_content"]:
        parts.append(f"External Content: {context['external_content']}")
    if "document" in context and context["document"]:
        parts.append(f"Document: {context['document']}")

    return "\n".join(parts)


def evaluate_bedrock_guardrail(
    text: str,
    guardrail_id: Optional[str] = None,
    guardrail_version: Optional[str] = None,
    required: Optional[bool] = None
) -> Dict[str, Any]:
    """
    Evaluates text against Amazon Bedrock Guardrails using ApplyGuardrail API.
    Does NOT invoke an FM.

    Returns normalized result:
    {
      "available": bool,
      "blocked": bool,
      "prompt_attack_detected": bool,
      "sensitive_information_detected": bool,
      "assessments": list,
      "raw": dict,
      "reason": str (optional)
    }
    """
    gid = guardrail_id if guardrail_id is not None else os.environ.get("BEDROCK_GUARDRAIL_ID", BEDROCK_GUARDRAIL_ID)
    gver = guardrail_version if guardrail_version is not None else os.environ.get("BEDROCK_GUARDRAIL_VERSION", BEDROCK_GUARDRAIL_VERSION)
    is_required = required if required is not None else (
        os.environ.get("BEDROCK_REQUIRED", "false").lower() in ("true", "1", "yes")
    )

    # If no guardrail is configured
    if not gid:
        if is_required:
            logger.error("Bedrock Guardrail is configured as required, but BEDROCK_GUARDRAIL_ID is missing.")
            return {
                "available": False,
                "blocked": True,
                "prompt_attack_detected": False,
                "sensitive_information_detected": False,
                "assessments": [],
                "raw": {},
                "reason": "Bedrock Guardrail is required but not configured (missing ID)."
            }
        # Local development graceful bypass
        return {
            "available": False,
            "blocked": False,
            "prompt_attack_detected": False,
            "sensitive_information_detected": False,
            "assessments": [],
            "raw": {},
            "reason": "Bedrock Guardrail not configured."
        }

    client = get_bedrock_client()
    if not client:
        if is_required:
            logger.error("Bedrock client unavailable and BEDROCK_REQUIRED=True. Failing closed.")
            return {
                "available": False,
                "blocked": True,
                "prompt_attack_detected": False,
                "sensitive_information_detected": False,
                "assessments": [],
                "raw": {},
                "reason": "Bedrock client unavailable (fail-closed)."
            }
        return {
            "available": False,
            "blocked": False,
            "prompt_attack_detected": False,
            "sensitive_information_detected": False,
            "assessments": [],
            "raw": {},
            "reason": "Bedrock client initialization failed."
        }

    # Evaluate text content
    # If text is empty, nothing to evaluate
    cleaned_text = (text or "").strip()
    if not cleaned_text:
        return {
            "available": True,
            "blocked": False,
            "prompt_attack_detected": False,
            "sensitive_information_detected": False,
            "assessments": [],
            "raw": {}
        }

    # Bedrock ApplyGuardrail supports max 25,000 characters per content block
    truncated_text = cleaned_text[:24000]

    try:
        response = client.apply_guardrail(
            guardrailIdentifier=gid,
            guardrailVersion=str(gver),
            source="INPUT",
            content=[
                {
                    "text": {
                        "text": truncated_text
                    }
                }
            ]
        )

        action = response.get("action", "NONE")
        assessments = response.get("assessments", [])

        blocked = action == "GUARDRAIL_INTERVENED"
        prompt_attack_detected = False
        sensitive_information_detected = False

        for assessment in assessments:
            # Check content policy for prompt attacks
            content_policy = assessment.get("contentPolicy", {})
            for f in content_policy.get("filters", []):
                filter_type = str(f.get("type", "")).upper()
                filter_action = str(f.get("action", "")).upper()
                if "PROMPT_ATTACK" in filter_type and filter_action in ("BLOCKED", "ANONYMIZED", "GUARDRAIL_INTERVENED"):
                    prompt_attack_detected = True
                elif filter_action == "BLOCKED":
                    blocked = True

            # Check sensitive information policy
            sens_policy = assessment.get("sensitiveInformationPolicy", {})
            if sens_policy.get("piiEntities") or sens_policy.get("regexes"):
                sensitive_information_detected = True

            # Check topic policy
            topic_policy = assessment.get("topicPolicy", {})
            for topic in topic_policy.get("topics", []):
                if topic.get("action") == "BLOCKED":
                    blocked = True

            # Check word policy
            word_policy = assessment.get("wordPolicy", {})
            if word_policy.get("customWords") or word_policy.get("managedWordLists"):
                blocked = True

        if prompt_attack_detected or sensitive_information_detected:
            blocked = True

        return {
            "available": True,
            "blocked": blocked,
            "prompt_attack_detected": prompt_attack_detected,
            "sensitive_information_detected": sensitive_information_detected,
            "assessments": assessments,
            "raw": {
                "action": action,
                "usage": response.get("usage", {})
            }
        }

    except (BotoCoreError, ClientError) as e:
        logger.warning(f"Amazon Bedrock ApplyGuardrail call failed: {e}")
        if is_required:
            logger.error("Bedrock evaluation failed and BEDROCK_REQUIRED=True. Failing closed.")
            return {
                "available": False,
                "blocked": True,
                "prompt_attack_detected": False,
                "sensitive_information_detected": False,
                "assessments": [],
                "raw": {"error": str(e)},
                "reason": f"Amazon Bedrock Guardrails error (fail-closed): {str(e)}"
            }

        return {
            "available": False,
            "blocked": False,
            "prompt_attack_detected": False,
            "sensitive_information_detected": False,
            "assessments": [],
            "raw": {"error": str(e)},
            "reason": f"Amazon Bedrock Guardrails unavailable: {str(e)}"
        }
    except Exception as e:
        logger.warning(f"Unexpected error in Bedrock evaluation: {e}")
        if is_required:
            return {
                "available": False,
                "blocked": True,
                "prompt_attack_detected": False,
                "sensitive_information_detected": False,
                "assessments": [],
                "raw": {"error": str(e)},
                "reason": f"Unexpected Bedrock error (fail-closed): {str(e)}"
            }
        return {
            "available": False,
            "blocked": False,
            "prompt_attack_detected": False,
            "sensitive_information_detected": False,
            "assessments": [],
            "raw": {"error": str(e)},
            "reason": f"Unexpected error: {str(e)}"
        }
