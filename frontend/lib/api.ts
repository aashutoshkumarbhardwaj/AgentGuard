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
  mcp_gateway?: string;
  mcp_upstream_servers?: number;
  mcp_tools_discovered?: number;
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

export interface McpServer {
  id: string;
  name: string;
  transport: 'stdio' | 'streamable-http' | string;
  connected: boolean;
  tools: number;
  command?: string;
  args?: string[];
  url?: string;
  env_keys?: string[];
}

export interface McpTool {
  name: string;
  original_name?: string;
  server: string;
  description: string;
  input_schema?: any;
}

export async function fetchMcpServers(): Promise<McpServer[]> {
  try {
    const res = await fetch(`${API_URL}/v1/mcp/servers`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.servers || [];
  } catch {
    return [];
  }
}

export async function addMcpServer(payload: {
  id: string;
  name?: string;
  transport: string;
  command?: string;
  args?: string[];
  url?: string;
  env?: Record<string, string>;
}): Promise<{ server?: McpServer; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/v1/mcp/servers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.detail || 'Failed to add MCP server' };
    }
    return { server: data.server };
  } catch (err: any) {
    return { error: err.message || 'Network error connecting to AgentGuard API' };
  }
}

export async function removeMcpServer(serverId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/v1/mcp/servers/${serverId}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function reconnectMcpServer(
  serverId: string
): Promise<{ server?: McpServer; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/v1/mcp/servers/${serverId}/reconnect`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.detail || 'Failed to reconnect MCP server' };
    }
    return { server: data.server };
  } catch (err: any) {
    return { error: err.message || 'Network error' };
  }
}

export async function fetchMcpTools(): Promise<McpTool[]> {
  try {
    const res = await fetch(`${API_URL}/v1/mcp/tools`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.tools || [];
  } catch {
    return [];
  }
}

export async function fetchServerTools(serverId: string): Promise<McpTool[]> {
  try {
    const res = await fetch(`${API_URL}/v1/mcp/servers/${serverId}/tools`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.tools || [];
  } catch {
    return [];
  }
}

export async function fetchApprovals(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/approvals`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.approvals || [];
  } catch {
    return [];
  }
}

export async function approveApproval(approvalId: string): Promise<any> {
  const res = await fetch(`${API_URL}/approvals/${approvalId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return await res.json();
}

export async function rejectApproval(approvalId: string): Promise<any> {
  const res = await fetch(`${API_URL}/approvals/${approvalId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return await res.json();
}

export interface AgentRecord {
  id: string;
  name: string;
  framework: string;
  owner: string;
  allowed_tools: string[];
}

export async function fetchAgents(): Promise<AgentRecord[]> {
  try {
    const res = await fetch(`${API_URL}/agents`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.agents || [];
  } catch {
    return [];
  }
}

export async function allowAgentPermission(agentId: string, action: string): Promise<any> {
  const res = await fetch(`${API_URL}/agents/${agentId}/permissions/allow?action=${encodeURIComponent(action)}`, {
    method: 'POST',
  });
  return await res.json();
}

export async function denyAgentPermission(agentId: string, action: string): Promise<any> {
  const res = await fetch(`${API_URL}/agents/${agentId}/permissions/deny?action=${encodeURIComponent(action)}`, {
    method: 'POST',
  });
  return await res.json();
}

export interface PolicyRecord {
  id: string;
  name: string;
  action: string;
  effect: 'PERMIT' | 'APPROVE' | 'DENY';
  status: string;
  decision: string;
  risk_level: string;
  risk_score: number;
  description: string;
  type?: string;
}

export async function fetchPolicies(): Promise<PolicyRecord[]> {
  try {
    const res = await fetch(`${API_URL}/policies`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.policies || [];
  } catch {
    return [];
  }
}

