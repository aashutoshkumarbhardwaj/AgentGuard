import React from "react";
import { Network, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Shield, Layers, HelpCircle } from "lucide-react";

export default function ContextAwareness() {
  const contextDimensions = [
    { label: "WHO?", desc: "Original Human User & Session Token" },
    { label: "WHICH AGENT?", desc: "Verified Agent Persona & IAM Role" },
    { label: "WHICH TOOL?", desc: "Target API / Command Signature" },
    { label: "WHICH RESOURCE?", desc: "Exact File, Table, or Bucket Path" },
    { label: "WHICH DATA?", desc: "PII, Secret, or Public Classification" },
    { label: "WHERE IS IT GOING?", desc: "Internal VPC vs External Domain" },
    { label: "WHY?", desc: "Original User Prompt Intent Alignment" },
    { label: "WHAT IS THE RISK?", desc: "Entropy & Impact Severity Score" },
  ];

  const examples = [
    {
      action: "email.send",
      context: "Internal recipient (@corp.internal) with meeting notes",
      decision: "ALLOW",
      risk: "LOW (14/100)",
      reason: "Trusted intra-organization boundary with zero PII",
    },
    {
      action: "email.send",
      context: "Verified external partner (@acme-partner.com) with NDA document",
      decision: "REQUIRE APPROVAL",
      risk: "MEDIUM (58/100)",
      reason: "External perimeter crossing with proprietary document",
    },
    {
      action: "email.send",
      context: "Unregistered foreign email service (@tempmail.org) with API secret",
      decision: "BLOCK",
      risk: "CRITICAL (99/100)",
      reason: "High-entropy credential detected going to unknown disposable domain",
    },
  ];

  return (
    <section id="context-awareness" className="py-24 border-b border-slate-800 bg-[#070A12] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3 py-1 font-mono text-xs font-semibold text-emerald-400 mb-3">
            <Network className="h-3.5 w-3.5" />
            <span>CONTEXT-AWARE AUTHORIZATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            Beyond binary tool permissions.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Never just ask: <code className="text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">&quot;Can Agent X use email.send?&quot;</code><br />
            An agent authorized to send internal emails must never be allowed to broadcast customer secrets to the open internet.
          </p>
        </div>

        {/* 8 Context Evaluation Dimensions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {contextDimensions.map((d, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-[#0B0F1A] p-4 text-center hover:border-slate-700 transition-all font-mono"
            >
              <div className="text-emerald-400 font-bold text-xs tracking-wider mb-1">
                {d.label}
              </div>
              <div className="text-slate-400 text-[11px] leading-tight font-sans">
                {d.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Context-Aware Matrix Demonstration */}
        <div className="rounded-2xl border border-slate-800 bg-[#090D18] p-6 sm:p-8 shadow-xl">
          <div className="font-mono text-xs text-slate-400 mb-4 pb-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-white font-bold">CASE STUDY: SAME TOOL (`email.send`), THREE DIFFERENT CONTEXTS</span>
            <span className="text-slate-500">Autonomous Execution Matrix</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {examples.map((ex, i) => (
              <div key={i} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {ex.action}
                    </span>
                    <span className="text-slate-400 font-sans text-xs">
                      {ex.context}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] font-sans">
                    Reason: {ex.reason}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-slate-400 text-[11px]">
                    Risk: <strong className="text-slate-200">{ex.risk}</strong>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold tracking-wider ${
                      ex.decision === "BLOCK"
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : ex.decision === "REQUIRE APPROVAL"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    {ex.decision === "BLOCK" && <XCircle className="h-3.5 w-3.5 text-red-400" />}
                    {ex.decision === "REQUIRE APPROVAL" && <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
                    {ex.decision === "ALLOW" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                    {ex.decision}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
