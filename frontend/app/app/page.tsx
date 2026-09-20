'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Bot,
  Activity,
  Network,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ArrowRight,
  Plus,
  RefreshCw,
  ExternalLink,
  Lock,
  Zap,
} from 'lucide-react';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import {
  fetchHealth,
  fetchMcpServers,
  fetchMcpTools,
  fetchApprovals,
  fetchAuditLogs,
  HealthResponse,
  McpServer,
  McpTool,
} from '@/lib/api';
import { cn } from '@/lib/utils';

export default function LocalConsoleOverview() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [servers, setServers] = useState<McpServer[]>([]);
  const [tools, setTools] = useState<McpTool[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const loadData = async () => {
    try {
      const [h, s, t, a, logs] = await Promise.all([
        fetchHealth(),
        fetchMcpServers(),
        fetchMcpTools(),
        fetchApprovals(),
        fetchAuditLogs(),
      ]);
      setHealth(h);
      setServers(s);
      setTools(t);
      setApprovals(a.filter((item) => item.status === 'PENDING'));
      setAuditLogs(logs);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed loading dashboard state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Compute real security counts from backend audit logs
  const allowCount = auditLogs.filter((e) => e.decision === 'ALLOW').length;
  const approveCount = auditLogs.filter((e) => e.decision === 'APPROVE').length;
  const blockCount = auditLogs.filter((e) => e.decision === 'BLOCK').length;
  const totalDecisions = auditLogs.length;

  const isOnline = health?.status === 'healthy' || health?.status === 'degraded';

  return (
    <div className="relative w-full space-y-8 pb-16 font-memorable select-none">
      {/* Header Banner */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={cn('h-2 w-2 rounded-full', isOnline ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse')} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              AgentGuard Security Console // Local Runtime
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Security Control Plane
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-zinc-300 font-mono font-normal">
              v{health?.version || '1.0.0'}
            </span>
          </h1>
          <p className="text-[13.5px] text-zinc-400 mt-1">
            Local gateway monitoring tool invocations, enforcing Cedar policies, and securing agent execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-white rounded-lg border border-white/[0.08] bg-white/[0.02] transition-colors cursor-pointer"
            title="Refresh state"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
            <span>Updated {lastRefreshed.toLocaleTimeString([], { hour12: false })}</span>
          </button>
          <Link href="/app/mcp">
            <HoverBorderGradient
              as="div"
              containerClassName="rounded-xl"
              className="bg-[#0e1118] text-white text-xs font-medium px-3.5 py-1.5 flex items-center gap-1.5"
              highlight="radial-gradient(75% 181% at 50% 50%, #38bdf8 0%, rgba(255, 255, 255, 0.4) 100%)"
            >
              <Plus className="w-3.5 h-3.5 text-sky-400" />
              <span>Add MCP Server</span>
            </HoverBorderGradient>
          </Link>
        </div>
      </div>

      {/* 1. Real-time Status Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Runtime Status */}
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0c10]/95 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>RUNTIME</span>
            <span className={cn('h-2 w-2 rounded-full', isOnline ? 'bg-emerald-400' : 'bg-rose-400')} />
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-white tracking-tight">
              {isOnline ? 'Online' : 'Offline'}
            </p>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
              Core Engine Active
            </p>
          </div>
        </div>

        {/* REST API Status */}
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0c10]/95 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>REST API</span>
            <span className="text-[10px] font-mono text-zinc-400">:8000</span>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-emerald-400 tracking-tight">
              {health?.status ? 'Online' : 'Checking...'}
            </p>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate">
              http://localhost:8000
            </p>
          </div>
        </div>

        {/* MCP Gateway */}
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0c10]/95 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>MCP GATEWAY</span>
            <span className="text-[10px] font-mono text-zinc-400">/mcp</span>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-sky-400 tracking-tight">
              {health?.mcp_gateway === 'online' ? 'Online' : 'Available'}
            </p>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate">
              http://localhost:8000/mcp
            </p>
          </div>
        </div>

        {/* Audit Verification */}
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0c10]/95 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>AUDIT CHAIN</span>
            <Lock className="h-3 w-3 text-emerald-400" />
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-emerald-400 tracking-tight">
              SHA-256
            </p>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
              Tamper-Proof Ledger
            </p>
          </div>
        </div>
      </div>

      {/* 2. Primary Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* MCP Servers & Tools */}
        <CardSpotlight className="p-6 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-sky-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  MCP Registry
                </span>
              </div>
              <Link href="/app/mcp" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium">
                <span>Manage</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white tracking-tight">{servers.length}</span>
              <span className="text-xs text-zinc-400">Connected Server{servers.length === 1 ? '' : 's'}</span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              <span className="text-white font-medium">{tools.length}</span> tool{tools.length === 1 ? '' : 's'} dynamically exposed across all registered MCP runtimes.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-zinc-500">Namespaced routing</span>
            <span className="text-emerald-400 font-mono font-medium">server:tool</span>
          </div>
        </CardSpotlight>

        {/* Pending Approvals */}
        <CardSpotlight className="p-6 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Pending Approvals
                </span>
              </div>
              <Link href="/app/approvals" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium">
                <span>Queue</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className={cn('text-3xl font-bold tracking-tight', approvals.length > 0 ? 'text-amber-400' : 'text-white')}>
                {approvals.length}
              </span>
              <span className="text-xs text-zinc-400">Action{approvals.length === 1 ? '' : 's'} waiting sign-off</span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              {approvals.length > 0
                ? 'High-risk tool invocations held pending human authorization.'
                : 'No pending approvals. AgentGuard is not waiting for human authorization.'}
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-zinc-500">Governance model</span>
            <span className="text-zinc-300 font-medium">Human-in-the-Loop</span>
          </div>
        </CardSpotlight>

        {/* Security Decisions Tally */}
        <CardSpotlight className="p-6 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Security Decisions
                </span>
              </div>
              <Link href="/app/requests" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium">
                <span>Requests</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span className="text-xs font-medium text-emerald-400 block">ALLOW</span>
                <span className="text-lg font-bold text-white">{allowCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <span className="text-xs font-medium text-amber-400 block">APPROVE</span>
                <span className="text-lg font-bold text-white">{approveCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                <span className="text-xs font-medium text-rose-400 block">BLOCK</span>
                <span className="text-lg font-bold text-white">{blockCount}</span>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-zinc-500">Evaluated requests</span>
            <span className="text-zinc-300 font-mono font-medium">{totalDecisions} total</span>
          </div>
        </CardSpotlight>
      </div>

      {/* 3. Connected Servers Summary or Empty State */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0a0c10]/95 p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <Network className="h-4 w-4 text-sky-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">Connected MCP Servers</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-zinc-400 font-mono">
              {servers.length}
            </span>
          </div>
          <Link href="/app/mcp" className="text-xs text-sky-400 hover:text-sky-300 font-medium">
            View All MCP Details →
          </Link>
        </div>

        {servers.length === 0 ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08] text-zinc-400 mb-3">
              <Network className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-white">No MCP servers connected</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              Add your first MCP server to start protecting tool calls.
            </p>
            <div className="mt-4">
              <Link href="/app/mcp">
                <HoverBorderGradient
                  as="div"
                  containerClassName="rounded-xl inline-block"
                  className="bg-[#0e1118] text-white text-xs font-medium px-4 py-2 flex items-center gap-2"
                  highlight="radial-gradient(75% 181% at 50% 50%, #38bdf8 0%, rgba(255, 255, 255, 0.4) 100%)"
                >
                  <Plus className="w-3.5 h-3.5 text-sky-400" />
                  <span>+ Add MCP Server</span>
                </HoverBorderGradient>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm tracking-tight">{s.name || s.id}</span>
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Connected
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-1">ID: {s.id}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>{s.transport}</span>
                  <span className="text-zinc-300 font-semibold">{s.tools} tools</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Recent Requests Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0a0c10]/95 p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">Recent Tool Call Requests</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-zinc-400 font-mono">
              {auditLogs.length} logged
            </span>
          </div>
          <Link href="/app/requests" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">
            Full Requests Ledger →
          </Link>
        </div>

        {auditLogs.length === 0 ? (
          <div className="py-8 text-center text-zinc-400">
            <Activity className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No tool requests recorded yet. When agents invoke tools via AgentGuard, real-time telemetry will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.06] text-zinc-500 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Time</th>
                  <th className="pb-3 font-semibold">Agent</th>
                  <th className="pb-3 font-semibold">Tool / Action</th>
                  <th className="pb-3 font-semibold">Decision</th>
                  <th className="pb-3 font-semibold">Risk Score</th>
                  <th className="pb-3 font-semibold">Policy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {auditLogs.slice(0, 7).map((log, idx) => {
                  const isAllow = log.decision === 'ALLOW';
                  const isBlock = log.decision === 'BLOCK';
                  const isApprove = log.decision === 'APPROVE';
                  return (
                    <tr key={log.event_hash || idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 text-zinc-400">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour12: false }) : '—'}
                      </td>
                      <td className="py-3 text-white font-medium">{log.agent_id}</td>
                      <td className="py-3 text-zinc-300 font-semibold">
                        {log.tool}{log.action ? ` : ${log.action}` : ''}
                      </td>
                      <td className="py-3">
                        <span
                          className={cn(
                            'inline-block px-2 py-0.5 rounded text-[10.5px] font-bold',
                            isAllow && 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
                            isBlock && 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
                            isApprove && 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          )}
                        >
                          {log.decision}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={cn(
                          'font-semibold',
                          (log.risk_score ?? 0) > 70 ? 'text-rose-400' : (log.risk_score ?? 0) > 30 ? 'text-amber-400' : 'text-emerald-400'
                        )}>
                          {log.risk_score ?? 0}/100
                        </span>
                      </td>
                      <td className="py-3 text-zinc-400 truncate max-w-[160px]">
                        {log.policy_id || 'DEFAULT_DENY'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
