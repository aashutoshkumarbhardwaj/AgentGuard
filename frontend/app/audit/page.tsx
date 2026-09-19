'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Link2, FileText, X, Shield } from 'lucide-react';
import { auditTrail } from '@/lib/mock-data';
import { PageHeader } from '@/components/layout/page-header';
import { DecisionBadge } from '@/components/dashboard/decision-badge';
import { Separator } from '@/components/ui/separator';
import { truncateHash } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import type { AuditEvent } from '@/lib/types';

export default function AuditPage() {
  const [selected, setSelected] = useState<AuditEvent | null>(null);
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setVerified(false);
    setTimeout(() => setVerified(true), 1200);
  };

  return (
    <div>
      <PageHeader title="Audit Trail" subtitle="Cryptographic hash chain of all security decisions">
        <button
          onClick={handleVerify}
          className="flex items-center gap-2 rounded-lg border border-border bg-card/30 px-4 py-2 text-sm hover:border-success/30 transition-colors"
        >
          <Shield className="h-4 w-4 text-primary" />
          Verify Chain
        </button>
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
            <span className="text-sm font-semibold text-success">Hash Chain Verified</span>
            <span className="text-xs text-muted-foreground">— all {auditTrail.length} events have valid integrity</span>
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
              {auditTrail.slice(0, 6).reverse().map((event, i) => (
                <div key={event.id} className="flex items-center shrink-0">
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
                      #{event.sequence.toString().slice(-3)}
                    </motion.div>
                    <span className="text-[9px] text-muted-foreground mt-1">
                      {verified ? <Check className="h-2.5 w-2.5 text-success" /> : '—'}
                    </span>
                  </div>
                </div>
              ))}
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

          {/* Event log table */}
          <div className="space-y-1">
            {auditTrail.map((event, i) => (
              <motion.button
                key={event.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(event)}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent/30',
                  selected?.id === event.id && 'bg-accent/40'
                )}
              >
                <span className="text-xs font-mono text-muted-foreground shrink-0 w-16">
                  #{event.sequence}
                </span>
                <span className="text-xs font-mono shrink-0 w-32 truncate">
                  {event.agentId}
                </span>
                <span className="text-xs font-mono shrink-0 flex-1 truncate">
                  {event.action}
                </span>
                <span className="shrink-0">
                  <DecisionBadge decision={event.decision} />
                </span>
                <Link2 className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:sticky lg:top-20 h-fit">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Event</p>
                    <h2 className="text-lg font-bold font-mono mt-0.5">#{selected.sequence}</h2>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Previous Hash</p>
                    <p className="text-sm font-mono text-muted-foreground mt-0.5">{truncateHash(selected.previousHash)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Event Hash</p>
                    <p className="text-sm font-mono text-info mt-0.5">{truncateHash(selected.eventHash)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Timestamp</p>
                    <p className="text-sm font-mono mt-0.5">{selected.timestamp}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Agent</p>
                    <p className="text-sm font-mono mt-0.5">{selected.agentId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Action</p>
                    <p className="text-sm font-mono mt-0.5">{selected.action}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Decision</p>
                    <DecisionBadge decision={selected.decision} size="md" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Policy</p>
                    <p className="text-sm font-mono text-info mt-0.5">{selected.policyId}</p>
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
