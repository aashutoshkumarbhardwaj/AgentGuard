import React from "react";
import { Cpu, ShieldCheck, ArrowRight, ArrowDown, Database, Terminal, CheckCircle2, AlertTriangle, XCircle, FileText, UserCheck, Cloud } from "lucide-react";

export default function ArchitectureDiagram() {
  return (
    <section id="architecture" className="py-24 border-b border-slate-800 bg-[#06080E] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3 py-1 font-mono text-xs font-semibold text-emerald-400 mb-3">
            <Cloud className="h-3.5 w-3.5" />
            <span>SYSTEM ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            The AgentGuard Runtime Architecture.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Engineered for Amazon Bedrock agents, autonomous copilots, and custom LLM runtimes. Zero modifications to tool source code required.
          </p>
        </div>

        {/* The Architecture Flow Container */}
        <div className="rounded-2xl border border-slate-800 bg-[#090D18] p-6 sm:p-10 shadow-2xl font-mono text-xs">
          
          <div className="flex flex-col items-center space-y-8">
            
            {/* Layer 1: Autonomous Agent Layer */}
            <div className="w-full max-w-xl rounded-xl border border-cyan-500/30 bg-[#0C1222] p-5 text-center shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2 pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Cpu className="h-4 w-4" />
                  01. AUTONOMOUS AGENT RUNTIME
                </span>
                <span>Amazon Bedrock • Claude 3.5 Sonnet / Haiku</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Agent generates autonomous tool invocation: <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">dispatch_tool(&quot;email.send&quot;, payload)</code>
              </p>
            </div>

            {/* Downward Transition */}
            <div className="flex flex-col items-center">
              <div className="text-[10px] text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 mb-1">
                Tool Call Intercepted at Gateway Hook
              </div>
              <ArrowDown className="h-5 w-5 text-emerald-400" />
            </div>

            {/* Layer 2: AgentGuard Control Plane (Core Box) */}
            <div className="w-full max-w-4xl rounded-2xl border border-emerald-500/40 bg-[#0B1020] p-6 sm:p-8 shadow-2xl glow-emerald">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-emerald-400" />
                  <div>
                    <h3 className="text-white font-bold text-base tracking-wider font-mono">
                      AGENTGUARD RUNTIME CONTROL PLANE
                    </h3>
                    <p className="text-slate-400 text-[11px] font-sans">
                      Deterministic Multi-Engine Policy &amp; Risk Pipeline (&lt; 15ms Latency)
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full shrink-0">
                  ACTIVE IN-LINE GATEWAY
                </span>
              </div>

              {/* 4 Internal Engines Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
                  <span className="text-emerald-400 font-bold block text-xs mb-1">POLICY ENGINE</span>
                  <p className="text-slate-400 font-sans text-[11px]">
                    Cedar policy evaluator enforces least privilege boundaries.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
                  <span className="text-cyan-400 font-bold block text-xs mb-1">RISK ENGINE</span>
                  <p className="text-slate-400 font-sans text-[11px]">
                    Quantitative scoring (0-100) based on target sensitivity &amp; entropy.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
                  <span className="text-amber-400 font-bold block text-xs mb-1">CONTEXT ENGINE</span>
                  <p className="text-slate-400 font-sans text-[11px]">
                    Evaluates user intent, recipient domain, and data classification.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
                  <span className="text-purple-400 font-bold block text-xs mb-1">DECISION ENGINE</span>
                  <p className="text-slate-400 font-sans text-[11px]">
                    Emits deterministic verdict: ALLOW, REQUIRE APPROVAL, or BLOCK.
                  </p>
                </div>
              </div>

              {/* Tri-Verdict Output Branches */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    ALLOW (LOW RISK)
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans">
                    Immediate passthrough to tool endpoint.
                  </span>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-xs mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    APPROVE (MED/HIGH)
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans">
                    Agent paused; human supervisor notified.
                  </span>
                </div>
                <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-red-400 font-bold text-xs mb-1">
                    <XCircle className="h-4 w-4" />
                    BLOCK (CRITICAL)
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans">
                    Halted permanently; incident logged.
                  </span>
                </div>
              </div>
            </div>

            {/* Downward Transition to External Impact */}
            <div className="flex flex-col items-center">
              <ArrowDown className="h-5 w-5 text-slate-600" />
            </div>

            {/* Layer 3: Endpoints & Storage */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                <Terminal className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
                <span className="text-white font-bold block text-xs mb-1">TOOL EXECUTION</span>
                <span className="text-[11px] text-slate-400 font-sans">
                  APIs, Databases, Cloud Infrastructure, Email
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                <UserCheck className="h-5 w-5 text-amber-400 mx-auto mb-2" />
                <span className="text-white font-bold block text-xs mb-1">HUMAN SUPERVISOR</span>
                <span className="text-[11px] text-slate-400 font-sans">
                  Slack Alert, Web Console, PagerDuty Webhook
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                <FileText className="h-5 w-5 text-cyan-400 mx-auto mb-2" />
                <span className="text-white font-bold block text-xs mb-1">AUDIT VAULT</span>
                <span className="text-[11px] text-slate-400 font-sans">
                  SHA-256 Hash Chained S3 &amp; DynamoDB Ledger
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
