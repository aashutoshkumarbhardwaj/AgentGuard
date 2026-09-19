'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export function SecurityStatus() {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative flex items-center justify-center">
        {/* Outer pulse rings */}
        <span className="absolute h-36 w-36 rounded-full border border-success/15 animate-pulse-ring" />
        <span
          className="absolute h-36 w-36 rounded-full border border-success/10 animate-pulse-ring"
          style={{ animationDelay: '1s' }}
        />
        <span
          className="absolute h-36 w-36 rounded-full border border-success/8 animate-pulse-ring"
          style={{ animationDelay: '2s' }}
        />

        {/* Ambient glow behind */}
        <div className="absolute h-32 w-32 rounded-full bg-success/10 blur-2xl" />

        {/* Core circle */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex h-28 w-28 items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 35%, hsl(var(--success) / 0.18), hsl(var(--success) / 0.04))',
            border: '1.5px solid hsl(var(--success) / 0.35)',
            boxShadow: '0 0 30px -8px hsl(var(--success) / 0.3), inset 0 0 20px -8px hsl(var(--success) / 0.15)',
          }}
        >
          {/* Inner ring detail */}
          <div className="absolute inset-2.5 rounded-full border border-success/15" />
          <div className="absolute inset-5 rounded-full border border-success/10" />
          <Shield className="relative h-9 w-9 text-success" strokeWidth={2.2} />
        </motion.div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-lg font-bold tracking-[0.2em] text-success">PROTECTED</p>
        <p className="text-sm text-muted-foreground/60 mt-1">All systems online</p>
      </div>
    </div>
  );
}
