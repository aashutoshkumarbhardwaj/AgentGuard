'use client';

import { motion } from 'framer-motion';
import { Radio, Shield, Activity, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { LiveActivityStream } from '@/components/dashboard/live-activity-stream';
import { useLiveEvents } from '@/hooks/use-live-events';

export default function ActivityPage() {
  const events = useLiveEvents(30, 2500);

  const allowedCount = events.filter((e) => e.decision === 'ALLOW').length;
  const blockedCount = events.filter((e) => e.decision === 'BLOCK').length;
  const approveCount = events.filter((e) => e.decision === 'APPROVE').length;

  return (
    <div className="relative w-full space-y-8 pb-16 font-memorable select-none">
      {/* Background Ambience 1: Ambient Cosmic Radial Glows */}
      <div className="pointer-events-none absolute -top-16 left-1/4 h-[500px] w-[550px] -translate-x-1/2 rounded-full bg-sky-950/20 blur-[150px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[450px] w-[500px] rounded-full bg-blue-950/15 blur-[140px]" />

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
                <Activity className="h-3 w-3 text-sky-400" strokeWidth={2.4} />
              </div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-sky-400">
                EVENT TELEMETRY // REAL-TIME
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Activity Stream
            </h1>
            <p className="text-[15px] text-white/50 mt-1 max-w-xl">
              Real-time audit log of inspected tool executions, risk evaluations, and policy decisions.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#090b12]/80 backdrop-blur-md px-3.5 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
            </span>
            <span className="text-[12px] font-medium text-white/90 font-mono">
              Streaming Every 2.5s
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Top Summary Metrics with CardSpotlight Hover Effect                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Active Invocations */}
          <CardSpotlight className="p-6 flex flex-col justify-between min-h-[190px]">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/25">
                  <Radio className="h-4.5 w-4.5 text-sky-400 animate-pulse" />
                </div>
                <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300">
                  {events.length} EVENTS BUFFERED
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-3">Live Feed</h3>
              <p className="text-[14px] text-white/55 mt-0.5">
                Continuous agent tool call stream intercepted via MCP.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
              <span>Polling Rate: 2,500ms</span>
              <span className="text-sky-400">Zero Drop</span>
            </div>
          </CardSpotlight>

          {/* Card 2: Permitted Actions */}
          <CardSpotlight className="p-6 flex flex-col justify-between min-h-[190px]">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/25">
                  <CheckCircle2 className="h-4.5 w-4.5 text-sky-400" />
                </div>
                <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300">
                  {allowedCount} ALLOWED
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-3">Authorized Calls</h3>
              <p className="text-[14px] text-white/55 mt-0.5">
                Passed deterministic policy and risk scoring thresholds.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
              <span>{approveCount} Approval Required</span>
              <span className="text-sky-400">Low Risk</span>
            </div>
          </CardSpotlight>

          {/* Card 3: Intercepted Anomalies */}
          <CardSpotlight className="p-6 flex flex-col justify-between min-h-[190px]">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/25">
                  <AlertTriangle className="h-4.5 w-4.5 text-rose-400" />
                </div>
                <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  {blockedCount} BLOCKED
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-3">Mitigated Threats</h3>
              <p className="text-[14px] text-white/55 mt-0.5">
                Quarantined prompt injections and data exfiltration attempts.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
              <span>Threat Level: Elevated</span>
              <span className="text-rose-400">Interception Active</span>
            </div>
          </CardSpotlight>
        </div>

        {/* ========================================================================= */}
        {/* Main Security Activity Feed with CardSpotlight Hover Effect               */}
        {/* ========================================================================= */}
        <CardSpotlight className="p-6 sm:p-8" radius={450}>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
              </span>
              <h2 className="text-[17px] font-semibold text-white tracking-tight">
                Live Security Activity
              </h2>
              <span className="text-xs text-white/40 font-mono">
                polling every 2.5s
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-white/50 font-mono">
              <Radio className="h-3 w-3 text-sky-400" />
              {events.length} events
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
