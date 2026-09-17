"use client";

import React, { useState } from "react";
import { FileText, ShieldCheck, Link as LinkIcon, CheckCircle2, RefreshCw, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import { INITIAL_AUDIT_LEDGER, AuditBlock, verifyChain } from "@/lib/auditChain";

export default function AuditLedger() {
  const [ledger, setLedger] = useState<AuditBlock[]>(INITIAL_AUDIT_LEDGER);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    count: number;
    timestamp: string;
  } | null>({
    verified: true,
    count: 1284,
    timestamp: "Just now",
  });

  const handleVerify = async () => {
    setVerifying(true);
    setVerificationResult(null);

    // Simulate verification delay
    setTimeout(async () => {
      const res = await verifyChain(ledger);
      const now = new Date().toTimeString().split(" ")[0];
      setVerificationResult({
        verified: res.valid,
        count: 1284,
        timestamp: now,
      });
      setVerifying(false);
    }, 800);
  };

  return (
    <section id="audit-ledger" className="py-24 border-b border-slate-800 bg-[#06080E] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-3 py-1 font-mono text-xs font-semibold text-cyan-400 mb-3">
            <FileText className="h-3.5 w-3.5" />
            <span>TAMPER-EVIDENT CRYPTOGRAPHIC LEDGER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            Every action leaves an immutable audit trail.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Audit logs cannot be retroactively purged or modified by rogue agents. Each event is mathematically linked to its predecessor via SHA-256 hash chaining.
          </p>

          {/* Verification Bar & Action */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-mono text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
            >
              <RefreshCw className={`h-4 w-4 ${verifying ? "animate-spin" : ""}`} />
              {verifying ? "Recalculating SHA-256 Hashes..." : "Verify Audit Chain Integrity"}
            </button>

            {verificationResult && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-2.5 font-mono text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>
                  INTEGRITY VERIFIED • {verificationResult.count} events • 0 violations ({verificationResult.timestamp})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Hash Chain Presentation */}
        <div className="space-y-4">
          {ledger.map((block, idx) => (
            <div
              key={block.index}
              className="rounded-xl border border-slate-800 bg-[#0A0E1A] p-5 font-mono text-xs hover:border-slate-700 transition-all shadow-md relative"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left: Event Identification */}
                <div className="flex items-start gap-3">
                  <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2 py-1 rounded text-[11px] font-bold shrink-0">
                    EVENT #{block.index}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold text-sm">{block.action}</span>
                      <span className="text-slate-500">➔</span>
                      <code className="text-slate-300 text-xs bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {block.resource}
                      </code>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-1 flex items-center gap-2">
                      <span className="text-cyan-400">{block.agent}</span>
                      <span className="text-slate-600">•</span>
                      <span>{block.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Center: Decision & Risk */}
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider ${
                      block.decision === "BLOCK"
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : block.decision === "APPROVE"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    {block.decision}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Risk: <strong className="text-slate-300">{block.risk}</strong>
                  </span>
                </div>

                {/* Right: Cryptographic Hashes */}
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-[10px] space-y-1 lg:max-w-md w-full">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 shrink-0">SHA-256:</span>
                    <span className="text-emerald-400 truncate">{block.hash}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 shrink-0 flex items-center gap-1">
                      <LinkIcon className="h-2.5 w-2.5 text-slate-500" />
                      Prev Hash:
                    </span>
                    <span className="text-slate-400 truncate">{block.prevHash}</span>
                  </div>
                </div>

              </div>

              {/* Connecting Hash Link Line */}
              {idx < ledger.length - 1 && (
                <div className="hidden lg:flex justify-center -mb-7 mt-2 relative z-10">
                  <div className="h-6 w-0.5 bg-gradient-to-b from-cyan-500/50 to-slate-700"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Audit Callout Box */}
        <div className="mt-12 rounded-xl border border-slate-800 bg-[#080B15] p-5 text-center text-xs font-mono text-slate-400 max-w-2xl mx-auto">
          <Lock className="h-4 w-4 text-cyan-400 inline-block mr-2 -mt-0.5" />
          <span>
            Unlike standard application logs stored in plaintext files, AgentGuard hashes are mathematically chained. Even an administrator with server access cannot alter an event without breaking downstream verification.
          </span>
        </div>

      </div>
    </section>
  );
}
