#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# AgentGuard AWS Production Deployment Script
# Targets: ECS Fargate, ECR, EFS (Persistent SQLite), Bedrock Guardrails, CloudWatch
# ==============================================================================

echo "========================================================"
echo " Starting AgentGuard Production AWS Deployment"
echo "========================================================"

# Default configuration
AWS_REGION="${AWS_REGION:-ap-south-1}"
CLUSTER_NAME="${CLUSTER_NAME:-agentguard-cluster}"
SERVICE_NAME="${SERVICE_NAME:-agentguard-service}"
ECR_REPO_NAME="${ECR_REPO_NAME:-agentguard-backend}"
LOG_GROUP="/ecs/agentguard-backend"
EFS_NAME="agentguard-efs-data"
FRONTEND_ORIGIN="${AGENTGUARD_ALLOWED_ORIGINS:-https://agentguard.vercel.app,http://localhost:3000}"
BEDROCK_REQUIRED="${BEDROCK_REQUIRED:-false}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Verify AWS CLI
if ! command -v aws &> /dev/null; then
    echo "ERROR: AWS CLI is not installed. Please install it with 'brew install awscli' or your package manager."
    exit 1
fi

# Verify Docker
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker CLI is not installed or running."
    exit 1
fi

# Get AWS Account ID
echo "Checking AWS caller identity..."
AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query "Account" --output text)"
echo "AWS Account ID: ${AWS_ACCOUNT_ID}"
echo "AWS Region:     ${AWS_REGION}"

# 1. Setup CloudWatch Log Group
echo "--------------------------------------------------------"
echo "1. Ensuring CloudWatch Log Group exists..."
aws logs create-log-group --log-group-name "${LOG_GROUP}" --region "${AWS_REGION}" 2>/dev/null || true
aws logs put-retention-policy --log-group-name "${LOG_GROUP}" --retention-in-days 14 --region "${AWS_REGION}" || true
echo "✓ CloudWatch Log Group ready: ${LOG_GROUP}"

# 2. Setup IAM Roles
echo "--------------------------------------------------------"
echo "2. Ensuring IAM Roles are configured..."

# Execution Role
aws iam create-role \
    --role-name AgentGuardECSTaskExecutionRole \
    --assume-role-policy-document file://"${SCRIPT_DIR}/iam/task-execution-role-trust.json" 2>/dev/null || true

aws iam attach-role-policy \
    --role-name AgentGuardECSTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy || true

# Task Role (Least Privilege with Bedrock ApplyGuardrail + EFS + CloudWatch)
aws iam create-role \
    --role-name AgentGuardECSTaskRole \
    --assume-role-policy-document file://"${SCRIPT_DIR}/iam/task-execution-role-trust.json" 2>/dev/null || true

aws iam put-role-policy \
    --role-name AgentGuardECSTaskRole \
    --policy-name AgentGuardTaskPermissions \
    --policy-document file://"${SCRIPT_DIR}/iam/task-role-policy.json" || true

echo "✓ IAM Roles ready."

# 3. Setup ECR Repository & Push Image
echo "--------------------------------------------------------"
echo "3. Building & Pushing Container to Amazon ECR..."

aws ecr describe-repositories --repository-names "${ECR_REPO_NAME}" --region "${AWS_REGION}" 2>/dev/null || \
    aws ecr create-repository --repository-name "${ECR_REPO_NAME}" --region "${AWS_REGION}"

ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

echo "Logging in to ECR..."
aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${ECR_URI}"

IMAGE_TAG="latest"
echo "Building container for linux/amd64..."
docker build --platform linux/amd64 -t "${ECR_REPO_NAME}:${IMAGE_TAG}" "${ROOT_DIR}/backend"
docker tag "${ECR_REPO_NAME}:${IMAGE_TAG}" "${ECR_URI}:${IMAGE_TAG}"

echo "Pushing image to ${ECR_URI}:${IMAGE_TAG}..."
docker push "${ECR_URI}:${IMAGE_TAG}"
echo "✓ Container image pushed to ECR."

