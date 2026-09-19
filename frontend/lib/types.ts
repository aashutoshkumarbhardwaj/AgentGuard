export type Decision = "ALLOW" | "APPROVE" | "BLOCK";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ThreatType =
  | "Prompt Injection"
  | "Data Exfiltration"
  | "Unauthorized Tool"
  | "Credential Access"
  | "Policy Violation"
  | "Unknown Agent";

export type AgentStatus = "ACTIVE" | "IDLE" | "SUSPENDED";

export interface Agent {
  id: string;
  name: string;
  description: string;
  framework: string;
  owner: string;
  status: AgentStatus;
  permissions: number;
  actions: number;
  blocked: number;
  tools: string[];
}

export interface Permission {
  tool: string;
  description: string;
  allowed: boolean;
  category: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  agentId: string;
  action: string;
  decision: Decision;
  riskScore: number;
  riskLevel: RiskLevel;
  policyId?: string;
  reason?: string;
  threatType?: ThreatType;
  threatDetails?: {
    ruleEngine: boolean;
    mlDetector: boolean;
    confidence: number;
    snippet?: string;
  };
  context?: {
    source?: string;
    destination?: string;
  };
  arguments?: string;
}

export interface Approval {
  id: string;
  agentId: string;
  action: string;
  riskScore: number;
  riskLevel: RiskLevel;
  reason: string;
  destination?: string;
  timestamp: string;
  status: "PENDING" | "APPROVED" | "DENIED";
}

export interface Threat {
  id: string;
  type: ThreatType;
  severity: RiskLevel;
  agentId: string;
  action: string;
  snippet: string;
  ruleEngine: boolean;
  mlDetector: boolean;
  confidence: number;
  timestamp: string;
  riskFactors: { label: string; delta: number }[];
  finalRisk: number;
  reasons: string[];
}

export interface Policy {
  id: string;
  name: string;
  action: string;
  effect: "PERMIT" | "DENY";
  status: "ACTIVE" | "INACTIVE";
  cedar: string;
  description: string;
}

export interface AuditEvent {
  id: string;
  sequence: number;
  timestamp: string;
  agentId: string;
  action: string;
  decision: Decision;
  previousHash: string;
  eventHash: string;
  policyId: string;
  integrity: "VALID" | "TAMPERED";
}

export interface RiskFactor {
  label: string;
  delta: number;
}
