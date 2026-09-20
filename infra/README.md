# AgentGuard AWS Production Infrastructure

AgentGuard is deployed on AWS with a zero-trust runtime security architecture.

## Target Architecture

```
[ Next.js Frontend ]
        │
        │ HTTPS (CORS: AGENTGUARD_ALLOWED_ORIGINS)
        ▼
[ Application Load Balancer / Public IP ]
        │
        ▼
[ Amazon ECS Fargate ]
        │
        ├── AgentGuard FastAPI (/v1/authorize, /health, /audit)
        ├── Cedar Authorization Engine (Deterministic RBAC/ABAC)
        ├── Amazon Bedrock Guardrails (ML Prompt Attack & Sensitive PII Detection)
        ├── Rule & ML Threat Detection (Prompt Injection)
        ├── Context & Data Classification Engine
        ├── Risk Engine
        └── Audit Hash-Chain / JIT Approval System
                 │
                 ▼
          [ Amazon EFS ] (/data)
                 │
                 ▼
          agentguard.db (Persistent SQLite Database)
```

## Security & Least-Privilege IAM

The ECS Task Role is granted strictly least-privilege permissions:
- `bedrock:ApplyGuardrail`: To evaluate prompt injection and sensitive information before tool execution.
- `elasticfilesystem:ClientMount`, `elasticfilesystem:ClientWrite`: To mount persistent SQLite at `/data`.
- `logs:CreateLogStream`, `logs:PutLogEvents`: For CloudWatch logging at `/ecs/agentguard-backend`.
- **No `AdministratorAccess` is ever granted.**

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `AWS_REGION` | AWS Region | `ap-south-1` |
| `BEDROCK_GUARDRAIL_ID` | Amazon Bedrock Guardrail Identifier | *(Optional / Configurable)* |
| `BEDROCK_GUARDRAIL_VERSION` | Guardrail Version | `1` |
| `BEDROCK_REQUIRED` | Fail-closed enforcement if Bedrock is offline | `false` (Local dev), `true` (Strict Prod) |
| `AGENTGUARD_DB` | Persistent SQLite Database path | `/data/agentguard.db` |
| `AGENTGUARD_ALLOWED_ORIGINS` | Permitted Frontend Origins (CORS) | `https://agentguard.vercel.app` |

## Deployment Instructions

### 1. Prerequisites
- AWS CLI configured with active credentials (`aws sts get-caller-identity`).
- Docker daemon running locally.

### 2. Automated Turnkey Deployment
Run the automated deployment script:

```bash
cd infra
./deploy.sh
```

The script will:
1. Create the Amazon ECR repository and push the container image (`linux/amd64`).
2. Provision Amazon CloudWatch log groups.
3. Configure the IAM Task Execution Role and Task Role.
4. Provision Amazon EFS with mount targets in VPC subnets.
5. Create the Amazon Bedrock Guardrail with prompt attack & PII filters (or use existing).
6. Register the ECS task definition with the EFS volume mount at `/data`.
7. Launch the Amazon ECS Fargate service and verify `/health`.

### 3. Health & Status Verification

Check health:
```bash
curl -s http://<DEPLOYED_IP_OR_ALB>:8000/health
```

Expected Response:
```json
{
  "status": "healthy",
  "service": "agentguard",
  "version": "1.0.0",
  "bedrock": true,
  "database": "online",
  "authorization_engine": "online",
  "risk_engine": "online",
  "threat_detector": "online",
  "audit": "online"
}
```
