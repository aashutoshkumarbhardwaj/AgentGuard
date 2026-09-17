import React from "react";
import { AlertCircle, ArrowDown, Check, X, ShieldAlert, Zap, Layers, Sparkles } from "lucide-react";

export default function ProblemComparison() {
  return (
    <section id="problem" className="py-24 border-b border-slate-800 bg-[#06080E] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title & Framing */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-950/20 px-3 py-1 font-mono text-xs font-semibold text-red-400 mb-3">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>THE ARCHITECTURAL PROBLEM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            AI agents changed the security model.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Traditional application security was designed for deterministic software: static roles, predictable endpoints, and fixed user privileges. Autonomous AI agents completely invalidate these assumptions.
          </p>
        </div>

        {/* Side-by-side Architectural Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Traditional Software Model */}
          <div className="rounded-2xl border border-slate-800 bg-[#0A0D16] p-8 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  TRADITIONAL APPLICATION SECURITY
                </span>
                <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Static &amp; Predictable
                </span>
              </div>

              {/* Execution Flow Diagram */}
              <div className="space-y-3 font-mono text-xs max-w-md mx-auto mb-8">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center text-slate-300">
                  User initiates request
                </div>
                <div className="flex justify-center text-slate-600"><ArrowDown className="h-4 w-4" /></div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center text-slate-300">
                  Hardcoded Application Code
                </div>
                <div className="flex justify-center text-slate-600"><ArrowDown className="h-4 w-4" /></div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center text-slate-300">
                  Static Role-Based Access Control (RBAC)
                </div>
                <div className="flex justify-center text-slate-600"><ArrowDown className="h-4 w-4" /></div>
                <div className="rounded-lg border border-slate-800 bg-emerald-950/20 text-emerald-400 border-emerald-500/20 p-3 text-center font-semibold">
                  Predictable Database / API Action
                </div>
              </div>

              {/* Takeaway bullets */}
              <ul className="space-y-3 text-xs text-slate-400 font-mono">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>The codebase has known, deterministic execution paths.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>Input sanitization prevents standard SQLi / XSS vulnerabilities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>The software never invents new workflows on the fly.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
              Result: Traditional firewalls and IAM roles were sufficient.
            </div>
          </div>

          {/* Card 2: Autonomous AI Agent Dynamic Reality */}
          <div className="rounded-2xl border border-red-500/30 bg-[#0C0F1B] p-8 relative flex flex-col justify-between glow-crimson">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-red-500/20">
                <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  THE AUTONOMOUS AGENT REALITY
                </span>
                <span className="text-xs font-mono text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30 font-semibold">
                  Dynamic &amp; Unpredictable
                </span>
              </div>

              {/* Execution Flow Diagram */}
              <div className="space-y-2.5 font-mono text-xs max-w-md mx-auto mb-8">
                <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 text-center text-slate-300">
                  User prompt: &ldquo;Process my pending customer emails&rdquo;
                </div>
                <div className="flex justify-center text-slate-600"><ArrowDown className="h-3.5 w-3.5" /></div>
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-2.5 text-center text-cyan-300">
                  AI Agent reads external email payload
                </div>
                <div className="flex justify-center text-red-500"><ArrowDown className="h-3.5 w-3.5" /></div>
                <div className="rounded-lg border border-red-500/40 bg-red-950/30 p-2.5 text-center text-red-300 font-semibold animate-pulse">
                  ⚠ MALICIOUS INSTRUCTION HIDDEN IN EMAIL
                </div>
                <div className="flex justify-center text-red-500"><ArrowDown className="h-3.5 w-3.5" /></div>
                <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-2.5 text-center text-red-200">
                  Agent interprets injection as a valid directive
                </div>
                <div className="flex justify-center text-red-500"><ArrowDown className="h-3.5 w-3.5" /></div>
                <div className="rounded-lg border border-red-500 bg-red-950/40 text-red-300 p-2.5 text-center font-bold">
                  💥 Agent invokes `file.read()` and `email.send(attacker)`
                </div>
              </div>

              {/* Takeaway bullets */}
              <ul className="space-y-3 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>The agent dynamically decides which tool to call next based on untrusted content.</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>The user never explicitly authorized the agent&apos;s malicious secondary actions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Existing IAM gave the agent API access, so AWS/APIs happily execute the tool!</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-red-500/20 text-[11px] text-red-300 font-mono font-semibold">
              The fatal flaw: Capability alone is not authority. Organizations need a control plane.
            </div>
          </div>

        </div>

        {/* Bottom Banner Callout */}
        <div className="mt-12 rounded-xl border border-slate-800 bg-[#090D18] p-6 text-center max-w-4xl mx-auto">
          <p className="font-mono text-sm text-slate-300">
            <span className="text-emerald-400 font-bold">The AgentGuard Solution:</span> Introduce a runtime control layer between the AI agent and the tool execution boundary. The agent can suggest whatever tool it wants; AgentGuard decides whether it is permitted.
          </p>
        </div>

      </div>
    </section>
  );
}
