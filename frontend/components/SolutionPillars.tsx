import React from "react";
import { ShieldCheck, Cpu, GitCommit, CheckCircle2, ArrowRight, Lock, Eye, AlertOctagon } from "lucide-react";

export default function SolutionPillars() {
  const pillars = [
    {
      step: "01",
      title: "INTERCEPT",
      subtitle: "Deterministic In-Line Gateway",
      description:
        "Every tool request dispatched by an autonomous agent (APIs, databases, file systems, code execution) is captured at the runtime boundary. Agents hold zero direct invocation privileges.",
      icon: Lock,
      badge: "100% Tool Coverage",
      details: ["Python & TypeScript SDK Hooks", "Amazon Bedrock Action Groups Gateway", "Zero-bypass architecture"],
    },
    {
      step: "02",
      title: "DECIDE",
      subtitle: "Tri-Engine Evaluation",
      description:
        "Three deterministic engines evaluate the payload simultaneously: Cedar Policy Engine (least privilege), Context Engine (agent persona, destination, data sensitivity), and Quantitative Risk Engine.",
      icon: Eye,
      badge: "< 2ms Latency",
      details: ["Cedar authorization logic", "Risk score (0 - 100)", "Zero reliance on LLM for security logic"],
    },
    {
      step: "03",
      title: "ENFORCE",
      subtitle: "Tri-State Execution Gate",
      description:
        "Based on policy and risk severity, AgentGuard issues one of three deterministic verdicts: instantly PERMIT safe operations, PAUSE and request Human Approval, or permanently TERMINATE malicious actions.",
      icon: AlertOctagon,
      badge: "PERMIT / APPROVE / FORBID",
      details: ["Human-in-the-loop escalation", "Tamper-evident SHA-256 chaining", "Structured audit explanation"],
    },
  ];

  return (
    <section id="how-it-works" className="py-24 border-b border-white/[0.08] bg-[#09090B] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300 mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
            <span>THE RUNTIME CONTROL PLANE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Three unbreakable execution stages.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            AgentGuard does not replace your AI agents. It governs their execution authority with deterministic rigor.
          </p>
        </div>

        {/* Visual Workflow Breadcrumb */}
        <div className="hidden md:flex items-center justify-center gap-4 mb-14 font-mono text-xs font-medium tracking-wider text-zinc-400">
          <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-4 py-2 rounded-lg text-zinc-200">
            <span>01 INTERCEPT</span>
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-600" />
          <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-4 py-2 rounded-lg text-zinc-200">
            <span>02 DECIDE</span>
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-600" />
          <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-4 py-2 rounded-lg text-zinc-200">
            <span>03 ENFORCE</span>
          </div>
        </div>

        {/* The Three Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.step}
                className="relative rounded-2xl border border-white/[0.08] bg-zinc-950 p-8 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl glass-panel"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-semibold text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-white/10">
                      PHASE {p.step}
                    </span>
                    <span className="font-mono text-[11px] font-medium tracking-wide px-2 py-0.5 rounded border border-white/10 bg-zinc-900/80 text-zinc-300">
                      {p.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl border border-white/10 bg-zinc-900 text-zinc-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">{p.title}</h3>
                      <p className="text-xs text-zinc-400">{p.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                    {p.description}
                  </p>
                </div>

                {/* Sub-capabilities list */}
                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  {p.details.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
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
