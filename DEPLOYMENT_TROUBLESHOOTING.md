# AgentGuard AWS Deployment Troubleshooting Guide

## Quick Fix for Current Issue

The error you encountered is a common AWS ECS issue where the ECS service-linked role doesn't exist. Here's how to fix it immediately:

### Option 1: Use the Quick Fix Script
```bash
./fix-ecs-deployment.sh
```

### Option 2: Manual Fix
```bash
# Create the ECS service-linked role
aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com

# Wait a moment for propagation
sleep 5

# Re-run your deployment
cd infra && ./deploy.sh
```

## Common Deployment Issues and Solutions

### 1. ECS Service-Linked Role Missing
**Error**: `Unable to assume the service linked role. Please verify that the ECS service linked role exists.`

**Solution**: 
```bash
aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com
```

### 2. Insufficient IAM Permissions
**Error**: Various permission denied errors

**Required AWS Permissions**:
- ECS (full access)
- IAM (service-linked role creation)
- EC2 (VPC, Security Groups, Subnets)
- ECR (repository management)
- EFS (file systems)
- CloudWatch (logs)
- Bedrock (guardrails)

### 3. Task Definition Registration Fails
**Common Causes**:
- Invalid task definition JSON
- Referenced IAM roles don't exist
- EFS file system ID not found

**Debug**:
```bash
# Validate task definition
aws ecs describe-task-definition --task-definition agentguard-backend:latest
```

### 4. Service Creation Fails
**Common Causes**:
- Subnets don't exist or are in wrong AZ
- Security groups don't exist
- Task definition invalid

**Debug**:
```bash
# Check service events
aws ecs describe-services --cluster agentguard-cluster --services agentguard-service --query "services[0].events[:5]"
```

### 5. Tasks Keep Stopping
**Common Causes**:
- Container fails to start
- Health check failures
- Resource constraints

**Debug**:
```bash
# Check task status
aws ecs describe-tasks --cluster agentguard-cluster --tasks TASK_ARN

# Check logs
aws logs tail /ecs/agentguard-backend --follow
```

## Deployment Scripts

### Main Deployment
```bash
cd infra
./deploy.sh
```

### Check Status
```bash
./check-deployment.sh
```

### Environment Variables
```bash
export AWS_REGION=ap-south-1
export CLUSTER_NAME=agentguard-cluster
export SERVICE_NAME=agentguard-service
export BEDROCK_REQUIRED=false
```

## Manual Cleanup (if needed)

### Delete Failed Service
```bash
aws ecs delete-service --cluster agentguard-cluster --service agentguard-service --force
```

### Delete Cluster
```bash
aws ecs delete-cluster --cluster agentguard-cluster
```

### Delete ECR Repository
```bash
aws ecr delete-repository --repository-name agentguard-backend --force
```

## Verification Steps

### 1. Check Service Status
```bash
aws ecs describe-services --cluster agentguard-cluster --services agentguard-service
```

### 2. Check Tasks
```bash
aws ecs list-tasks --cluster agentguard-cluster --service agentguard-service
```

### 3. Get Public IP
```bash
# Get task ARN
TASK_ARN=$(aws ecs list-tasks --cluster agentguard-cluster --service agentguard-service --query "taskArns[0]" --output text)

# Get ENI ID
ENI_ID=$(aws ecs describe-tasks --cluster agentguard-cluster --tasks $TASK_ARN --query "tasks[0].attachments[0].details[?name=='networkInterfaceId'].value" --output text)

# Get public IP
PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $ENI_ID --query "NetworkInterfaces[0].Association.PublicIp" --output text)

echo "Service URL: http://$PUBLIC_IP:8000"
```

### 4. Test Health Endpoint
```bash
curl http://$PUBLIC_IP:8000/health
```

## Best Practices

1. **Always check AWS credentials first**: `aws sts get-caller-identity`
2. **Use the check-deployment.sh script** to monitor status
3. **Check CloudWatch logs** for application errors
4. **Verify security group rules** allow port 8000 inbound
5. **Ensure EFS mount targets** exist in all subnets

## Support

If you continue to have issues:
1. Run `./check-deployment.sh` and share the output
2. Check CloudWatch logs: `aws logs tail /ecs/agentguard-backend --follow`
3. Verify IAM permissions for your AWS user/role
4. Ensure all AWS services are available in your region (ap-south-1)