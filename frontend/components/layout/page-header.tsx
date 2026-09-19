'use client';

import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-7"
    >
      <div>
        <h1 className="text-[26px] font-bold tracking-tight-tightest tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground/70 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}
