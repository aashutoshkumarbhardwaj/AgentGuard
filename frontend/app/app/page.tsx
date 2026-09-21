'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Network,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
  Server,
  Wrench,
  FlaskConical,
  Activity,
  CheckCircle2,
  Lock,
} from 'lucide-react';
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
import { CardSpotlight } from '@/components/ui/card-spotlight';

export default function LocalConsoleOverview() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [servers, setServers] = useState<McpServer[]>([]);
  const [tools, setTools] = useState<McpTool[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const isRuntimeOnline = health?.status === 'healthy' || health?.status === 'degraded';
  const isGatewayOnline = true; // Served on /mcp sub-app

  // Requests Today
  const todayStr = new Date().toISOString().split('T')[0];
  const requestsToday = auditLogs.filter((log) => {
    if (!log.timestamp) return false;
    return log.timestamp.startsWith(todayStr);
  }).length;

  return (
    <div className="w-full space-y-8 pb-16 font-memorable select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={cn('h-2 w-2 rounded-full', isRuntimeOnline ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse')} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              AgentGuard Local Console
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            Overview
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time status of your local runtime security boundary and MCP gateway.
          </p>
        </div>

        {/* Primary and Secondary CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/app/mcp"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add MCP Server</span>
          </Link>
          <Link
            href="/app/playground"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 transition-all"
          >
            <FlaskConical className="h-3.5 w-3.5 text-emerald-400" />
            <span>Open Playground</span>
          </Link>
        </div>
      </div>

      {/* Useful Current State Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Runtime Status */}
        <div className="p-4 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block font-mono">
            AgentGuard
          </span>
          <div className="flex items-center gap-1.5 pt-1">
            <span className={cn('h-2 w-2 rounded-full', isRuntimeOnline ? 'bg-emerald-400' : 'bg-rose-400')} />
            <span className="text-xs font-semibold text-white">
              {isRuntimeOnline ? 'Runtime Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* 2. MCP Gateway Status */}
        <div className="p-4 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block font-mono">
            MCP Gateway
          </span>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-white">
              Online
            </span>
          </div>
        </div>

        {/* 3. MCP Servers Count */}
        <Link href="/app/mcp" className="p-4 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/20 transition-all space-y-1 block">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block font-mono">
            MCP Servers
          </span>
          <p className="text-xl font-bold font-mono text-white pt-0.5">
            {servers.length}
          </p>
        </Link>

        {/* 4. Discovered Tools Count */}
        <Link href="/app/mcp" className="p-4 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/20 transition-all space-y-1 block">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block font-mono">
            Tools
          </span>
          <p className="text-xl font-bold font-mono text-white pt-0.5">
            {tools.length}
          </p>
        </Link>

        {/* 5. Pending Approvals */}
        <Link href="/app/approvals" className="p-4 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/20 transition-all space-y-1 block">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block font-mono">
            Pending Approvals
          </span>
          <p className={cn(
            'text-xl font-bold font-mono pt-0.5',
            approvals.length > 0 ? 'text-amber-400' : 'text-zinc-400'
          )}>
            {approvals.length}
          </p>
        </Link>

        {/* 6. Requests Today */}
        <Link href="/app/audit" className="p-4 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/20 transition-all space-y-1 block">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block font-mono">
            Requests Today
          </span>
          <p className="text-xl font-bold font-mono text-white pt-0.5">
            {requestsToday}
          </p>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] overflow-hidden space-y-0">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white tracking-tight">Recent Activity</h2>
          </div>
          <Link
            href="/app/audit"
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View all in Audit</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {auditLogs.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Shield className="h-8 w-8 text-zinc-600 mb-1" />
            <p className="text-sm font-medium text-white">No activity yet.</p>
            <p className="text-xs text-zinc-400 max-w-sm">
              Connect an MCP server and run a tool from Playground.
            </p>
            <div className="flex items-center gap-3 pt-3">
              <Link
                href="/app/mcp"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition-all"
              >
                Add MCP Server
              </Link>
              <Link
                href="/app/playground"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 transition-all"
              >
                Open Playground
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {auditLogs.slice(0, 5).map((log, idx) => (
              <div
                key={log.id || idx}
                className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full shrink-0',
                      log.decision === 'ALLOW' && 'bg-emerald-400',
                      log.decision === 'APPROVE' && 'bg-amber-400',
                      log.decision === 'BLOCK' && 'bg-rose-400'
                    )}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-white truncate">
                        {log.tool}.{log.action}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold',
                          log.decision === 'ALLOW' && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                          log.decision === 'APPROVE' && 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
                          log.decision === 'BLOCK' && 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        )}
                      >
                        {log.decision}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-zinc-400 truncate mt-0.5">
                      {log.reason || 'Evaluated by security policy'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10.5px] font-mono text-zinc-500 block">
                    Risk: {log.risk_score || 0}/100
                  </span>
                  <span className="text-[10px] font-mono text-zinc-600 block mt-0.5">
                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
