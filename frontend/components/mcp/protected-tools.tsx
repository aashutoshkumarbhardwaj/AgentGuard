'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Mail, FileText, Shield, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="rounded-xl border border-border/40 surface-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[13px] font-semibold">Protected Tools</h2>
        <span className="text-[10px] text-muted-foreground/40 font-mono">3 active</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isHovered = hovered === tool.id;
          return (
            <motion.div
              key={tool.id}
              onHoverStart={() => setHovered(tool.id)}
              onHoverEnd={() => setHovered(null)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'group relative rounded-lg border p-3 transition-all duration-200 cursor-pointer',
                isHovered
                  ? 'border-primary/30 bg-primary/[0.04]'
                  : 'border-border/40 bg-muted/10'
              )}
            >
              {/* Hover connection indicator */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  className="absolute -top-px left-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                />
              )}
              <div className="flex items-center justify-between mb-2">
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
                  isHovered ? 'border-primary/30 bg-primary/10' : 'border-border/40 bg-muted/20'
                )}>
                  <Icon className={cn('h-4 w-4 transition-colors', isHovered ? 'text-primary' : 'text-muted-foreground/60')} />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-success">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  <span className="font-medium">Protected</span>
                </div>
              </div>
              <p className="text-[13px] font-medium">{tool.name}</p>
              <p className="text-[11px] text-muted-foreground/50 font-mono mt-0.5 tabular-nums">
                {tool.calls.toLocaleString()} calls
              </p>
              <p className="text-[10px] text-muted-foreground/30 mt-0.5">{tool.lastRequest}</p>

              {/* Hover: protected by AgentGuard */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center gap-1 text-[10px] text-primary"
                >
                  <Shield className="h-2.5 w-2.5" />
                  <span>Routed via AgentGuard</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
