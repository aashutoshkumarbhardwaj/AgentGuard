'use client';

import { useState } from 'react';
import { 
  ShieldCheck, 
  Layout, 
  Repeat, 
  Search, 
  CheckSquare, 
  GitFork, 
  ArrowRight, 
  Terminal, 
  Check, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export function UsecaseBentoGrid() {
  const [activeAudioBar, setActiveAudioBar] = useState(false);

  return (
    <div className="w-full space-y-12">
      {/* Page Title Section matching screenshot */}
      <div className="text-center max-w-4xl mx-auto pt-6 pb-2">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-normal tracking-[-0.035em] text-white leading-[1.06]"
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          DevOps, MCP, Finance, Enterprise.
        </h1>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ========================================================================= */}
        {/* Card 1: Coding & DevOps Agents (Left column, tall card - lg:col-span-6)   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 rounded-2xl bg-[#090a10]/85 border border-white/[0.09] hover:border-white/[0.2] backdrop-blur-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group">
          <div>
            <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors mb-5">
              <ShieldCheck className="w-5 h-5 text-zinc-300" />
            </div>

            <h3 className="text-2xl font-semibold text-white tracking-tight">Coding &amp; DevOps Agents</h3>
            <p className="mt-2 text-[14.5px] text-white/55 leading-relaxed">
              Runtime policy guardrails for autonomous engineering agents. Blocks destructive shell execution, credential exfiltration, and unauthorized repository mutations.
            </p>

            <a
              href="#coding-agents"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white mt-4 transition-colors group/link"
            >
              <span>READ MORE</span>
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Graphic: GitHub Actions + Terminal + MCP Tools */}
          <div className="relative mt-8 pt-4 pb-2">
            <div className="rounded-xl bg-black/80 border border-white/[0.08] p-4 relative overflow-hidden font-mono text-[11px] shadow-2xl">
              {/* Top Hub Connection Wire & Logo */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-[10px] text-white/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span>AGENTGUARD // RUNTIME ROUTING</span>
                </div>
                <span>CEDAR // 0x2A</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                {/* Left: Agent Actions */}
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 space-y-2">
                  <div className="text-white/40 text-[9.5px] flex items-center gap-1">
                    <GitFork className="w-3 h-3 text-white/50" />
                    <span>AGENT ACTIONS</span>
                  </div>
                  <div className="space-y-1.5 text-[10px]">
                    <div className="text-sky-300 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" />
                      <span className="truncate">read_file (ALLOW)</span>
                    </div>
                    <div className="text-white/50 truncate">run_linter (ALLOW)</div>
                    <div className="text-amber-300/80 truncate">deploy_prod (APPROVE)</div>
                    <div className="text-red-400/80 truncate">rm -rf / (BLOCK)</div>
                  </div>
                </div>

                {/* Center: Live Terminal */}
                <div className="rounded-lg bg-[#06070b] border border-sky-400/25 p-3 space-y-1.5 text-[10px] shadow-[0_0_20px_rgba(56,189,248,0.1)]">
                  <div className="flex items-center gap-1 text-white/40 text-[9px] pb-1 border-b border-white/5">
                    <Terminal className="w-2.5 h-2.5 text-sky-400" />
                    <span>Terminal</span>
                  </div>
                  <div className="text-white/80">$ guard.require(&apos;bash&apos;)</div>
                  <div className="text-red-400/90 text-[9px]">BLOCKED: policy deny</div>
                  <div className="text-sky-300">$ guard.authorize(...)</div>
                  <div className="text-white/80">$ risk: LOW (score 12)</div>
                  <div className="text-sky-300 flex items-center gap-1 text-[9.5px]">
                    <Check className="w-2.5 h-2.5" />
                    <span>action allowed (exit 0)</span>
                  </div>
                </div>

                {/* Right: Security Policies */}
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 space-y-2">
                  <div className="text-white/40 text-[9.5px] flex items-center gap-1">
                    <Layers className="w-3 h-3 text-white/50" />
                    <span>SECURITY POLICIES</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-white/60">
                    <div>Least Privilege</div>
                    <div>Secret Masking</div>
                    <div>Safe Shell Only</div>
                    <div>HITL Escalation</div>
                    <div className="text-sky-300 font-semibold">&gt; Cedar Enforced</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Stack: MCP Gateways + Customer Support */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* ======================================================================= */}
          {/* Card 2: MCP Gateways (lg:col-span-6)                                    */}
          {/* ======================================================================= */}
          <div className="rounded-2xl bg-[#090a10]/85 border border-white/[0.09] hover:border-white/[0.2] backdrop-blur-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-sm">
                <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors mb-4">
                  <Layout className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="text-2xl font-semibold text-white tracking-tight">MCP Security Gateways</h3>
                <p className="mt-2 text-[14px] text-white/55 leading-relaxed">
                  Interception proxy for Model Context Protocol tools. Sanitizes schemas, enforces Cedar RBAC, and blocks rogue tool execution.
                </p>
                <a
                  href="#mcp-gateway"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white mt-4 transition-colors group/link"
                >
                  <span>READ MORE</span>
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Graphic: Screen diff inspector */}
              <div className="flex-1 rounded-xl bg-black/80 border border-white/[0.08] p-3.5 font-mono text-[11px] space-y-2">
                <div className="flex items-center justify-between text-[10px] text-white/40 pb-1.5 border-b border-white/5">
                  <span className="text-sky-300">@ Gateway</span>
                  <span>MCP PROXY // PORT 8000</span>
                </div>
                <div className="text-[10.5px]">
                  <span className="text-white/40">Active MCP Clients:</span>
                  <div className="text-white/90 font-medium pl-2">Claude Desktop &amp; Cursor</div>
                </div>
                <div className="text-[10px] text-white/50 pt-1 border-t border-white/5 space-y-0.5">
                  <div className="text-white/35">Gateway Inspection:</div>
                  <div className="text-sky-300 pl-2">tools/list → schema_sanitize</div>
                  <div className="text-white/70 pl-2">tools/call → cedar_evaluate</div>
                  <div className="text-white/70 pl-2">risk_engine → ALLOW (0.4ms)</div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* Card 3: Customer Support & Email (lg:col-span-6)                        */}
          {/* ======================================================================= */}
          <div 
            onMouseEnter={() => setActiveAudioBar(true)}
            onMouseLeave={() => setActiveAudioBar(false)}
            className="rounded-2xl bg-[#090a10]/85 border border-white/[0.09] hover:border-white/[0.2] backdrop-blur-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-sm">
                <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors mb-4">
                  <Repeat className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="text-2xl font-semibold text-white tracking-tight">Customer Support &amp; Email</h3>
                <p className="mt-2 text-[14px] text-white/55 leading-relaxed">
                  Inspects outbound messages and support ticketing actions. Prevents prompt injection jailbreaks, phishing, and customer PII leakage.
                </p>
                <a
                  href="#communication-security"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white mt-4 transition-colors group/link"
                >
                  <span>READ MORE</span>
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Graphic: Live soundwave equalizer */}
              <div className="flex-1 rounded-xl bg-black/80 border border-white/[0.08] p-4 flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                </div>
                
                {/* Audio Wave Bars */}
                <div className="flex items-center gap-1 h-12 px-2">
                  {[24, 40, 16, 48, 32, 20, 44, 28, 52, 36, 18, 42, 26].map((height, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-gradient-to-t from-sky-500 to-white/90 transition-all duration-300"
                      style={{
                        height: activeAudioBar ? `${Math.min(48, height * 1.2)}px` : `${height * 0.7}px`,
                        opacity: activeAudioBar ? 0.95 : 0.6,
                      }}
                    />
                  ))}
                </div>

                <span className="font-mono text-[10px] text-sky-300 font-medium">REALTIME INJECTION SCANNER</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* Card 4: Research & Web Ingestion (Left column, bottom - lg:col-span-6)    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 rounded-2xl bg-[#090a10]/85 border border-white/[0.09] hover:border-white/[0.2] backdrop-blur-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group">
          <div>
            <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors mb-4">
              <Search className="w-5 h-5 text-zinc-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white tracking-tight">Research &amp; Web Ingestion</h3>
            <p className="mt-2 text-[14.5px] text-white/55 leading-relaxed">
              Defends against indirect prompt injection hidden in web pages, PDFs, and scraped documents before agents parse untrusted context into tool calls.
            </p>
            <a
              href="#research-agents"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white mt-4 transition-colors group/link"
            >
              <span>READ MORE</span>
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Graphic: Threat detector metrics */}
          <div className="relative mt-6 rounded-xl bg-black/80 border border-white/[0.08] p-4 font-mono text-[11px] space-y-3">
            <div className="flex items-center justify-between text-[10px] text-white/40 pb-2 border-b border-white/5">
              <span className="text-zinc-300 font-semibold">THREAT DETECTOR</span>
              <span className="text-sky-300">SHIELD_ACTIVE</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                <div className="text-white/40 text-[9.5px]">ATTACKS BLOCKED</div>
                <div className="text-lg font-bold text-white">99.8% INJECTION</div>
              </div>
              <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                <div className="text-white/40 text-[9.5px]">EVALUATION LATENCY</div>
                <div className="text-lg font-bold text-sky-300">&lt; 1.2ms P99</div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Card 5: Financial & Infrastructure Ops (Right column, bottom - lg:col-span-6) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 rounded-2xl bg-[#090a10]/85 border border-white/[0.09] hover:border-white/[0.2] backdrop-blur-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group">
          <div>
            <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors mb-4">
              <CheckSquare className="w-5 h-5 text-zinc-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white tracking-tight">Financial &amp; Infrastructure Ops</h3>
            <p className="mt-2 text-[14.5px] text-white/55 leading-relaxed">
              Automate routine financial queries safely while gating high-value refunds, database writes, and cloud infrastructure changes behind human approval.
            </p>
            <a
              href="#ops-agents"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white mt-4 transition-colors group/link"
            >
              <span>READ MORE</span>
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Graphic: Approval pipeline */}
          <div className="relative mt-6 rounded-xl bg-black/80 border border-white/[0.08] p-4 font-mono text-[11px] space-y-3">
            <div className="flex items-center justify-between text-[10px] text-white/40 pb-2 border-b border-white/5">
              <span>APPROVAL PIPELINE</span>
              <span className="text-sky-300">JIT_GUARDED</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/80 text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Stripe / AWS</span>
              </div>
              <div className="text-white/20">→</div>
              <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/80 text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Risk: HIGH</span>
              </div>
              <div className="text-white/20">→</div>
              <div className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-400/30 text-sky-300 text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                <span>Human Approval</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Card 6: Cryptographic Audit & Compliance (Full width card - lg:col-span-12) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-12 rounded-2xl bg-[#090a10]/85 border border-white/[0.09] hover:border-white/[0.2] backdrop-blur-2xl p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group">
          <div className="max-w-xl">
            <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors mb-4">
              <Activity className="w-5 h-5 text-zinc-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white tracking-tight">Cryptographic Audit &amp; Compliance</h3>
            <p className="mt-2 text-[14.5px] text-white/55 leading-relaxed">
              Every authorization decision, policy evaluation, risk score, and human review is immutably sealed in a SHA-256 Merkle chain for enterprise SOC2, HIPAA, and regulatory compliance.
            </p>
            <a
              href="#audit-ledger"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white mt-4 transition-colors group/link"
            >
              <span>READ MORE</span>
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Graphic: Merkle chain audit log */}
          <div className="w-full md:w-80 rounded-xl bg-black/80 border border-white/[0.08] p-4 font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-[10px] text-white/40 pb-1.5 border-b border-white/5">
              <span className="text-sky-300 font-semibold">AUDIT CHAIN</span>
              <span>SHA-256 TAMPER-PROOF</span>
            </div>
            <div className="flex items-center justify-center py-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-white/[0.05] border border-white/10 text-white/70">Block #1042</span>
                <span className="text-sky-400">→</span>
                <span className="px-2.5 py-1 rounded bg-sky-500/15 border border-sky-400/40 text-sky-200 font-bold shadow-[0_0_12px_rgba(56,189,248,0.3)]">0x8f...e2a</span>
                <span className="text-sky-400">→</span>
                <span className="px-2.5 py-1 rounded bg-white/[0.05] border border-white/10 text-white/70">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
