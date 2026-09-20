'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot, Server, ArrowDown, Shield, CheckCircle2, AlertTriangle, XCircle,
  Eye, FileCode, Check, Search, Cpu, Database, Globe, FolderGit2,
  MessageSquare, HardDrive, Mail, FileText, Layers, Lock, Sparkles, Terminal
} from 'lucide-react';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { cn } from '@/lib/utils';

export function GatewayArchitecture() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const clients = [
    { name: 'Claude Desktop', type: 'Desktop Client' },
    { name: 'Cursor IDE', type: 'Dev Environment' },
    { name: 'LangChain Agent', type: 'Autonomous Framework' },
    { name: 'CrewAI Crew', type: 'Multi-Agent Network' },
    { name: 'Custom LLM Runtime', type: 'Enterprise API' },
  ];

  const gatewaySteps = [
    { id: 1, name: 'Discover MCP tools', icon: Search, detail: 'Dynamic capability negotiation via list_tools protocol' },
    { id: 2, name: 'Intercept tool calls', icon: Terminal, detail: 'Sub-millisecond stdio/SSE proxy interception' },
    { id: 3, name: 'Normalize request', icon: FileCode, detail: 'Parse tool args, AST schema, & execution context' },
    { id: 4, name: 'Cedar authorization', icon: Shield, detail: 'Deterministic policy evaluation via Amazon Cedar engine' },
    { id: 5, name: 'Risk analysis', icon: Cpu, detail: 'Multi-factor behavioral risk scoring (0 - 100)' },
    { id: 6, name: 'Prompt-injection detection', icon: AlertTriangle, detail: 'Dual-engine ML + heuristic vector sanitization' },
    { id: 7, name: 'Sensitive-data detection', icon: Lock, detail: 'PII, secret credential, & exfiltration scanner' },
    { id: 8, name: 'Context analysis', icon: Eye, detail: 'Stateful session intent and anomaly correlation' },
    { id: 9, name: 'Bedrock Guardrail', icon: Sparkles, detail: 'AWS Bedrock safety rails & content filters' },
  ];

  const decisions = [
    { name: 'ALLOW', desc: 'Cryptographically passed to tool', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
    { name: 'APPROVE', desc: 'Escalated to human supervisor', color: 'text-amber-300', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
    { name: 'BLOCK', desc: 'Deterministic fail-closed denial', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
  ];

  const mcpServers = [
    { name: 'GitHub', desc: 'Repos, PRs, Issues', icon: FolderGit2 },
    { name: 'Slack', desc: 'Channels & Messages', icon: MessageSquare },
    { name: 'Google Drive', desc: 'Cloud Documents', icon: HardDrive },
    { name: 'Gmail', desc: 'Emails & Calendar', icon: Mail },
    { name: 'Notion', desc: 'Knowledge Base', icon: FileText },
    { name: 'Databases', desc: 'PostgreSQL, Redis', icon: Database },
    { name: 'Filesystem', desc: 'Local Storage IO', icon: HardDrive },
    { name: 'Browser', desc: 'Web Automation', icon: Globe },
    { name: 'Any MCP Tool', desc: 'Extensible JSONRPC', icon: Server },
  ];

  return (
    <CardSpotlight className="w-full p-6 sm:p-8 rounded-3xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-300 font-memorable select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-sky-500/10 border border-sky-500/25">
              <Layers className="h-3 w-3 text-sky-400" />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
              End-to-End Gateway Architecture
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            The AgentGuard MCP Interception Engine
          </h2>
          <p className="text-[13.5px] text-zinc-400 mt-1 max-w-2xl font-normal leading-relaxed">
            Every MCP tool call from any AI agent or client is inspected, risk-evaluated, and deterministically authorized before reaching upstream servers.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-mono bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Zero-Trust Gateway Spec v1.0</span>
        </div>
      </div>

      {/* Main 3-Tier Flow Diagram */}
      <div className="mt-8 space-y-8">
        {/* ========================================================================= */}
        {/* TIER 1: ANY MCP CLIENT / AI AGENT                                         */}
        {/* ========================================================================= */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[13.5px] font-semibold text-white tracking-tight">
                  ANY MCP CLIENT / AI AGENT
                </h3>
                <p className="text-[11px] text-zinc-400 font-normal">
                  Inbound tool execution requests via stdio or SSE streams
                </p>
              </div>
            </div>
            <span className="text-[10.5px] font-mono text-zinc-400 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06]">
              Client Tier
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-3">
            {clients.map((c) => (
              <div
                key={c.name}
                className="p-3 rounded-xl border border-white/[0.06] bg-[#0a0c10]/80 hover:border-white/[0.14] transition-colors"
              >
                <p className="text-[12.5px] font-medium text-white truncate">{c.name}</p>
                <p className="text-[10.5px] text-zinc-500 font-normal truncate mt-0.5">{c.type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Connecting Pipe */}
        <div className="flex flex-col items-center justify-center -my-3 relative z-10">
          <div className="h-6 w-px bg-gradient-to-b from-white/30 to-sky-400" />
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 border border-sky-400/40 text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
            <ArrowDown className="h-3 w-3" />
          </div>
          <div className="h-6 w-px bg-gradient-to-b from-sky-400 to-white/30" />
        </div>

        {/* ========================================================================= */}
        {/* TIER 2: AgentGuard MCP Gateway (Core Inspection Engine)                  */}
        {/* ========================================================================= */}
        <div className="relative rounded-2xl border border-sky-500/20 bg-sky-950/[0.04] p-5 sm:p-6 shadow-[0_0_40px_rgba(56,189,248,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 border border-sky-400/30 text-sky-300">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-white tracking-tight">
                  AgentGuard MCP Gateway
                </h3>
                <p className="text-[11.5px] text-zinc-400 font-normal">
                  9-Stage Deterministic Security &amp; Authorization Pipeline
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                &lt;1.2ms latency overhead
              </span>
            </div>
          </div>

          {/* 9 Pipeline Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {gatewaySteps.map((step) => {
              const Icon = step.icon;
              const isHovered = activeStep === step.id;
              return (
                <div
                  key={step.id}
                  onMouseEnter={() => setActiveStep(step.id)}
                  onMouseLeave={() => setActiveStep(null)}
                  className={cn(
                    'group relative p-3 rounded-xl border transition-all duration-200 cursor-pointer',
                    isHovered
                      ? 'border-sky-400/40 bg-white/[0.06] shadow-md'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors',
                      isHovered
                        ? 'border-sky-400/40 bg-sky-500/20 text-sky-300'
                        : 'border-white/[0.08] bg-white/[0.04] text-zinc-400'
                    )}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-white truncate tracking-tight">
                        {step.name}
                      </p>
                      <p className="text-[10.5px] text-zinc-400 font-normal truncate mt-0.5">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verdict Sub-Tier */}
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] font-medium uppercase tracking-wider text-zinc-400">
                Evaluation Output &amp; Policy Routing
              </span>
              <span className="text-[10.5px] font-mono text-zinc-500">
                Cryptographic Decision Triad
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {decisions.map((d) => (
                <div
                  key={d.name}
                  className={cn('p-3 rounded-xl border flex items-center justify-between', d.bg, d.border)}
                >
                  <div>
                    <span className={cn('text-[13px] font-bold tracking-wider', d.color)}>
                      {d.name}
                    </span>
                    <p className="text-[10.5px] text-zinc-400 font-normal mt-0.5">
                      {d.desc}
                    </p>
                  </div>
                  <span className={cn('h-2 w-2 rounded-full', d.color.replace('text-', 'bg-'))} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Connecting Pipe */}
        <div className="flex flex-col items-center justify-center -my-3 relative z-10">
          <div className="h-6 w-px bg-gradient-to-b from-white/30 to-emerald-400" />
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <ArrowDown className="h-3 w-3" />
          </div>
          <div className="h-6 w-px bg-gradient-to-b from-emerald-400 to-white/30" />
        </div>

        {/* ========================================================================= */}
        {/* TIER 3: ANY MCP SERVER                                                    */}
        {/* ========================================================================= */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Server className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[13.5px] font-semibold text-white tracking-tight">
                  ANY MCP SERVER
                </h3>
                <p className="text-[11px] text-zinc-400 font-normal">
                  Downstream target tools and protected integrations
                </p>
              </div>
            </div>
            <span className="text-[10.5px] font-mono text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Verified Execution
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 mt-3">
            {mcpServers.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.name}
                  className="p-2.5 rounded-xl border border-white/[0.06] bg-[#0a0c10]/80 hover:border-white/[0.14] transition-colors text-center flex flex-col items-center justify-center min-h-[76px]"
                >
                  <Icon className="h-4 w-4 text-zinc-400 mb-1" />
                  <p className="text-[11.5px] font-medium text-white truncate w-full">{s.name}</p>
                  <p className="text-[9.5px] text-zinc-500 truncate w-full">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CardSpotlight>
  );
}
