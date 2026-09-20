'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Mail, FileText, Shield, Check, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CardSpotlight } from '@/components/ui/card-spotlight';

interface Tool {
  id: string;
  name: string;
  icon: typeof Calendar;
  calls: number;
  lastRequest: string;
  category: string;
}

const tools: Tool[] = [
  { id: 'calendar', name: 'Calendar MCP', icon: Calendar, calls: 4821, lastRequest: '2s ago', category: 'Time & Scheduling' },
  { id: 'email', name: 'Email MCP', icon: Mail, calls: 2156, lastRequest: '5s ago', category: 'Communications' },
  { id: 'file', name: 'Filesystem MCP', icon: FileText, calls: 1515, lastRequest: '1s ago', category: 'Local Storage' },
];

export function ProtectedTools() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <CardSpotlight className="p-5 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-300 font-memorable">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <h2 className="text-[13.5px] font-semibold text-white tracking-tight">Protected Tools</h2>
        </div>
        <span className="text-[11px] text-zinc-400 font-medium">3 active endpoints</span>
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
                'group relative rounded-xl border p-4 transition-all duration-300 cursor-pointer overflow-hidden',
                isHovered
                  ? 'border-white/[0.2] bg-white/[0.05] shadow-lg'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
                    isHovered
                      ? 'border-white/20 bg-white/10 text-white'
                      : 'border-white/[0.08] bg-white/[0.04] text-zinc-400'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  <span>Protected</span>
                </div>
              </div>
              <p className="text-[13.5px] font-semibold text-white tracking-tight">{tool.name}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5 font-normal">
                {tool.category}
              </p>
              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                <span className="text-zinc-300 font-medium">{tool.calls.toLocaleString()} calls</span>
                <span className="text-zinc-500">{tool.lastRequest}</span>
              </div>
            </div>
          );
        })}
      </div>
    </CardSpotlight>
  );
}
