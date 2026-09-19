'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AnimatedCounter } from './animated-counter';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  change?: string;
  changeUp?: boolean;
  subtitle?: string;
  accentColor: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  index?: number;
}

const accentText: Record<string, string> = {
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
  neutral: 'text-foreground',
};

export function StatCard({ label, value, change, changeUp, subtitle, accentColor, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-lg border border-border/40 surface-card px-3.5 py-3"
    >
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/45">{label}</p>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <AnimatedCounter
          value={value}
          className={cn('text-[22px] font-bold font-mono tabular-nums tracking-tight', accentText[accentColor])}
        />
      </div>
      <div className="mt-1 h-3.5 flex items-center gap-1">
        {change && (
          <div className="flex items-center gap-1 text-[11px]">
            {changeUp !== undefined && (
              changeUp
                ? <TrendingUp className="h-2.5 w-2.5 text-success" />
                : <TrendingDown className="h-2.5 w-2.5 text-danger" />
            )}
            <span className={cn(changeUp === false ? 'text-danger' : 'text-muted-foreground/50')}>{change}</span>
          </div>
        )}
        {subtitle && (
          <p className="text-[11px] text-muted-foreground/45">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
