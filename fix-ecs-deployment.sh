#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Quick Fix for ECS Service-Linked Role Issue
# This script addresses the immediate deployment problem
# ==============================================================================

echo "========================================================"
echo " Quick Fix: ECS Service-Linked Role Issue"
echo "========================================================"

AWS_REGION="${AWS_REGION:-ap-south-1}"
CLUSTER_NAME="${CLUSTER_NAME:-agentguard-cluster}"
SERVICE_NAME="${SERVICE_NAME:-agentguard-service}"

# Step 1: Create ECS Service-Linked Role
echo "1. Creating ECS Service-Linked Role..."
aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com || {
    echo "Service-linked role may already exist or creation failed"
    echo "Checking if it exists..."
    
    # Check if the role exists
    ROLE_EXISTS=$(aws iam get-role --role-name AWSServiceRoleForECS 2>/dev/null || echo "MISSING")
    if [[ "${ROLE_EXISTS}" == "MISSING" ]]; then
        echo "ERROR: Failed to create or find ECS service-linked role"
        echo "You may need to:"
        echo "1. Ensure your AWS user has IAM permissions"
        echo "2. Contact your AWS administrator"
        exit 1
    else
        echo "✓ ECS Service-Linked Role exists"
    fi
}

# Step 2: Wait a moment for role propagation
echo "2. Waiting for role propagation..."
sleep 5

# Step 3: Check if cluster exists and is ready
echo "3. Checking cluster status..."
CLUSTER_STATUS="$(aws ecs describe-clusters --clusters "${CLUSTER_NAME}" --query "clusters[0].status" --output text --region "${AWS_REGION}" 2>/dev/null || echo "MISSING")"
echo "Cluster status: ${CLUSTER_STATUS}"

if [ "${CLUSTER_STATUS}" != "ACTIVE" ]; then
    echo "Creating/ensuring cluster is ready..."
    aws ecs create-cluster --cluster-name "${CLUSTER_NAME}" --region "${AWS_REGION}" || true
    sleep 3
fi

# Step 4: Clean up any failed services
echo "4. Checking for failed services..."
FAILED_SERVICES=$(aws ecs describe-services --cluster "${CLUSTER_NAME}" --services "${SERVICE_NAME}" --query "services[?status!='ACTIVE'].serviceName" --output text --region "${AWS_REGION}" 2>/dev/null || echo "")

if [ -n "${FAILED_SERVICES}" ] && [ "${FAILED_SERVICES}" != "None" ]; then
    echo "Found failed service, cleaning up..."
    aws ecs delete-service --cluster "${CLUSTER_NAME}" --service "${SERVICE_NAME}" --force --region "${AWS_REGION}" || true
    echo "Waiting for cleanup..."
    sleep 10
fi

echo "========================================================"
echo " Quick fix complete!"
echo " You can now re-run your deployment:"
echo " cd infra && ./deploy.sh"
echo "========================================================"