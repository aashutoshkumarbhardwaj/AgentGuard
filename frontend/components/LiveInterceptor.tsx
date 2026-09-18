"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Shield, Play, Pause, RefreshCw, CheckCircle2, AlertTriangle, XCircle, ShieldAlert, Activity, Filter } from "lucide-react";
import { INITIAL_STREAM_EVENTS, AgentEvent } from "@/lib/mockData";

export default function LiveInterceptor() {
  const [events, setEvents] = useState<AgentEvent[]>(INITIAL_STREAM_EVENTS);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [filter, setFilter] = useState<"ALL" | "ALLOW" | "APPROVE" | "BLOCK">("ALL");
  const [selectedEvent, setSelectedEvent] = useState<AgentEvent>(INITIAL_STREAM_EVENTS[3]);

  // Automated Event Simulator: appends dynamic realistic events every 4.5 seconds
  useEffect(() => {
    if (!isStreaming) return;

    const samplePool: Omit<AgentEvent, "id" | "timestamp" | "hash" | "prevHash">[] = [
      {
        agent: "sales-assistant-bot",
        agentRole: "CRM Query Agent",
        action: "database.query",
        resource: "leads.high_value_accounts",
        risk: "LOW",
        riskScore: 16,
        decision: "ALLOW",
        reason: "Scoped internal lead query conforms with data classification tier 1",
        policy: "POL-DB-READ-PUBLIC",
        latencyMs: 12,
      },
      {
        agent: "finance-bot-v1",
        agentRole: "Accounts Payable Copilot",
        action: "financial.transfer",
        resource: "stripe.disburse($14,500.00)",
        destination: "acct_984129841_external",
        risk: "CRITICAL",
        riskScore: 97,
        decision: "BLOCK",
        reason: "Autonomous outbound disbursement exceeded $0 unauthorized financial cap",
        policy: "POL-ZERO-UNSUPERVISED-CAPITAL",
        latencyMs: 7,
      },
      {
        agent: "github-coder-bot",
        agentRole: "Automated PR Reviewer",
        action: "file.modify",
        resource: "src/auth/jwt_verifier.py",
        risk: "HIGH",
        riskScore: 78,
        decision: "APPROVE",
        reason: "Critical authentication subsystem file rewrite flagged for security architect sign-off",
        policy: "POL-CORE-AUTH-PROTECT",
        latencyMs: 24,
      },
      {
        agent: "marketing-summarizer",
        agentRole: "Web Intelligence Agent",
        action: "web.scrape",
        resource: "https://partner-portal.corp/pricing",
        risk: "LOW",
        riskScore: 9,
        decision: "ALLOW",
        reason: "Outbound read-only GET request to verified partner domain",
        policy: "POL-WEB-OUTBOUND-ALLOW",
        latencyMs: 18,
      },
      {
        agent: "injected-email-reader",
        agentRole: "Inbox Assistant",
        action: "credential.read",
        resource: "vault://github/personal_access_token",
        risk: "CRITICAL",
        riskScore: 99,
        decision: "BLOCK",
        reason: "Prompt injection detected in subject line; blocked exfiltration of repository credentials",
        policy: "POL-CREDENTIAL-VAULT-DEFENSE",
        latencyMs: 5,
      },
    ];

    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toTimeString().split(" ")[0] + "." + Math.floor(now.getMilliseconds());
      const randomSample = samplePool[Math.floor(Math.random() * samplePool.length)];
      
      const newEvent: AgentEvent = {
        ...randomSample,
        id: "evt-" + Math.floor(Math.random() * 90000 + 10000),
        timestamp: timeString,
        hash: Math.random().toString(16).substring(2, 18),
        prevHash: events[0]?.hash || "0000000000000000",
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isStreaming, events]);

  const filteredEvents = events.filter((e) => {
    if (filter === "ALL") return true;
    return e.decision === filter;
  });

  return (
    <section id="live-interceptor" className="py-20 border-b border-white/[0.08] bg-[#09090B] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs mb-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>LIVE GATEWAY TELEMETRY STREAM</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
              Runtime tool execution telemetry.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
              Every tool request dispatched by an autonomous agent is evaluated in single-digit milliseconds before execution.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs border transition-colors ${
                isStreaming
                  ? "border-amber-500/30 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40"
                  : "border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40"
              }`}
            >
              {isStreaming ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isStreaming ? "Pause Live Feed" : "Resume Stream"}
            </button>

            {/* Filter Pills */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-md p-1 font-mono text-xs">
              {(["ALL", "ALLOW", "APPROVE", "BLOCK"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                    filter === f
                      ? f === "BLOCK"
                        ? "bg-red-500 text-white font-bold"
                        : f === "APPROVE"
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : f === "ALLOW"
                        ? "bg-emerald-500 text-slate-950 font-bold"
                        : "bg-slate-700 text-white font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The Live Split-Screen Interceptor Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Live Event Stream Terminal (7 cols) */}
          <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#090D18] shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#060810] px-4 py-2.5 font-mono text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span>AGENT_TOOL_DISPATCH_PIPE (STDOUT)</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Displaying {filteredEvents.length} active events
              </span>
            </div>

            {/* Event List */}
            <div className="divide-y divide-slate-800/80 max-h-[500px] overflow-y-auto">
              {filteredEvents.map((evt) => {
                const isSelected = selectedEvent.id === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className={`p-3.5 transition-all cursor-pointer font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected ? "bg-slate-800/40 border-l-4 border-l-emerald-500" : "hover:bg-slate-800/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Decision Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider shrink-0 ${
                          evt.decision === "BLOCK"
                            ? "bg-red-500/20 text-red-300 border border-red-500/40"
                            : evt.decision === "APPROVE"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        }`}
                      >
                        {evt.decision === "BLOCK" && <XCircle className="h-3 w-3 text-red-400" />}
                        {evt.decision === "APPROVE" && <AlertTriangle className="h-3 w-3 text-amber-400" />}
                        {evt.decision === "ALLOW" && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                        {evt.decision}
                      </span>

                      {/* Action & Resource Info */}
                      <div>
                        <div className="text-white font-semibold flex items-center gap-2 flex-wrap">
                          <span>{evt.action}</span>
                          <span className="text-slate-500 text-[11px]">on</span>
                          <code className="text-slate-300 text-[11px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {evt.resource}
                          </code>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-1 flex items-center gap-2">
                          <span className="text-cyan-400">{evt.agent}</span>
                          <span className="text-slate-600">•</span>
                          <span>{evt.agentRole}</span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata on right */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-slate-500 text-[11px] shrink-0">
                      <span className="text-slate-400">{evt.timestamp}</span>
                      <span className="text-slate-500 font-mono text-[10px]">{evt.latencyMs}ms</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Stream Status */}
            <div className="border-t border-slate-800 bg-[#060810] px-4 py-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${isStreaming ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                {isStreaming ? "Streaming active event hooks" : "Stream paused"}
              </span>
              <span>Cedar Engine Latency Avg: 11.4ms</span>
            </div>
          </div>

          {/* Right Column: Deep Event Inspector (5 cols) */}
          <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0B101D] shadow-xl p-5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-white tracking-wider">EVENT DEEP INSPECTION</span>
              </div>
              <span className="text-slate-400 text-[11px]">{selectedEvent.id}</span>
            </div>

            {/* Risk Gauge */}
            <div className="mb-4 rounded-lg bg-slate-950/70 p-3 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-slate-400">RISK SEVERITY EVALUATION</span>
                <span className={`font-bold ${
                  selectedEvent.risk === "CRITICAL" ? "text-red-400" :
                  selectedEvent.risk === "HIGH" ? "text-amber-400" :
                  selectedEvent.risk === "MEDIUM" ? "text-yellow-400" : "text-emerald-400"
                }`}>
                  {selectedEvent.risk} ({selectedEvent.riskScore} / 100)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    selectedEvent.risk === "CRITICAL" ? "bg-red-500" :
                    selectedEvent.risk === "HIGH" ? "bg-amber-500" :
                    selectedEvent.risk === "MEDIUM" ? "bg-yellow-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${selectedEvent.riskScore}%` }}
                />
              </div>
            </div>

            {/* Key Value Details */}
            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">Target Action</span>
                <span className="text-white font-semibold">{selectedEvent.action}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">Agent Identifier</span>
                <span className="text-cyan-300">{selectedEvent.agent}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">Resource Path</span>
                <span className="text-slate-300 truncate max-w-[200px]" title={selectedEvent.resource}>
                  {selectedEvent.resource}
                </span>
              </div>
              {selectedEvent.destination && (
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-500">Destination</span>
                  <span className="text-red-300">{selectedEvent.destination}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">Enforced Policy</span>
                <span className="text-emerald-400 font-semibold">{selectedEvent.policy}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">Engine Evaluation Time</span>
                <span className="text-slate-300">{selectedEvent.latencyMs} ms</span>
              </div>
            </div>

            {/* Human Readable AI Explanation Box */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 mb-4">
              <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                <span>AI Reason Summary (LLM Explainer)</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                &ldquo;{selectedEvent.reason}&rdquo;
              </p>
              <span className="text-[10px] text-slate-500 block mt-2">
                * Note: Decision was produced deterministically by Policy &amp; Risk Engines. The LLM only generated this English explanation.
              </span>
            </div>

            {/* Cryptographic Hash Evidence */}
            <div className="rounded border border-slate-800/80 bg-slate-900/50 p-2.5 text-[10px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Event SHA-256:</span>
                <span className="font-mono text-slate-300">{selectedEvent.hash}...</span>
              </div>
              <div className="flex justify-between">
                <span>Previous Hash:</span>
                <span className="font-mono text-slate-400">{selectedEvent.prevHash}...</span>
              </div>
              <div className="text-emerald-400 font-semibold text-right pt-1">
                ✓ Cryptographically chained in audit ledger
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
