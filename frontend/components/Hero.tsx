"use client";

import React, { useState } from "react";
import { Download, ArrowUpRight, Shield, Terminal, CheckCircle2, AlertTriangle, XCircle, Cpu } from "lucide-react";

export default function Hero() {
  const [selectedAgent, setSelectedAgent] = useState<"finance" | "database" | "calendar">("finance");

  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32 bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 text-center">
        
        {/* Top Announcement Pill - Exact Superset Style with Orange Dot */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950 px-4 py-1.5 text-xs font-medium text-zinc-300 mb-10 hover:border-white/20 transition-colors cursor-pointer">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
          <span>Zero-Trust Runtime Governance for Autonomous Agents</span>
          <span className="text-zinc-500">→</span>
        </div>

        {/* Main Headline - Exact Superset Typography & Signature Corner Brackets */}
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight font-sans">
            Bring Any Agent.
          </h1>
          
          {/* Framed Second Line with Warm Orange Corner Brackets */}
          <div className="bracket-frame mt-2 sm:mt-3">
            <div className="bracket-tl"></div>
            <div className="bracket-tr"></div>
            <div className="bracket-bl"></div>
            <div className="bracket-br"></div>
            <span className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight font-sans">
              Govern Them All.
            </span>
          </div>
        </div>

        {/* Sub-headline - Exact Superset Style */}
        <p className="text-lg sm:text-xl text-zinc-400 font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
          One runtime control plane for Amazon Bedrock, Claude, and any autonomous agent.
        </p>

        {/* Dual CTA Buttons - Exact Superset Style */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <a
            href="#live-interceptor"
            className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black uppercase tracking-wider transition-all hover:bg-zinc-200 active:scale-95 shadow-md"
          >
            <span>Deploy AgentGuard</span>
            <Download className="h-4 w-4" />
          </a>

          <a
            href="https://github.com/aashutoshkumarbhardwaj/Titan"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-950 px-6 py-3 text-sm font-medium text-zinc-300 hover:border-white/20 hover:text-white transition-all"
          >
            <span>View on GitHub</span>
            <ArrowUpRight className="h-4 w-4 text-zinc-500" />
          </a>
        </div>

        {/* Superset-Style Multi-Agent Interactive Workspace */}
        <div className="w-full text-left superset-card overflow-hidden">
          
          {/* Window Header with Tabs */}
          <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] bg-[#0A0A0A] px-4 py-2 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedAgent("finance")}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-mono transition-colors ${
                  selectedAgent === "finance"
                    ? "bg-zinc-900 text-white border border-white/10"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                <span>agent-01 // Claude-3.5 (Financial Wire)</span>
              </button>

              <button
                onClick={() => setSelectedAgent("database")}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-mono transition-colors ${
                  selectedAgent === "database"
                    ? "bg-zinc-900 text-white border border-white/10"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                <span>agent-02 // Llama-3 (DB Schema Alter)</span>
              </button>

              <button
                onClick={() => setSelectedAgent("calendar")}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-mono transition-colors ${
                  selectedAgent === "calendar"
                    ? "bg-zinc-900 text-white border border-white/10"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>agent-03 // Bedrock (Calendar Read)</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>CEDAR ENGINE V3.4</span>
              </span>
              <span>LATENCY: 1.4MS</span>
            </div>
          </div>

          {/* Three-Column Workspace Inspection View */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
            
            {/* Column 1: Agent Dispatch Request */}
            <div className="rounded-xl border border-white/[0.06] bg-[#060606] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-zinc-400 mb-3 pb-2 border-b border-white/[0.06]">
                  <span className="font-semibold text-zinc-200">1. INCOMING DISPATCH</span>
                  <span className="text-[10px] text-zinc-500">INTERCEPTED</span>
                </div>
                
                {selectedAgent === "finance" && (
                  <div className="space-y-2 text-zinc-300 text-[11px]">
                    <div className="text-zinc-500">// Agent attempts external wire</div>
                    <p className="text-rose-300">
                      agent.dispatch_tool(&quot;banking.wire_transfer&quot;, &#123;
                    </p>
                    <p className="pl-4 text-zinc-300">amount: $14,500.00,</p>
                    <p className="pl-4 text-zinc-300">recipient: &quot;0x94f...ext&quot;,</p>
                    <p className="pl-4 text-zinc-300">purpose: &quot;invoiced_vendor&quot;</p>
                    <p className="text-rose-300">&#125;)</p>
                  </div>
                )}

                {selectedAgent === "database" && (
                  <div className="space-y-2 text-zinc-300 text-[11px]">
                    <div className="text-zinc-500">// Agent attempts DDL drop</div>
                    <p className="text-amber-300">
                      agent.dispatch_tool(&quot;sql.execute_raw&quot;, &#123;
                    </p>
                    <p className="pl-4 text-zinc-300">query: &quot;DROP TABLE customer_vault&quot;,</p>
                    <p className="pl-4 text-zinc-300">database: &quot;prod_cluster_primary&quot;</p>
                    <p className="text-amber-300">&#125;)</p>
                  </div>
                )}

                {selectedAgent === "calendar" && (
                  <div className="space-y-2 text-zinc-300 text-[11px]">
                    <div className="text-zinc-500">// Agent reads schedule</div>
                    <p className="text-emerald-300">
                      agent.dispatch_tool(&quot;calendar.list_events&quot;, &#123;
                    </p>
                    <p className="pl-4 text-zinc-300">scope: &quot;read_only&quot;,</p>
                    <p className="pl-4 text-zinc-300">user: &quot;executive@tenant.internal&quot;</p>
                    <p className="text-emerald-300">&#125;)</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] text-zinc-500">
                Source: In-flight Bedrock Hook
              </div>
            </div>

            {/* Column 2: Cedar Policy Evaluation */}
            <div className="rounded-xl border border-white/[0.06] bg-[#060606] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-zinc-400 mb-3 pb-2 border-b border-white/[0.06]">
                  <span className="font-semibold text-zinc-200">2. CEDAR EVALUATION</span>
                  <span className="text-[10px] text-orange-400 font-bold">DETERMINISTIC</span>
                </div>

                {selectedAgent === "finance" && (
                  <div className="space-y-2 text-zinc-400 text-[11px]">
                    <div className="text-zinc-300 font-semibold">Policy #POL-TREASURY-01:</div>
                    <code className="block bg-zinc-950 p-2 rounded text-[10px] text-zinc-400 border border-white/[0.04]">
                      forbid (principal, action == &quot;wire_transfer&quot;, resource)
                      when &#123; context.amount &gt; 1000 &#125;;
                    </code>
                    <p className="text-zinc-400 mt-2">
                      Violation: Requested transfer ($14,500) exceeds autonomous cap ($1,000).
                    </p>
                  </div>
                )}

                {selectedAgent === "database" && (
                  <div className="space-y-2 text-zinc-400 text-[11px]">
                    <div className="text-zinc-300 font-semibold">Policy #POL-SCHEMA-02:</div>
                    <code className="block bg-zinc-950 p-2 rounded text-[10px] text-zinc-400 border border-white/[0.04]">
                      forbid (principal, action == &quot;execute_raw&quot;, resource)
                      when &#123; context.query like &quot;*DROP*&quot; &#125;;
                    </code>
                    <p className="text-zinc-400 mt-2">
                      Dual-Custody Requirement: Irreversible DDL flagged for human sign-off.
                    </p>
                  </div>
                )}

                {selectedAgent === "calendar" && (
                  <div className="space-y-2 text-zinc-400 text-[11px]">
                    <div className="text-zinc-300 font-semibold">Policy #POL-CALENDAR-ALLOW:</div>
                    <code className="block bg-zinc-950 p-2 rounded text-[10px] text-zinc-400 border border-white/[0.04]">
                      permit (principal in Role::Employee,
                      action == &quot;list_events&quot;, resource);
                    </code>
                    <p className="text-zinc-400 mt-2">
                      Permission Confirmed: Read-only scope inside trusted corporate domain.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] text-zinc-500">
                Decision Drift: 0.00% (No LLM self-policing)
              </div>
            </div>

            {/* Column 3: Gate Outcome & Proof */}
            <div className="rounded-xl border border-white/[0.06] bg-[#060606] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-zinc-400 mb-3 pb-2 border-b border-white/[0.06]">
                  <span className="font-semibold text-zinc-200">3. ENFORCEMENT VERDICT</span>
                  <span className="text-[10px] text-zinc-500">AUDITED</span>
                </div>

                {selectedAgent === "finance" && (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3">
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                        <XCircle className="h-4 w-4" />
                        <span>TERMINATED (403 FORBIDDEN)</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Tool call aborted before network dispatch. Zero dollars transferred.
                      </p>
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Hash: <span className="text-zinc-400">sha256:7f9a...3c12</span>
                    </div>
                  </div>
                )}

                {selectedAgent === "database" && (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                        <AlertTriangle className="h-4 w-4" />
                        <span>CHALLENGED (HUMAN APPROVAL)</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Execution paused. Authorization payload dispatched to SecOps Slack.
                      </p>
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Hash: <span className="text-zinc-400">sha256:91be...a84f</span>
                    </div>
                  </div>
                )}

                {selectedAgent === "calendar" && (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>AUTHORIZED &amp; EXECUTED</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Dispatched to calendar API. Audit ledger entry generated.
                      </p>
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Hash: <span className="text-zinc-400">sha256:14cb...902a</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] text-zinc-500 flex justify-between">
                <span>Execution Time: 1.4ms</span>
                <span className="text-emerald-400">PASSED GATE</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
