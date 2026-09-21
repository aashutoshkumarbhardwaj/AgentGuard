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

export interface DecisionEngineTelemetry {
  decision: 'ALLOW' | 'APPROVE' | 'BLOCK';
  probabilities: Record<string, number>;
  confidence: number;
  provider: string;
  model?: string | null;
  latency_ms?: number | null;
  fallback_used: boolean;
  fallback_chain?: string[];
  hard_policy_enforced?: boolean;
  metadata?: Record<string, any>;
}

export interface PlaygroundToolResult {
  decision: 'ALLOW' | 'APPROVE' | 'BLOCK';
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  policy_id: string;
  reason: string;
  factors: string[];
  status: 'EXECUTED' | 'PENDING_APPROVAL' | 'BLOCKED' | 'ERROR';
  upstream_called: boolean;
  approval_id?: string | null;
  result?: any;
  server_id: string;
  tool_name: string;
  decision_engine?: DecisionEngineTelemetry | null;
  error?: string;
}

export async function executePlaygroundTool(
  serverId: string,
  toolName: string,
  args: Record<string, any>,
  agentId: string = 'research-agent'
): Promise<PlaygroundToolResult> {
  try {
    const res = await fetch(
      `${API_URL}/v1/mcp/servers/${encodeURIComponent(serverId)}/tools/${encodeURIComponent(toolName)}/call`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arguments: args,
          agent_id: agentId,
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return {
        decision: 'BLOCK',
        risk_score: 100,
        risk_level: 'CRITICAL',
        policy_id: 'GATEWAY_ERROR',
        reason: data.detail || 'Tool execution request failed',
        factors: ['Gateway communication error'],
        status: 'ERROR',
        upstream_called: false,
        server_id: serverId,
        tool_name: toolName,
        error: data.detail || 'Request failed',
      };
    }
    return data;
  } catch (err: any) {
    return {
      decision: 'BLOCK',
      risk_score: 100,
      risk_level: 'CRITICAL',
      policy_id: 'NETWORK_ERROR',
      reason: err.message || 'Network error connecting to AgentGuard gateway',
      factors: ['Network failure'],
      status: 'ERROR',
      upstream_called: false,
      server_id: serverId,
      tool_name: toolName,
      error: err.message || 'Network error',
    };
  }
}

export async function connectDemoMcp(): Promise<{ server?: McpServer; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/v1/mcp/servers/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.detail || 'Failed to connect Demo MCP' };
    }
    return { server: data.server };
  } catch (err: any) {
    return { error: err.message || 'Network error connecting to AgentGuard API' };
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

export interface DecisionStatusResponse {
  enabled: boolean;
  primary: {
    name: string;
    displayName: string;
    model: string;
    configured: boolean;
    maskedKey?: string | null;
    source?: string;
  };
  fallback: {
    name: string;
    displayName: string;
    model: string;
    configured: boolean;
    maskedKey?: string | null;
    endpoint: string;
    source?: string;
  };
  failsafe: {
    name: string;
    displayName: string;
    model: string;
    configured: boolean;
  };
  allow_threshold: number;
  block_threshold: number;
}

export async function fetchDecisionStatus(): Promise<DecisionStatusResponse | null> {
  try {
    const res = await fetch(`${API_URL}/v1/decision/status`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function updateDecisionKeys(payload: {
  typesafe_api_key?: string | null;
  openjev_api_key?: string | null;
  openjev_base_url?: string | null;
}): Promise<{ status: string; message: string; decision_status?: DecisionStatusResponse }> {
  const res = await fetch(`${API_URL}/v1/decision/keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function clearDecisionKey(
  provider: 'typesafe' | 'openjev'
): Promise<{ status: string; decision_status?: DecisionStatusResponse }> {
  const res = await fetch(`${API_URL}/v1/decision/keys/${provider}`, {
    method: 'DELETE',
  });
  return await res.json();
}

export async function evaluateDecisionTest(payload: {
  tool: string;
  action: string;
  risk_score: number;
  risk_level: string;
}): Promise<DecisionEngineTelemetry | null> {
  try {
    const res = await fetch(`${API_URL}/v1/decision/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}


