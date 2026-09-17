# AgentGuard — The Control Layer for Autonomous AI Agents

AgentGuard sits between autonomous AI agents (e.g. Amazon Bedrock, Claude, LangChain) and the tools they execute (APIs, databases, email, filesystems, code execution). It enforces deterministic security policies, assesses risk, requests human approval for sensitive operations, blocks dangerous actions, and creates a tamper-evident audit trail.

> **Core Philosophy:** AI can decide what it wants to do. AgentGuard decides what it is allowed to do.

---

## 🚀 Quick Start (Run Locally in 2 Steps)

### Prerequisites
- Node.js 18+ installed on your system.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the interactive security console.

---

## 🛡️ Core Interactive Features in this Experience
1. **Live Interceptor Terminal:** Real-time auto-streaming tool calls evaluated in sub-15ms latency with risk gauges (0–100) and Cedar policy enforcement.
2. **Prompt Injection Defense Sandbox:** Click `[Simulate Prompt Injection Attack]` to watch a 6-stage attack lifecycle get stopped and hard-blocked in real-time.
3. **Interactive Policy Sandbox:** Live permission toggles (`ALLOW`, `APPROVE`, `BLOCK`) with immediate reactive tool probe simulation.
4. **Human-in-the-Loop Workflow:** Interactive approval modal with SLA countdown and supervisor sign-off.
5. **Cryptographic SHA-256 Audit Ledger:** Verifiable hash-chained event logs with client-side integrity validation button.
6. **Architecture & AWS Stack:** Visual runtime pipeline featuring Amazon Bedrock, Cedar Policy Language, Python FastAPI, AWS DynamoDB & S3.
