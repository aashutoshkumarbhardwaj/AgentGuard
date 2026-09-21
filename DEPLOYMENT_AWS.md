# AgentGuard Deployment Guide (Docker & AWS)

This guide covers running AgentGuard via Docker locally and deploying to AWS ECS Fargate & Amazon ECR.

---

## 1. Local & Production Docker Orchestration

Run both the AgentGuard Backend (API + MCP Gateway) and Frontend Dashboard with Docker Compose:

```bash
# Build and start all services in the background
docker compose up -d --build

# View logs
docker compose logs -f

# Check health
curl http://localhost:8000/health
```

### Services Started:
- **Backend API & Universal MCP Gateway**: `http://localhost:8000`
  - Health endpoint: `http://localhost:8000/health`
  - Streamable MCP Gateway: `http://localhost:8000/mcp`
  - Persistent SQLite DB volume: `agentguard_data` mounted at `/data`
- **Frontend Console & Landing Page**: `http://localhost:8787`
  - Production Next.js standalone container

---

## 2. Deploy to AWS via GitHub Actions (Recommended CI/CD)

The repository includes an automated workflow [`.github/workflows/deploy-aws.yml`](.github/workflows/deploy-aws.yml).

### Steps:
1. Go to your GitHub repository **Settings** → **Secrets and variables** → **Actions**.
2. Add the following repository secrets:
   - `AWS_ACCESS_KEY_ID`: Your AWS IAM User access key with ECR and ECS permissions.
   - `AWS_SECRET_ACCESS_KEY`: Your AWS IAM User secret access key.
   - `AWS_REGION`: (Optional, defaults to `ap-south-1` or `us-east-1`).
   - `ECR_REPOSITORY`: (Optional, defaults to `agentguard-backend`).
   - `ECS_CLUSTER`: (Optional, defaults to `agentguard-cluster`).
   - `ECS_SERVICE`: (Optional, defaults to `agentguard-service`).
3. Whenever you push to `main` or manually trigger **Deploy to AWS ECS** in the GitHub Actions tab:
   - Docker image is built and tagged with the commit SHA.
   - Image is pushed to Amazon ECR.
   - ECS Fargate task definition is updated and rolled out with zero downtime.

---

## 3. Deploy to AWS via Automated CLI Script (`infra/deploy.sh`)

If deploying directly from your terminal:

### Prerequisites:
1. Configure AWS CLI credentials:
   ```bash
   aws configure
   ```
2. Verify access:
   ```bash
   aws sts get-caller-identity
   ```

### Run Automated Deployment:
```bash
cd infra
chmod +x deploy.sh
./deploy.sh
```

The script automatically:
1. Provisions Amazon ECR repository `agentguard-backend` (if not present).
2. Builds and pushes the Docker container for `linux/amd64`.
3. Creates CloudWatch Log Group `/ecs/agentguard-backend`.
4. Configures IAM Task Execution and Task Roles.
5. Sets up Amazon EFS persistent storage for SQLite at `/data`.
6. Configures Amazon Bedrock Guardrail filters (prompt injection & PII).
7. Registers the ECS task definition and deploys the Fargate service.
8. Verifies container health at `http://<ALB-OR-PUBLIC-IP>:8000/health`.

---

## 4. Frontend Deployment on AWS / Vercel

### Option A: Vercel (Fastest for Next.js)
- Connect GitHub repository to Vercel.
- Set root directory to `frontend`.
- Set Environment Variable: `NEXT_PUBLIC_API_URL=https://<YOUR-AWS-BACKEND-DOMAIN>`.

### Option B: AWS ECS / AWS App Runner
- Build the frontend Dockerfile:
  ```bash
  docker build -t agentguard-frontend:latest ./frontend --build-arg NEXT_PUBLIC_API_URL=https://<YOUR-AWS-BACKEND-DOMAIN>
  ```
- Push to Amazon ECR and deploy to App Runner or ECS Fargate.
