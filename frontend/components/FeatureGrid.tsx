"use client";

import React from "react";
import { Shield, Gauge, Sliders, UserCheck, ShieldAlert, FileText, ArrowRight } from "lucide-react";

export default function FeatureGrid() {
  const features = [
    {
      id: "01",
      title: "In-Line Action Interception",
      tag: "Foundational Gateway",
      description:
        "Every autonomous tool call (APIs, email, DB queries, bash execution, file modification) passes through AgentGuard first. Agents possess zero direct execution privileges.",
      icon: Shield,
      detail: "Agent ➔ tool_dispatch() ➔ Gateway Intercept ➔ Cedar Evaluation ➔ Execution",
    },
    {
      id: "02",
      title: "Context-Aware Risk Scoring",
      tag: "Dynamic Evaluation",
      description:
        "Calculates multi-dimensional risk from 0 to 100 based on tool sensitivity, parameter entropy, caller privilege, and destination network classification.",
      icon: Gauge,
      detail: "Risk = f(Action, Resource, Environment, Data Entropy, Destination)",
    },
    {
      id: "03",
      title: "Cedar-Powered Policy Engine",
      tag: "Least Privilege",
      description:
        "Enforce fine-grained organizational authorization policies written in Amazon Cedar without modifying agent prompt code. Define strict boundaries per agent persona.",
      icon: Sliders,
      detail: "calendar.read (Permit) • wire_transfer (Approval) • drop_table (Forbid)",
    },
    {
      id: "04",
      title: "Supervisory Human Approvals",
      tag: "Dual Custody",
      description:
        "AgentGuard pauses the autonomous execution loop for critical operations. Human operators receive rich diagnostic context and can Approve or Deny via Slack/Console.",
      icon: UserCheck,
      detail: "Autonomous Propose ➔ Human Validate ➔ Gateway Enforce",
    },
    {
      id: "05",
      title: "Weaponized Injection Defense",
      tag: "OWASP LLM Mitigation",
      description:
        "When an agent is compromised by malicious prompt injections in external emails or web scrapes, AgentGuard catches and terminates unauthorized secondary tool dispatches.",
      icon: ShieldAlert,
      detail: "Isolates reasoning jailbreaks before real-world API impact",
    },
    {
      id: "06",
      title: "Tamper-Evident Audit Ledger",
      tag: "Cryptographic Proof",
      description:
        "Every evaluated dispatch generates an immutable cryptographic block chained with the prior block's SHA-256 hash. Zero retroactive modification possible.",
      icon: FileText,
      detail: "Hash-chained verification tree with continuous tamper validation",
    },
  ];

  return (
    <section id="features" className="py-24 border-b border-white/[0.08] bg-[#09090B] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300 mb-3">
            <Shield className="h-3.5 w-3.5 text-zinc-400" />
            <span>SIX CORE DEFENSE SUBSYSTEMS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Enterprise runtime governance architecture.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            A comprehensive, multi-layered security control plane purpose-built for autonomous AI agents in production environments.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className="group rounded-2xl border border-white/[0.08] bg-zinc-950 p-6 shadow-sm transition-all duration-200 hover:border-white/20 hover:bg-zinc-900/60 glass-panel flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-200 group-hover:border-white/20 transition-colors">
                      <Icon className="h-5 w-5 text-zinc-300" />
                    </div>
                    <span className="font-mono text-[11px] text-zinc-500 font-semibold">{f.id} // {f.tag}</span>
                  </div>

                  <h3 className="text-base font-semibold text-white tracking-tight mb-2 group-hover:text-zinc-100">
                    {f.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    {f.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] font-mono text-[11px] text-zinc-400">
                  {f.detail}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
