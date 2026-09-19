'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { SecurityEvent } from '@/lib/types';
import { useEventInspector } from '@/components/providers/event-provider';
import { cn } from '@/lib/utils';
import { getRiskColor } from '@/lib/helpers';

const decisionConfig = {
  ALLOW: { color: 'text-success', dot: 'bg-success', label: 'ALLOW' },
  APPROVE: { color: 'text-warning', dot: 'bg-warning', label: 'APPROVE' },
  BLOCK: { color: 'text-danger', dot: 'bg-danger', label: 'BLOCK' },
};

interface LiveActivityStreamProps {
  events: SecurityEvent[];
  compact?: boolean;
}

export function LiveActivityStream({ events }: LiveActivityStreamProps) {
  const { openInspector } = useEventInspector();

  return (
    <div className="space-y-px">
      <AnimatePresence initial={false}>
        {events.map((event) => {
          const config = decisionConfig[event.decision];
          return (
            <motion.button
              key={event.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => openInspector(event.id)}
              className="group flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-foreground/[0.03]"
            >
              {/* Timestamp */}
              <span className="text-[11px] font-mono text-muted-foreground/40 tabular-nums shrink-0 w-16">
                {event.timestamp}
              </span>

              {/* Agent */}
              <span className="text-[12px] text-muted-foreground/70 truncate shrink-0 w-28">
                {event.agentId}
              </span>

              {/* Action */}
              <span className="text-[12px] font-mono truncate flex-1 min-w-0">
                {event.action}
              </span>

              {/* Decision */}
              <div className={cn('flex items-center gap-1.5 shrink-0', config.color)}>
                <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
                <span className="text-[10px] font-semibold uppercase tracking-wider w-14">{config.label}</span>
              </div>

              {/* Risk */}
              <span className={cn(
                'text-[11px] font-mono font-semibold tabular-nums shrink-0 w-7 text-right',
                getRiskColor(event.riskLevel)
              )}>
                {event.riskScore}
              </span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
