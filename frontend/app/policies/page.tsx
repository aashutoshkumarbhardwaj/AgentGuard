'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, ChevronRight, Code2 } from 'lucide-react';
import { policies } from '@/lib/mock-data';
import { PageHeader } from '@/components/layout/page-header';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Policy } from '@/lib/types';

export default function PoliciesPage() {
  const [selected, setSelected] = useState<Policy | null>(null);

  return (
    <div>
      <PageHeader title="Policies" subtitle={`${policies.filter((p) => p.status === 'ACTIVE').length} active policies`} />

      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        {/* Policy list */}
        <div className="grid gap-3 sm:grid-cols-2">
          {policies.map((policy, i) => (
            <motion.button
              key={policy.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              onClick={() => setSelected(policy)}
              className={cn(
                'group text-left rounded-xl border border-border bg-card/30 backdrop-blur-sm p-5 transition-colors hover:border-primary/30',
                selected?.id === policy.id && 'ring-1 ring-primary/30'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/20 border border-border">
                    <FileText className="h-4 w-4 text-info" />
                  </div>
                  <div>
                    <p className="text-sm font-mono font-semibold">{policy.name}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>

              <div className="mt-4 space-y-2">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Action</p>
                  <p className="text-sm font-mono mt-0.5">{policy.action}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Effect</p>
                    <span className={cn(
                      'inline-flex mt-0.5 items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                      policy.effect === 'PERMIT'
                        ? 'border-success/30 bg-success/10 text-success'
                        : 'border-danger/30 bg-danger/10 text-danger'
                    )}>
                      {policy.effect}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Status</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={cn(
                        'h-2 w-2 rounded-full',
                        policy.status === 'ACTIVE' ? 'bg-success animate-pulse' : 'bg-muted-foreground'
                      )} />
                      <span className={cn('text-[10px] font-semibold uppercase', policy.status === 'ACTIVE' ? 'text-success' : 'text-muted-foreground')}>
                        {policy.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
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
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Policy</p>
                    <h2 className="text-lg font-mono font-bold mt-0.5">{selected.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{selected.description}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Action</p>
                    <p className="text-sm font-mono mt-0.5">{selected.action}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Effect</p>
                    <span className={cn(
                      'inline-flex mt-0.5 items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                      selected.effect === 'PERMIT'
                        ? 'border-success/30 bg-success/10 text-success'
                        : 'border-danger/30 bg-danger/10 text-danger'
                    )}>
                      {selected.effect}
                    </span>
                  </div>
                </div>

                {/* Cedar code */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Code2 className="h-3 w-3" /> Cedar Syntax
                  </p>
                  <pre className="rounded-lg border border-border bg-muted/20 p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                    {selected.cedar}
                  </pre>
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
                <p className="text-sm text-muted-foreground">Select a policy to inspect</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
