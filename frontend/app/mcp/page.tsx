'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Shield, Github, Star, Sparkles, Activity, Layers, Terminal, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { McpSecurityGraph } from '@/components/mcp/security-graph';
import { ProtectedTools } from '@/components/mcp/protected-tools';
import { LiquidBentoCard } from '@/components/mcp/liquid-bento-card';
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
        { opacity: 0, y: 24, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.07,
          duration: 0.75,
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
    <div ref={containerRef} className="relative w-full min-h-screen pb-12 select-none">
      {/* ========================================================================= */}
      {/* Background Layer 1: Ambient Cosmic Radial Glows                          */}
      {/* ========================================================================= */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-[550px] w-[600px] -translate-x-1/2 rounded-full bg-sky-950/20 blur-[150px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[450px] w-[500px] rounded-full bg-emerald-950/15 blur-[140px]" />

      {/* ========================================================================= */}
      {/* Background Layer 2: Authentic Dithered Dot Matrix Texture Overlay         */}
      {/* ========================================================================= */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.45) 0.8px, transparent 0.8px)',
          backgroundSize: '3.5px 3.5px',
        }}
      />

      <div className="relative z-10 space-y-6">
        {/* ========================================================================= */}
        {/* Header Section: Title, Status Beacon & Mode Switcher                     */}
        {/* ========================================================================= */}
        <div className="bento-item flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pt-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/25">
                <Shield className="h-3 w-3 text-emerald-400" strokeWidth={2.4} />
              </div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400/90">
                MCP GATEWAY
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Secure the tool layer
            </h1>
            <p className="text-[13.5px] text-white/50 mt-1 max-w-xl">
              Every AI agent tool call is inspected, risk-scored, and authorized in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Connected Badge */}
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#090b12]/80 backdrop-blur-md px-3.5 py-1.5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[12px] font-medium text-white/90">Connected</span>
              <span className="text-[11px] text-white/40 font-mono pl-1 border-l border-white/10">
                {agents.length} agents · 3 tools · protected
              </span>
            </div>

            {/* View Mode Toggle Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-white/[0.08] bg-black/50 backdrop-blur-md">
              <HoverBorderGradient
                as="button"
                containerClassName="rounded-xl"
                className={cn(
                  'px-3 py-1.5 text-[11px] font-mono transition-all duration-200',
                  viewMode === 'mcp'
                    ? 'bg-white/15 text-white font-medium shadow-sm'
                    : 'bg-transparent text-white/40 hover:text-white/80'
                )}
                highlight="radial-gradient(75% 181% at 50% 50%, #38bdf8 0%, rgba(255, 255, 255, 0) 100%)"
                onClick={() => setViewMode('mcp')}
              >
                MCP Security Grid
              </HoverBorderGradient>
              <HoverBorderGradient
                as="button"
                containerClassName="rounded-xl"
                className={cn(
                  'px-3 py-1.5 text-[11px] font-mono transition-all duration-200',
                  viewMode === 'aceternity'
                    ? 'bg-white/15 text-white font-medium shadow-sm'
                    : 'bg-transparent text-white/40 hover:text-white/80'
                )}
                highlight="radial-gradient(75% 181% at 50% 50%, #38bdf8 0%, rgba(255, 255, 255, 0) 100%)"
                onClick={() => setViewMode('aceternity')}
              >
                Aceternity Bento Demo
              </HoverBorderGradient>
            </div>
          </div>
        </div>

        {viewMode === 'aceternity' ? (
          /* ========================================================================= */
          /* Aceternity Bento Grid Demo Component View                                 */
          /* ========================================================================= */
          <div className="bento-item pt-4">
            <div className="mb-4 text-center">
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
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
            {/* Bento Row 1: 4 Stat Counter Cards with Liquid Glow & Glass             */}
            {/* --------------------------------------------------------------------- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: 'AGENTS',
                  value: agents.length.toString(),
                  sub: 'Active runtime clients',
                  color: 'text-white',
                  glow: 'rgba(56, 189, 248, 0.08)',
                },
                {
                  label: 'TOOLS',
                  value: '3',
                  sub: 'Calendar, Email, Files',
                  color: 'text-white',
                  glow: 'rgba(56, 189, 248, 0.08)',
                },
                {
                  label: 'CALLS',
                  value: callsCount.toLocaleString(),
                  sub: 'Inspected in real time',
                  color: 'text-white',
                  glow: 'rgba(16, 185, 129, 0.08)',
                },
                {
                  label: 'BLOCKED',
                  value: '37',
                  sub: 'Threats mitigated',
                  color: 'text-rose-400',
                  glow: 'rgba(239, 68, 68, 0.08)',
                },
              ].map((stat) => (
                <LiquidBentoCard
                  key={stat.label}
                  glowColor={stat.glow}
                  className="p-4 sm:p-5 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-white/40">
                      {stat.label}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  </div>
                  <div className="mt-3">
                    <p className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-white/40 font-mono mt-1 truncate">
                      {stat.sub}
                    </p>
                  </div>
                </LiquidBentoCard>
              ))}
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* Bento Row 2: Centerpiece Security Graph (8 cols) + Live Stream (4 cols)*/}
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
              <LiquidBentoCard
                className="lg:col-span-5 p-5 flex flex-col justify-between"
                glowColor="rgba(56, 189, 248, 0.08)"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-sky-400" />
                      <h3 className="text-[13px] font-semibold text-white tracking-tight">
                        Architecture Pipeline
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      &lt;1.2ms overhead
                    </span>
                  </div>

                  {/* Visual Step-by-Step Flow Pipeline */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono py-2">
                    {[
                      { name: 'Agent', color: 'text-white/60' },
                      { name: 'MCP Gateway', color: 'text-sky-400' },
                      { name: 'AgentGuard', color: 'text-emerald-400' },
                      { name: 'Policy + Risk + Threat', color: 'text-amber-400' },
                      { name: 'Decision', color: 'text-sky-300' },
                      { name: 'Tool', color: 'text-white/60' },
                    ].map((step, i, arr) => (
                      <span key={step.name} className="flex items-center gap-2">
                        <span className={cn('px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]', step.color)}>
                          {step.name}
                        </span>
                        {i < arr.length - 1 && (
                          <span className="text-white/20 font-bold">→</span>
                        )}
                      </span>
                    ))}
                  </div>

                  <p className="text-[12px] text-white/50 leading-relaxed mt-3">
                    Requests flow through the MCP gateway, are inspected by AgentGuard&apos;s security pipeline, and only permitted actions reach the tool layer.
                  </p>
                </div>

                {/* Bottom Assurance Badges */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/40">
                  <div className="flex items-center gap-1.5 text-emerald-400/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Deterministic policy check</span>
                  </div>
                  <span>100% verifiable trail</span>
                </div>
              </LiquidBentoCard>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* Bento Row 4: Footer Strip                                             */}
            {/* --------------------------------------------------------------------- */}
            <LiquidBentoCard
              className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
              glowColor="rgba(255, 255, 255, 0.05)"
            >
              <div className="flex items-center gap-2 text-[12px] text-white/50">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Runtime security &amp; authorization for the MCP tool layer.</span>
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[12px] font-mono text-white/60 transition-colors hover:text-white"
              >
                <Github className="h-3.5 w-3.5" /> <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" /> 2.4k
              </a>
            </LiquidBentoCard>
          </>
        )}
      </div>
    </div>
  );
}
