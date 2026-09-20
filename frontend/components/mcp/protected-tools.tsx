'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Mail, FileText, Shield, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LiquidBentoCard } from './liquid-bento-card';

interface Tool {
  id: string;
  name: string;
  icon: typeof Calendar;
  calls: number;
  lastRequest: string;
}

const tools: Tool[] = [
  { id: 'calendar', name: 'Calendar', icon: Calendar, calls: 4821, lastRequest: '2s ago' },
  { id: 'email', name: 'Email', icon: Mail, calls: 2156, lastRequest: '5s ago' },
  { id: 'file', name: 'Files', icon: FileText, calls: 1515, lastRequest: '1s ago' },
];

export function ProtectedTools() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <LiquidBentoCard className="p-5" glowColor="rgba(16, 185, 129, 0.08)">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h2 className="text-[13px] font-semibold text-white tracking-tight">Protected Tools</h2>
        </div>
        <span className="text-[11px] text-white/40 font-mono">3 active</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isHovered = hovered === tool.id;
          return (
            <div
              key={tool.id}
              onMouseEnter={() => setHovered(tool.id)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'group relative rounded-xl border p-3.5 transition-all duration-300 cursor-pointer overflow-hidden',
                isHovered
                  ? 'border-emerald-500/30 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
              )}
            >
              {/* Hover connection highlight */}
              {isHovered && (
                <div className="absolute -top-px left-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
              )}
              <div className="flex items-center justify-between mb-2.5">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
                    isHovered
                      ? 'border-emerald-500/40 bg-emerald-500/15'
                      : 'border-white/[0.08] bg-white/[0.04]'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isHovered ? 'text-emerald-400' : 'text-zinc-400'
                    )}
                  />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  <span>Protected</span>
                </div>
              </div>
              <p className="text-[13.5px] font-semibold text-white tracking-tight">{tool.name}</p>
              <p className="text-[11px] text-white/50 font-mono mt-0.5 tabular-nums">
                {tool.calls.toLocaleString()} calls
              </p>
              <p className="text-[10px] text-white/35 font-mono mt-0.5">{tool.lastRequest}</p>

              {/* Hover telemetry label */}
              {isHovered && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 pt-1.5 border-t border-emerald-500/20">
                  <Shield className="h-2.5 w-2.5" />
                  <span>Routed via AgentGuard</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </LiquidBentoCard>
  );
}
