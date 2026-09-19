'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Check, X, Eye, AlertTriangle } from 'lucide-react';
import { pendingApprovals as initialApprovals } from '@/lib/mock-data';
import { PageHeader } from '@/components/layout/page-header';
import { RiskGauge } from '@/components/dashboard/risk-gauge';
import { Button } from '@/components/ui/button';
import type { Approval } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeAction, setRemoveAction] = useState<'approve' | 'deny' | null>(null);

  const handleApprove = (id: string) => {
    setRemoveAction('approve');
    setRemovingId(id);
    setTimeout(() => {
      setApprovals((prev) => prev.filter((a) => a.id !== id));
      setRemovingId(null);
      setRemoveAction(null);
    }, 700);
  };

  const handleDeny = (id: string) => {
    setRemoveAction('deny');
    setRemovingId(id);
    setTimeout(() => {
      setApprovals((prev) => prev.filter((a) => a.id !== id));
      setRemovingId(null);
      setRemoveAction(null);
    }, 700);
  };

  const pending = approvals.filter((a) => a.status === 'PENDING');

  return (
    <div>
      <PageHeader title="Approval Center" subtitle={`${pending.length} actions require human review`} />

      {pending.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-border/40 surface-card py-24"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 border border-success/20 glow-success">
            <Check className="h-8 w-8 text-success" strokeWidth={2.2} />
          </div>
          <p className="text-lg font-semibold mt-4">All caught up</p>
          <p className="text-sm text-muted-foreground/60 mt-1">No actions pending human review.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {pending.map((approval, i) => {
              const isRemoving = removingId === approval.id;
              return (
                <motion.div
                  key={approval.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    borderColor: isRemoving
                      ? removeAction === 'approve'
                        ? 'hsl(var(--success) / 0.5)'
                        : 'hsl(var(--danger) / 0.5)'
                      : 'hsl(var(--border) / 0.5)',
                  }}
                  exit={{ opacity: 0, x: 300 }}
                  transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    'relative overflow-hidden rounded-2xl border surface-elevated p-5',
                    isRemoving && removeAction === 'approve' && 'bg-success/5',
                    isRemoving && removeAction === 'deny' && 'bg-danger/5'
                  )}
                >
                  {/* Subtle left accent bar */}
                  <div className={cn(
                    'absolute left-0 top-0 bottom-0 w-[3px]',
                    isRemoving && removeAction === 'approve' ? 'bg-success' : isRemoving && removeAction === 'deny' ? 'bg-danger' : 'bg-warning/40'
                  )} />

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between pl-2">
                    {/* Left: Details */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 rounded-lg border border-warning/25 bg-warning/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-warning">
                          <ShieldAlert className="h-3 w-3" strokeWidth={2.2} />
                          Approval Required
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground/50">{approval.timestamp}</span>
                      </div>

                      {/* Agent + Action */}
                      <div className="space-y-2.5">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/40">Agent</p>
                          <p className="text-[13px] font-mono mt-0.5">{approval.agentId}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/40">Action</p>
                          <p className="text-base font-mono font-semibold mt-0.5">{approval.action}</p>
                        </div>

                        {/* Destination */}
                        {approval.destination && (
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/40">Destination</p>
                            <p className="text-[13px] font-mono text-info mt-0.5">{approval.destination}</p>
                          </div>
                        )}
                      </div>

                      {/* Reason */}
                      <div className="flex items-start gap-2 rounded-xl bg-warning/[0.06] border border-warning/20 p-3">
                        <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" strokeWidth={2.2} />
                        <p className="text-[13px] text-warning/90">{approval.reason}</p>
                      </div>
                    </div>

                    {/* Right: Risk + Actions */}
                    <div className="lg:w-56 space-y-4 shrink-0">
                      <div className="rounded-xl border border-border/40 bg-muted/15 p-4">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/40 mb-2">Risk</p>
                        <RiskGauge score={approval.riskScore} level={approval.riskLevel} showScale={false} />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDeny(approval.id)}
                          disabled={isRemoving}
                          variant="outline"
                          className="flex-1 border-danger/30 text-danger hover:bg-danger/10 hover:text-danger"
                        >
                          <X className="h-4 w-4 mr-1" /> Deny
                        </Button>
                        <Button
                          onClick={() => handleApprove(approval.id)}
                          disabled={isRemoving}
                          className="flex-1 bg-success text-success-foreground hover:bg-success/80"
                        >
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                      </div>
                      <Button variant="ghost" className="w-full text-muted-foreground" size="sm">
                        <Eye className="h-3.5 w-3.5 mr-1.5" /> View Request
                      </Button>
                    </div>
                  </div>

                  {/* Removal flash */}
                  <AnimatePresence>
                    {isRemoving && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={cn(
                          'mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold',
                          removeAction === 'approve'
                            ? 'bg-success/15 text-success'
                            : 'bg-danger/15 text-danger'
                        )}
                      >
                        {removeAction === 'approve' ? (
                          <>
                            <Check className="h-4 w-4" strokeWidth={2.2} /> Human approval received — tool execution authorized
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4" strokeWidth={2.2} /> Action denied — request blocked
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
