import React from "react";
import { ShieldCheck, Terminal, Github, ExternalLink, ArrowRight, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#05070B] text-slate-400 font-mono text-xs">
      
      {/* Final Call to Action Section */}
      <div className="border-b border-slate-800/80 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-grid-pattern">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>HACKATHON EVALUATION BUILD • AMAZON BEDROCK READY</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight font-sans mb-4">
            Let your agents act. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Keep the authority yours.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-sans">
            Autonomous capability should never equate to unlimited authority. Drop AgentGuard into your agentic workflow and establish complete control over what your AI is allowed to do.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#live-interceptor"
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 font-sans"
            >
              <Terminal className="h-4 w-4" />
              Try the Live Demo
            </a>
            <a
              href="#architecture"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white font-sans"
            >
              Explore the Architecture
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-5 py-3.5 text-sm font-semibold text-slate-400 transition-all hover:text-white hover:border-slate-700 font-sans"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links Bar */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base font-mono">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>Agent<span className="text-emerald-400">Guard</span></span>
            </div>
            <p className="text-slate-400 font-sans text-xs max-w-sm leading-relaxed">
              The control and runtime security layer for autonomous AI agents. Deterministic policy enforcement, context-aware risk scoring, human-in-the-loop approvals, and tamper-evident audit chaining.
            </p>
            <div className="text-[11px] text-slate-500">
              AWS Bedrock Hackathon 2026 Submission
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a></li>
              <li><a href="#attack-demo" className="hover:text-emerald-400 transition-colors">Attack Defense</a></li>
              <li><a href="#policy-sandbox" className="hover:text-emerald-400 transition-colors">Policy Sandbox</a></li>
              <li><a href="#audit-ledger" className="hover:text-emerald-400 transition-colors">Audit Ledger</a></li>
              <li><a href="#architecture" className="hover:text-emerald-400 transition-colors">Architecture</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Technical Pitch</h4>
            <div className="space-y-2 text-[11px] text-slate-400 font-sans">
              <p>
                <strong className="text-slate-200">What did you build?</strong><br />
                A runtime control plane that intercepts AI agent tool calls and enforces deterministic policies.
              </p>
              <p>
                <strong className="text-slate-200">What is special?</strong><br />
                We do not ask the LLM to judge its own actions. Decisions are strictly deterministic; the LLM only generates explanations.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <div>
            © 2026 AgentGuard Security Protocol. Built for Autonomous Agent Governance.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              All Systems Operational
            </span>
            <span>Zero Data Exfiltration</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
