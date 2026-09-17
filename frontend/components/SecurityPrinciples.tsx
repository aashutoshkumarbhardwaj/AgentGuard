import React from "react";
import { ShieldAlert, Key, UserCheck, Cpu, FileCheck } from "lucide-react";

export default function SecurityPrinciples() {
  const principles = [
    {
      num: "01",
      title: "Zero Trust for Agents",
      principle: "Never trust an agent simply because it was initialized with valid credentials.",
      explanation: "An agent can be co-opted at any moment by untrusted indirect prompt injection. Every single downstream tool request must be independently authenticated and evaluated.",
      icon: ShieldAlert,
    },
    {
      num: "02",
      title: "Strict Least Privilege",
      principle: "Grant agents only the minimum operational scope necessary for the current task.",
      explanation: "Just because an agent has an API token does not give it carte blanche to delete tables, access credentials, or execute external transactions.",
      icon: Key,
    },
    {
      num: "03",
      title: "Human Oversight for Consequence",
      principle: "High-impact actions must always remain under supervisory human custody.",
      explanation: "AI can draft the email, prepare the PR, or calculate the financial disbursement, but human authorization is strictly required before irreversible real-world state changes.",
      icon: UserCheck,
    },
    {
      num: "04",
      title: "Deterministic Enforcement",
      principle: "Security boundaries must never rely on generative LLM outputs.",
      explanation: "Policy enforcement is implemented in pure, mathematical code and Cedar logic. The model is an actor in the system, never the arbiter of its own authority.",
      icon: Cpu,
    },
    {
      num: "05",
      title: "Tamper-Evident Auditability",
      principle: "Every invocation must produce an immutable cryptographic proof.",
      explanation: "SHA-256 hash chaining ensures complete, unalterable accountability. Zero retroactive log sanitization by rogue agents or compromised hosts.",
      icon: FileCheck,
    },
  ];

  return (
    <section className="py-24 border-b border-slate-800 bg-[#06080E] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3 py-1 font-mono text-xs font-semibold text-emerald-400 mb-3">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>SECURITY PRINCIPLES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            The Five Axioms of Agent Governance.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            A defense-in-depth framework designed from the ground up for the agentic AI era.
          </p>
        </div>

        {/* Principles Vertical Stacking */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.num}
                className="rounded-xl border border-slate-800 bg-[#090D18] p-6 hover:border-slate-700 transition-all font-mono text-xs shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-emerald-400 font-bold text-sm bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">
                      {p.num}
                    </span>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-white font-bold text-base font-sans">{p.title}</h3>
                    <div className="text-emerald-400 font-mono text-xs font-semibold">
                      &ldquo;{p.principle}&rdquo;
                    </div>
                    <p className="text-slate-400 font-sans text-xs leading-relaxed pt-1">
                      {p.explanation}
                    </p>
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
