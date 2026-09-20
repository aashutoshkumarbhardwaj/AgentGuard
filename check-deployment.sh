#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# AgentGuard Deployment Status Checker
# ==============================================================================

AWS_REGION="${AWS_REGION:-ap-south-1}"
CLUSTER_NAME="${CLUSTER_NAME:-agentguard-cluster}"
SERVICE_NAME="${SERVICE_NAME:-agentguard-service}"

echo "========================================================"
echo " AgentGuard Deployment Status Check"
echo "========================================================"

# Check AWS credentials
echo "1. AWS Identity:"
aws sts get-caller-identity --region "${AWS_REGION}"

echo ""
echo "2. ECS Service-Linked Role Status:"
aws iam get-role --role-name AWSServiceRoleForECS >/dev/null 2>&1 && echo "✓ ECS Service-Linked Role exists" || echo "✗ ECS Service-Linked Role missing"

echo ""
echo "3. Cluster Status:"
CLUSTER_STATUS="$(aws ecs describe-clusters --clusters "${CLUSTER_NAME}" --query "clusters[0].status" --output text --region "${AWS_REGION}" 2>/dev/null || echo "MISSING")"
echo "Cluster: ${CLUSTER_NAME} - Status: ${CLUSTER_STATUS}"

echo ""
echo "4. Service Status:"
SERVICE_INFO=$(aws ecs describe-services --cluster "${CLUSTER_NAME}" --services "${SERVICE_NAME}" --region "${AWS_REGION}" 2>/dev/null || echo "SERVICE_NOT_FOUND")

if [[ "${SERVICE_INFO}" != "SERVICE_NOT_FOUND" ]]; then
    SERVICE_STATUS=$(echo "${SERVICE_INFO}" | grep -o '"status": "[^"]*' | cut -d'"' -f4)
    RUNNING_COUNT=$(echo "${SERVICE_INFO}" | grep -o '"runningCount": [0-9]*' | cut -d':' -f2 | tr -d ' ')
    DESIRED_COUNT=$(echo "${SERVICE_INFO}" | grep -o '"desiredCount": [0-9]*' | cut -d':' -f2 | tr -d ' ')
    
    echo "Service: ${SERVICE_NAME}"
    echo "Status: ${SERVICE_STATUS}"
    echo "Running: ${RUNNING_COUNT}/${DESIRED_COUNT}"
    
    echo ""
    echo "5. Recent Service Events:"
    aws ecs describe-services --cluster "${CLUSTER_NAME}" --services "${SERVICE_NAME}" --query "services[0].events[:5].[createdAt,message]" --output table --region "${AWS_REGION}"
    
    echo ""
    echo "6. Task Status:"
    TASK_ARNS=$(aws ecs list-tasks --cluster "${CLUSTER_NAME}" --service-name "${SERVICE_NAME}" --query "taskArns" --output text --region "${AWS_REGION}" 2>/dev/null || echo "")
    
    if [ -n "${TASK_ARNS}" ] && [ "${TASK_ARNS}" != "None" ]; then
        echo "Tasks found:"
        for task_arn in ${TASK_ARNS}; do
            TASK_STATUS=$(aws ecs describe-tasks --cluster "${CLUSTER_NAME}" --tasks "${task_arn}" --query "tasks[0].lastStatus" --output text --region "${AWS_REGION}")
            HEALTH_STATUS=$(aws ecs describe-tasks --cluster "${CLUSTER_NAME}" --tasks "${task_arn}" --query "tasks[0].healthStatus" --output text --region "${AWS_REGION}" 2>/dev/null || echo "UNKNOWN")
            echo "  Task: $(basename ${task_arn}) - Status: ${TASK_STATUS} - Health: ${HEALTH_STATUS}"
        done
        
        # Get public IP if available
        echo ""
        echo "7. Service Endpoint:"
        TASK_ARN=$(echo ${TASK_ARNS} | cut -d' ' -f1)
        ENI_ID=$(aws ecs describe-tasks --cluster "${CLUSTER_NAME}" --tasks "${TASK_ARN}" --query "tasks[0].attachments[0].details[?name=='networkInterfaceId'].value" --output text --region "${AWS_REGION}" 2>/dev/null || echo "")
        
        if [ -n "${ENI_ID}" ] && [ "${ENI_ID}" != "None" ]; then
            PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids "${ENI_ID}" --query "NetworkInterfaces[0].Association.PublicIp" --output text --region "${AWS_REGION}" 2>/dev/null || echo "None")
            if [ -n "${PUBLIC_IP}" ] && [ "${PUBLIC_IP}" != "None" ]; then
                echo "Public IP: ${PUBLIC_IP}"
                echo "Service URL: http://${PUBLIC_IP}:8000"
                echo "Health endpoint: http://${PUBLIC_IP}:8000/health"
                
                echo ""
                echo "8. Health Check:"
                curl -s --connect-timeout 5 --max-time 10 "http://${PUBLIC_IP}:8000/health" && echo "" || echo "Health check failed or service not ready"
            else
                echo "No public IP assigned"
            fi
        fi
    else
        echo "No tasks found"
    fi
    
else
    echo "Service not found"
fi

echo ""
echo "9. Logs (last 20 lines):"
LOG_GROUP="/ecs/agentguard-backend"
aws logs tail "${LOG_GROUP}" --since 10m --region "${AWS_REGION}" 2>/dev/null | tail -20 || echo "No logs available or log group doesn't exist"

echo ""
echo "========================================================"