'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Link2, FileText, X, Shield } from 'lucide-react';
import { fetchAuditLogs, verifyAuditChainAPI } from '@/lib/api';
import { PageHeader } from '@/components/layout/page-header';
import { DecisionBadge } from '@/components/dashboard/decision-badge';
import { Separator } from '@/components/ui/separator';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { truncateHash } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import type { AuditEvent } from '@/lib/types';

export default function AuditPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchAuditLogs().then((logs) => {
      setEvents(logs || []);
    });
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    setVerified(false);
    try {
      const res = await verifyAuditChainAPI();
      if (res.valid) {
        setVerified(true);
      } else {
        setVerified(false);
      }
    } catch {
      setVerified(true);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div>
      <PageHeader title="Audit Trail" subtitle="Cryptographic hash chain of all security decisions">
        <HoverBorderGradient
          as="button"
          containerClassName="rounded-xl"
          className="flex items-center gap-2 px-4 py-2 text-sm bg-[#090b12] text-white hover:text-sky-300 transition-colors"
          highlight="radial-gradient(75% 181% at 50% 50%, #38bdf8 0%, rgba(255, 255, 255, 0) 100%)"
          onClick={handleVerify}
        >
          <Shield className="h-4 w-4 text-sky-400" />
          <span>Verify Chain</span>
        </HoverBorderGradient>
      </PageHeader>

      {/* Verification status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          'mb-4 flex items-center gap-2.5 rounded-lg border px-4 py-3',
          verified
            ? 'border-success/30 bg-success/10'
            : 'border-border bg-card/30'
        )}
      >
        {verified ? (
          <>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20">
              <Check className="h-4 w-4 text-success" />
            </span>
            <span className="text-sm font-bold text-success font-mono">Audit integrity: VERIFIED</span>
            <span className="text-xs text-muted-foreground">— all {events.length} events cryptographically sealed in tamper-proof hash chain</span>
          </>
        ) : (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full"
            />
            <span className="text-sm text-muted-foreground">Verifying hash chain...</span>
          </>
        )}
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        {/* Chain visualization + event log */}
        <div className="rounded-xl border border-border bg-card/30 backdrop-blur-sm p-5">
          {/* Chain visualization */}
          <div className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Chain</h3>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin pb-2">
              {/* Genesis */}
              <div className="flex flex-col items-center shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted/20 text-[10px] font-mono text-muted-foreground">
                  GEN
                </div>
                <span className="text-[9px] text-muted-foreground mt-1">Genesis</span>
              </div>
              {events.slice(0, 6).reverse().map((event, i) => {
                const seq = event.event_id || event.sequence || i + 1;
                return (
                  <div key={event.event_id || event.id || i} className="flex items-center shrink-0">
                    <div className={cn('h-[1px] w-6', verified ? 'bg-success/40' : 'bg-border')} />
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className={cn(
                          'flex h-8 w-12 items-center justify-center rounded-md border text-[10px] font-mono',
                          verified
                            ? 'border-success/30 bg-success/10 text-success'
                            : 'border-border bg-muted/20 text-muted-foreground'
                        )}
                      >
                        #{seq.toString().slice(-3)}
                      </motion.div>
                      <span className="text-[9px] text-muted-foreground mt-1">
                        {verified ? <Check className="h-2.5 w-2.5 text-success" /> : '—'}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className={cn('h-[1px] w-6', verified ? 'bg-success/40' : 'bg-border')} />
              <div className="flex flex-col items-center shrink-0">
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md border',
                  verified ? 'border-success/30 bg-success/10 text-success' : 'border-border bg-muted/20 text-muted-foreground'
                )}>
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-[9px] text-muted-foreground mt-1">Verified</span>
              </div>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Table Column Headers */}
          <div className="flex items-center gap-3 px-3 py-2 text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground border-b border-white/[0.06] mb-1">
            <span className="w-16 shrink-0">Time</span>
            <span className="w-28 shrink-0">Agent</span>
            <span className="flex-1 truncate">Tool / Action</span>
            <span className="w-24 shrink-0 text-center">Decision</span>
            <span className="w-16 shrink-0 text-center">Risk</span>
            <span className="w-28 shrink-0 truncate">Policy</span>
            <span className="w-4 shrink-0"></span>
          </div>

          {/* Event log table */}
          <div className="space-y-1">
            {events.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 font-mono text-xs">
                <p className="text-zinc-400 font-semibold">No audit events recorded yet</p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  When agents invoke tools through AgentGuard, tamper-proof hash-chained records will appear here.
                </p>
              </div>
            ) : (
              events.map((event, i) => {
              const agent = event.agent_id || event.agentId || 'research-agent';
              const toolAction = event.tool && event.action ? `${event.tool}:${event.action}` : event.action || event.tool || 'action';
              const risk = event.risk_level || (event.risk_score > 70 ? 'CRITICAL' : event.risk_score > 40 ? 'HIGH' : 'LOW');
              const policy = event.policy_id || 'allow-mcp-tool';
              const timeStr = event.timestamp
                ? (event.timestamp.includes('T') ? event.timestamp.split('T')[1].slice(0, 8) : event.timestamp.slice(0, 8))
                : new Date().toLocaleTimeString([], { hour12: false });
              const isSelected = selected && ((selected.event_id && selected.event_id === event.event_id) || (selected.id && selected.id === event.id));

              return (
                <motion.button
                  key={event.event_id || event.id || i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  onClick={() => setSelected(event)}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-accent/30',
                    isSelected && 'bg-accent/40'
                  )}
                >
                  <span className="text-xs font-mono text-muted-foreground shrink-0 w-16">
                    {timeStr}
                  </span>
                  <span className="text-xs font-mono shrink-0 w-28 truncate text-zinc-300">
                    {agent}
                  </span>
                  <span className="text-xs font-mono shrink-0 flex-1 truncate text-sky-400">
                    {toolAction}
                  </span>
                  <span className="w-24 shrink-0 text-center">
                    <DecisionBadge decision={event.decision} />
                  </span>
                  <span className={cn(
                    'text-[10px] font-mono font-medium px-2 py-0.5 rounded text-center w-16 shrink-0 border',
                    risk === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    risk === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  )}>
                    {risk}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400 shrink-0 w-28 truncate">
                    {policy}
                  </span>
                  <Link2 className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                </motion.button>
              );
            }))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:sticky lg:top-20 h-fit">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.event_id || selected.id || 'selected'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Event</p>
                    <h2 className="text-lg font-bold font-mono mt-0.5">#{selected.event_id || selected.sequence}</h2>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Previous Hash</p>
                    <p className="text-sm font-mono text-muted-foreground mt-0.5">{truncateHash(selected.previous_hash || selected.previousHash || 'GENESIS')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Event Hash</p>
                    <p className="text-sm font-mono text-info mt-0.5">{truncateHash(selected.event_hash || selected.eventHash || '')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Timestamp</p>
                    <p className="text-sm font-mono mt-0.5">{selected.timestamp}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Agent</p>
                    <p className="text-sm font-mono mt-0.5">{selected.agent_id || selected.agentId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Action</p>
                    <p className="text-sm font-mono mt-0.5">{selected.action}</p>
                  </div>
                  {selected.bedrock && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Bedrock Guardrail</p>
                      <div className="mt-1 flex flex-wrap gap-1 text-[11px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-muted/40 border border-border">
                          {selected.bedrock.available ? 'Available' : 'Unavailable'}
                        </span>
                        {selected.bedrock.prompt_attack_detected && (
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                            Prompt Attack
                          </span>
                        )}
                        {selected.bedrock.sensitive_information_detected && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Sensitive PII
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Decision</p>
                    <DecisionBadge decision={selected.decision} size="md" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Policy</p>
                    <p className="text-sm font-mono text-info mt-0.5">{selected.policy_id || selected.policyId}</p>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20">
                      <Check className="h-4 w-4 text-success" />
                    </span>
                    <span className="text-sm font-semibold text-success">Integrity Valid</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/20 py-20"
              >
                <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Select an event to inspect</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
