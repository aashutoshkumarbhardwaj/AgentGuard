'use client';

import { motion } from 'framer-motion';
import { Shield, Github, Star } from 'lucide-react';
import { McpSecurityGraph } from '@/components/mcp/security-graph';
import { ProtectedTools } from '@/components/mcp/protected-tools';
import { agents } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function McpPage() {
  return (
    <div className="space-y-5">
      {/* Compact hero header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between pt-2"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Shield className="h-4 w-4 text-primary" strokeWidth={2.2} />
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">MCP Gateway</span>
          </div>
          <h1 className="text-[26px] font-bold tracking-tight-tightest leading-tight">
            Secure the tool layer
          </h1>
          <p className="text-[13px] text-muted-foreground/60 mt-1">
            Every AI agent tool call is inspected, risk-scored, and authorized in real time.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/20 px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-success" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            <span className="text-[12px] font-medium text-muted-foreground">Connected</span>
          </div>
          <span className="text-[11px] text-muted-foreground/40 font-mono">
            {agents.length} agents · 3 tools · protected
          </span>
        </div>
      </motion.div>

      {/* Compact live counters */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="grid grid-cols-4 gap-3"
      >
        {[
          { label: 'Agents', value: agents.length, color: 'text-foreground' },
          { label: 'Tools', value: 3, color: 'text-foreground' },
          { label: 'Calls', value: '8,492', color: 'text-foreground' },
          { label: 'Blocked', value: 37, color: 'text-danger' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border/40 surface-card px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">{stat.label}</p>
            <p className={`text-[18px] font-bold font-mono tabular-nums mt-0.5 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Security graph — the centerpiece */}
      <McpSecurityGraph />

      {/* Protected tools */}
      <ProtectedTools />

      {/* Architecture summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="rounded-xl border border-border/30 bg-muted/10 p-4"
      >
        <h3 className="text-[13px] font-semibold mb-3">Architecture</h3>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-muted-foreground/50">
          {['Agent', 'MCP Gateway', 'AgentGuard', 'Policy + Risk + Threat', 'Decision', 'Tool'].map((step, i, arr) => (
            <span key={step} className="flex items-center gap-2">
              <span className={cn(step === 'AgentGuard' ? 'text-primary' : step === 'Decision' ? 'text-info' : '')}>{step}</span>
              {i < arr.length - 1 && <span className="text-muted-foreground/20">→</span>}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground/40 mt-2">
          Requests flow through the MCP gateway, are inspected by AgentGuard's security pipeline, and only permitted actions reach the tool layer.
        </p>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="flex items-center justify-between gap-3 rounded-lg border border-border/30 bg-muted/10 px-4 py-3"
      >
        <span className="text-[12px] text-muted-foreground/50">Runtime security for the MCP tool layer.</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[12px] text-muted-foreground/60 transition-colors hover:text-foreground"
        >
          <Github className="h-3.5 w-3.5" /> <Star className="h-2.5 w-2.5 text-warning" /> 2.4k
        </a>
      </motion.div>
    </div>
  );
}
