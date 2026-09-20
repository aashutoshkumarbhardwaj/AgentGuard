'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Bot,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Zap,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Radio,
} from 'lucide-react';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { agents } from '@/lib/mock-data';

export default function OverviewPage() {
  const [activeMetric] = useState('realtime');

  return (
    <div className="relative w-full space-y-10 pb-16 font-memorable select-none">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute -top-16 left-1/3 h-[500px] w-[550px] -translate-x-1/2 rounded-full bg-sky-950/20 blur-[150px]" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[450px] w-[500px] rounded-full bg-blue-950/15 blur-[140px]" />

      {/* Dithered Matrix Texture Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.45) 0.8px, transparent 0.8px)',
          backgroundSize: '3.5px 3.5px',
        }}
      />

      <div className="relative z-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-sky-500/10 border border-sky-500/30">
                <Shield className="h-3 w-3 text-sky-400" strokeWidth={2.4} />
              </div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-sky-400">
                AGENTGUARD // CONTROL PLANE
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              System Overview
            </h1>
            <p className="text-[15px] text-white/50 mt-1 max-w-2xl">
              Continuous runtime inspection, threat mitigation, and policy enforcement across AI agent tool invocations.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#090b12]/80 backdrop-blur-md px-3.5 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
            </span>
            <span className="text-[12px] font-medium text-white/90">All Systems Operational</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Section 1: Fleet & Execution Telemetry (3 CardSpotlight Cards)            */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-sky-400 uppercase font-semibold tracking-wider">
                01 // FLEET TELEMETRY
              </span>
              <span className="text-white/30 text-xs">•</span>
              <h2 className="text-[16px] font-semibold text-white tracking-tight">
                Runtime Posture &amp; Authorization
              </h2>
            </div>
            <span className="text-xs text-white/40 font-mono">3 metrics online</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <CardSpotlight className="p-6 sm:p-7 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/25">
                    <Bot className="h-4.5 w-4.5 text-sky-400" />
                  </div>
                  <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300">
                    3 ACTIVE
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mt-4">Agent Fleet</h3>
                <p className="text-[14px] text-white/55 mt-1 leading-relaxed">
                  Research, support, and external agent runtimes connected via secure MCP gateway.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
                <span>0 Quarantined</span>
                <span className="text-sky-400">100% Health</span>
              </div>
            </CardSpotlight>

            {/* Card 2 */}
            <CardSpotlight className="p-6 sm:p-7 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/25">
                    <Activity className="h-4.5 w-4.5 text-sky-400" />
                  </div>
                  <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300">
                    99.6% ALLOWED
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mt-4">Tool Call Stream</h3>
                <p className="text-[14px] text-white/55 mt-1 leading-relaxed">
                  8,492 tool calls evaluated in real time. 37 anomalous or malicious actions blocked.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
                <span>37 Blocked Attacks</span>
                <span className="text-sky-400">Real-Time Risk Scoring</span>
              </div>
            </CardSpotlight>

            {/* Card 3 */}
            <CardSpotlight className="p-6 sm:p-7 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/25">
                    <Zap className="h-4.5 w-4.5 text-sky-400" />
                  </div>
                  <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300">
                    &lt;1.2MS P99
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mt-4">Inspection Latency</h3>
                <p className="text-[14px] text-white/55 mt-1 leading-relaxed">
                  Zero bottleneck edge evaluation with local token cache and parallel heuristic rules.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
                <span>Deterministic Check</span>
                <span className="text-sky-400">Zero Execution Lag</span>
              </div>
            </CardSpotlight>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Section 2: Security & Threat Guard (3 CardSpotlight Cards)                */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-sky-400 uppercase font-semibold tracking-wider">
                02 // THREAT MITIGATION
              </span>
              <span className="text-white/30 text-xs">•</span>
              <h2 className="text-[16px] font-semibold text-white tracking-tight">
                Security Layers &amp; Policy Boundaries
              </h2>
            </div>
            <span className="text-xs text-white/40 font-mono">Continuous enforcement</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <CardSpotlight className="p-6 sm:p-7 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/25">
                    <ShieldCheck className="h-4.5 w-4.5 text-sky-400" />
                  </div>
                  <span className="text-[10.5px] font-mono text-white/40">LAYER 1</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mt-4">Prompt Injection Defense</h3>
                <p className="text-[14px] text-white/55 mt-1 leading-relaxed">
                  Deep inspection of agent reasoning traces to block indirect prompt injections before tool firing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
                <span>Vector + Lexical</span>
                <span className="text-sky-400">Active</span>
              </div>
            </CardSpotlight>

            {/* Card 2 */}
            <CardSpotlight className="p-6 sm:p-7 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/25">
                    <Lock className="h-4.5 w-4.5 text-sky-400" />
                  </div>
                  <span className="text-[10.5px] font-mono text-white/40">LAYER 2</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mt-4">Data Exfiltration Guard</h3>
                <p className="text-[14px] text-white/55 mt-1 leading-relaxed">
                  Prevents unauthorized egress of sensitive API credentials, customer PII, and system tokens.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
                <span>Payload Redaction</span>
                <span className="text-sky-400">Active</span>
              </div>
            </CardSpotlight>

            {/* Card 3 */}
            <CardSpotlight className="p-6 sm:p-7 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/25">
                    <FileCheck className="h-4.5 w-4.5 text-sky-400" />
                  </div>
                  <span className="text-[10.5px] font-mono text-white/40">LAYER 3</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mt-4">Privilege Boundaries</h3>
                <p className="text-[14px] text-white/55 mt-1 leading-relaxed">
                  Strict tool-level scopes and sandboxing ensuring read-only agents cannot perform destructive edits.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
                <span>RBAC Policy</span>
                <span className="text-sky-400">Enforced</span>
              </div>
            </CardSpotlight>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Section 3: Approvals & Human-in-the-Loop (3 CardSpotlight Cards)          */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-sky-400 uppercase font-semibold tracking-wider">
                03 // HUMAN GOVERNANCE
              </span>
              <span className="text-white/30 text-xs">•</span>
              <h2 className="text-[16px] font-semibold text-white tracking-tight">
                Approvals &amp; Cryptographic Audit
              </h2>
            </div>
            <Link
              href="/approvals"
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono transition-colors"
            >
              <span>View Approval Center</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <CardSpotlight className="p-6 sm:p-7 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/25">
                    <ShieldCheck className="h-4.5 w-4.5 text-sky-400" />
                  </div>
                  <span className="text-[10.5px] font-mono text-sky-300">ACTION REQUIRED</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mt-4">Pending Approvals</h3>
                <p className="text-[14px] text-white/55 mt-1 leading-relaxed">
                  High-risk actions paused for manual verification before write or send privileges are authorized.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
                <span className="text-amber-400">2 Pending Review</span>
                <Link href="/approvals" className="text-sky-400 hover:underline">
                  Review &rarr;
                </Link>
              </div>
            </CardSpotlight>

            {/* Card 2 */}
            <CardSpotlight className="p-6 sm:p-7 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/25">
                    <CheckCircle2 className="h-4.5 w-4.5 text-sky-400" />
                  </div>
                  <span className="text-[10.5px] font-mono text-white/40">SHA-256</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mt-4">Verifiable Audit Trail</h3>
                <p className="text-[14px] text-white/55 mt-1 leading-relaxed">
                  Every tool call, permission evaluation, and risk score sealed in a tamper-proof cryptographic ledger.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
                <span>100% Traceability</span>
                <Link href="/audit" className="text-sky-400 hover:underline">
                  Audit Logs &rarr;
                </Link>
              </div>
            </CardSpotlight>

            {/* Card 3 */}
            <CardSpotlight className="p-6 sm:p-7 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/25">
                    <Radio className="h-4.5 w-4.5 text-sky-400" />
                  </div>
                  <span className="text-[10.5px] font-mono text-sky-300">SANDBOX</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mt-4">Simulator Sandbox</h3>
                <p className="text-[14px] text-white/55 mt-1 leading-relaxed">
                  Simulate complex attack vectors and benchmark agent behaviors against custom policy rulesets.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
                <span>Shadow Mode</span>
                <Link href="/simulator" className="text-sky-400 hover:underline">
                  Launch Simulator &rarr;
                </Link>
              </div>
            </CardSpotlight>
          </div>
        </div>
      </div>
    </div>
  );
}
