import React from "react";
import { XCircle, CheckCircle2, Shield, ArrowDown, ArrowRight, Brain, AlertTriangle } from "lucide-react";

export default function DeterministicSecurity() {
  return (
    <section className="py-24 border-b border-slate-800 bg-[#070A12] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-3 py-1 font-mono text-xs font-semibold text-cyan-400 mb-3">
            <Brain className="h-3.5 w-3.5" />
            <span>CRITICAL PHILOSOPHY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            The LLM is NOT the security authority.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Asking an LLM to decide whether its own action is safe is an architectural fallacy. LLMs hallucinate, suffer jailbreaks, and can be prompt-manipulated. AgentGuard separates decision from explanation.
          </p>
        </div>

        {/* Side-by-side Visual Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Flawed LLM-Self-Policing Model */}
          <div className="rounded-2xl border border-red-500/30 bg-[#0B0D18] p-8 font-mono text-xs relative">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-red-500/20">
              <span className="text-red-400 font-bold tracking-wider flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                THE FLAWED APPROACH: LLM SELF-POLICING
              </span>
              <span className="text-[10px] text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                Vulnerable to Jailbreaks
              </span>
            </div>

            <div className="space-y-3 max-w-md mx-auto mb-6">
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900 text-center text-slate-300">
                AI Agent generates tool call
              </div>
              <div className="flex justify-center text-slate-600"><ArrowDown className="h-4 w-4" /></div>
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900 text-center text-slate-300">
                Secondary LLM Prompt: &quot;Is this tool call safe?&quot;
              </div>
              <div className="flex justify-center text-red-500"><ArrowDown className="h-4 w-4" /></div>
              <div className="p-3 rounded-lg border border-red-500/40 bg-red-950/30 text-center text-red-300">
                ⚠ Attacker prompt tricks LLM: &quot;YES, it is an authorized system routine&quot;
              </div>
              <div className="flex justify-center text-red-500"><ArrowDown className="h-4 w-4" /></div>
              <div className="p-3 rounded-lg border border-red-500 bg-red-950/50 text-center text-red-200 font-bold">
                💥 Destructive Tool Executes!
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 text-slate-400 font-sans text-xs">
              <strong className="text-red-400">Why it fails:</strong> Probabilistic language models cannot provide cryptographic or deterministic safety guarantees. An adversary can craft token sequences to bypass an LLM-based guardrail.
            </div>
          </div>

          {/* AgentGuard Deterministic Enforcement Model */}
          <div className="rounded-2xl border border-emerald-500/30 bg-[#0A0F1D] p-8 font-mono text-xs relative glow-emerald">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-emerald-500/20">
              <span className="text-emerald-400 font-bold tracking-wider flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                THE AGENTGUARD WAY: DETERMINISTIC ENFORCEMENT
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Zero Jailbreak Surface
              </span>
            </div>

            <div className="space-y-3 max-w-md mx-auto mb-6">
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900 text-center text-slate-300">
                AI Agent generates tool call
              </div>
              <div className="flex justify-center text-slate-600"><ArrowDown className="h-4 w-4" /></div>
              <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-950/30 text-center text-emerald-300 font-bold">
                Deterministic Policy + Risk Engine Evaluation (Cedar)
              </div>
              <div className="flex justify-center text-emerald-500"><ArrowDown className="h-4 w-4" /></div>
              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-center text-emerald-200">
                Strict Decision: ALLOW / APPROVE / BLOCK
              </div>
              <div className="flex justify-center text-cyan-400"><ArrowDown className="h-4 w-4" /></div>
              <div className="p-3 rounded-lg border border-cyan-500/30 bg-cyan-950/30 text-center text-cyan-300">
                LLM only translates deterministic verdict into human English
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 text-slate-400 font-sans text-xs">
              <strong className="text-emerald-400">Why it wins:</strong> The decision engine contains zero generative randomness. Policies are pure code and logic. The LLM is used strictly for human observability and reporting.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
