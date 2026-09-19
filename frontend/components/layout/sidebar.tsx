'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Bot, Activity, ShieldCheck, AlertTriangle,
  FileText, Lock, ScrollText, Swords, Network, Settings, Shield, Github, Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Overview', href: '/', icon: LayoutDashboard },
      { label: 'Activity', href: '/activity', icon: Activity },
      { label: 'Agents', href: '/agents', icon: Bot },
      { label: 'Approvals', href: '/approvals', icon: ShieldCheck },
    ],
  },
  {
    label: 'Security',
    items: [
      { label: 'Threats', href: '/threats', icon: AlertTriangle },
      { label: 'Policies', href: '/policies', icon: FileText },
      { label: 'Permissions', href: '/permissions', icon: Lock },
      { label: 'Audit', href: '/audit', icon: ScrollText },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'Simulator', href: '/simulator', icon: Swords },
      { label: 'MCP', href: '/mcp', icon: Network },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-[220px] flex-col border-r border-border/50 bg-background/80">
      {/* Logo — quiet, no glow */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border/40 px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/30">
          <Shield className="h-4 w-4 text-foreground/80" strokeWidth={2} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold tracking-tight">AgentGuard</span>
          <span className="text-[9px] text-muted-foreground/50 font-mono">v1.0.0</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-2.5 mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/35">
              {group.label}
            </p>
            <div className="space-y-px">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors duration-150',
                      isActive
                        ? 'bg-foreground/[0.06] text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]'
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 h-4 w-[2px] rounded-r bg-primary" style={{ position: 'absolute', marginLeft: '-8px' }} />
                    )}
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isActive ? 'text-foreground/70' : 'text-muted-foreground/50 group-hover:text-foreground/70'
                      )}
                      strokeWidth={2}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/40 px-2 py-2 space-y-px">
        <Link
          href="/settings"
          className="group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03] transition-colors"
        >
          <Settings className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground/70" strokeWidth={2} />
          <span>Settings</span>
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03] transition-colors"
        >
          <Github className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground/70" strokeWidth={2} />
          <span>GitHub</span>
          <span className="ml-auto flex items-center gap-0.5 text-[10px] text-muted-foreground/40 font-mono">
            <Star className="h-2.5 w-2.5" /> 2.4k
          </span>
        </a>
      </div>
    </aside>
  );
}
