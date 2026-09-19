'use client';

import { Shield, ShieldAlert, ShieldX } from 'lucide-react';
import type { Decision } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DecisionBadgeProps {
  decision: Decision;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const config = {
  ALLOW: {
    icon: Shield,
    label: 'ALLOWED',
    color: 'text-success',
    bg: 'bg-success/[0.08] border-success/25',
  },
  APPROVE: {
    icon: ShieldAlert,
    label: 'APPROVAL REQUIRED',
    color: 'text-warning',
    bg: 'bg-warning/[0.08] border-warning/25',
  },
  BLOCK: {
    icon: ShieldX,
    label: 'BLOCKED',
    color: 'text-danger',
    bg: 'bg-danger/[0.08] border-danger/25',
  },
};

export function DecisionBadge({ decision, size = 'sm', showIcon = true }: DecisionBadgeProps) {
  const c = config[decision];
  const Icon = c.icon;
  const sizes = {
    sm: 'px-2.5 py-1 text-[10px] gap-1',
    md: 'px-3 py-1.5 text-xs gap-1.5',
    lg: 'px-4 py-2 text-sm gap-2',
  };
  const iconSizes = { sm: 'h-3 w-3', md: 'h-3.5 w-3.5', lg: 'h-4 w-4' };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border font-semibold uppercase tracking-wider',
        c.bg,
        c.color,
        sizes[size]
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} strokeWidth={2.2} />}
      {c.label}
    </span>
  );
}
