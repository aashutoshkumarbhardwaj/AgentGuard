'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronRight, X } from 'lucide-react';
import { threats } from '@/lib/mock-data';
import { PageHeader } from '@/components/layout/page-header';
import { DecisionBadge } from '@/components/dashboard/decision-badge';
import { Separator } from '@/components/ui/separator';
import type { Threat } from '@/lib/types';
import { cn } from '@/lib/utils';

const severityConfig = {
  CRITICAL: { color: 'text-danger', bg: 'bg-danger/[0.08] border-danger/25', label: 'CRITICAL', glow: 'glow-danger' },
  HIGH: { color: 'text-warning', bg: 'bg-warning/[0.08] border-warning/25', label: 'HIGH', glow: 'glow-warning' },
  MEDIUM: { color: 'text-warning', bg: 'bg-warning/[0.05] border-warning/15', label: 'MEDIUM', glow: '' },
  LOW: { color: 'text-success', bg: 'bg-success/[0.08] border-success/25', label: 'LOW', glow: '' },
};

export default function ThreatsPage() {
  const [selected, setSelected] = useState<Threat | null>(null);

  return (
    <div>
      <PageHeader title="Threat Center" subtitle={`${threats.length} threats detected`} />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Threat list */}
        <div className="space-y-3">
          {threats.map((threat, i) => {
            const sev = severityConfig[threat.severity];
            return (
              <motion.button
                key={threat.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                onClick={() => setSelected(threat)}
                className={cn(
                  'group relative overflow-hidden w-full text-left rounded-2xl border surface-card p-5 transition-all',
                  sev.bg,
                  selected?.id === threat.id && 'ring-1 ring-primary/30'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl border', sev.bg)}>
                      <AlertTriangle className={cn('h-[18px] w-[18px]', sev.color)} strokeWidth={2.2} />
                    </span>
                    <div>
                      <p className={cn('text-[10px] font-bold uppercase tracking-[0.15em]', sev.color)}>
                        {sev.label}
                      </p>
                      <p className="text-[14px] font-semibold mt-0.5">{threat.type}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                </div>

                <div className="mt-3 space-y-1.5">
                  <p className="text-[11px] text-muted-foreground/60 font-mono">{threat.agentId} · {threat.action}</p>
                  <p className="text-[12px] text-muted-foreground/50 italic truncate">"{threat.snippet}"</p>
                </div>

                <div className="mt-3 flex items-center gap-4 border-t border-border/30 pt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/40">Rule</span>
                    <span className={cn('text-xs font-semibold', threat.ruleEngine ? 'text-danger' : 'text-muted-foreground/40')}>
                      {threat.ruleEngine ? 'MATCH' : '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/40">ML</span>
                    <span className={cn('text-xs font-semibold', threat.mlDetector ? 'text-danger' : 'text-muted-foreground/40')}>
                      {threat.mlDetector ? `${threat.confidence}%` : '—'}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Threat detail panel */}
        <div className="lg:sticky lg:top-20 h-fit">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-border/40 surface-elevated p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className={cn('text-[10px] font-bold uppercase tracking-[0.15em]', severityConfig[selected.severity].color)}>
                      Threat Detected
                    </p>
                    <h2 className="text-xl font-bold mt-1">{selected.type}</h2>
                    <p className="text-[13px] font-mono text-muted-foreground/60 mt-0.5">{selected.agentId} · {selected.action}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Snippet */}
                <div className="rounded-xl border border-border/40 bg-muted/15 p-3 mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40 mb-1">Input</p>
                  <p className="text-[13px] font-mono italic">"{selected.snippet}"</p>
                </div>

                <Separator className="my-4 opacity-50" />

                {/* Detection */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/40 mb-3">Detection</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg bg-muted/15 px-3 py-2">
                      <span className="text-[13px]">Rule Engine</span>
                      <span className={cn('text-[13px] font-semibold', selected.ruleEngine ? 'text-danger' : 'text-muted-foreground/40')}>
                        {selected.ruleEngine ? 'Detected' : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted/15 px-3 py-2">
                      <span className="text-[13px]">ML Detector</span>
                      <span className={cn('text-[13px] font-semibold', selected.mlDetector ? 'text-danger' : 'text-muted-foreground/40')}>
                        {selected.mlDetector ? 'Detected' : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted/15 px-3 py-2">
                      <span className="text-[13px]">Confidence</span>
                      <span className="text-[13px] font-mono font-semibold text-danger">{selected.confidence}%</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-4 opacity-50" />

                {/* Risk Analysis */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/40 mb-3">Risk Analysis</p>
                  <div className="space-y-1.5">
                    {selected.riskFactors.map((factor, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[13px]">
                        <span className="text-muted-foreground/60">{factor.label}</span>
                        <span className={cn('font-mono font-semibold', factor.delta > 20 ? 'text-danger' : 'text-warning')}>
                          +{factor.delta}
                        </span>
                      </div>
                    ))}
                    <Separator className="my-2 opacity-50" />
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold">Final Risk</span>
                      <span className="text-xl font-bold font-mono text-danger tabular-nums">{selected.finalRisk}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-4 opacity-50" />

                {/* Decision */}
                <div className="flex justify-center">
                  <DecisionBadge decision="BLOCK" size="lg" />
                </div>

                {/* Reasons */}
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/40 mb-3">
                    Why was this blocked?
                  </p>
                  <div className="space-y-2.5">
                    {selected.reasons.map((reason, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.1 }}
                        className="flex items-start gap-2.5"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger/15 text-[10px] font-bold text-danger">
                          {idx + 1}
                        </span>
                        <span className="text-[13px]">{reason}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-border/40 surface-card py-24"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/20">
                  <AlertTriangle className="h-7 w-7 text-muted-foreground/20" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-muted-foreground/40 mt-4">Select a threat to inspect</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
