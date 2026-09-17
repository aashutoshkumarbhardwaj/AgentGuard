import React from "react";
import { ShieldCheck, Cpu, GitCommit, CheckCircle2, ArrowRight, Lock, Eye, AlertOctagon } from "lucide-react";

export default function SolutionPillars() {
  const pillars = [
    {
      step: "01",
      title: "INTERCEPT",
      subtitle: "Deterministic Gateway",
      description:
        "Every tool request invoked by an autonomous agent (APIs, databases, file systems, code execution) is captured at the runtime boundary. The agent has zero direct execution privileges.",
      icon: Lock,
      color: "emerald",
      badge: "100% Tool Coverage",
      details: ["Python & Node SDK Hooks", "Amazon Bedrock Action Groups Gateway", "Zero-bypass architecture"],
    },
    {
      step: "02",
      title: "DECIDE",
      subtitle: "Tri-Engine Evaluation",
      description:
        "Three deterministic engines evaluate the payload simultaneously: Cedar Policy Engine (least privilege), Context Engine (agent identity, destination, data sensitivity), and Quantitative Risk Engine.",
      icon: Eye,
      color: "cyan",
      badge: "< 15ms Latency",
      details: ["Cedar authorization logic", "Risk score (0 - 100)", "No reliance on LLM for safety logic"],
    },
    {
      step: "03",
      title: "ENFORCE",
      subtitle: "Tri-State Execution",
      description:
        "Based on policy and risk severity, AgentGuard issues one of three deterministic verdicts: instantly ALLOW safe operations, PAUSE and request Human Approval, or permanently BLOCK malicious actions.",
      icon: AlertOctagon,
      color: "amber",
      badge: "ALLOW / APPROVE / BLOCK",
      details: ["Human-in-the-loop escalation", "Tamper-evident hash chaining", "AI-generated audit explanation"],
    },
  ];

  return (
    <section id="how-it-works" className="py-24 border-b border-slate-800 bg-[#07090F] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3 py-1 font-mono text-xs font-semibold text-emerald-400 mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>THE SOLUTION ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            Meet the control plane for AI agents.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            AgentGuard does not replace your AI agents. It governs their authority with three unbreakable runtime stages.
          </p>
        </div>

        {/* Visual Workflow Breadcrumb */}
        <div className="hidden md:flex items-center justify-center gap-4 mb-14 font-mono text-xs font-bold tracking-widest text-slate-400">
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-4 py-2 rounded-lg">
            <span>01 INTERCEPT</span>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-600" />
          <div className="flex items-center gap-2 text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-4 py-2 rounded-lg">
            <span>02 DECIDE</span>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-600" />
          <div className="flex items-center gap-2 text-amber-400 bg-amber-950/40 border border-amber-500/30 px-4 py-2 rounded-lg">
            <span>03 ENFORCE</span>
          </div>
        </div>

        {/* The Three Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={p.step}
                className="relative rounded-2xl border border-slate-800 bg-[#0B0F1A] p-8 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      STEP {p.step}
                    </span>
                    <span className={`font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                      p.color === "emerald" ? "text-emerald-400 bg-emerald-950/40 border-emerald-500/30" :
                      p.color === "cyan" ? "text-cyan-400 bg-cyan-950/40 border-cyan-500/30" :
                      "text-amber-400 bg-amber-950/40 border-amber-500/30"
                    }`}>
                      {p.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-lg border ${
                      p.color === "emerald" ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-400" :
                      p.color === "cyan" ? "border-cyan-500/30 bg-cyan-950/30 text-cyan-400" :
                      "border-amber-500/30 bg-amber-950/30 text-amber-400"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-mono text-xl font-bold text-white tracking-tight">{p.title}</h3>
                      <p className="font-mono text-xs text-slate-400">{p.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                    {p.description}
                  </p>
                </div>

                {/* Sub-capabilities list */}
                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  {p.details.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 font-mono text-xs text-slate-400">
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        p.color === "emerald" ? "bg-emerald-400" :
                        p.color === "cyan" ? "bg-cyan-400" : "bg-amber-400"
                      }`} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
