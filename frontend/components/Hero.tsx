"use client";

import React, { useState, useRef } from "react";
import { Shield, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Terminal, Cpu, Play, Sparkles } from "lucide-react";
import BorderBeam from "@/components/ui/BorderBeam";
import TextShimmer from "@/components/ui/TextShimmer";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"blocked" | "approved" | "allowed">("blocked");
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Perspective Tilt Physics on Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / (rect.height / 2)) * -6; // max 6 deg
    const tiltY = (x / (rect.width / 2)) * 6;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/60 bg-grid-pattern">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-gradient pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Pill Badge with Shimmer */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-1.5 font-mono text-xs font-medium text-emerald-300 backdrop-blur-sm mb-6 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <TextShimmer className="font-semibold">AI AGENT SECURITY • RUNTIME CONTROL LAYER</TextShimmer>
            </div>

            {/* Main Punchy Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6 font-sans">
              Give AI agents autonomy.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Not unlimited authority.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mb-8 font-normal">
              AgentGuard sits between autonomous AI agents and the tools they access. It evaluates every action against deterministic security policies, assesses context risk, requests human approval, and halts unauthorized execution in real time.
            </p>

            {/* Core Philosophy Callout */}
            <div className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-950/70 p-4 mb-8 font-mono text-xs text-slate-400 flex items-center gap-3 shadow-inner">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shrink-0"></div>
              <span>
                <strong className="text-white font-semibold">Core Philosophy:</strong> AI can decide what it wants to do. AgentGuard decides what it is allowed to do.
              </span>
            </div>

            {/* CTA Buttons with Glowing Borders */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href="#live-interceptor"
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/40"
              >
                <Terminal className="h-4 w-4 transition-transform group-hover:scale-110" />
                Explore Live Interceptor
              </a>
              <a
                href="#architecture"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-sm transition-all hover:border-slate-500 hover:bg-slate-800 hover:text-white"
              >
                View Architecture
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </a>
              <a
                href="#attack-demo"
                className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-950/20 px-5 py-3.5 text-sm font-mono font-semibold text-red-300 transition-all hover:border-red-500/60 hover:bg-red-950/40"
              >
                <Play className="h-3.5 w-3.5 fill-current text-red-400" />
                Simulate Injection Attack
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-10 grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 w-full max-w-xl">
              <div>
                <div className="font-mono text-2xl font-bold text-white">&lt; 15ms</div>
                <div className="text-xs text-slate-400">Policy Evaluation Latency</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-emerald-400">100%</div>
                <div className="text-xs text-slate-400">Deterministic Tool Intercept</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-cyan-400">SHA-256</div>
                <div className="text-xs text-slate-400">Hash-Chained Audit Ledger</div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Real-time Interceptor Visual with 3D Tilt & Border Beam */}
          <div className="lg:col-span-5">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transition: "transform 0.15s ease-out" }}
              className="relative rounded-2xl border border-slate-800 bg-[#0A0E18] shadow-2xl overflow-hidden scanline-overlay"
            >
              {/* 21st.dev Laser Border Beam Effect */}
              <BorderBeam
                size={250}
                duration={8}
                colorFrom="#10B981"
                colorTo="#06B6D4"
                borderWidth={2}
              />

              {/* Window Titlebar */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-[#070A12] px-4 py-2.5 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
                  <span className="text-slate-400 ml-2 font-mono">agentguard-interceptor.sys</span>
                </div>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  ACTIVE HOOK
                </span>
              </div>

              {/* Interactive Scenario Tabs */}
              <div className="grid grid-cols-3 border-b border-slate-800 bg-[#0D1220] p-1 font-mono text-xs">
                <button
                  onClick={() => setActiveTab("blocked")}
                  className={`py-1.5 text-center rounded transition-all ${
                    activeTab === "blocked"
                      ? "bg-red-950/60 text-red-300 border border-red-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Destructive Deletion
                </button>
                <button
                  onClick={() => setActiveTab("approved")}
                  className={`py-1.5 text-center rounded transition-all ${
                    activeTab === "approved"
                      ? "bg-amber-950/60 text-amber-300 border border-amber-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  External Email
                </button>
                <button
                  onClick={() => setActiveTab("allowed")}
                  className={`py-1.5 text-center rounded transition-all ${
                    activeTab === "allowed"
                      ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Read Calendar
                </button>
              </div>

              {/* Body: Visual Tool Interception Pipeline */}
              <div className="p-5 font-mono text-xs space-y-4">
                
                {/* Source Agent Box */}
                <div className="rounded-lg border border-slate-800 bg-[#06080E] p-3.5">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <Cpu className="h-3.5 w-3.5" />
                      AUTONOMOUS AGENT
                    </span>
                    <span className="text-slate-500">Bedrock Claude-3.5-Sonnet</span>
                  </div>
                  <div className="text-slate-200 bg-slate-900/80 p-2 rounded border border-slate-800 text-[11px] font-mono">
                    {activeTab === "blocked" && (
                      <span className="text-red-300">
                        agent.dispatch_tool(&quot;file.delete&quot;, target=&quot;/var/db/customer_vault.sqlite&quot;)
                      </span>
                    )}
                    {activeTab === "approved" && (
                      <span className="text-amber-300">
                        agent.dispatch_tool(&quot;email.send&quot;, to=&quot;competitor-eval@external.org&quot;, attachment=&quot;q3_financials.xlsx&quot;)
                      </span>
                    )}
                    {activeTab === "allowed" && (
                      <span className="text-emerald-300">
                        agent.dispatch_tool(&quot;calendar.read&quot;, range=&quot;today&quot;, user=&quot;alice@company.internal&quot;)
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow Interception Downward */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-0.5 text-[10px] text-slate-400">
                    <span>Tool invocation intercepted</span>
                    <ArrowRight className="h-3 w-3 rotate-90 text-emerald-400" />
                  </div>
                </div>

                {/* AgentGuard Engine Decision Box */}
                <div className={`rounded-xl border p-4 transition-all ${
                  activeTab === "blocked" 
                    ? "border-red-500/40 bg-red-950/20 glow-crimson" 
                    : activeTab === "approved"
                    ? "border-amber-500/40 bg-amber-950/20 glow-amber"
                    : "border-emerald-500/40 bg-emerald-950/20 glow-emerald"
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield className={`h-4 w-4 ${
                        activeTab === "blocked" ? "text-red-400" : activeTab === "approved" ? "text-amber-400" : "text-emerald-400"
                      }`} />
                      <span className="font-bold text-white tracking-wider">AGENTGUARD RUNTIME GATEWAY</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Cedar Policy v2.4</span>
                  </div>

                  {/* Grid Specs */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">EVALUATION RISK</span>
                      <span className={`font-bold ${
                        activeTab === "blocked" ? "text-red-400" : activeTab === "approved" ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        {activeTab === "blocked" && "CRITICAL (Score: 98/100)"}
                        {activeTab === "approved" && "MEDIUM (Score: 56/100)"}
                        {activeTab === "allowed" && "LOW (Score: 08/100)"}
                      </span>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">POLICY ENFORCEMENT</span>
                      <span className={`font-bold ${
                        activeTab === "blocked" ? "text-red-400" : activeTab === "approved" ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        {activeTab === "blocked" && "RULE: POL-IMMUTABLE-DATA"}
                        {activeTab === "approved" && "RULE: POL-EXTERNAL-GATE"}
                        {activeTab === "allowed" && "RULE: POL-LEAST-PRIVILEGE"}
                      </span>
                    </div>
                  </div>

                  {/* LLM Explanation Text (Non-Decision Maker) */}
                  <div className="text-[11px] text-slate-300 bg-slate-950/80 p-2 rounded border border-slate-800 mb-3">
                    <span className="text-cyan-400 font-semibold block text-[10px]">EXPLANATION:</span>
                    {activeTab === "blocked" && "Destructive volume deletion intercepted. Autonomous agents are prohibited from modifying root filesystem storage."}
                    {activeTab === "approved" && "Agent attempted outbound email transmission with attachment to external domain. Paused awaiting admin sign-off."}
                    {activeTab === "allowed" && "Read-only calendar access within internal organizational perimeter conforms to least privilege."}
                  </div>

                  {/* Final Decision Banner */}
                  <div className={`flex items-center justify-between p-2.5 rounded font-bold tracking-wider ${
                    activeTab === "blocked"
                      ? "bg-red-500/20 text-red-300 border border-red-500/40"
                      : activeTab === "approved"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  }`}>
                    <span className="flex items-center gap-1.5">
                      {activeTab === "blocked" && <XCircle className="h-4 w-4 text-red-400" />}
                      {activeTab === "approved" && <AlertTriangle className="h-4 w-4 text-amber-400" />}
                      {activeTab === "allowed" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      {activeTab === "blocked" && "FINAL DECISION: BLOCK"}
                      {activeTab === "approved" && "FINAL DECISION: REQUIRE APPROVAL"}
                      {activeTab === "allowed" && "FINAL DECISION: ALLOW"}
                    </span>
                    <span className="text-[10px] font-mono opacity-80">LATENCY: 8ms</span>
                  </div>
                </div>

                {/* Audit Hash Chained Footer */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                  <span>Audit Hash: <code className="text-slate-400">e501b8...ac09</code></span>
                  <span className="text-emerald-400 font-bold">✓ Cryptographically Chained</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
