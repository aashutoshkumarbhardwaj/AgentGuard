'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bot, ArrowRight } from 'lucide-react';
import { agents } from '@/lib/mock-data';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

const statusConfig = {
  ACTIVE: { color: 'text-success', dot: 'bg-success', label: 'Active', ring: 'shadow-[0_0_8px_hsl(var(--success))]' },
  IDLE: { color: 'text-muted-foreground', dot: 'bg-muted-foreground', label: 'Idle', ring: '' },
  SUSPENDED: { color: 'text-danger', dot: 'bg-danger', label: 'Suspended', ring: 'shadow-[0_0_8px_hsl(var(--danger))]' },
};

export default function AgentsPage() {
  return (
    <div>
      <PageHeader title="Agents" subtitle={`${agents.length} registered agents`} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent, i) => {
          const status = statusConfig[agent.status];
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <Link href={`/agents/${agent.id}`}>
                <div className="group relative overflow-hidden rounded-2xl border border-border/50 surface-card p-5 transition-all duration-300 hover:border-primary/25">
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-primary/[0.06] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Header */}
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                        <div className="absolute inset-0 rounded-xl bg-primary/8 blur-md" />
                        <Bot className="relative h-5 w-5 text-primary" strokeWidth={2.2} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{agent.name}</h3>
                        <p className="text-xs font-mono text-muted-foreground/60">{agent.id}</p>
                      </div>
                    </div>
                    <div className={cn('flex items-center gap-1.5', status.color)}>
                      <span className={cn('h-2 w-2 rounded-full', status.dot, status.ring)} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{status.label}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="relative mt-4 text-[13px] text-muted-foreground/70 leading-relaxed">{agent.description}</p>

                  {/* Stats */}
                  <div className="relative mt-4 grid grid-cols-3 gap-3 border-t border-border/40 pt-4">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/40">Permissions</p>
                      <p className="text-xl font-bold font-mono mt-1 tabular-nums">{agent.permissions}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/40">Actions</p>
                      <p className="text-xl font-bold font-mono mt-1 tabular-nums text-info">{agent.actions}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/40">Blocked</p>
                      <p className="text-xl font-bold font-mono mt-1 tabular-nums text-danger">{agent.blocked}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground/50 font-mono">{agent.framework}</span>
                    <span className="flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                      Inspect <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
