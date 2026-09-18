"use client";

import React, { useState, useEffect } from "react";
import { Shield, AlertCircle, CheckCircle2, ShieldAlert, Terminal, Activity, ArrowUpRight, Filter } from "lucide-react";

interface Incident {
  id: string;
  time: string;
  agent: string;
  threatType: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  targetTool: string;
  enforcement: "TERMINATED (403)" | "CHALLENGED (MFA)" | "CONTAINED";
  latency: string;
}

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "INC-4819",
    time: "Just now",
    agent: "CustomerSupportAgent-04",
    threatType: "ASI-01 Indirect Prompt Injection",
    severity: "CRITICAL",
    targetTool: "database.drop_table",
    enforcement: "TERMINATED (403)",
    latency: "1.2ms",
  },
  {
    id: "INC-4818",
    time: "14s ago",
    agent: "SalesPipelineAgent-02",
    threatType: "ASI-02 Data Exfiltration via S3",
    severity: "CRITICAL",
    targetTool: "aws_s3.put_object",
    enforcement: "TERMINATED (403)",
    latency: "1.6ms",
  },
  {
    id: "INC-4817",
    time: "48s ago",
    agent: "DevOpsAutomationAgent",
    threatType: "Privilege Escalation / sudo attempt",
    severity: "HIGH",
    targetTool: "bash.execute_command",
    enforcement: "CHALLENGED (MFA)",
    latency: "2.1ms",
  },
  {
    id: "INC-4816",
    time: "2m ago",
    agent: "FinanceBillingAssistant",
    threatType: "Excessive Unverified Wire Transfer",
    severity: "HIGH",
    targetTool: "stripe.charges.create",
    enforcement: "CHALLENGED (MFA)",
    latency: "1.4ms",
  },
  {
    id: "INC-4815",
    time: "5m ago",
    agent: "CodeReviewAssistant-01",
    threatType: "Suspicious Directory Traversal",
    severity: "MEDIUM",
    targetTool: "filesystem.read_file",
    enforcement: "CONTAINED",
    latency: "0.9ms",
  },
];

export default function ThreatRadar() {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [totalIntercepts, setTotalIntercepts] = useState(42918);

  const simulateNewIncident = () => {
    const threats = [
      { type: "ASI-01 Jailbreak Payload in Email Body", tool: "mail.send_raw", sev: "CRITICAL" as const, enf: "TERMINATED (403)" as const },
      { type: "ASI-06 Sensitive PII Credential Harvesting", tool: "vault.read_secret", sev: "CRITICAL" as const, enf: "TERMINATED (403)" as const },
      { type: "ASI-07 Unbounded Recursion Loop", tool: "api.recursive_invoke", sev: "HIGH" as const, enf: "CHALLENGED (MFA)" as const },
    ];
    const picked = threats[Math.floor(Math.random() * threats.length)];
    const newInc: Incident = {
      id: `INC-${Math.floor(Math.random() * 800) + 4820}`,
      time: "Just now",
      agent: `AgentCluster-${Math.floor(Math.random() * 9) + 1}`,
      threatType: picked.type,
      severity: picked.sev,
      targetTool: picked.tool,
      enforcement: picked.enf,
      latency: `${(Math.random() * 1.2 + 0.9).toFixed(1)}ms`,
    };
    setIncidents((prev) => [newInc, ...prev.slice(0, 5)]);
    setTotalIntercepts((prev) => prev + 1);
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-zinc-950 p-6 shadow-xl glass-panel">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-200">
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Live Security Gateway Telemetry
              </h3>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400 font-mono">
                REAL-TIME AUDIT STREAM
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Continuous runtime policy verification across active autonomous agent tool dispatches
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={simulateNewIncident}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-all hover:bg-zinc-800 hover:border-white/20 active:scale-95"
          >
            <Shield className="h-3.5 w-3.5 text-zinc-400" />
            <span>Simulate Threat Vector</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-white/[0.08]">
        <div className="rounded-xl border border-white/[0.05] bg-zinc-900/40 p-4">
          <div className="text-xs font-medium text-zinc-400">Total Enforced Halts</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {totalIntercepts.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span>↑ 100% Blocked Prior to Dispatch</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.05] bg-zinc-900/40 p-4">
          <div className="text-xs font-medium text-zinc-400">Mean Gateway Latency</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">1.38 ms</div>
          <div className="text-[11px] text-zinc-500 mt-1">Sub-millisecond Cedar evaluation</div>
        </div>

        <div className="rounded-xl border border-white/[0.05] bg-zinc-900/40 p-4">
          <div className="text-xs font-medium text-zinc-400">Deterministic Policy Drift</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">0.00%</div>
          <div className="text-[11px] text-zinc-500 mt-1">Zero LLM self-governance drift</div>
        </div>

        <div className="rounded-xl border border-white/[0.05] bg-zinc-900/40 p-4">
          <div className="text-xs font-medium text-zinc-400">Active Tenant Enclaves</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">24 Agents</div>
          <div className="text-[11px] text-zinc-500 mt-1">Bedrock &amp; Anthropic pipelines</div>
        </div>
      </div>

      {/* Incident Stream Table */}
      <div className="pt-5 overflow-x-auto">
        <div className="text-xs font-medium text-zinc-400 mb-3 flex items-center justify-between">
          <span>RECENT IN-FLIGHT DISPATCH INTERCEPTIONS</span>
          <span className="font-mono text-[11px] text-zinc-500">Live Polling • SHA-256 Verified</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.08] text-zinc-500 font-mono text-[11px]">
              <th className="pb-2.5 font-medium">INCIDENT ID</th>
              <th className="pb-2.5 font-medium">TIMESTAMP</th>
              <th className="pb-2.5 font-medium">AGENT CLUSTER</th>
              <th className="pb-2.5 font-medium">THREAT VECTOR</th>
              <th className="pb-2.5 font-medium">TARGET TOOL</th>
              <th className="pb-2.5 font-medium">STATUS</th>
              <th className="pb-2.5 font-medium text-right">LATENCY</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] font-mono text-[11px]">
            {incidents.map((inc) => (
              <tr key={inc.id} className="hover:bg-zinc-900/40 transition-colors">
                <td className="py-3 font-semibold text-zinc-300">{inc.id}</td>
                <td className="py-3 text-zinc-500">{inc.time}</td>
                <td className="py-3 text-zinc-300">{inc.agent}</td>
                <td className="py-3">
                  <span className="text-zinc-200 font-sans font-medium">{inc.threatType}</span>
                </td>
                <td className="py-3 text-zinc-400">
                  <code className="rounded bg-zinc-900 px-1.5 py-0.5 border border-white/[0.06] text-[10px]">
                    {inc.targetTool}
                  </code>
                </td>
                <td className="py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      inc.severity === "CRITICAL"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    <span className="h-1 w-1 rounded-full bg-current"></span>
                    {inc.enforcement}
                  </span>
                </td>
                <td className="py-3 text-right text-zinc-400">{inc.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
