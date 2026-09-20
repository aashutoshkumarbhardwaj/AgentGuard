'use client';

import { motion } from 'framer-motion';
import { Radio, Shield, Activity, AlertTriangle, Zap, CheckCircle2, Sliders, Play, Pause } from 'lucide-react';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { LiveActivityStream } from '@/components/dashboard/live-activity-stream';
import { useLiveEvents } from '@/hooks/use-live-events';

export default function ActivityPage() {
  const events = useLiveEvents(30, 2500);

  const allowedCount = events.filter((e) => e.decision === 'ALLOW').length;
  const blockedCount = events.filter((e) => e.decision === 'BLOCK').length;
  const approveCount = events.filter((e) => e.decision === 'APPROVE').length;

  return (
    <div className="relative w-full space-y-8 pb-20 font-memorable select-none">
      {/* Subtle Ambient Radial Lighting */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-slate-900/30 blur-[160px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-blue-950/15 blur-[150px]" />

      <div className="relative z-10 space-y-8">
        {/* Header - Minimalist, Executive Typography */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
                Event Telemetry // Real-Time
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Activity Stream
            </h1>
            <p className="text-[14.5px] text-zinc-400 mt-1 max-w-xl font-normal leading-relaxed">
              Real-time audit log of inspected agent tool calls, runtime policy evaluations, and automatic risk decisions.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0a0c10]/90 backdrop-blur-md px-3.5 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[12px] font-medium text-zinc-300">
              Streaming Every 2.5s
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Top Summary Metrics (3 Luxury Bento Cards)                                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Active Invocations */}
          <CardSpotlight className="p-6 flex flex-col justify-between min-h-[190px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <Radio className="h-4.5 w-4.5 text-zinc-300" />
                </div>
                <span className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                  {events.length} BUFFERED
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white tracking-tight mt-3">Live Interception Feed</h3>
              <p className="text-[13.5px] text-zinc-400 mt-1 font-normal leading-relaxed">
                Continuous agent tool call stream intercepted at the MCP protocol layer.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
              <span>Polling Rate: 2,500ms</span>
              <span className="text-zinc-300 font-medium">Zero Drop</span>
            </div>
          </CardSpotlight>

          {/* Card 2: Permitted Actions */}
          <CardSpotlight className="p-6 flex flex-col justify-between min-h-[190px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <CheckCircle2 className="h-4.5 w-4.5 text-zinc-300" />
                </div>
                <span className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                  {allowedCount} ALLOWED
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white tracking-tight mt-3">Authorized Executions</h3>
              <p className="text-[13.5px] text-zinc-400 mt-1 font-normal leading-relaxed">
                Passed deterministic permissions and automated risk thresholds.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
              <span>{approveCount} Escalated to Review</span>
              <span className="text-zinc-300 font-medium">Clear Trail</span>
            </div>
          </CardSpotlight>

          {/* Card 3: Intercepted Anomalies */}
          <CardSpotlight className="p-6 flex flex-col justify-between min-h-[190px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <AlertTriangle className="h-4.5 w-4.5 text-rose-400" />
                </div>
                <span className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  {blockedCount} BLOCKED
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white tracking-tight mt-3">Mitigated Threats</h3>
              <p className="text-[13.5px] text-zinc-400 mt-1 font-normal leading-relaxed">
                Quarantined injection attempts, data egress, and unpermitted resource edits.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
              <span>Threat Protection Active</span>
              <span className="text-rose-400 font-medium">Zero Bypass</span>
            </div>
          </CardSpotlight>
        </div>

        {/* ========================================================================= */}
        {/* Main Security Activity Feed (Luxury Glass Container)                     */}
        {/* ========================================================================= */}
        <CardSpotlight className="p-6 sm:p-8 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08]" radius={450}>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <h2 className="text-[16px] font-semibold text-white tracking-tight">
                Live Security Interception Stream
              </h2>
              <span className="text-xs text-zinc-500 font-normal">
                (Polling every 2.5s)
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-normal">
              <Radio className="h-3 w-3 text-zinc-400" />
              <span>{events.length} events logged</span>
            </span>
          </div>

          <div className="relative z-20">
            <LiveActivityStream events={events} />
          </div>
        </CardSpotlight>
      </div>
    </div>
  );
}
