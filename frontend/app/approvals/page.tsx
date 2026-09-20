'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Check,
  X,
  Eye,
  Clock,
  CheckCircle2,
  FileCode,
  Radio,
  Sliders,
  ShieldCheck,
  Sparkles,
  Bot,
  Mail,
  FileEdit,
  Database,
  Search,
  RotateCcw,
  Copy,
  Terminal,
  AlertCircle,
} from 'lucide-react';
import { pendingApprovals as initialApprovals } from '@/lib/mock-data';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import type { Approval } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeAction, setRemoveAction] = useState<'approve' | 'deny' | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [auditLog, setAuditLog] = useState<Array<{ id: string; action: string; agent: string; decision: 'APPROVED' | 'DENIED'; timestamp: string; hash: string }>>([
    {
      id: 'ap-000',
      action: 'database.query',
      agent: 'analytics-agent',
      decision: 'APPROVED',
      timestamp: '12:20:04',
      hash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
  ]);

  const handleApprove = (id: string) => {
    const item = approvals.find((a) => a.id === id);
    setRemoveAction('approve');
    setRemovingId(id);
    setTimeout(() => {
      if (item) {
        setAuditLog((prev) => [
          {
            id: item.id,
            action: item.action,
            agent: item.agentId,
            decision: 'APPROVED',
            timestamp: new Date().toLocaleTimeString([], { hour12: false }),
            hash: `sha256-${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
          },
          ...prev.slice(0, 4),
        ]);
      }
      setApprovals((prev) => prev.filter((a) => a.id !== id));
      setRemovingId(null);
      setRemoveAction(null);
    }, 400);
  };

  const handleDeny = (id: string) => {
    const item = approvals.find((a) => a.id === id);
    setRemoveAction('deny');
    setRemovingId(id);
    setTimeout(() => {
      if (item) {
        setAuditLog((prev) => [
          {
            id: item.id,
            action: item.action,
            agent: item.agentId,
            decision: 'DENIED',
            timestamp: new Date().toLocaleTimeString([], { hour12: false }),
            hash: `sha256-${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
          },
          ...prev.slice(0, 4),
        ]);
      }
      setApprovals((prev) => prev.filter((a) => a.id !== id));
      setRemovingId(null);
      setRemoveAction(null);
    }, 400);
  };

  const handleResetQueue = () => {
    setApprovals(initialApprovals);
    setRemovingId(null);
    setRemoveAction(null);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const pending = approvals.filter((a) => a.status === 'PENDING');
  const highRiskCount = pending.filter((a) => a.riskLevel === 'HIGH' || a.riskScore >= 70).length;
  const mediumRiskCount = pending.filter((a) => a.riskLevel === 'MEDIUM' || (a.riskScore >= 40 && a.riskScore < 70)).length;

  const filteredApprovals = pending.filter((item) => {
    const matchesRisk =
      riskFilter === 'ALL'
        ? true
        : riskFilter === 'HIGH'
        ? item.riskScore >= 70 || item.riskLevel === 'HIGH'
        : item.riskScore < 70;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : item.agentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.destination && item.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.reason && item.reason.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRisk && matchesSearch;
  });

  const getActionIcon = (action: string) => {
    if (action.includes('email')) return <Mail className="h-4 w-4 text-zinc-300" />;
    if (action.includes('file')) return <FileEdit className="h-4 w-4 text-zinc-300" />;
    if (action.includes('data') || action.includes('export')) return <Database className="h-4 w-4 text-zinc-300" />;
    return <Terminal className="h-4 w-4 text-zinc-300" />;
  };

  return (
    <div className="relative w-full space-y-8 pb-20 font-memorable select-none">
      {/* Subtle Ambient Radial Lighting */}
      <div className="pointer-events-none absolute -top-20 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-slate-900/30 blur-[160px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-blue-950/15 blur-[150px]" />

      <div className="relative z-10 space-y-8">
        {/* Header - Minimalist, Executive Typography */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
              Governance Control Plane
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <div>
              <h1 className="text-3xl sm:text-[34px] font-semibold tracking-tight text-white">
                Approval Center
              </h1>
              <p className="text-[14px] text-zinc-400 mt-1 font-normal">
                {pending.length} agent {pending.length === 1 ? 'action requires' : 'actions require'} sign-off before runtime execution.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-zinc-400 font-medium bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-full backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>Protected Gateway Online</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Row 1: Top Metric Cards (Clean, Symmetrical, Luxury Glass)               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'PENDING REVIEW',
              value: pending.length.toString(),
              sub: 'Actions awaiting sign-off',
              color: 'text-white',
              icon: Clock,
            },
            {
              label: 'CRITICAL ESCALATIONS',
              value: highRiskCount.toString(),
              sub: 'Risk evaluation ≥ 70/100',
              color: highRiskCount > 0 ? 'text-rose-400/90' : 'text-zinc-400',
              icon: AlertCircle,
            },
            {
              label: 'APPROVAL SLA',
              value: '< 5 min',
              sub: 'Automated escalate policy',
              color: 'text-zinc-200',
              icon: Radio,
            },
            {
              label: 'SIGNATURE STATUS',
              value: 'SHA-256',
              sub: 'Cryptographic authorization',
              color: 'text-white',
              icon: CheckCircle2,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <CardSpotlight
                key={stat.label}
                className="p-5 flex flex-col justify-between min-h-[116px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-medium tracking-wider text-zinc-400">
                    {stat.label}
                  </span>
                  <Icon className="h-3.5 w-3.5 text-zinc-500" />
                </div>
                <div className="mt-2.5">
                  <p className={`text-2xl font-semibold tracking-tight ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-[11.5px] text-zinc-500 font-normal mt-0.5 truncate">
                    {stat.sub}
                  </p>
                </div>
              </CardSpotlight>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* Filter & Control Strip (Segmented Controls with Matching Hover Borders)   */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-[#0a0c10]/90 border border-white/[0.08] backdrop-blur-xl">
          {/* Segmented Risk Filter */}
          <div className="flex items-center gap-1.5">
            <HoverBorderGradient
              as="button"
              containerClassName="rounded-xl"
              className={cn(
                'px-3.5 py-1.5 text-[12px] font-medium transition-all',
                riskFilter === 'ALL'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'bg-transparent text-zinc-400 hover:text-white'
              )}
              highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
              onClick={() => setRiskFilter('ALL')}
            >
              All Requests ({pending.length})
            </HoverBorderGradient>

            <HoverBorderGradient
              as="button"
              containerClassName="rounded-xl"
              className={cn(
                'px-3.5 py-1.5 text-[12px] font-medium transition-all',
                riskFilter === 'HIGH'
                  ? 'bg-rose-500/15 text-rose-300'
                  : 'bg-transparent text-zinc-400 hover:text-rose-300'
              )}
              highlight="radial-gradient(75% 181% at 50% 50%, #f43f5e 0%, rgba(255, 255, 255, 0.4) 100%)"
              onClick={() => setRiskFilter('HIGH')}
            >
              High Risk ({highRiskCount})
            </HoverBorderGradient>

            <HoverBorderGradient
              as="button"
              containerClassName="rounded-xl"
              className={cn(
                'px-3.5 py-1.5 text-[12px] font-medium transition-all',
                riskFilter === 'MEDIUM'
                  ? 'bg-white/10 text-zinc-200'
                  : 'bg-transparent text-zinc-400 hover:text-zinc-200'
              )}
              highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.3) 100%)"
              onClick={() => setRiskFilter('MEDIUM')}
            >
              Medium Risk ({mediumRiskCount})
            </HoverBorderGradient>
          </div>

          {/* Search & Reset Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agent, action, target..."
                className="w-full pl-9 pr-7 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-[12px] text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {approvals.length < initialApprovals.length && (
              <HoverBorderGradient
                as="button"
                containerClassName="rounded-xl"
                className="bg-[#0e1118] text-zinc-300 hover:text-white text-[11.5px] font-medium px-3.5 py-1.5 flex items-center gap-1.5"
                highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
                onClick={handleResetQueue}
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Queue</span>
              </HoverBorderGradient>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Row 2: Top-Company Bento Grid of Approval Cards                          */}
        {/* ========================================================================= */}
        {pending.length === 0 ? (
          <CardSpotlight className="py-24 text-center flex flex-col items-center justify-center rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.1] text-zinc-300">
              <Check className="h-6 w-6 text-white" strokeWidth={2.2} />
            </div>
            <h3 className="text-xl font-semibold text-white tracking-tight mt-5">Queue Clear</h3>
            <p className="text-[13.5px] text-zinc-400 mt-1 max-w-sm font-normal">
              Zero actions pending sign-off. All agent runtime invocations have been evaluated and executed.
            </p>
            <HoverBorderGradient
              as="button"
              containerClassName="rounded-xl mt-6"
              className="bg-[#0e1118] text-zinc-200 hover:text-white text-xs font-medium px-4 py-2 flex items-center gap-2"
              highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.5) 100%)"
              onClick={handleResetQueue}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restore Demo Queue</span>
            </HoverBorderGradient>
          </CardSpotlight>
        ) : filteredApprovals.length === 0 ? (
          <CardSpotlight className="py-16 text-center rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08]">
            <p className="text-zinc-400 text-sm font-normal">No pending actions match your current filter.</p>
            <button
              onClick={() => {
                setRiskFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-3 text-zinc-300 hover:text-white underline text-xs cursor-pointer"
            >
              Clear filters
            </button>
          </CardSpotlight>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredApprovals.map((approval) => {
                const isRemoving = removingId === approval.id;
                const isHighRisk = approval.riskScore >= 70;

                return (
                  <motion.div
                    key={approval.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="relative"
                  >
                    <CardSpotlight
                      className={cn(
                        'p-6 relative flex flex-col justify-between min-h-[320px] rounded-2xl transition-all duration-300 bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18]',
                        isRemoving && removeAction === 'approve' && 'border-emerald-500/40 bg-emerald-950/20',
                        isRemoving && removeAction === 'deny' && 'border-rose-500/40 bg-rose-950/20'
                      )}
                    >
                      {/* Subtle Top Inner Highlight Edge */}
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                      {/* Card Header: Review Status, Agent Chip, Timestamp */}
                      <div>
                        <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                              Review Required
                            </span>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.025] border border-white/[0.06] text-[11px] text-zinc-400 font-medium">
                              <Bot className="h-3 w-3 text-zinc-500" />
                              <span className="truncate max-w-[120px]">{approval.agentId}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11.5px] text-zinc-500 shrink-0 font-mono">
                            <Clock className="h-3 w-3 text-zinc-500" />
                            <span>{approval.timestamp}</span>
                          </div>
                        </div>

                        {/* Card Body: Action & Destination */}
                        <div className="mt-4 space-y-3.5">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            <div>
                              <span className="text-[10px] uppercase font-medium tracking-wider text-zinc-500 block">
                                Requested Action
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08]">
                                  {getActionIcon(approval.action)}
                                </div>
                                <span className="text-[17px] font-semibold text-white tracking-tight">
                                  {approval.action}
                                </span>
                              </div>
                            </div>

                            {approval.destination && (
                              <div className="sm:text-right">
                                <span className="text-[10px] uppercase font-medium tracking-wider text-zinc-500 block">
                                  Destination Target
                                </span>
                                <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[12px] text-zinc-300 font-mono">
                                  <span className="truncate max-w-[170px] sm:max-w-[210px]">{approval.destination}</span>
                                  <button
                                    onClick={() => handleCopy(approval.destination!, approval.id)}
                                    title="Copy destination"
                                    className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Reason / Trigger Callout (Refined Dark Glass, No Harsh Yellow) */}
                          {approval.reason && (
                            <div className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.025] border border-white/[0.06] px-3.5 py-2.5 text-[12px] text-zinc-300">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <ShieldAlert className="h-4 w-4 text-zinc-400 shrink-0" strokeWidth={2} />
                                <span className="truncate font-normal">{approval.reason}</span>
                              </div>
                              <span className="text-[10px] uppercase tracking-wider text-zinc-500 border border-white/[0.06] px-2 py-0.5 rounded-full bg-white/[0.02] shrink-0 font-medium">
                                Policy Check
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer: Micro-Meter & Refined HoverBorder Buttons */}
                      <div className="mt-5 space-y-4 pt-4 border-t border-white/[0.06]">
                        {/* Clean Micro-Meter (Hairline Linear Style) */}
                        <div className="space-y-1.5">
                          <div className="flex items-baseline justify-between">
                            <span className="text-[10.5px] uppercase tracking-wider text-zinc-500 font-medium">
                              Risk Evaluation
                            </span>
                            <div className="flex items-baseline gap-1.5">
                              <span
                                className={cn(
                                  'text-sm font-semibold tabular-nums',
                                  isHighRisk ? 'text-rose-400/90' : 'text-zinc-300'
                                )}
                              >
                                {approval.riskScore}
                              </span>
                              <span className="text-xs text-zinc-500">/ 100</span>
                              <span
                                className={cn(
                                  'ml-1 text-[10px] font-medium uppercase px-2 py-0.5 rounded-full border',
                                  isHighRisk
                                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                                    : 'bg-white/[0.04] text-zinc-400 border-white/[0.08]'
                                )}
                              >
                                {approval.riskLevel}
                              </span>
                            </div>
                          </div>

                          {/* Hairline 2.5px track */}
                          <div className="h-[2.5px] w-full rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-500',
                                isHighRisk
                                  ? 'bg-gradient-to-r from-rose-500/80 to-rose-400'
                                  : 'bg-gradient-to-r from-zinc-500 to-zinc-300'
                              )}
                              style={{ width: `${approval.riskScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Interactive Buttons Cluster (Refined HoverBorderGradient with Matching Colors) */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          {/* Left: View Request button */}
                          <HoverBorderGradient
                            as="button"
                            containerClassName="rounded-xl"
                            className="bg-[#0e1118] text-zinc-300 hover:text-white text-[11.5px] font-medium px-3.5 py-2 flex items-center gap-1.5"
                            highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
                            onClick={() => setSelectedApproval(approval)}
                          >
                            <Eye className="h-3.5 w-3.5 text-zinc-400" />
                            <span>View Details</span>
                          </HoverBorderGradient>

                          {/* Right: Deny & Approve */}
                          <div className="flex items-center gap-2">
                            <HoverBorderGradient
                              as="button"
                              containerClassName="rounded-xl"
                              className="bg-[#120c10] text-rose-300/90 hover:text-rose-200 text-[12px] font-medium px-4 py-2 flex items-center gap-1.5 disabled:opacity-50"
                              highlight="radial-gradient(75% 181% at 50% 50%, #f43f5e 0%, rgba(255, 255, 255, 0.5) 100%)"
                              onClick={() => handleDeny(approval.id)}
                              disabled={isRemoving}
                            >
                              <X className="h-3.5 w-3.5" strokeWidth={2.2} />
                              <span>Deny</span>
                            </HoverBorderGradient>

                            <HoverBorderGradient
                              as="button"
                              containerClassName="rounded-xl"
                              className="bg-[#0c1410] text-emerald-300/90 hover:text-emerald-200 text-[12px] font-medium px-4 py-2 flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)] disabled:opacity-50"
                              highlight="radial-gradient(75% 181% at 50% 50%, #10b981 0%, rgba(255, 255, 255, 0.6) 100%)"
                              onClick={() => handleApprove(approval.id)}
                              disabled={isRemoving}
                            >
                              <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} />
                              <span>Approve</span>
                            </HoverBorderGradient>
                          </div>
                        </div>

                        {/* Removal Confirmation Notification */}
                        {isRemoving && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              'text-center py-2 px-3 rounded-xl text-[12px] font-medium',
                              removeAction === 'approve'
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25'
                                : 'bg-rose-500/10 text-rose-300 border border-rose-500/25'
                            )}
                          >
                            {removeAction === 'approve' ? 'Action Authorized & Signed' : 'Action Denied & Quarantined'}
                          </motion.div>
                        )}
                      </div>
                    </CardSpotlight>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Row 3: Companion Bento Strip (Clean Analytical Widgets)                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
          {/* Card 1: Risk Distribution */}
          <CardSpotlight className="p-5 flex flex-col justify-between min-h-[170px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-zinc-400" />
                  <h3 className="text-[13.5px] font-medium text-white tracking-tight">
                    Risk Breakdown
                  </h3>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">Live Queue</span>
              </div>

              <div className="space-y-3 font-normal text-xs">
                <div>
                  <div className="flex justify-between text-zinc-400 mb-1 text-[11.5px]">
                    <span className="text-rose-400/90 font-medium">Critical Risk (≥70)</span>
                    <span>{highRiskCount} items</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full bg-rose-500/70 rounded-full transition-all duration-500"
                      style={{ width: `${(highRiskCount / Math.max(pending.length, 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-1 text-[11.5px]">
                    <span className="text-zinc-300 font-medium">Standard Risk (40-69)</span>
                    <span>{mediumRiskCount} items</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full bg-zinc-400/70 rounded-full transition-all duration-500"
                      style={{ width: `${(mediumRiskCount / Math.max(pending.length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-white/[0.06] text-[11px] text-zinc-500 flex items-center justify-between font-normal">
              <span>Threshold Policy</span>
              <span className="text-zinc-300 font-medium">Score ≥ 40 requires sign-off</span>
            </div>
          </CardSpotlight>

          {/* Card 2: Governance Protocol */}
          <CardSpotlight className="p-5 flex flex-col justify-between min-h-[170px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-zinc-300" />
                  <h3 className="text-[13.5px] font-medium text-white tracking-tight">
                    Governance Protocol
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-medium text-emerald-400/90 tracking-wider">ENFORCED</span>
              </div>

              <p className="text-[12px] text-zinc-400 leading-relaxed font-normal">
                External egress, outbound bulk transmissions, and file overwrites are held in quarantine sandbox until cryptographically signed by an operator.
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500 font-normal">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Fail-closed security</span>
              </span>
              <span>Zero bypass</span>
            </div>
          </CardSpotlight>

          {/* Card 3: Cryptographic Audit Trail */}
          <CardSpotlight className="p-5 flex flex-col justify-between min-h-[170px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-zinc-300" />
                  <h3 className="text-[13.5px] font-medium text-white tracking-tight">
                    Audit Signature Chain
                  </h3>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">Recent Log</span>
              </div>

              <div className="space-y-2">
                {auditLog.slice(0, 2).map((entry, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/[0.025] border border-white/[0.06] text-[11.5px]">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-200 font-medium truncate max-w-[130px]">{entry.action}</span>
                      <span className={cn(
                        'text-[10px] font-medium px-2 py-0.5 rounded-full',
                        entry.decision === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                      )}>
                        {entry.decision}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate mt-1 font-mono">{entry.hash}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/[0.06] text-[11px] text-zinc-500 flex items-center justify-between font-normal">
              <span>Ledger Status</span>
              <span className="text-zinc-300 font-mono text-[10.5px]">Immutable append</span>
            </div>
          </CardSpotlight>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* View Details Inspection Modal Drawer                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedApproval && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApproval(null)}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 p-4"
            >
              <CardSpotlight className="p-6 sm:p-7 shadow-2xl rounded-2xl bg-[#0a0c10] border border-white/[0.12]">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <FileCode className="h-5 w-5 text-zinc-300" />
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight">
                        Request Payload Inspection
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">ID: {selectedApproval.id} • {selectedApproval.timestamp}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedApproval(null)}
                    className="h-8 w-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4 space-y-3.5 text-[13px]">
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Agent Runtime</span>
                      <span className="text-white font-medium text-xs mt-0.5 block">{selectedApproval.agentId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Action Requested</span>
                      <span className="text-zinc-200 font-semibold text-xs mt-0.5 block">{selectedApproval.action}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Destination</span>
                      <span className="text-zinc-300 font-mono text-xs truncate block mt-0.5">{selectedApproval.destination || 'Internal'}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Risk Assessment</span>
                      <span className={cn(
                        'text-xs font-semibold mt-0.5 block',
                        selectedApproval.riskScore >= 70 ? 'text-rose-400' : 'text-zinc-200'
                      )}>
                        {selectedApproval.riskScore} / 100 ({selectedApproval.riskLevel})
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-xs block mb-1.5 font-medium">Policy Rule Trigger</span>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-zinc-300 text-xs flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-zinc-400 shrink-0" />
                      <span>{selectedApproval.reason}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-xs block mb-1.5 font-medium">Payload Parameters</span>
                    <div className="p-3.5 rounded-xl bg-[#06080c] border border-white/[0.06] text-[11px] font-mono text-zinc-300 overflow-x-auto">
                      <pre>{JSON.stringify({
                        requestId: selectedApproval.id,
                        agent: selectedApproval.agentId,
                        method: selectedApproval.action,
                        target: selectedApproval.destination,
                        metadata: {
                          clientTimestamp: selectedApproval.timestamp,
                          sandboxQuarantine: true,
                          riskVector: selectedApproval.reason,
                        }
                      }, null, 2)}</pre>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <HoverBorderGradient
                    as="button"
                    containerClassName="rounded-xl flex-1 w-full"
                    className="w-full bg-[#120c10] text-rose-300/90 hover:text-rose-200 font-medium text-xs py-2.5 flex items-center justify-center gap-1.5"
                    highlight="radial-gradient(75% 181% at 50% 50%, #f43f5e 0%, rgba(255, 255, 255, 0.5) 100%)"
                    onClick={() => {
                      handleDeny(selectedApproval.id);
                      setSelectedApproval(null);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Deny &amp; Quarantine</span>
                  </HoverBorderGradient>

                  <HoverBorderGradient
                    as="button"
                    containerClassName="rounded-xl flex-1 w-full"
                    className="w-full bg-[#0c1410] text-emerald-300/90 hover:text-emerald-200 font-medium text-xs py-2.5 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    highlight="radial-gradient(75% 181% at 50% 50%, #10b981 0%, rgba(255, 255, 255, 0.6) 100%)"
                    onClick={() => {
                      handleApprove(selectedApproval.id);
                      setSelectedApproval(null);
                    }}
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} />
                    <span>Authorize &amp; Execute</span>
                  </HoverBorderGradient>
                </div>
              </CardSpotlight>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
