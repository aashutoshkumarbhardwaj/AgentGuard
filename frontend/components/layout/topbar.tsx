'use client';

import { Search, Command, Bell, Github, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopbarProps {
  onOpenCommand: () => void;
}

export function Topbar({ onOpenCommand }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/40 bg-background/70 px-5">
      {/* Search */}
      <button
        onClick={onOpenCommand}
        className="group flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/20 px-3 py-1.5 text-[13px] text-muted-foreground/60 transition-colors hover:bg-muted/40 hover:text-muted-foreground w-72"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="flex items-center gap-0.5 rounded border border-border/40 px-1 py-0.5 text-[10px] font-mono text-muted-foreground/40">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      <div className="flex items-center gap-3">
        {/* Social links — subtle flashing */}
        <div className="flex items-center gap-px mr-1">
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:text-foreground hover:bg-foreground/[0.04]"
          >
            <Github className="h-4 w-4" />
          </motion.a>
          <motion.a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter / X"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:text-foreground hover:bg-foreground/[0.04]"
          >
            <Twitter className="h-3.5 w-3.5" />
          </motion.a>
        </div>

        <div className="h-4 w-px bg-border/40" />

        {/* Compact status */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-success" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">Protected</span>
        </div>

        {/* Notifications */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:text-foreground hover:bg-foreground/[0.04]">
          <Bell className="h-4 w-4" />
        </button>

        {/* Avatar */}
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/40 border border-border/50">
          <span className="text-[11px] font-medium text-muted-foreground">A</span>
        </div>
      </div>
    </header>
  );
}
