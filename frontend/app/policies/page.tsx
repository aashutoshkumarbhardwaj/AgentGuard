'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  X,
  ChevronRight,
  Code2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Search,
  RotateCcw,
  Sliders,
  Sparkles,
  Zap,
  Power,
  Terminal,
} from 'lucide-react';
import { policies as initialPolicies } from '@/lib/mock-data';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import type { Policy } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function PoliciesPage() {
  const [policyList, setPolicyList] = useState<Policy[]>(initialPolicies);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [effectFilter, setEffectFilter] = useState<'ALL' | 'ACTIVE' | 'PERMIT' | 'DENY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCount = policyList.filter((p) => p.status === 'ACTIVE').length;
  const permitCount = policyList.filter((p) => p.effect === 'PERMIT').length;
  const denyCount = policyList.filter((p) => p.effect === 'DENY').length;

  const handleToggleStatus = (id: string) => {
    setPolicyList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : p
      )
    );
    if (selectedPolicy?.id === id) {
      setSelectedPolicy((prev) =>
        prev ? { ...prev, status: prev.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : null
      );
    }
  };

  const filteredPolicies = policyList.filter((policy) => {
    const matchesFilter =
      effectFilter === 'ALL'
        ? true
        : effectFilter === 'ACTIVE'
        ? policy.status === 'ACTIVE'
        : policy.effect === effectFilter;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          policy.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (policy.description && policy.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative w-full space-y-8 pb-20 font-memorable select-none">
      {/* Subtle Ambient Radial Lighting */}
      <div className="pointer-events-none absolute -top-20 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-slate-900/30 blur-[160px]" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[450px] w-[450px] rounded-full bg-blue-950/15 blur-[150px]" />

      <div className="relative z-10 space-y-8">
        {/* Header - Minimalist, Executive Typography */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
              Security Governance // Policy Engine
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <div>
              <h1 className="text-3xl sm:text-[34px] font-semibold tracking-tight text-white">
                Security Policies
              </h1>
              <p className="text-[14.5px] text-zinc-400 mt-1 max-w-xl font-normal leading-relaxed">
                Deterministic permission boundaries, regex triggers, and role-based execution constraints.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-zinc-300 font-medium bg-[#0a0c10]/90 border border-white/[0.08] px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>{activeCount} Policies Enforced Live</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Row 1: Top Metric Cards (Clean, Symmetrical, Luxury Glass)               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'ACTIVE RULES',
              value: activeCount.toString(),
              sub: 'Deterministic policy rulesets',
              color: 'text-white',
              icon: FileText,
            },
            {
              label: 'FAIL-CLOSED BASELINE',
              value: 'ENFORCED',
              sub: 'Zero-trust default deny',
              color: 'text-zinc-200',
              icon: ShieldCheck,
            },
            {
              label: 'AST EVAL SPEED',
              value: '< 0.8ms',
              sub: 'In-memory parallel cache',
              color: 'text-zinc-200',
              icon: Zap,
            },
            {
              label: 'AUDIT COMPLIANCE',
              value: '100%',
              sub: 'Cryptographic hash verified',
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
                effectFilter === 'ALL'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'bg-transparent text-zinc-400 hover:text-white'
              )}
              highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
              onClick={() => setEffectFilter('ALL')}
            >
              All Rules ({policyList.length})
            </HoverBorderGradient>

            <HoverBorderGradient
              as="button"
              containerClassName="rounded-xl"
              className={cn(
                'px-3.5 py-1.5 text-[12px] font-medium transition-all',
                effectFilter === 'ACTIVE'
                  ? 'bg-white/10 text-white'
                  : 'bg-transparent text-zinc-400 hover:text-white'
              )}
              highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.3) 100%)"
              onClick={() => setEffectFilter('ACTIVE')}
            >
              Active ({activeCount})
            </HoverBorderGradient>

            <HoverBorderGradient
              as="button"
              containerClassName="rounded-xl"
              className={cn(
                'px-3.5 py-1.5 text-[12px] font-medium transition-all',
                effectFilter === 'DENY'
                  ? 'bg-rose-500/15 text-rose-300'
                  : 'bg-transparent text-zinc-400 hover:text-rose-300'
              )}
              highlight="radial-gradient(75% 181% at 50% 50%, #f43f5e 0%, rgba(255, 255, 255, 0.4) 100%)"
              onClick={() => setEffectFilter('DENY')}
            >
              Deny Rules ({denyCount})
            </HoverBorderGradient>

            <HoverBorderGradient
              as="button"
              containerClassName="rounded-xl"
              className={cn(
                'px-3.5 py-1.5 text-[12px] font-medium transition-all',
                effectFilter === 'PERMIT'
                  ? 'bg-white/10 text-zinc-200'
                  : 'bg-transparent text-zinc-400 hover:text-zinc-200'
              )}
              highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.3) 100%)"
              onClick={() => setEffectFilter('PERMIT')}
            >
              Permit Rules ({permitCount})
            </HoverBorderGradient>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search policy name, action..."
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

            {filteredPolicies.length < policyList.length && (
              <HoverBorderGradient
                as="button"
                containerClassName="rounded-xl"
                className="bg-[#0e1118] text-zinc-300 hover:text-white text-[11.5px] font-medium px-3.5 py-1.5 flex items-center gap-1.5"
                highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
                onClick={() => {
                  setEffectFilter('ALL');
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
        {/* Row 2: Rich Bento Grid of Policy Cards (Top Company Luxury Cards)         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredPolicies.map((policy) => {
              const isActive = policy.status === 'ACTIVE';
              const isDeny = policy.effect === 'DENY';

              return (
                <motion.div
                  key={policy.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="relative"
                >
                  <CardSpotlight className="p-6 relative flex flex-col justify-between min-h-[300px] rounded-2xl transition-all duration-300 bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                    <div>
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium',
                              isDeny
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                            )}
                          >
                            <span
                              className={cn(
                                'h-1.5 w-1.5 rounded-full',
                                isDeny ? 'bg-rose-400' : 'bg-emerald-400'
                              )}
                            />
                            {policy.effect}
                          </span>
                          <span className="text-xs text-zinc-500 font-mono">{policy.id}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              'h-2 w-2 rounded-full',
                              isActive ? 'bg-emerald-400' : 'bg-zinc-600'
                            )}
                          />
                          <span className="text-[11px] text-zinc-400 font-medium">
                            {policy.status}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mt-4 space-y-3">
                        <div>
                          <span className="text-[10px] uppercase font-medium tracking-wider text-zinc-500 block">
                            Target Tool Scope
                          </span>
                          <p className="text-[16px] font-semibold text-white tracking-tight mt-0.5">
                            {policy.action}
                          </p>
                        </div>

                        <p className="text-[13.5px] text-zinc-400 font-normal leading-relaxed">
                          {policy.description || policy.name}
                        </p>
                      </div>
                    </div>

                    {/* Footer & Actions */}
                    <div className="mt-5 space-y-3.5 pt-4 border-t border-white/[0.06]">
                      <div className="flex items-center justify-between text-xs text-zinc-500 font-normal">
                        <span>AST Heuristic Rule</span>
                        <span className="text-zinc-300 font-mono">Parallel Engine</span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <HoverBorderGradient
                          as="button"
                          containerClassName="rounded-xl"
                          className="bg-[#0e1118] text-zinc-300 hover:text-white text-[11.5px] font-medium px-3.5 py-2 flex items-center gap-1.5"
                          highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
                          onClick={() => setSelectedPolicy(policy)}
                        >
                          <Code2 className="h-3.5 w-3.5 text-zinc-400" />
                          <span>Inspect AST Rule</span>
                        </HoverBorderGradient>

                        <HoverBorderGradient
                          as="button"
                          containerClassName="rounded-xl"
                          className={cn(
                            'text-[12px] font-medium px-3.5 py-2 flex items-center gap-1.5 transition-all',
                            isActive
                              ? 'bg-[#120c10] text-rose-300/90 hover:text-rose-200'
                              : 'bg-[#0c1410] text-emerald-300/90 hover:text-emerald-200'
                          )}
                          highlight={
                            isActive
                              ? 'radial-gradient(75% 181% at 50% 50%, #f43f5e 0%, rgba(255, 255, 255, 0.4) 100%)'
                              : 'radial-gradient(75% 181% at 50% 50%, #10b981 0%, rgba(255, 255, 255, 0.4) 100%)'
                          }
                          onClick={() => handleToggleStatus(policy.id)}
                        >
                          <Power className="h-3 w-3" />
                          <span>{isActive ? 'Deactivate' : 'Activate'}</span>
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
      {/* Rule Code / AST Modal Drawer                                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedPolicy && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPolicy(null)}
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
                    <FileText className="h-5 w-5 text-zinc-300" />
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight">
                        Policy Rule Specification
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">{selectedPolicy.id} • {selectedPolicy.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPolicy(null)}
                    className="h-8 w-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4 space-y-4 text-[13px]">
                  {/* Grid */}
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Policy Enforcement</span>
                      <span className={cn(
                        'font-semibold text-xs mt-0.5 block',
                        selectedPolicy.effect === 'DENY' ? 'text-rose-400' : 'text-emerald-400'
                      )}>
                        {selectedPolicy.effect}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Engine Status</span>
                      <span className="text-zinc-200 font-semibold text-xs mt-0.5 block">{selectedPolicy.status}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Target Tool Scope</span>
                      <span className="text-zinc-200 font-mono text-xs truncate block mt-0.5">{selectedPolicy.action}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Compilation Mode</span>
                      <span className="text-zinc-200 font-mono text-xs mt-0.5 block">AST Heuristic</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <span className="text-zinc-400 text-xs block mb-1.5 font-medium">Policy Description &amp; Scope</span>
                    <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06] text-xs text-zinc-300 leading-relaxed font-normal">
                      {selectedPolicy.description || selectedPolicy.name}
                    </div>
                  </div>

                  {/* Declarative Rule YAML */}
                  <div>
                    <span className="text-zinc-400 text-xs block mb-1.5 font-medium">Compiled Policy Declaration (YAML / AST)</span>
                    <div className="p-3.5 rounded-xl bg-[#06080c] border border-white/[0.06] text-[11px] font-mono text-zinc-300 overflow-x-auto">
                      <pre>{`version: "2026-09"
rule_id: "${selectedPolicy.id}"
name: "${selectedPolicy.name}"
effect: "${selectedPolicy.effect}"
status: "${selectedPolicy.status}"
target:
  action: "${selectedPolicy.action}"
  scope: "runtime.mcp.tool_call"
conditions:
  - type: "regex_sanitization"
    fail_closed: true
    require_signature: true
audit:
  log_level: "VERBOSE"
  quarantine_on_violation: true`}</pre>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <HoverBorderGradient
                    as="button"
                    containerClassName="rounded-xl flex-1 w-full"
                    className={cn(
                      'w-full font-medium text-xs py-2.5 flex items-center justify-center gap-1.5',
                      selectedPolicy.status === 'ACTIVE'
                        ? 'bg-[#120c10] text-rose-300/90 hover:text-rose-200'
                        : 'bg-[#0c1410] text-emerald-300/90 hover:text-emerald-200'
                    )}
                    highlight={
                      selectedPolicy.status === 'ACTIVE'
                        ? 'radial-gradient(75% 181% at 50% 50%, #f43f5e 0%, rgba(255, 255, 255, 0.4) 100%)'
                        : 'radial-gradient(75% 181% at 50% 50%, #10b981 0%, rgba(255, 255, 255, 0.4) 100%)'
                    }
                    onClick={() => handleToggleStatus(selectedPolicy.id)}
                  >
                    <Power className="h-3.5 w-3.5" />
                    <span>{selectedPolicy.status === 'ACTIVE' ? 'Deactivate Policy' : 'Activate Policy'}</span>
                  </HoverBorderGradient>

                  <HoverBorderGradient
                    as="button"
                    containerClassName="rounded-xl flex-1 w-full"
                    className="w-full bg-[#0e1118] text-zinc-300 hover:text-white font-medium text-xs py-2.5 flex items-center justify-center gap-1.5"
                    highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
                    onClick={() => setSelectedPolicy(null)}
                  >
                    <span>Close Rule View</span>
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
