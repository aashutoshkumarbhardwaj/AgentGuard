"use client";

import React, { useState } from "react";
import { UserCheck, AlertTriangle, CheckCircle2, XCircle, Clock, Shield, ArrowRight, Bell, Sparkles } from "lucide-react";

export default function HumanApprovalModal() {
  const [decisionState, setDecisionState] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [feedbackNote, setFeedbackNote] = useState<string>("");

  const handleApprove = () => {
    setDecisionState("APPROVED");
    setFeedbackNote("Approved by Human Supervisor (SecOps Lead). Agent resumed execution.");
  };

  const handleReject = () => {
    setDecisionState("REJECTED");
    setFeedbackNote("Rejected by Human Supervisor. Agent execution halted and tool call dropped.");
  };

  const handleReset = () => {
    setDecisionState("PENDING");
    setFeedbackNote("");
  };

  return (
    <section className="py-24 border-b border-slate-800 bg-[#070A12] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-950/20 px-3 py-1 font-mono text-xs font-semibold text-amber-400 mb-3">
            <UserCheck className="h-3.5 w-3.5" />
            <span>HUMAN-IN-THE-LOOP CONTROL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            AI suggests. Human authorizes. AgentGuard enforces.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            For critical operations (wire transfers, public communications, production database modifications), AgentGuard pauses the autonomous execution loop until an authenticated human provides explicit approval.
          </p>
        </div>

        {/* The Interactive Approval Card Simulation */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-amber-500/30 bg-[#0C101F] shadow-2xl overflow-hidden glow-amber">
            
            {/* Header / Title Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#070A14] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold text-white tracking-wider">
                    HUMAN APPROVAL REQUIRED
                  </h3>
                  <p className="font-mono text-[11px] text-slate-400">
                    Agent execution paused • Awaiting supervisor review
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`font-mono text-xs px-3 py-1 rounded-full font-bold tracking-wider ${
                  decisionState === "PENDING"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                    : decisionState === "APPROVED"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-red-500/20 text-red-300 border border-red-500/40"
                }`}
              >
                {decisionState}
              </span>
            </div>

            {/* Approval Body Content */}
            <div className="p-6 sm:p-8 font-mono text-xs space-y-5">
              
              {/* Request Description */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="text-slate-400 text-[11px] mb-1">INTERCEPTED ACTION SUMMARY</div>
                <div className="text-white text-sm font-sans font-semibold mb-2">
                  Research Agent &quot;market-analyst-v4&quot; requests to send an external communication.
                </div>
                <div className="text-slate-400 text-xs font-sans">
                  The agent finished drafting the Q3 Strategy Brief and invoked outbound tool <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">email.send()</code>.
                </div>
              </div>

              {/* Parameters Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                  <span className="text-slate-500 text-[10px] block">RECIPIENT</span>
                  <span className="text-slate-200 font-bold truncate block">external-lead@acme-eval.io</span>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                  <span className="text-slate-500 text-[10px] block">ATTACHMENT</span>
                  <span className="text-slate-200 font-bold truncate block">q3_strategy_draft.pdf</span>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 text-[10px] block">RISK EVALUATION</span>
                  <span className="text-amber-400 font-bold">HIGH (72 / 100)</span>
                </div>
              </div>

              {/* Live Decision Feedback Alert */}
              {feedbackNote && (
                <div className={`p-3.5 rounded-lg border font-sans text-xs ${
                  decisionState === "APPROVED"
                    ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                    : "border-red-500/40 bg-red-950/30 text-red-300"
                }`}>
                  <strong className="block font-mono text-[11px] mb-1">AUDIT NOTIFICATION:</strong>
                  {feedbackNote}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                {decisionState === "PENDING" ? (
                  <>
                    <button
                      onClick={handleReject}
                      className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-950/30 py-3 text-xs font-bold text-red-300 transition-all hover:bg-red-900/50 hover:border-red-500"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject &amp; Abort Execution
                    </button>
                    <button
                      onClick={handleApprove}
                      className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve &amp; Resume Agent
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs text-slate-300 hover:bg-slate-700"
                  >
                    Reset Simulation State
                  </button>
                )}
              </div>

            </div>

            {/* SLA Timer Footer */}
            <div className="border-t border-slate-800 bg-[#070A14] px-6 py-2.5 text-[11px] font-mono text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                Timeout SLA: Auto-abort if unreviewed in 15m
              </span>
              <span>Audit Ticket: #APPR-94821</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
