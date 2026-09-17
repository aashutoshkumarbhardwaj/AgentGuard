import React from "react";
import { Shield, Gauge, Sliders, UserCheck, ShieldAlert, FileText, CheckCircle2, ArrowRight } from "lucide-react";

export default function FeatureGrid() {
  const features = [
    {
      id: "01",
      title: "Action Interception",
      tag: "Foundational Gate",
      description:
        "Every autonomous tool invocation (APIs, email, DB, bash, file modification) passes through AgentGuard first. Agents have zero direct execution privileges.",
      icon: Shield,
      color: "emerald",
      metric: "100% Interception",
      detail: "Agent ➔ email.send() ➔ AgentGuard ➔ Policy Evaluation ➔ Decision",
    },
    {
      id: "02",
      title: "Quantitative Risk Engine",
      tag: "Contextual Scoring",
      description:
        "Calculates a dynamic risk score from 0 to 100 based on tool action, target resource sensitivity, data exfiltration entropy, and destination classification.",
      icon: Gauge,
      color: "cyan",
      metric: "LOW / MED / CRITICAL",
      detail: "Action + Target + Sensitivity + Destination + Context",
    },
    {
      id: "03",
      title: "Cedar-Powered Policy Engine",
      tag: "Least Privilege",
      description:
        "Enforce fine-grained organizational authorization policies without modifying agent prompt code. Define strict boundaries for each agent persona.",
      icon: Sliders,
      color: "emerald",
      metric: "Sub-15ms Evaluation",
      detail: "calendar.read (Allow), email.send (Approval), file.delete (Block)",
    },
    {
      id: "04",
      title: "Human-in-the-Loop Approvals",
      tag: "Supervisory Control",
      description:
        "AgentGuard pauses the autonomous execution loop for sensitive operations. Human operators receive detailed context and can Approve or Deny.",
      icon: UserCheck,
      color: "amber",
      metric: "Zero Friction Gate",
      detail: "AI suggests ➔ Human authorizes ➔ AgentGuard enforces",
    },
    {
      id: "05",
      title: "Prompt Injection Defense",
      tag: "Attack Neutralization",
      description:
        "When an agent is manipulated by malicious prompt injections in external emails or web pages, AgentGuard stops the resulting unauthorized tool execution.",
      icon: ShieldAlert,
      color: "red",
      metric: "Zero Exfiltration",
      detail: "Catches malicious secondary tool requests before real-world impact",
    },
    {
      id: "06",
      title: "Tamper-Evident Audit Ledger",
      tag: "Cryptographic Integrity",
      description:
        "Every evaluated action generates a cryptographic audit block chained with the previous block's SHA-256 hash. Zero retroactive modification possible.",
      icon: FileText,
      color: "cyan",
      metric: "SHA-256 Chaining",
      detail: "Hash-chained event stream verified with zero integrity violations",
    },
  ];

  return (
    <section id="features" className="py-24 border-b border-slate-800 bg-[#06080E] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-3 py-1 font-mono text-xs font-semibold text-cyan-400 mb-3">
            <Shield className="h-3.5 w-3.5" />
            <span>CORE CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            Six engines. One unbreakable control layer.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Engineered specifically for autonomous AI agents that interact dynamically with the real world.
          </p>
        </div>

        {/* 6 Feature Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className="group relative rounded-xl border border-slate-800 bg-[#090D18] p-6 hover:border-slate-700 transition-all hover:bg-[#0C1222] shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-slate-500">{f.id}</span>
                    <span className={`font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded border ${
                      f.color === "red" ? "text-red-400 bg-red-950/40 border-red-500/30" :
                      f.color === "amber" ? "text-amber-400 bg-amber-950/40 border-amber-500/30" :
                      f.color === "cyan" ? "text-cyan-400 bg-cyan-950/40 border-cyan-500/30" :
                      "text-emerald-400 bg-emerald-950/40 border-emerald-500/30"
                    }`}>
                      {f.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg border border-slate-700/80 bg-slate-900 text-white">
                      <Icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h3 className="font-mono text-lg font-bold text-white tracking-tight">
                      {f.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {f.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/60 truncate">
                    {f.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
