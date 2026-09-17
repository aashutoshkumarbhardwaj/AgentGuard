"use client";

import React, { useState } from "react";
import { Sliders, Shield, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Terminal, Play, ArrowRight } from "lucide-react";
import { INITIAL_POLICIES, PolicyRule } from "@/lib/mockData";

export default function PolicySandbox() {
  const [policies, setPolicies] = useState<PolicyRule[]>(INITIAL_POLICIES);
  const [testAction, setTestAction] = useState<string>("email.send");
  const [testResult, setTestResult] = useState<{
    action: string;
    decision: "ALLOW" | "APPROVE" | "BLOCK";
    message: string;
    ruleId: string;
    timestamp: string;
  } | null>(null);

  const handleToggle = (policyId: string, decision: "ALLOW" | "APPROVE" | "BLOCK") => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === policyId ? { ...p, currentDecision: decision } : p))
    );

    // If the currently toggled policy is what's tested, update test result
    const updated = policies.find((p) => p.id === policyId);
    if (updated && updated.action === testAction) {
      triggerTest(updated.action, decision);
    }
  };

  const triggerTest = (actionToTest = testAction, overrideDecision?: "ALLOW" | "APPROVE" | "BLOCK") => {
    const policy = policies.find((p) => p.action === actionToTest);
    const decision = overrideDecision || policy?.currentDecision || "BLOCK";
    const now = new Date().toTimeString().split(" ")[0];

    let message = "";
    if (decision === "ALLOW") {
      message = `Policy evaluated: '${actionToTest}' allowed without supervisor intervention. Immediate dispatch to tool adapter.`;
    } else if (decision === "APPROVE") {
      message = `Policy evaluated: '${actionToTest}' suspended. Human-in-the-loop approval ticket queued to security dashboard.`;
    } else {
      message = `Policy evaluated: '${actionToTest}' halted permanently. Zero tool invocation permitted by least-privilege policy.`;
    }

    setTestResult({
      action: actionToTest,
      decision,
      message,
      ruleId: policy?.id || "POL-CUSTOM",
      timestamp: now,
    });
  };

  return (
    <section id="policy-sandbox" className="py-24 border-b border-slate-800 bg-[#06080E] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3 py-1 font-mono text-xs font-semibold text-emerald-400 mb-3">
            <Sliders className="h-3.5 w-3.5" />
            <span>INTERACTIVE POLICY CONTROL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            Update security bounds without rewriting code.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Never hardcode permissions into AI prompts. Configure fine-grained Cedar policies in real time. Try toggling rules below and test live tool enforcement.
          </p>
        </div>

        {/* Policy Editor Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Policy Table Editor (7 cols) */}
          <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#090D18] shadow-xl overflow-hidden font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#060810] px-4 py-3">
              <span className="text-white font-bold tracking-wider flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                ACTIVE CEDAR POLICY RULESET
              </span>
              <span className="text-slate-500 text-[11px]">Dynamic Runtime Sync</span>
            </div>

            <div className="divide-y divide-slate-800">
              {policies.map((pol) => (
                <div key={pol.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/20 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">{pol.action}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                        {pol.category}
                      </span>
                    </div>
                    <p className="text-slate-400 font-sans text-xs">
                      {pol.description}
                    </p>
                  </div>

                  {/* 3-State Toggle Pill */}
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 shrink-0">
                    <button
                      onClick={() => handleToggle(pol.id, "ALLOW")}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                        pol.currentDecision === "ALLOW"
                          ? "bg-emerald-500 text-slate-950 shadow"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      ALLOW
                    </button>
                    <button
                      onClick={() => handleToggle(pol.id, "APPROVE")}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                        pol.currentDecision === "APPROVE"
                          ? "bg-amber-500 text-slate-950 shadow"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      APPROVAL
                    </button>
                    <button
                      onClick={() => handleToggle(pol.id, "BLOCK")}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                        pol.currentDecision === "BLOCK"
                          ? "bg-red-500 text-white shadow"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      BLOCK
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 bg-[#060810] px-4 py-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>{policies.length} Policies Active in Memory</span>
              <span className="text-emerald-400">Hot-Reloading Enabled (0ms downtime)</span>
            </div>
          </div>

          {/* Real-time Policy Tester Console (5 cols) */}
          <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0B101D] shadow-xl p-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-white font-bold flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                SIMULATE AGENT TOOL REQUEST
              </span>
              <span className="text-slate-500 text-[11px]">Runtime Gateway Probe</span>
            </div>

            <p className="text-slate-400 text-xs font-sans mb-4">
              Select any action to test against your live toggled policies above:
            </p>

            {/* Action Selector */}
            <div className="space-y-3 mb-6">
              <label className="text-slate-400 block text-[11px]">TARGET AGENT ACTION:</label>
              <div className="grid grid-cols-2 gap-2">
                {["email.send", "file.delete", "financial.transfer", "calendar.read"].map((act) => (
                  <button
                    key={act}
                    onClick={() => {
                      setTestAction(act);
                      triggerTest(act);
                    }}
                    className={`py-2 px-3 rounded text-left border transition-all text-xs font-mono truncate ${
                      testAction === act
                        ? "border-cyan-500 bg-cyan-950/30 text-cyan-300 font-bold"
                        : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>

              <button
                onClick={() => triggerTest()}
                className="w-full mt-3 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400 shadow-md"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Dispatch Test Tool Request
              </button>
            </div>

            {/* Test Execution Output Window */}
            {testResult && (
              <div className={`rounded-lg border p-4 transition-all ${
                testResult.decision === "BLOCK"
                  ? "border-red-500/40 bg-red-950/20"
                  : testResult.decision === "APPROVE"
                  ? "border-amber-500/40 bg-amber-950/20"
                  : "border-emerald-500/40 bg-emerald-950/20"
              }`}>
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                  <span className="text-slate-400 text-[10px]">EVALUATION TIMESTAMP: {testResult.timestamp}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      testResult.decision === "BLOCK"
                        ? "text-red-300 bg-red-500/30"
                        : testResult.decision === "APPROVE"
                        ? "text-amber-300 bg-amber-500/30"
                        : "text-emerald-300 bg-emerald-500/30"
                    }`}
                  >
                    DECISION: {testResult.decision}
                  </span>
                </div>

                <div className="text-white font-bold text-xs mb-1">
                  Target: {testResult.action}()
                </div>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">
                  {testResult.message}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Enforced by: {testResult.ruleId}</span>
                  <span className="text-emerald-400">Latency: 9.2ms</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
