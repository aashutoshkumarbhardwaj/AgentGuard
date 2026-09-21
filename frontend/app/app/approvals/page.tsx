'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Copy,
  Check,
  Loader2,
  ArrowRight,
  FlaskConical,
  Wrench,
} from 'lucide-react';
import { fetchApprovals, approveApproval, rejectApproval } from '@/lib/api';
import { cn } from '@/lib/utils';
import { CardSpotlight } from '@/components/ui/card-spotlight';

export default function LocalApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [executionResults, setExecutionResults] = useState<Record<string, any>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadApprovals = async () => {
    try {
      const list = await fetchApprovals();
      setApprovals((list || []).filter((item: any) => item.status === 'PENDING'));
    } catch (err) {
      console.error('Failed to load approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
    const timer = setInterval(loadApprovals, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(`approve-${id}`);
    try {
      const res = await approveApproval(id);
      if (res && res.executed) {
        setExecutionResults((prev) => ({ ...prev, [id]: res.result }));
      }
      await loadApprovals();
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeny = async (id: string) => {
    setActionLoading(`deny-${id}`);
    try {
      await rejectApproval(id);
      await loadApprovals();
    } catch (err) {
      console.error('Rejection failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-100 font-memorable select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Pending Approvals
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Human authorization queue for paused high-risk tool calls.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadApprovals}
              className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Refresh</span>
            </button>
            <Link
              href="/app/playground"
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <FlaskConical className="h-3.5 w-3.5" />
              <span>Playground</span>
            </Link>
          </div>
        </div>

        {/* Execution Results Alert Banner */}
        {Object.keys(executionResults).length > 0 && (
          <div className="space-y-3">
            {Object.entries(executionResults).map(([appId, res]) => (
              <div
                key={appId}
                className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-start justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-emerald-400">
                      Action Approved & Executed Upstream
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">ID: {appId.slice(0, 8)}...</span>
                  </div>
                  <pre className="font-mono text-emerald-300 bg-black/40 p-2.5 rounded-lg mt-1 whitespace-pre-wrap">
                    {typeof res === 'object' && res.result ? res.result : JSON.stringify(res, null, 2)}
                  </pre>
                </div>
                <button
                  onClick={() => {
                    setExecutionResults((prev) => {
                      const next = { ...prev };
                      delete next[appId];
                      return next;
                    });
                  }}
                  className="text-zinc-500 hover:text-white text-xs"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Approvals List */}
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            <p className="text-xs text-zinc-500">Checking pending authorizations...</p>
          </div>
        ) : approvals.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#0a0c10]/95 border border-dashed border-white/15 text-center flex flex-col items-center justify-center max-w-lg mx-auto space-y-3">
            <CheckCircle2 className="h-10 w-10 text-emerald-500/60" />
            <div>
              <h3 className="text-sm font-semibold text-white">No pending approvals.</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                AgentGuard is not waiting for human authorization.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => {
              const req = approval.request || {};
              const dec = approval.decision || {};
              const toolName = req.original_tool || `${req.tool}.${req.action}`;
              const isApproving = actionLoading === `approve-${approval.id}`;
              const isDenying = actionLoading === `deny-${approval.id}`;

              return (
                <div
                  key={approval.id}
                  className="rounded-2xl border border-white/[0.08] hover:border-white/[0.15] bg-[#0a0c10]/95 p-5 space-y-4 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                      <span className="text-sm font-semibold text-white font-mono">
                        {toolName}
                      </span>
                      {req.server_id && (
                        <span className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
                          server: {req.server_id}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => copyId(approval.id)}
                        className="text-[10.5px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
                      >
                        <span>ID: {approval.id.slice(0, 8)}...</span>
                        {copiedId === approval.id ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
                        Risk: {dec.risk_score || 70}/100 — {dec.risk_level || 'HIGH'}
                      </span>
                    </div>
                  </div>

                  {/* Interception Reason & Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block">
                        Reason For Interception
                      </span>
                      <p className="text-zinc-300 leading-relaxed">
                        {dec.reason || 'This state-modifying action requires explicit operator approval before execution.'}
                      </p>
                      {dec.policy_id && (
                        <p className="text-[11px] font-mono text-zinc-500">
                          Policy: {dec.policy_id}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block">
                        Payload Arguments
                      </span>
                      <pre className="font-mono text-[11px] text-zinc-300 bg-black/40 p-2.5 rounded-xl overflow-x-auto max-h-28 border border-white/[0.04]">
                        {JSON.stringify(req.arguments || {}, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Actions: Approve Once / Deny */}
                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => handleDeny(approval.id)}
                      disabled={isDenying || isApproving}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isDenying && <Loader2 className="h-3 w-3 animate-spin" />}
                      <span>DENY</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApprove(approval.id)}
                      disabled={isApproving || isDenying}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-black bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isApproving && <Loader2 className="h-3 w-3 animate-spin" />}
                      <span>APPROVE ONCE</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
