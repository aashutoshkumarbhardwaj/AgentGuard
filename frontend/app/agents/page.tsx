'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bot, ArrowRight, Shield, Activity, Lock, AlertTriangle } from 'lucide-react';
import { agents } from '@/lib/mock-data';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { cn } from '@/lib/utils';

const statusConfig = {
  ACTIVE: {
    color: 'text-sky-400',
    dot: 'bg-sky-400',
    label: 'Active',
    badge: 'bg-sky-500/10 border-sky-500/30 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]',
  },
  IDLE: {
    color: 'text-white/40',
    dot: 'bg-white/40',
    label: 'Idle',
    badge: 'bg-white/[0.04] border-white/10 text-white/50',
  },
  SUSPENDED: {
    color: 'text-rose-400',
    dot: 'bg-rose-400',
    label: 'Suspended',
    badge: 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
  },
};

export default function AgentsPage() {
  const totalActions = agents.reduce((acc, a) => acc + a.actions, 0);
  const totalBlocked = agents.reduce((acc, a) => acc + a.blocked, 0);
  const totalPermissions = agents.reduce((acc, a) => acc + a.permissions, 0);

  return (
    <div className="relative w-full space-y-8 pb-16 font-memorable select-none">
      {/* Background Ambience 1: Ambient Cosmic Radial Glows */}
      <div className="pointer-events-none absolute -top-16 left-1/3 h-[500px] w-[550px] -translate-x-1/2 rounded-full bg-sky-950/20 blur-[150px]" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[450px] w-[500px] rounded-full bg-blue-950/15 blur-[140px]" />

      {/* Background Ambience 2: Authentic Dithered Dot Matrix Texture Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.45) 0.8px, transparent 0.8px)',
          backgroundSize: '3.5px 3.5px',
        }}
      />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-sky-500/10 border border-sky-500/30">
                <Bot className="h-3 w-3 text-sky-400" strokeWidth={2.4} />
              </div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-sky-400">
                AGENT FLEET // RUNTIME
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Registered Agents
            </h1>
            <p className="text-[15px] text-white/50 mt-1 max-w-xl">
              Inspect agent permissions, tool action logs, and runtime sandboxing configurations.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#090b12]/80 backdrop-blur-md px-3.5 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
            </span>
            <span className="text-[12px] font-medium text-white/90 font-mono">
              {agents.length} Registered Agents
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Top Summary Metrics with CardSpotlight Hover Effect                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Active Agents */}
          <CardSpotlight className="p-6 flex flex-col justify-between min-h-[190px]">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/25">
                  <Bot className="h-4.5 w-4.5 text-sky-400" />
                </div>
                <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300">
                  {agents.length} CONNECTED
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-3">Active Runtimes</h3>
              <p className="text-[14px] text-white/55 mt-0.5">
                Support, research, and external agents bound to gateway.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
              <span>Status: 100% Online</span>
              <span className="text-sky-400">0 Quarantined</span>
            </div>
          </CardSpotlight>

          {/* Card 2: Total Permissions */}
          <CardSpotlight className="p-6 flex flex-col justify-between min-h-[190px]">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/25">
                  <Lock className="h-4.5 w-4.5 text-sky-400" />
                </div>
                <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300">
                  {totalPermissions} GRANTED
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-3">Permission Scopes</h3>
              <p className="text-[14px] text-white/55 mt-0.5">
                Strict least-privilege tool execution policies enforced.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
              <span>RBAC Mode: Enforced</span>
              <span className="text-sky-400">Scoped</span>
            </div>
          </CardSpotlight>

          {/* Card 3: Action Audit */}
          <CardSpotlight className="p-6 flex flex-col justify-between min-h-[190px]">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/25">
                  <Activity className="h-4.5 w-4.5 text-sky-400" />
                </div>
                <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300">
                  {totalActions.toLocaleString()} ACTIONS
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-3">Intercepted Calls</h3>
              <p className="text-[14px] text-white/55 mt-0.5">
                {totalBlocked} high-risk execution attempts mitigated.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
              <span className="text-rose-400">{totalBlocked} Blocked</span>
              <span className="text-sky-400">Verifiable</span>
            </div>
          </CardSpotlight>
        </div>

        {/* ========================================================================= */}
        {/* Agent Cards Grid with CardSpotlight Hover Effect                          */}
        {/* ========================================================================= */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => {
            const status = statusConfig[agent.status];
            return (
              <Link key={agent.id} href={`/agents/${agent.id}`} className="group/link block">
                <CardSpotlight className="p-6 sm:p-7 flex flex-col justify-between h-full min-h-[300px]">
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                          <Bot className="h-5 w-5 text-sky-400" strokeWidth={2.2} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-white tracking-tight group-hover/link:text-sky-300 transition-colors">
                            {agent.name}
                          </h3>
                          <p className="text-xs font-mono text-white/40">{agent.id}</p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10.5px] font-semibold uppercase tracking-wider',
                          status.badge
                        )}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
                        <span>{status.label}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-[14px] text-white/60 leading-relaxed line-clamp-2">
                      {agent.description}
                    </p>
                  </div>

                  <div>
                    {/* Stats */}
                    <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.08] pt-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35 font-mono">
                          Scopes
                        </p>
                        <p className="text-xl font-bold font-mono mt-1 text-white tabular-nums">
                          {agent.permissions}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35 font-mono">
                          Calls
                        </p>
                        <p className="text-xl font-bold font-mono mt-1 text-sky-300 tabular-nums">
                          {agent.actions}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35 font-mono">
                          Blocked
                        </p>
                        <p className="text-xl font-bold font-mono mt-1 text-rose-400 tabular-nums">
                          {agent.blocked}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-[11.5px] text-white/40 font-mono">
                        {agent.framework}
                      </span>
                      <span className="flex items-center gap-1 text-[13px] text-sky-400 font-medium group-hover/link:gap-2 transition-all">
                        <span>Inspect</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </CardSpotlight>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
