'use client';

import { motion } from 'framer-motion';
import { getRiskBarColor, getRiskColor } from '@/lib/helpers';
import type { RiskLevel } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  showScale?: boolean;
}

export function RiskGauge({ score, level, showScale = true }: RiskGaugeProps) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn('text-3xl font-bold font-mono tabular-nums tracking-tight', getRiskColor(level))}
        >
          {score}
        </motion.span>
        <span className="text-sm text-muted-foreground/50">/ 100</span>
        <span className={cn('text-xs font-semibold uppercase tracking-wider', getRiskColor(level))}>{level}</span>
      </div>
      <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-muted/40">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={cn('h-full rounded-full', getRiskBarColor(score))}
          style={{ boxShadow: `0 0 8px -2px hsl(var(--${score >= 90 ? 'danger' : score >= 70 ? 'warning' : 'success'}))` }}
        />
      </div>
      {showScale && (
        <>
          <div className="mt-1.5 flex justify-between text-[9px] font-mono text-muted-foreground/40">
            <span>0</span>
            <span>40</span>
            <span>70</span>
            <span>90</span>
            <span>100</span>
          </div>
          <div className="mt-0.5 flex justify-between text-[9px] uppercase tracking-wider text-muted-foreground/30">
            <span>Low</span>
            <span className="ml-2">Med</span>
            <span>High</span>
            <span>Critical</span>
            <span></span>
          </div>
        </>
      )}
    </div>
  );
}
