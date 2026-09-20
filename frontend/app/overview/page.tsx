'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Bot,
  Activity,
  ShieldCheck,
  Lock,
  Zap,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Radio,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { agents } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function OverviewPage() {
  return (
    <div className="relative w-full space-y-10 pb-20 font-memorable select-none">
      {/* Subtle Ambient Radial Lighting */}
      <div className="pointer-events-none absolute -top-20 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-slate-900/30 blur-[160px]" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[450px] w-[450px] rounded-full bg-blue-950/15 blur-[150px]" />

      <div className="relative z-10 space-y-10">
        {/* Header - Minimalist, Executive Typography */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
                AgentGuard // Control Plane
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              System Overview
            </h1>
            <p className="text-[14.5px] text-zinc-400 mt-1 max-w-2xl font-normal leading-relaxed">
              Continuous runtime inspection, threat mitigation, and cryptographic policy enforcement across AI agent tool invocations.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0a0c10]/90 backdrop-blur-md px-3.5 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[12px] font-medium text-zinc-300">All Systems Operational</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Section 1: Fleet & Execution Telemetry (3 Luxury Bento Cards)              */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="text-[10.5px] font-medium uppercase tracking-wider text-zinc-500">
                01
              </span>
              <span className="text-zinc-600 text-xs">•</span>
              <h2 className="text-[15px] font-semibold text-white tracking-tight">
                Runtime Posture &amp; Authorization
              </h2>
            </div>
            <span className="text-xs text-zinc-500 font-normal">3 metrics online</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <CardSpotlight className="p-6 flex flex-col justify-between min-h-[220px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    <Bot className="h-4.5 w-4.5 text-zinc-300" strokeWidth={2.2} />
                  </div>
                  <span className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                    3 ACTIVE
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight mt-4">Agent Fleet</h3>
                <p className="text-[13.5px] text-zinc-400 mt-1 leading-relaxed font-normal">
                  Research, support, and external agent runtimes connected via secure MCP gateway.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
                <span>0 Quarantined</span>
                <span className="text-zinc-300 font-medium">100% Health</span>
              </div>
            </CardSpotlight>

            {/* Card 2 */}
            <CardSpotlight className="p-6 flex flex-col justify-between min-h-[220px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    <Activity className="h-4.5 w-4.5 text-zinc-300" strokeWidth={2.2} />
                  </div>
                  <span className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                    99.6% ALLOWED
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight mt-4">Tool Call Stream</h3>
                <p className="text-[13.5px] text-zinc-400 mt-1 leading-relaxed font-normal">
                  8,492 tool calls evaluated in real time. 37 anomalous or malicious actions blocked.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
                <span>37 Blocked Attacks</span>
                <span className="text-zinc-300 font-medium">Real-Time Scoring</span>
              </div>
            </CardSpotlight>

            {/* Card 3 */}
            <CardSpotlight className="p-6 flex flex-col justify-between min-h-[220px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    <Zap className="h-4.5 w-4.5 text-zinc-300" strokeWidth={2.2} />
                  </div>
                  <span className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                    &lt;1.2MS P99
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight mt-4">Inspection Latency</h3>
                <p className="text-[13.5px] text-zinc-400 mt-1 leading-relaxed font-normal">
                  Zero bottleneck edge evaluation with local token cache and parallel heuristic rules.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
                <span>Deterministic Check</span>
                <span className="text-zinc-300 font-medium">Zero Lag</span>
              </div>
            </CardSpotlight>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Section 2: Security & Threat Guard (3 Luxury Bento Cards)                  */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="text-[10.5px] font-medium uppercase tracking-wider text-zinc-500">
                02
              </span>
              <span className="text-zinc-600 text-xs">•</span>
              <h2 className="text-[15px] font-semibold text-white tracking-tight">
                Security Layers &amp; Policy Boundaries
              </h2>
            </div>
            <span className="text-xs text-zinc-500 font-normal">Continuous enforcement</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <CardSpotlight className="p-6 flex flex-col justify-between min-h-[220px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    <ShieldCheck className="h-4.5 w-4.5 text-zinc-300" strokeWidth={2.2} />
                  </div>
                  <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-zinc-400">
                    LAYER 1
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight mt-4">Prompt Injection Defense</h3>
                <p className="text-[13.5px] text-zinc-400 mt-1 leading-relaxed font-normal">
                  Deep inspection of agent reasoning traces to block indirect prompt injections before tool firing.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
                <span>Vector + Lexical</span>
                <span className="text-emerald-400 font-medium">Active</span>
              </div>
            </CardSpotlight>

            {/* Card 2 */}
            <CardSpotlight className="p-6 flex flex-col justify-between min-h-[220px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    <Lock className="h-4.5 w-4.5 text-zinc-300" strokeWidth={2.2} />
                  </div>
                  <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-zinc-400">
                    LAYER 2
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight mt-4">Data Exfiltration Guard</h3>
                <p className="text-[13.5px] text-zinc-400 mt-1 leading-relaxed font-normal">
                  Prevents unauthorized egress of sensitive API credentials, customer PII, and system tokens.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
                <span>Payload Redaction</span>
                <span className="text-emerald-400 font-medium">Active</span>
              </div>
            </CardSpotlight>

            {/* Card 3 */}
            <CardSpotlight className="p-6 flex flex-col justify-between min-h-[220px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    <FileCheck className="h-4.5 w-4.5 text-zinc-300" strokeWidth={2.2} />
                  </div>
                  <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-zinc-400">
                    LAYER 3
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight mt-4">Privilege Boundaries</h3>
                <p className="text-[13.5px] text-zinc-400 mt-1 leading-relaxed font-normal">
                  Strict tool-level scopes and sandboxing ensuring read-only agents cannot perform destructive edits.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
                <span>RBAC Policy</span>
                <span className="text-emerald-400 font-medium">Enforced</span>
              </div>
            </CardSpotlight>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Section 3: Approvals & Human Governance (3 Luxury Bento Cards + Buttons)   */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="text-[10.5px] font-medium uppercase tracking-wider text-zinc-500">
                03
              </span>
              <span className="text-zinc-600 text-xs">•</span>
              <h2 className="text-[15px] font-semibold text-white tracking-tight">
                Approvals &amp; Cryptographic Audit
              </h2>
            </div>
            <Link href="/approvals">
              <HoverBorderGradient
                as="div"
                containerClassName="rounded-xl"
                className="bg-[#0e1118] text-zinc-300 hover:text-white text-[11.5px] font-medium px-3.5 py-1.5 flex items-center gap-1.5"
                highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
              >
                <span>View Approval Center</span>
                <ArrowRight className="w-3 h-3" />
              </HoverBorderGradient>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <CardSpotlight className="p-6 flex flex-col justify-between min-h-[220px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    <ShieldCheck className="h-4.5 w-4.5 text-zinc-300" strokeWidth={2.2} />
                  </div>
                  <span className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                    SIGN-OFF NEEDED
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight mt-4">Pending Approvals</h3>
                <p className="text-[13.5px] text-zinc-400 mt-1 leading-relaxed font-normal">
                  High-risk actions paused for manual verification before write or send privileges are authorized.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
                <span>Actions in Queue</span>
                <Link href="/approvals" className="text-zinc-300 hover:text-white font-medium flex items-center gap-1">
                  <span>Review</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardSpotlight>

            {/* Card 2 */}
            <CardSpotlight className="p-6 flex flex-col justify-between min-h-[220px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    <CheckCircle2 className="h-4.5 w-4.5 text-zinc-300" strokeWidth={2.2} />
                  </div>
                  <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-zinc-400">
                    SHA-256
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight mt-4">Verifiable Audit Trail</h3>
                <p className="text-[13.5px] text-zinc-400 mt-1 leading-relaxed font-normal">
                  Every tool call, permission evaluation, and risk score sealed in a tamper-proof cryptographic ledger.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
                <span>100% Traceability</span>
                <Link href="/audit" className="text-zinc-300 hover:text-white font-medium flex items-center gap-1">
                  <span>Audit Logs</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardSpotlight>

            {/* Card 3 */}
            <CardSpotlight className="p-6 flex flex-col justify-between min-h-[220px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    <Radio className="h-4.5 w-4.5 text-zinc-300" strokeWidth={2.2} />
                  </div>
                  <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-zinc-400">
                    SANDBOX
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight mt-4">Simulator Sandbox</h3>
                <p className="text-[13.5px] text-zinc-400 mt-1 leading-relaxed font-normal">
                  Simulate complex attack vectors and benchmark agent behaviors against custom policy rulesets.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-normal">
                <span>Shadow Mode</span>
                <Link href="/simulator" className="text-zinc-300 hover:text-white font-medium flex items-center gap-1">
                  <span>Launch Simulator</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardSpotlight>
          </div>
        </div>
      </div>
    </div>
  );
}
