/**
 * AgentGuard Backend API Client
 * Configured via NEXT_PUBLIC_API_URL (defaults to http://localhost:8000 for local development)
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'offline';
  service: string;
  version: string;
  bedrock: boolean;
  database?: string;
  authorization_engine?: string;
  risk_engine?: string;
  threat_detector?: string;
  audit?: string;
}

export interface SecurityDecision {
  decision: 'ALLOW' | 'APPROVE' | 'BLOCK';
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_score: number;
  policy_id: string;
  reason: string;
  factors: string[];
  authorization?: {
    cedar_allowed?: boolean;
    cedar_decision?: string;
  };
  security?: {
    prompt_injection?: {
      detected?: boolean;
      threat_type?: string;
      confidence?: number;
    };
    data_classification?: {
      sensitive?: boolean;
      classification?: string;
    };
    bedrock?: {
      available: boolean;
      blocked: boolean;
      prompt_attack_detected: boolean;
      sensitive_information_detected: boolean;
    };
  };
  bedrock?: {
    available: boolean;
    blocked: boolean;
    prompt_attack_detected: boolean;
    sensitive_information_detected: boolean;
  };
  status?: string;
  execution?: any;
}

export async function fetchHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_URL}/health`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      return {
        status: 'degraded',
        service: 'agentguard',
        version: '1.0.0',
        bedrock: false,
      };
    }
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      service: 'agentguard',
      version: '1.0.0',
      bedrock: false,
    };
  }
}

export async function fetchAuditLogs() {
  try {
    const res = await fetch(`${API_URL}/v1/audit`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.events || [];
  } catch {
    return [];
  }
}

export async function verifyAuditChainAPI() {
  try {
    const res = await fetch(`${API_URL}/audit/verify`, {
      cache: 'no-store',
    });
    if (!res.ok) return { valid: false, status: 'ERROR' };
    return await res.json();
  } catch {
    return { valid: false, status: 'OFFLINE' };
  }
}

export async function executeAgentAction(payload: {
  agent_id: string;
  user_id: string;
  tool: string;
  action: string;
  arguments?: Record<string, any>;
  context?: Record<string, any>;
}): Promise<SecurityDecision> {
  const res = await fetch(`${API_URL}/agent/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function authorizeAction(payload: {
  agent: { id: string; type?: string };
  principal: { id: string };
  action: { tool: string; operation: string; arguments?: Record<string, any> };
  context?: Record<string, any>;
}): Promise<any> {
  const res = await fetch(`${API_URL}/v1/authorize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}
