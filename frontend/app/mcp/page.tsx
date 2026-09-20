'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  Shield, Github, Star, Sparkles, Activity, Layers, Terminal, ArrowRight,
  Zap, CheckCircle2, Bot, Wrench, ShieldAlert, Check
} from 'lucide-react';
import { McpSecurityGraph } from '@/components/mcp/security-graph';
import { ProtectedTools } from '@/components/mcp/protected-tools';
import { LiquidBentoCard } from '@/components/mcp/liquid-bento-card';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import BentoGridDemo from '@/components/bento-grid-demo';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { agents } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function McpPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'mcp' | 'aceternity'>('mcp');
  const [callsCount, setCallsCount] = useState(8492);

  // GSAP entrance stagger animation on mount
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bento-item',
        { opacity: 0, y: 20, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.06,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        }
      );
    }, containerRef);

    // Live micro-counter increment
    const interval = setInterval(() => {
      setCallsCount((prev) => prev + Math.floor(Math.random() * 2) + 1);
    }, 3500);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, [viewMode]);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen pb-20 select-none font-memorable">
      {/* Ambient Lighting */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-slate-900/30 blur-[160px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[450px] w-[500px] rounded-full bg-emerald-950/10 blur-[150px]" />

      <div className="relative z-10 space-y-8">
        {/* ========================================================================= */}
        {/* Header Section: Minimalist Executive Typography                          */}
        {/* ========================================================================= */}
        <div className="bento-item pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
              Protocol Security // MCP Gateway
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <div>
              <h1 className="text-3xl sm:text-[34px] font-semibold tracking-tight text-white">
                MCP Gateway
              </h1>
              <p className="text-[14.5px] text-zinc-400 mt-1 max-w-xl font-normal leading-relaxed">
                Deterministic zero-trust security layer for Model Context Protocol tools, runtimes, and multi-agent systems.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {/* Connected Status Badge */}
              <div className="flex items-center gap-2 text-[12px] text-zinc-300 font-medium bg-[#0a0c10]/90 border border-white/[0.08] px-3.5 py-1.5 rounded-full backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span>Active Gateway</span>
                <span className="text-zinc-500 font-normal pl-1 border-l border-white/10">
                  {agents.length} runtimes · 3 tools
                </span>
              </div>

              {/* Mode Toggle Switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-white/[0.08] bg-[#0a0c10]/90 backdrop-blur-md">
                <HoverBorderGradient
                  as="button"
                  containerClassName="rounded-xl"
                  className={cn(
                    'px-3 py-1.5 text-[11.5px] font-medium transition-all duration-200',
                    viewMode === 'mcp'
                      ? 'bg-white/15 text-white font-medium shadow-sm'
                      : 'bg-transparent text-zinc-400 hover:text-white'
                  )}
                  highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0) 100%)"
                  onClick={() => setViewMode('mcp')}
                >
                  MCP Security Grid
                </HoverBorderGradient>
                <HoverBorderGradient
                  as="button"
                  containerClassName="rounded-xl"
                  className={cn(
                    'px-3 py-1.5 text-[11.5px] font-medium transition-all duration-200',
                    viewMode === 'aceternity'
                      ? 'bg-white/15 text-white font-medium shadow-sm'
                      : 'bg-transparent text-zinc-400 hover:text-white'
                  )}
                  highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0) 100%)"
                  onClick={() => setViewMode('aceternity')}
                >
                  Aceternity Bento Demo
                </HoverBorderGradient>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'aceternity' ? (
          /* ========================================================================= */
          /* Aceternity Bento Grid Demo Component View                                 */
          /* ========================================================================= */
          <div className="bento-item pt-4">
            <div className="mb-4 text-center">
              <span className="text-xs text-zinc-400 uppercase tracking-widest font-medium">
                Aceternity UI Bento Grid Component Demo
              </span>
            </div>
            <BentoGridDemo />
          </div>
        ) : (
          /* ========================================================================= */
          /* Main MCP Gateway Security Bento Grid Architecture                         */
          /* ========================================================================= */
          <>
            {/* --------------------------------------------------------------------- */}
            {/* Bento Row 1: 4 Stat Counter Cards with CardSpotlight & Top Sheen      */}
            {/* --------------------------------------------------------------------- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: 'CONNECTED RUNTIMES',
                  value: agents.length.toString(),
                  sub: 'Active runtime clients',
                  color: 'text-white',
                  icon: Bot,
                },
                {
                  label: 'PROTECTED TOOLS',
                  value: '3',
                  sub: 'Calendar, Email, Filesystem',
                  color: 'text-white',
                  icon: Wrench,
                },
                {
                  label: 'INSPECTED CALLS',
                  value: callsCount.toLocaleString(),
                  sub: 'Real-time proxy inspection',
                  color: 'text-white',
                  icon: Zap,
                },
                {
                  label: 'CONTAINED THREATS',
                  value: '37',
                  sub: 'Zero-trust mitigations',
                  color: 'text-rose-400',
                  icon: ShieldAlert,
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

            {/* --------------------------------------------------------------------- */}
            {/* Bento Row 2: Centerpiece Security Graph + Live Stream                 */}
            {/* --------------------------------------------------------------------- */}
            <McpSecurityGraph layout="bento" />

            {/* --------------------------------------------------------------------- */}
            {/* Bento Row 3: Protected Tools (7 cols) + Architecture Pipeline (5 cols) */}
            {/* --------------------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left Bento: Protected Tools (7 cols) */}
              <div className="lg:col-span-7">
                <ProtectedTools />
              </div>

              {/* Right Bento: Architecture & Real-Time Pipeline (5 cols) */}
              <CardSpotlight
                className="lg:col-span-5 p-5 flex flex-col justify-between rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20">
                        <Layers className="w-3.5 h-3.5 text-sky-400" />
                      </div>
                      <h3 className="text-[13.5px] font-semibold text-white tracking-tight">
                        Architecture Pipeline
                      </h3>
                    </div>
                    <span className="text-[10.5px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      &lt;1.2ms latency
                    </span>
                  </div>

                  {/* Visual Step-by-Step Flow Pipeline */}
                  <div className="flex flex-wrap items-center gap-1.5 py-2">
                    {[
                      { name: 'Agent', color: 'text-zinc-300' },
                      { name: 'MCP Gateway', color: 'text-sky-300' },
                      { name: 'AgentGuard', color: 'text-emerald-300' },
                      { name: 'Cedar + Risk Engine', color: 'text-zinc-100 font-medium' },
                      { name: 'Decision', color: 'text-sky-300' },
                      { name: 'Tool Exec', color: 'text-zinc-300' },
                    ].map((step, i, arr) => (
                      <span key={step.name} className="flex items-center gap-1.5 text-[11px]">
                        <span className={cn('px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08]', step.color)}>
                          {step.name}
                        </span>
                        {i < arr.length - 1 && (
                          <span className="text-zinc-600 font-bold">→</span>
                        )}
                      </span>
                    ))}
                  </div>

                  <p className="text-[12.5px] text-zinc-400 font-normal leading-relaxed mt-3">
                    Requests flow through the MCP gateway, are deterministically inspected by AgentGuard&apos;s multi-engine security pipeline, and only cryptographically verified actions reach the tool layer.
                  </p>
                </div>

                {/* Bottom Assurance Badges */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11.5px] text-zinc-500">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Deterministic Cedar verification</span>
                  </div>
                  <span>100% audit log trail</span>
                </div>
              </CardSpotlight>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* Bento Row 4: Footer Strip                                             */}
            {/* --------------------------------------------------------------------- */}
            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center gap-2 text-[12.5px] text-zinc-400 font-normal">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Runtime zero-trust security &amp; authorization for Model Context Protocol systems.</span>
              </div>
              <div className="flex items-center gap-4 text-[12px] text-zinc-400">
                <span className="text-emerald-400/90 font-medium">Status: Operational</span>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
