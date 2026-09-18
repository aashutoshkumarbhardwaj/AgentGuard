import React from "react";
import { AlertCircle, ArrowDown, Check, X, ShieldAlert, Zap, Layers, Sparkles } from "lucide-react";

export default function ProblemComparison() {
  return (
    <section id="problem" className="py-24 border-b border-white/[0.08] bg-[#09090B] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title & Framing */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300 mb-3">
            <AlertCircle className="h-3.5 w-3.5 text-zinc-400" />
            <span>THE ARCHITECTURAL SECURITY GAP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Autonomous agents changed the threat landscape.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
            Traditional application security was architected for deterministic software: static roles, predictable endpoints, and fixed user permissions. Autonomous AI agents completely invalidate these assumptions.
          </p>
        </div>

        {/* Side-by-side Architectural Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Traditional Software Model */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950 p-8 relative flex flex-col justify-between glass-panel">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
                <span className="text-xs uppercase tracking-wider text-zinc-300 font-semibold font-mono">
                  TRADITIONAL APPLICATION SECURITY
                </span>
                <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-white/[0.06]">
                  Deterministic &amp; Static
                </span>
              </div>

              {/* Execution Flow Diagram */}
              <div className="space-y-3 font-mono text-xs max-w-md mx-auto mb-8">
                <div className="rounded-lg border border-white/[0.06] bg-zinc-900/60 p-3 text-center text-zinc-300">
                  User initiates predefined request
                </div>
                <div className="flex justify-center text-zinc-600"><ArrowDown className="h-4 w-4" /></div>
                <div className="rounded-lg border border-white/[0.06] bg-zinc-900/60 p-3 text-center text-zinc-300">
                  Hardcoded Application Code
                </div>
                <div className="flex justify-center text-zinc-600"><ArrowDown className="h-4 w-4" /></div>
                <div className="rounded-lg border border-white/[0.06] bg-zinc-900/60 p-3 text-center text-zinc-300">
                  Static Role-Based Access Control (RBAC)
                </div>
                <div className="flex justify-center text-zinc-600"><ArrowDown className="h-4 w-4" /></div>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 p-3 text-center font-medium">
                  Predictable Database / API Action
                </div>
              </div>

              {/* Takeaway bullets */}
              <ul className="space-y-3 text-xs text-zinc-400 font-sans">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                  <span>The codebase has known, strictly deterministic execution paths.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                  <span>Input sanitization mitigates standard SQLi and XSS vulnerabilities.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                  <span>The application logic never dynamically orchestrates new workflows.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] text-[11px] text-zinc-500 font-mono">
              Outcome: Traditional network firewalls and IAM roles were sufficient.
            </div>
          </div>

          {/* Card 2: Autonomous AI Agent Dynamic Reality */}
          <div className="rounded-2xl border border-rose-500/20 bg-zinc-950 p-8 relative flex flex-col justify-between glass-panel">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-500/20">
                <span className="text-xs uppercase tracking-wider text-rose-300 font-semibold font-mono flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  THE AUTONOMOUS AGENT REALITY
                </span>
                <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-medium">
                  Dynamic &amp; Non-Deterministic
                </span>
              </div>

              {/* Execution Flow Diagram */}
              <div className="space-y-2.5 font-mono text-xs max-w-md mx-auto mb-8">
                <div className="rounded-lg border border-white/[0.06] bg-zinc-900/60 p-2.5 text-center text-zinc-300">
                  User prompt: &ldquo;Process my pending customer emails&rdquo;
                </div>
                <div className="flex justify-center text-zinc-600"><ArrowDown className="h-3.5 w-3.5" /></div>
                <div className="rounded-lg border border-white/[0.08] bg-zinc-900/80 p-2.5 text-center text-zinc-300">
                  Agent ingests untrusted external email content
                </div>
                <div className="flex justify-center text-rose-500"><ArrowDown className="h-3.5 w-3.5" /></div>
                <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-2.5 text-center text-rose-300 font-semibold">
                  ADVERSARIAL INJECTION HIDDEN IN BODY
                </div>
                <div className="flex justify-center text-rose-500"><ArrowDown className="h-3.5 w-3.5" /></div>
                <div className="rounded-lg border border-rose-500/20 bg-zinc-900/80 p-2.5 text-center text-zinc-300">
                  Agent reasoning treats injection as system command
                </div>
                <div className="flex justify-center text-rose-500"><ArrowDown className="h-3.5 w-3.5" /></div>
                <div className="rounded-lg border border-rose-500/40 bg-rose-500/20 text-rose-200 p-2.5 text-center font-bold">
                  💥 Agent schedules `database.read()` &amp; `email.send(attacker)`
                </div>
              </div>

              {/* Takeaway bullets */}
              <ul className="space-y-3 text-xs text-zinc-300 font-sans">
                <li className="flex items-start gap-2.5">
                  <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>The agent dynamically chooses which API to call next based on untrusted data.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>The user never authorized destructive or exfiltrative secondary tool dispatches.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Because the agent holds valid IAM credentials, the target APIs execute without objection.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-rose-500/20 text-[11px] text-rose-300 font-mono">
              The fundamental flaw: Capability is not authorization. Organizations need an active gateway.
            </div>
          </div>

        </div>

        {/* Bottom Solution Summary */}
        <div className="mt-12 rounded-xl border border-white/[0.08] bg-zinc-950 p-6 text-center max-w-4xl mx-auto glass-panel">
          <p className="text-sm text-zinc-300 leading-relaxed font-sans">
            <strong className="text-white font-semibold">The Architectural Solution:</strong> Insert an in-line security control gateway between the AI agent and the tool execution boundary. The agent may request any action; AgentGuard deterministically decides whether it executes.
          </p>
        </div>

      </div>
    </section>
  );
}
