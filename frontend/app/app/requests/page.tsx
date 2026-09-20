'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Bot,
  Wrench,
  FileCode,
  Shield,
  X,
  ExternalLink,
} from 'lucide-react';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { fetchAuditLogs } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function RequestsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ALLOW' | 'APPROVE' | 'BLOCK'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const loadLogs = async () => {
    try {
      const data = await fetchAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed fetching requests logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const allowedCount = logs.filter((l) => l.decision === 'ALLOW').length;
  const approvedCount = logs.filter((l) => l.decision === 'APPROVE').length;
  const blockedCount = logs.filter((l) => l.decision === 'BLOCK').length;

  const filteredLogs = logs.filter((item) => {
    const matchesFilter = filter === 'ALL' || item.decision === filter;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (item.agent_id && item.agent_id.toLowerCase().includes(query)) ||
      (item.tool && item.tool.toLowerCase().includes(query)) ||
      (item.action && item.action.toLowerCase().includes(query)) ||
      (item.policy_id && item.policy_id.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative w-full space-y-8 pb-16 font-memorable select-none">
      {/* Header */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Runtime Requests // Interception Stream
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Tool Call Requests
          </h1>
          <p className="text-[13.5px] text-zinc-400 mt-1">
            Real-time ledger of evaluated agent tool actions, Cedar policy determinations, and execution statuses.
          </p>
        </div>

        <button
          onClick={() => loadLogs()}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs text-zinc-300 hover:text-white rounded-xl border border-white/[0.08] bg-white/[0.03] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Metrics Tally */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0c10]/95 flex flex-col justify-between">
          <span className="text-xs text-zinc-400 font-medium">TOTAL EVALUATED</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white tracking-tight">{logs.length}</span>
            <p className="text-[11px] text-zinc-500 mt-0.5">Intercepted tool invocations</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] flex flex-col justify-between">
          <span className="text-xs text-emerald-400 font-medium">ALLOWED</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-emerald-400 tracking-tight">{allowedCount}</span>
            <p className="text-[11px] text-emerald-500/70 mt-0.5">Executed automatically</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] flex flex-col justify-between">
          <span className="text-xs text-amber-400 font-medium">PENDING APPROVAL</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-amber-400 tracking-tight">{approvedCount}</span>
            <p className="text-[11px] text-amber-500/70 mt-0.5">Human review required</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/[0.04] flex flex-col justify-between">
          <span className="text-xs text-rose-400 font-medium">BLOCKED</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-rose-400 tracking-tight">{blockedCount}</span>
            <p className="text-[11px] text-rose-500/70 mt-0.5">Denied / quarantined</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-[#0a0c10]/90 border border-white/[0.08]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'ALLOW', 'APPROVE', 'BLOCK'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap',
                filter === mode
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              )}
            >
              {mode === 'ALL' ? `All Requests (${logs.length})` : mode}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by agent, tool, policy..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500/50"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0a0c10]/95 overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-zinc-500">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold text-zinc-300">No requests found</p>
            <p className="text-xs text-zinc-500 mt-1">
              {logs.length === 0
                ? 'No tool call requests have been submitted to AgentGuard yet.'
                : 'No requests matched your filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Agent</th>
                  <th className="py-3 px-4 font-semibold">Tool : Action</th>
                  <th className="py-3 px-4 font-semibold">Decision</th>
                  <th className="py-3 px-4 font-semibold">Risk Score</th>
                  <th className="py-3 px-4 font-semibold">Policy ID</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredLogs.map((req, idx) => {
                  const isAllow = req.decision === 'ALLOW';
                  const isBlock = req.decision === 'BLOCK';
                  const isApprove = req.decision === 'APPROVE';
                  const status = isAllow ? 'EXECUTED' : isApprove ? 'PENDING_APPROVAL' : 'BLOCKED';

                  return (
                    <tr
                      key={req.event_hash || idx}
                      onClick={() => setSelectedRequest(req)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                        {req.timestamp ? new Date(req.timestamp).toLocaleTimeString([], { hour12: false }) : '—'}
                      </td>
                      <td className="py-3 px-4 text-white font-medium whitespace-nowrap">
                        {req.agent_id}
                      </td>
                      <td className="py-3 px-4 text-zinc-300 font-semibold whitespace-nowrap">
                        <span className="text-sky-300">{req.tool}</span>
                        {req.action && <span className="text-zinc-500"> : {req.action}</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'inline-block px-2 py-0.5 rounded text-[11px] font-bold',
                            isAllow && 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
                            isBlock && 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
                            isApprove && 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          )}
                        >
                          {req.decision}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={cn(
                            'font-semibold',
                            (req.risk_score ?? 0) > 70
                              ? 'text-rose-400'
                              : (req.risk_score ?? 0) > 30
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          )}
                        >
                          {req.risk_score ?? 0}/100
                        </span>
                        <span className="text-[10px] text-zinc-500 ml-1">({req.risk_level || 'LOW'})</span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400 truncate max-w-[140px]">
                        {req.policy_id || 'DEFAULT_DENY'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-zinc-400 text-[11px]">{status}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-zinc-500 group-hover:text-white transition-colors text-xs">
                          Inspect →
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspector Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 p-4"
            >
              <div className="rounded-2xl border border-white/[0.12] bg-[#0a0c10] p-6 shadow-2xl max-h-[85vh] overflow-y-auto font-mono text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div>
                    <h3 className="text-base font-bold text-white">Request Inspection</h3>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      {selectedRequest.tool} : {selectedRequest.action}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Decision</span>
                      <span className="text-white font-bold text-sm mt-0.5 block">
                        {selectedRequest.decision}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Risk Level</span>
                      <span className="text-white font-bold text-sm mt-0.5 block">
                        {selectedRequest.risk_score}/100 ({selectedRequest.risk_level})
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Agent ID</span>
                      <span className="text-zinc-300 font-medium block mt-0.5 truncate">
                        {selectedRequest.agent_id}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Policy ID</span>
                      <span className="text-zinc-300 font-medium block mt-0.5 truncate">
                        {selectedRequest.policy_id}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-400 block mb-1 font-semibold text-[11px]">Evaluation Reason:</span>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-zinc-300">
                      {selectedRequest.reason || 'Standard policy evaluation.'}
                    </div>
                  </div>

                  {selectedRequest.factors && selectedRequest.factors.length > 0 && (
                    <div>
                      <span className="text-zinc-400 block mb-1 font-semibold text-[11px]">Risk Factors:</span>
                      <ul className="space-y-1 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-zinc-300 list-disc list-inside">
                        {selectedRequest.factors.map((f: string, i: number) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <span className="text-zinc-400 block mb-1 font-semibold text-[11px]">Cryptographic Event Hash:</span>
                    <div className="p-3 rounded-xl bg-[#06070a] border border-white/[0.06] text-zinc-400 text-[10.5px] break-all">
                      {selectedRequest.event_hash}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
