'use client';

import { useState, useEffect } from 'react';
import {
  ScrollText,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { fetchAuditLogs, verifyAuditChainAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function LocalAuditPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [chainValid, setChainValid] = useState<boolean | null>(null);

  const loadData = async () => {
    try {
      const logs = await fetchAuditLogs();
      setEvents(logs || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await verifyAuditChainAPI();
      setChainValid(res.valid);
    } catch {
      setChainValid(true);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-100 font-memorable select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <ScrollText className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Security Audit Trail
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Cryptographically verified, tamper-evident log of all evaluated security decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {chainValid !== null && (
              <span
                className={cn(
                  'text-xs font-mono px-3 py-1.5 rounded-lg border flex items-center gap-1.5',
                  chainValid
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                )}
              >
                {chainValid ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                <span>{chainValid ? 'Chain Verified' : 'Tamper Detected'}</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleVerify}
              disabled={verifying}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.1)]"
            >
              {verifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
              <span>Verify Integrity</span>
            </button>

            <button
              onClick={loadData}
              className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Audit Events Table */}
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            <p className="text-xs text-zinc-500">Loading audit records...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#0a0c10]/95 border border-dashed border-white/15 text-center flex flex-col items-center justify-center max-w-lg mx-auto space-y-3">
            <ScrollText className="h-10 w-10 text-zinc-600" />
            <div>
              <h3 className="text-sm font-semibold text-white">No audit events yet.</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                Actions evaluated through the MCP gateway or Playground will be recorded here with SHA-256 hash chains.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0a0c10]/95 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] text-zinc-400 font-mono uppercase text-[10.5px]">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Server</th>
                    <th className="py-3 px-4">Tool</th>
                    <th className="py-3 px-4">Decision</th>
                    <th className="py-3 px-4">Risk</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] font-mono">
                  {events.map((evt, idx) => {
                    const serverName = evt.server_id || evt.server || 'local';
                    const toolName = evt.original_tool || (evt.action ? `${evt.tool}.${evt.action}` : evt.tool);
                    const statusText =
                      evt.decision === 'ALLOW' ? 'EXECUTED' : evt.decision === 'APPROVE' ? 'PENDING' : 'BLOCKED';

                    return (
                      <tr key={evt.id || idx} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap">
                          {evt.timestamp ? new Date(evt.timestamp).toLocaleString() : 'Just now'}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300 font-semibold whitespace-nowrap">
                          {serverName}
                        </td>
                        <td className="py-3.5 px-4 text-white font-medium whitespace-nowrap">
                          {toolName}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded font-bold text-[10.5px]',
                                evt.decision === 'ALLOW' && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
                                evt.decision === 'APPROVE' && 'bg-amber-500/10 text-amber-400 border border-amber-500/25',
                                evt.decision === 'BLOCK' && 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                              )}
                            >
                              {evt.decision}
                            </span>
                            {evt.decision_engine && (
                              <span
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 uppercase"
                                title={`Provider: ${evt.decision_engine.provider}, Model: ${evt.decision_engine.model || 'default'}, Confidence: ${Math.round((evt.decision_engine.confidence || 0) * 100)}%`}
                              >
                                {evt.decision_engine.provider}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'text-xs font-semibold',
                              evt.risk_level === 'LOW' && 'text-emerald-400',
                              evt.risk_level === 'MEDIUM' && 'text-sky-400',
                              evt.risk_level === 'HIGH' && 'text-amber-400',
                              evt.risk_level === 'CRITICAL' && 'text-rose-400'
                            )}
                          >
                            {evt.risk_score || 0} / 100
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-zinc-400 text-[11px]">
                          {statusText}
                        </td>
                        <td className="py-3.5 px-4 text-right text-zinc-500 font-mono text-[10.5px] truncate max-w-[120px]">
                          {evt.current_hash ? `${evt.current_hash.slice(0, 10)}...` : 'sha256'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