# 4. Setup EFS Persistent Storage for SQLite (/data/agentguard.db)
echo "--------------------------------------------------------"
echo "4. Configuring EFS Persistent File System for SQLite..."

VPC_ID="$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text --region "${AWS_REGION}")"
if [ "${VPC_ID}" == "None" ] || [ -z "${VPC_ID}" ]; then
    VPC_ID="$(aws ec2 describe-vpcs --query "Vpcs[0].VpcId" --output text --region "${AWS_REGION}")"
fi
echo "Using VPC: ${VPC_ID}"

SUBNET_IDS=($(aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VPC_ID}" --query "Subnets[*].SubnetId" --output text --region "${AWS_REGION}"))
echo "Found Subnets: ${SUBNET_IDS[*]}"

# Security Group for EFS & ECS
SG_ID="$(aws ec2 describe-security-groups --filters "Name=group-name,Values=agentguard-ecs-sg" "Name=vpc-id,Values=${VPC_ID}" --query "SecurityGroups[0].GroupId" --output text --region "${AWS_REGION}" 2>/dev/null || true)"
if [ "${SG_ID}" == "None" ] || [ -z "${SG_ID}" ]; then
    SG_ID="$(aws ec2 create-security-group --group-name agentguard-ecs-sg --description "Security group for AgentGuard ECS and EFS" --vpc-id "${VPC_ID}" --query "GroupId" --output text --region "${AWS_REGION}")"
    # Allow port 8000 inbound
    aws ec2 authorize-security-group-ingress --group-id "${SG_ID}" --protocol tcp --port 8000 --cidr 0.0.0.0/0 --region "${AWS_REGION}" || true
    # Allow port 2049 for NFS from self
    aws ec2 authorize-security-group-ingress --group-id "${SG_ID}" --protocol tcp --port 2049 --source-group "${SG_ID}" --region "${AWS_REGION}" || true
fi
echo "Security Group: ${SG_ID}"

# Check or Create EFS
EFS_FS_ID="$(aws efs describe-file-systems --query "FileSystems[?Name=='${EFS_NAME}'].FileSystemId" --output text --region "${AWS_REGION}" 2>/dev/null || true)"
if [ -z "${EFS_FS_ID}" ] || [ "${EFS_FS_ID}" == "None" ]; then
    echo "Creating EFS file system ${EFS_NAME}..."
    EFS_FS_ID="$(aws efs create-file-system --creation-token "agentguard-fs-$(date +%s)" --tags Key=Name,Value="${EFS_NAME}" --performance-mode generalPurpose --throughput-mode bursting --encrypted --query "FileSystemId" --output text --region "${AWS_REGION}")"
    sleep 5
fi
echo "EFS File System ID: ${EFS_FS_ID}"

# Create Mount Targets for each subnet
for subnet in "${SUBNET_IDS[@]}"; do
    EXISTING_MT="$(aws efs describe-mount-targets --file-system-id "${EFS_FS_ID}" --query "MountTargets[?SubnetId=='${subnet}'].MountTargetId" --output text --region "${AWS_REGION}" 2>/dev/null || true)"
    if [ -z "${EXISTING_MT}" ] || [ "${EXISTING_MT}" == "None" ]; then
        echo "Creating mount target in subnet ${subnet}..."
        aws efs create-mount-target --file-system-id "${EFS_FS_ID}" --subnet-id "${subnet}" --security-groups "${SG_ID}" --region "${AWS_REGION}" 2>/dev/null || true
    fi
done
echo "✓ EFS storage ready."

# 5. Amazon Bedrock Guardrail Setup
echo "--------------------------------------------------------"
echo "5. Checking Amazon Bedrock Guardrail configuration..."
BEDROCK_GUARDRAIL_ID="${BEDROCK_GUARDRAIL_ID:-}"
BEDROCK_GUARDRAIL_VERSION="${BEDROCK_GUARDRAIL_VERSION:-1}"

if [ -z "${BEDROCK_GUARDRAIL_ID}" ]; then
    echo "Checking for existing Bedrock guardrail named 'agentguard-security-guardrail'..."
    EXISTING_GR="$(aws bedrock list-guardrails --query "guardrails[?name=='agentguard-security-guardrail'].id" --output text --region "${AWS_REGION}" 2>/dev/null || true)"
    if [ -n "${EXISTING_GR}" ] && [ "${EXISTING_GR}" != "None" ]; then
        BEDROCK_GUARDRAIL_ID="${EXISTING_GR}"
        echo "Found existing Bedrock Guardrail ID: ${BEDROCK_GUARDRAIL_ID}"
    else
        echo "Creating new Amazon Bedrock Guardrail in ${AWS_REGION}..."
        CREATE_RESP="$(aws bedrock create-guardrail \
            --name "agentguard-security-guardrail" \
            --description "AgentGuard runtime guardrail for prompt injection and sensitive data" \
            --content-policy-config "filtersConfig=[{type=PROMPT_ATTACK,inputStrength=HIGH,outputStrength=NONE}]" \
            --sensitive-information-policy-config "piiEntitiesConfig=[{type=EMAIL,action=BLOCK},{type=PHONE,action=BLOCK},{type=NAME,action=BLOCK},{type=CREDIT_DEBIT_CARD_NUMBER,action=BLOCK}],regexesConfig=[]" \
            --blocked-input-messaging "Blocked by Amazon Bedrock Guardrail" \
            --blocked-outputs-messaging "Blocked by Amazon Bedrock Guardrail" \
            --region "${AWS_REGION}" 2>/dev/null || true)"
        
        if [ -n "${CREATE_RESP}" ]; then
            BEDROCK_GUARDRAIL_ID="$(echo "${CREATE_RESP}" | grep -o '"guardrailId": "[^"]*' | cut -d'"' -f4 || true)"
            echo "Created Guardrail ID: ${BEDROCK_GUARDRAIL_ID}"
            # Create Version
            if [ -n "${BEDROCK_GUARDRAIL_ID}" ]; then
                aws bedrock create-guardrail-version --guardrail-identifier "${BEDROCK_GUARDRAIL_ID}" --description "v1" --region "${AWS_REGION}" || true
                BEDROCK_GUARDRAIL_VERSION="1"
            fi
        else
            echo "NOTE: Bedrock guardrail creation skipped or unsupported in this region/account. Running with fallback."
            BEDROCK_GUARDRAIL_ID=""
        fi
    fi
fi
echo "Bedrock Guardrail ID:      ${BEDROCK_GUARDRAIL_ID:-[None - Fallback Mode]}"
echo "Bedrock Guardrail Version: ${BEDROCK_GUARDRAIL_VERSION}"

# 6. Register Task Definition
echo "--------------------------------------------------------"
echo "6. Registering ECS Task Definition..."
TASK_DEF_TMP="/tmp/agentguard-task-def-$$.json"
sed \
    -e "s/\${AWS_ACCOUNT_ID}/${AWS_ACCOUNT_ID}/g" \
    -e "s/\${AWS_REGION}/${AWS_REGION}/g" \
    -e "s/\${BEDROCK_GUARDRAIL_ID}/${BEDROCK_GUARDRAIL_ID}/g" \
    -e "s/\${BEDROCK_GUARDRAIL_VERSION}/${BEDROCK_GUARDRAIL_VERSION}/g" \
    -e "s/\${BEDROCK_REQUIRED}/${BEDROCK_REQUIRED}/g" \
    -e "s/\${EFS_FILE_SYSTEM_ID}/${EFS_FS_ID}/g" \
    -e "s#\${AGENTGUARD_ALLOWED_ORIGINS}#${FRONTEND_ORIGIN}#g" \
    "${SCRIPT_DIR}/ecs/task-definition.template.json" > "${TASK_DEF_TMP}"

TASK_DEF_ARN="$(aws ecs register-task-definition --cli-input-json "file://${TASK_DEF_TMP}" --query "taskDefinition.taskDefinitionArn" --output text --region "${AWS_REGION}")"
rm -f "${TASK_DEF_TMP}"
echo "✓ Registered Task Definition: ${TASK_DEF_ARN}"

# 7. Create Cluster and Service
echo "--------------------------------------------------------"
echo "7. Deploying ECS Fargate Service..."
aws ecs create-cluster --cluster-name "${CLUSTER_NAME}" --region "${AWS_REGION}" 2>/dev/null || true

SUBNET_CSV=$(IFS=, ; echo "${SUBNET_IDS[*]}")
EXISTING_SERVICE="$(aws ecs describe-services --cluster "${CLUSTER_NAME}" --services "${SERVICE_NAME}" --query "services[?status=='ACTIVE'].serviceName" --output text --region "${AWS_REGION}" 2>/dev/null || true)"

if [ -z "${EXISTING_SERVICE}" ] || [ "${EXISTING_SERVICE}" == "None" ]; then
    echo "Creating new ECS Fargate service ${SERVICE_NAME}..."
    aws ecs create-service \
        --cluster "${CLUSTER_NAME}" \
        --service-name "${SERVICE_NAME}" \
        --task-definition "${TASK_DEF_ARN}" \
        --desired-count 1 \
        --launch-type FARGATE \
        --network-configuration "awsvpcConfiguration={subnets=[${SUBNET_CSV}],securityGroups=[${SG_ID}],assignPublicIp=ENABLED}" \
        --region "${AWS_REGION}"
else
    echo "Updating existing ECS service ${SERVICE_NAME}..."
    aws ecs update-service \
        --cluster "${CLUSTER_NAME}" \
        --service "${SERVICE_NAME}" \
        --task-definition "${TASK_DEF_ARN}" \
        --force-new-deployment \
        --region "${AWS_REGION}"
fi

echo "Waiting for service to stabilize..."
aws ecs wait services-stable --cluster "${CLUSTER_NAME}" --services "${SERVICE_NAME}" --region "${AWS_REGION}" || true

# 8. Discover Task Public IP and Health Check
echo "--------------------------------------------------------"
echo "8. Verifying Deployment & Health..."
TASK_ARN="$(aws ecs list-tasks --cluster "${CLUSTER_NAME}" --service-name "${SERVICE_NAME}" --desired-status RUNNING --query "taskArns[0]" --output text --region "${AWS_REGION}" 2>/dev/null || true)"

if [ -n "${TASK_ARN}" ] && [ "${TASK_ARN}" != "None" ]; then
    ENI_ID="$(aws ecs describe-tasks --cluster "${CLUSTER_NAME}" --tasks "${TASK_ARN}" --query "tasks[0].attachments[0].details[?name=='networkInterfaceId'].value" --output text --region "${AWS_REGION}")"
    PUBLIC_IP="$(aws ec2 describe-network-interfaces --network-interface-ids "${ENI_ID}" --query "NetworkInterfaces[0].Association.PublicIp" --output text --region "${AWS_REGION}" 2>/dev/null || true)"
    
    if [ -n "${PUBLIC_IP}" ] && [ "${PUBLIC_IP}" != "None" ]; then
        SERVICE_URL="http://${PUBLIC_IP}:8000"
        echo "Service is live at: ${SERVICE_URL}"
        echo "Checking GET ${SERVICE_URL}/health..."
        sleep 5
        curl -s "${SERVICE_URL}/health" || echo "Health check returned no direct response (check security group or wait 30s)."
    fi
fi

echo "========================================================"
echo " AgentGuard AWS Deployment Complete!"
echo " Cluster:       ${CLUSTER_NAME}"
echo " Service:       ${SERVICE_NAME}"
echo " ECR Image:     ${ECR_URI}:${IMAGE_TAG}"
echo " EFS Volume:    ${EFS_FS_ID} -> /data/agentguard.db"
echo " Bedrock ID:    ${BEDROCK_GUARDRAIL_ID:-Fallback}"
echo "========================================================"
