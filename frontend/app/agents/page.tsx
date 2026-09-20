'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bot, ArrowRight, Shield, Activity, Lock, AlertTriangle, Radio } from 'lucide-react';
import { agents } from '@/lib/mock-data';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { cn } from '@/lib/utils';

const statusConfig = {
  ACTIVE: {
    color: 'text-zinc-300',
    dot: 'bg-emerald-400',
    label: 'Active',
    badge: 'bg-white/[0.04] border-white/[0.08] text-zinc-300',
  },
  IDLE: {
    color: 'text-zinc-500',
    dot: 'bg-zinc-500',
    label: 'Idle',
    badge: 'bg-white/[0.02] border-white/[0.06] text-zinc-400',
  },
  SUSPENDED: {
    color: 'text-rose-400',
    dot: 'bg-rose-400',
    label: 'Suspended',
    badge: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
  },
};

export default function AgentsPage() {
  const totalActions = agents.reduce((acc, a) => acc + a.actions, 0);
  const totalBlocked = agents.reduce((acc, a) => acc + a.blocked, 0);
  const totalPermissions = agents.reduce((acc, a) => acc + a.permissions, 0);

  return (
    <div className="relative w-full space-y-8 pb-20 font-memorable select-none">
      {/* Subtle Ambient Radial Lighting */}
      <div className="pointer-events-none absolute -top-20 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-slate-900/30 blur-[160px]" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[450px] w-[450px] rounded-full bg-blue-950/15 blur-[150px]" />

      <div className="relative z-10 space-y-8">
        {/* Header - Minimalist, Executive Typography */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
                Agent Fleet // Governance
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Registered Agents
            </h1>
            <p className="text-[14.5px] text-zinc-400 mt-1 max-w-xl font-normal leading-relaxed">
              Inspect agent identity profiles, tool execution scopes, and real-time sandbox policies.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0a0c10]/90 backdrop-blur-md px-3.5 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[12px] font-medium text-zinc-300">
              {agents.length} Connected Runtimes
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Top Summary Metrics (3 Luxury Bento Cards)                                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Active Agents */}
          <CardSpotlight className="p-6 flex flex-col justify-between min-h-[190px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <Bot className="h-4.5 w-4.5 text-zinc-300" />
                </div>
                <span className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                  {agents.length} CONNECTED
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white tracking-tight mt-3">Active Runtimes</h3>
              <p className="text-[13.5px] text-zinc-400 mt-1 font-normal leading-relaxed">
                Support, research, and external agents bound to the gateway.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
              <span>Status: 100% Online</span>
              <span className="text-zinc-300 font-medium">Zero Quarantined</span>
            </div>
          </CardSpotlight>

          {/* Card 2: Total Permissions */}
          <CardSpotlight className="p-6 flex flex-col justify-between min-h-[190px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <Lock className="h-4.5 w-4.5 text-zinc-300" />
                </div>
                <span className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                  {totalPermissions} GRANTED
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white tracking-tight mt-3">Permission Scopes</h3>
              <p className="text-[13.5px] text-zinc-400 mt-1 font-normal leading-relaxed">
                Least-privilege tool execution scopes enforced per agent.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
              <span>RBAC Mode: Enforced</span>
              <span className="text-zinc-300 font-medium">Hardware Isolation</span>
            </div>
          </CardSpotlight>

          {/* Card 3: Action Audit */}
          <CardSpotlight className="p-6 flex flex-col justify-between min-h-[190px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <Activity className="h-4.5 w-4.5 text-zinc-300" />
                </div>
                <span className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                  {totalActions.toLocaleString()} ACTIONS
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white tracking-tight mt-3">Intercepted Invocations</h3>
              <p className="text-[13.5px] text-zinc-400 mt-1 font-normal leading-relaxed">
                {totalBlocked} high-risk execution attempts mitigated.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
              <span className="text-rose-400/90 font-medium">{totalBlocked} Blocked</span>
              <span className="text-zinc-300 font-medium">Verifiable Ledger</span>
            </div>
          </CardSpotlight>
        </div>

        {/* ========================================================================= */}
        {/* Agent Cards Grid (Top Company Luxury Bento Cards)                         */}
        {/* ========================================================================= */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => {
            const status = statusConfig[agent.status];
            return (
              <div key={agent.id} className="group/link block">
                <CardSpotlight className="p-6 sm:p-7 flex flex-col justify-between h-full min-h-[310px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  <div>
                    {/* Header: Icon, Agent Title, Status Chip */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                          <Bot className="h-5 w-5 text-zinc-300" strokeWidth={2.2} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-semibold text-white tracking-tight group-hover/link:text-zinc-200 transition-colors">
                            {agent.name}
                          </h3>
                          <p className="text-xs font-mono text-zinc-500">{agent.id}</p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium',
                          status.badge
                        )}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
                        <span>{status.label}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-[13.5px] text-zinc-400 font-normal leading-relaxed line-clamp-2">
                      {agent.description}
                    </p>
                  </div>

                  <div>
                    {/* 3-Column Metrics */}
                    <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-4">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                          Scopes
                        </p>
                        <p className="text-lg font-semibold mt-0.5 text-white tabular-nums">
                          {agent.permissions}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                          Invocations
                        </p>
                        <p className="text-lg font-semibold mt-0.5 text-zinc-200 tabular-nums">
                          {agent.actions}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                          Mitigated
                        </p>
                        <p className="text-lg font-semibold mt-0.5 text-rose-400/90 tabular-nums">
                          {agent.blocked}
                        </p>
                      </div>
                    </div>

                    {/* Footer with HoverBorderGradient Button */}
                    <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-[11.5px] text-zinc-500 font-mono">
                        {agent.framework}
                      </span>
                      <Link href={`/agents/${agent.id}`}>
                        <HoverBorderGradient
                          as="div"
                          containerClassName="rounded-xl"
                          className="bg-[#0e1118] text-zinc-300 hover:text-white text-[11.5px] font-medium px-3 py-1.5 flex items-center gap-1.5"
                          highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
                        >
                          <span>Inspect Agent</span>
                          <ArrowRight className="h-3 w-3" />
                        </HoverBorderGradient>
                      </Link>
                    </div>
                  </div>
                </CardSpotlight>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
