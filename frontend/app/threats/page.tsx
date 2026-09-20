'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ChevronRight,
  X,
  ShieldAlert,
  Shield,
  Bot,
  Terminal,
  Activity,
  Search,
  CheckCircle2,
  Lock,
  FileCode,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { threats as initialThreats } from '@/lib/mock-data';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { DecisionBadge } from '@/components/dashboard/decision-badge';
import type { Threat } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ThreatsPage() {
  const [threatList, setThreatList] = useState<Threat[]>(initialThreats);
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [quarantiningId, setQuarantiningId] = useState<string | null>(null);

  const criticalCount = threatList.filter((t) => t.severity === 'CRITICAL').length;
  const highCount = threatList.filter((t) => t.severity === 'HIGH').length;
  const mediumCount = threatList.filter((t) => t.severity === 'MEDIUM').length;

  const filteredThreats = threatList.filter((threat) => {
    const matchesSeverity =
      severityFilter === 'ALL' ? true : threat.severity === severityFilter;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : threat.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          threat.agentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          threat.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          threat.snippet.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSeverity && matchesSearch;
  });

  const handleQuarantine = (id: string) => {
    setQuarantiningId(id);
    setTimeout(() => {
      setQuarantiningId(null);
    }, 1500);
  };

  return (
    <div className="relative w-full space-y-8 pb-20 font-memorable select-none">
      {/* Subtle Ambient Radial Lighting */}
      <div className="pointer-events-none absolute -top-20 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-slate-900/30 blur-[160px]" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[450px] w-[450px] rounded-full bg-rose-950/10 blur-[150px]" />

      <div className="relative z-10 space-y-8">
        {/* Header - Minimalist, Executive Typography */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
              Security Perimeter // Threat Center
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <div>
              <h1 className="text-3xl sm:text-[34px] font-semibold tracking-tight text-white">
                Threat Center
              </h1>
              <p className="text-[14.5px] text-zinc-400 mt-1 max-w-xl font-normal leading-relaxed">
                {threatList.length} malicious vectors and anomalous agent executions intercepted by real-time heuristic filters.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-zinc-300 font-medium bg-[#0a0c10]/90 border border-white/[0.08] px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400" />
              </span>
              <span>Zero-Day Isolation Active</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Row 1: Top Metric Cards (Clean, Symmetrical, Luxury Glass)               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'INTERCEPTED THREATS',
              value: threatList.length.toString(),
              sub: 'Total anomalous vectors',
              color: 'text-white',
              icon: AlertTriangle,
            },
            {
              label: 'CRITICAL ESCALATIONS',
              value: criticalCount.toString(),
              sub: 'Immediate quarantine triggers',
              color: criticalCount > 0 ? 'text-rose-400/90' : 'text-zinc-400',
              icon: ShieldAlert,
            },
            {
              label: 'ML CONFIDENCE',
              value: '96.8%',
              sub: 'Heuristic + vector inference',
              color: 'text-zinc-200',
              icon: Zap,
            },
            {
              label: 'CONTAINMENT RATE',
              value: '100%',
              sub: 'Fail-closed enforcement',
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
          <div className="flex items-center gap-1.5">
            <HoverBorderGradient
              as="button"
              containerClassName="rounded-xl"
              className={cn(
                'px-3.5 py-1.5 text-[12px] font-medium transition-all',
                severityFilter === 'ALL'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'bg-transparent text-zinc-400 hover:text-white'
              )}
              highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
              onClick={() => setSeverityFilter('ALL')}
            >
              All Threats ({threatList.length})
            </HoverBorderGradient>

            <HoverBorderGradient
              as="button"
              containerClassName="rounded-xl"
              className={cn(
                'px-3.5 py-1.5 text-[12px] font-medium transition-all',
                severityFilter === 'CRITICAL'
                  ? 'bg-rose-500/15 text-rose-300'
                  : 'bg-transparent text-zinc-400 hover:text-rose-300'
              )}
              highlight="radial-gradient(75% 181% at 50% 50%, #f43f5e 0%, rgba(255, 255, 255, 0.4) 100%)"
              onClick={() => setSeverityFilter('CRITICAL')}
            >
              Critical ({criticalCount})
            </HoverBorderGradient>

            <HoverBorderGradient
              as="button"
              containerClassName="rounded-xl"
              className={cn(
                'px-3.5 py-1.5 text-[12px] font-medium transition-all',
                severityFilter === 'HIGH'
                  ? 'bg-white/10 text-zinc-200'
                  : 'bg-transparent text-zinc-400 hover:text-zinc-200'
              )}
              highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.3) 100%)"
              onClick={() => setSeverityFilter('HIGH')}
            >
              High ({highCount})
            </HoverBorderGradient>

            <HoverBorderGradient
              as="button"
              containerClassName="rounded-xl"
              className={cn(
                'px-3.5 py-1.5 text-[12px] font-medium transition-all',
                severityFilter === 'MEDIUM'
                  ? 'bg-white/10 text-zinc-300'
                  : 'bg-transparent text-zinc-400 hover:text-zinc-300'
              )}
              highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.3) 100%)"
              onClick={() => setSeverityFilter('MEDIUM')}
            >
              Medium ({mediumCount})
            </HoverBorderGradient>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search type, agent, snippet..."
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

            {filteredThreats.length < threatList.length && (
              <HoverBorderGradient
                as="button"
                containerClassName="rounded-xl"
                className="bg-[#0e1118] text-zinc-300 hover:text-white text-[11.5px] font-medium px-3.5 py-1.5 flex items-center gap-1.5"
                highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
                onClick={() => {
                  setSeverityFilter('ALL');
                  setSearchQuery('');
                }}
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </HoverBorderGradient>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Row 2: Rich Bento Grid of Threats (Top Company Luxury Cards)              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredThreats.map((threat) => {
              const isCritical = threat.severity === 'CRITICAL';
              const isQuarantining = quarantiningId === threat.id;

              return (
                <motion.div
                  key={threat.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="relative"
                >
                  <CardSpotlight className="p-6 relative flex flex-col justify-between min-h-[320px] rounded-2xl transition-all duration-300 bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                    <div>
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium',
                              isCritical
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                                : 'bg-white/[0.04] border-white/[0.08] text-zinc-300'
                            )}
                          >
                            <span
                              className={cn(
                                'h-1.5 w-1.5 rounded-full',
                                isCritical ? 'bg-rose-400' : 'bg-zinc-400'
                              )}
                            />
                            {threat.severity}
                          </span>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.025] border border-white/[0.06] text-[11px] text-zinc-400 font-medium">
                            <Bot className="h-3 w-3 text-zinc-500" />
                            <span className="truncate max-w-[120px]">{threat.agentId}</span>
                          </div>
                        </div>

                        <span className="text-[11px] text-zinc-500 font-mono">
                          {threat.action}
                        </span>
                      </div>

                      {/* Title & Intercepted Snippet */}
                      <div className="mt-4 space-y-3">
                        <h3 className="text-[17px] font-semibold text-white tracking-tight">
                          {threat.type}
                        </h3>

                        <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06] text-[12.5px] font-mono text-zinc-300 italic">
                          "{threat.snippet}"
                        </div>
                      </div>
                    </div>

                    {/* Footer: Vectors & Actions */}
                    <div className="mt-5 space-y-4 pt-4 border-t border-white/[0.06]">
                      {/* Vector indicators */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10.5px] uppercase font-medium text-zinc-500">Rule Match</span>
                            <span className={cn('text-xs font-semibold', threat.ruleEngine ? 'text-zinc-200' : 'text-zinc-600')}>
                              {threat.ruleEngine ? 'TRIGGERED' : '—'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10.5px] uppercase font-medium text-zinc-500">ML Confidence</span>
                            <span className="text-xs font-semibold text-rose-400/90 font-mono">
                              {threat.mlDetector ? `${threat.confidence}%` : '—'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 font-mono text-xs">
                          <span className="text-zinc-500">Risk:</span>
                          <span className="font-semibold text-rose-400">{threat.finalRisk}/100</span>
                        </div>
                      </div>

                      {/* Hairline progress bar */}
                      <div className="h-[2.5px] w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500/80 to-rose-400 rounded-full"
                          style={{ width: `${threat.finalRisk}%` }}
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <HoverBorderGradient
                          as="button"
                          containerClassName="rounded-xl"
                          className="bg-[#0e1118] text-zinc-300 hover:text-white text-[11.5px] font-medium px-3.5 py-2 flex items-center gap-1.5"
                          highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
                          onClick={() => setSelectedThreat(threat)}
                        >
                          <Terminal className="h-3.5 w-3.5 text-zinc-400" />
                          <span>View Forensics</span>
                        </HoverBorderGradient>

                        <HoverBorderGradient
                          as="button"
                          containerClassName="rounded-xl"
                          className={cn(
                            'text-[12px] font-medium px-4 py-2 flex items-center gap-1.5 transition-all',
                            isQuarantining
                              ? 'bg-emerald-950/40 text-emerald-300'
                              : 'bg-[#120c10] text-rose-300/90 hover:text-rose-200'
                          )}
                          highlight="radial-gradient(75% 181% at 50% 50%, #f43f5e 0%, rgba(255, 255, 255, 0.5) 100%)"
                          onClick={() => handleQuarantine(threat.id)}
                        >
                          {isQuarantining ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Quarantined</span>
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                              <span>Isolate Agent</span>
                            </>
                          )}
                        </HoverBorderGradient>
                      </div>
                    </div>
                  </CardSpotlight>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Forensics Inspection Modal Drawer                                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedThreat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedThreat(null)}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 p-4"
            >
              <CardSpotlight className="p-6 sm:p-7 shadow-2xl rounded-2xl bg-[#0a0c10] border border-white/[0.12] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="h-5 w-5 text-rose-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight">
                        Threat Forensics &amp; Vector Trace
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">{selectedThreat.id} • {selectedThreat.agentId}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedThreat(null)}
                    className="h-8 w-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4 space-y-4 text-[13px]">
                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Threat Category</span>
                      <span className="text-white font-semibold text-xs mt-0.5 block">{selectedThreat.type}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Interception Severity</span>
                      <span className="text-rose-400 font-semibold text-xs mt-0.5 block">{selectedThreat.severity}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Target Tool</span>
                      <span className="text-zinc-200 font-mono text-xs truncate block mt-0.5">{selectedThreat.action}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">ML Confidence</span>
                      <span className="text-zinc-200 font-mono text-xs font-semibold mt-0.5 block">{selectedThreat.confidence}% Confidence</span>
                    </div>
                  </div>

                  {/* Intercepted Payload */}
                  <div>
                    <span className="text-zinc-400 text-xs block mb-1.5 font-medium">Intercepted Raw Payload</span>
                    <div className="p-3 rounded-xl bg-[#06080c] border border-white/[0.06] text-xs font-mono text-zinc-300 italic">
                      "{selectedThreat.snippet}"
                    </div>
                  </div>

                  {/* Risk Factors Breakdown */}
                  <div>
                    <span className="text-zinc-400 text-xs block mb-1.5 font-medium">Calculated Risk Factors</span>
                    <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                      {selectedThreat.riskFactors.map((factor, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">{factor.label}</span>
                          <span className="font-mono font-semibold text-rose-400">+{factor.delta}</span>
                        </div>
                      ))}
                      <div className="pt-2 mt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold">
                        <span className="text-white">Aggregate Risk Score</span>
                        <span className="font-mono text-rose-400 text-sm">{selectedThreat.finalRisk} / 100</span>
                      </div>
                    </div>
                  </div>

                  {/* Why Blocked */}
                  <div>
                    <span className="text-zinc-400 text-xs block mb-1.5 font-medium">Deterministic Blocking Reasons</span>
                    <div className="space-y-2">
                      {selectedThreat.reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-xs text-zinc-300">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-[9px] font-bold text-rose-400">
                            {idx + 1}
                          </span>
                          <span>{reason}</span>
                        </div>
                      ))}
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
                      handleQuarantine(selectedThreat.id);
                      setSelectedThreat(null);
                    }}
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Quarantine Runtime Immediately</span>
                  </HoverBorderGradient>

                  <HoverBorderGradient
                    as="button"
                    containerClassName="rounded-xl flex-1 w-full"
                    className="w-full bg-[#0e1118] text-zinc-300 hover:text-white font-medium text-xs py-2.5 flex items-center justify-center gap-1.5"
                    highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
                    onClick={() => setSelectedThreat(null)}
                  >
                    <span>Close Forensics</span>
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
