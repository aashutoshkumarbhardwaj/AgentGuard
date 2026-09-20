'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Bot,
  Activity,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Lock,
  ScrollText,
  Swords,
  Network,
  Settings,
  Shield,
  Github,
  Star,
  PanelLeftClose,
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Overview', href: '/overview', icon: LayoutDashboard },
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

interface SidebarItemProps {
  item: {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
  };
  isActive: boolean;
  open: boolean;
}

function SidebarSpotlightItem({ item, isActive, open }: SidebarItemProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef<HTMLAnchorElement>(null);
  const Icon = item.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Link
      ref={itemRef}
      href={item.href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      title={!open ? item.label : undefined}
      className={cn(
        'group relative flex items-center rounded-xl text-[15px] font-medium font-memorable transition-all duration-200 overflow-hidden border select-none',
        open ? 'gap-3 px-3 py-2' : 'justify-center p-2.5',
        isActive
          ? 'border-sky-500/40 bg-sky-500/10 text-white shadow-[0_0_20px_rgba(56,189,248,0.14)]'
          : isHovered
          ? 'border-sky-500/30 bg-sky-950/20 text-white shadow-[0_0_15px_rgba(56,189,248,0.1)]'
          : 'border-transparent text-white/60 hover:text-white'
      )}
    >
      {/* Dynamic Card Spotlight Radial Glow following cursor */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-200"
          style={{
            background: `radial-gradient(130px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.22), transparent 70%)`,
          }}
        />
      )}

      {/* Card Spotlight Dot-Matrix Texture Reveal following cursor */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-45 transition-opacity duration-200"
          style={{
            maskImage: `radial-gradient(100px circle at ${mousePos.x}px ${mousePos.y}px, white, transparent 80%)`,
            WebkitMaskImage: `radial-gradient(100px circle at ${mousePos.x}px ${mousePos.y}px, white, transparent 80%)`,
            backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.85) 0.9px, transparent 0.9px)',
            backgroundSize: '3.5px 3.5px',
          }}
        />
      )}

      {/* Active Left Indicator */}
      {isActive && (
        <span className="absolute left-0 h-5 w-[3px] rounded-r bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)] z-10" />
      )}

      {/* Professional Icon (Sky Blue / Glacier Cyan) */}
      <Icon
        className={cn(
          'h-4.5 w-4.5 shrink-0 transition-colors relative z-10',
          isActive
            ? 'text-sky-400'
            : isHovered
            ? 'text-sky-300'
            : 'text-white/50 group-hover:text-white/90'
        )}
        strokeWidth={isActive ? 2.3 : 1.9}
      />

      {/* Label with Memorable Font & Increased Size */}
      {open && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          className="truncate text-[15px] tracking-tight relative z-10"
        >
          {item.label}
        </motion.span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { open, setOpen, animate } = useSidebar();

  return (
    <>
      {/* Desktop Collapsible & Expandable Sidebar with Card Spotlight Hover Effects */}
      <motion.aside
        animate={{
          width: animate ? (open ? '240px' : '64px') : '240px',
        }}
        transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={cn(
          'fixed left-0 top-0 z-30 hidden md:flex h-full flex-col justify-between',
          'border-r border-white/[0.08] bg-[#06070a]/95 backdrop-blur-2xl font-memorable',
          'overflow-hidden select-none transition-colors shadow-2xl'
        )}
      >
        {/* Top: Logo & Collapse Pin */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.08] px-4">
          <Link href="/overview" className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
              <Shield className="h-4.5 w-4.5 text-sky-400" strokeWidth={2.2} />
            </div>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col leading-tight truncate"
              >
                <span className="text-[15.5px] font-bold tracking-tight text-white font-memorable">
                  AgentGuard
                </span>
                <span className="text-[10px] text-white/40 font-mono">v1.0.0</span>
              </motion.div>
            )}
          </Link>

          {/* Pin toggle button */}
          {open && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              title="Collapse sidebar"
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Center: Navigation Groups & Card Spotlight Links across the 3 sections */}
        <nav className="flex-1 overflow-y-auto scrollbar-none px-3 py-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              {open ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-2.5 mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/35 font-memorable truncate"
                >
                  {group.label}
                </motion.p>
              ) : (
                <div className="h-2" />
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href === '/overview' && pathname === '/');
                  return (
                    <SidebarSpotlightItem
                      key={item.href}
                      item={item}
                      isActive={isActive}
                      open={open}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom: Settings & GitHub with Card Spotlight Hover */}
        <div className="border-t border-white/[0.08] p-3 space-y-1 font-memorable">
          <Link
            href="/settings"
            title={!open ? 'Settings' : undefined}
            className={cn(
              'group relative flex items-center rounded-xl text-[14.5px] font-medium text-white/60 hover:text-white hover:bg-sky-950/20 hover:border-sky-500/30 border border-transparent transition-all overflow-hidden',
              open ? 'gap-3 px-3 py-2' : 'justify-center p-2.5'
            )}
          >
            <Settings className="h-4.5 w-4.5 shrink-0 text-white/50 group-hover:text-sky-300 transition-colors" strokeWidth={1.9} />
            {open && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="truncate tracking-tight"
              >
                Settings
              </motion.span>
            )}
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            title={!open ? 'GitHub (2.4k)' : undefined}
            className={cn(
              'group relative flex items-center rounded-xl text-[14.5px] font-medium text-white/60 hover:text-white hover:bg-sky-950/20 hover:border-sky-500/30 border border-transparent transition-all overflow-hidden',
              open ? 'gap-3 px-3 py-2' : 'justify-center p-2.5'
            )}
          >
            <Github className="h-4.5 w-4.5 shrink-0 text-white/50 group-hover:text-sky-300 transition-colors" strokeWidth={1.9} />
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between w-full min-w-0"
              >
                <span className="truncate tracking-tight">GitHub</span>
                <span className="flex items-center gap-1 text-[11px] text-white/40 font-mono">
                  <Star className="h-3 w-3 text-sky-400 fill-sky-400" /> 2.4k
                </span>
              </motion.div>
            )}
          </a>
        </div>
      </motion.aside>

      {/* Mobile Drawer */}
      <div className="md:hidden">
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-[#06070a] border-r border-white/[0.08] p-5 flex flex-col justify-between font-memorable"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10">
                        <Shield className="h-4.5 w-4.5 text-sky-400" strokeWidth={2.2} />
                      </div>
                      <span className="font-bold text-white text-[16px] tracking-tight">AgentGuard</span>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="text-white/50 hover:text-white p-1 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <nav className="space-y-5">
                    {navGroups.map((group) => (
                      <div key={group.label}>
                        <p className="text-[11px] uppercase tracking-wider text-white/35 mb-1.5 px-2">
                          {group.label}
                        </p>
                        <div className="space-y-1">
                          {group.items.map((item) => {
                            const isActive =
                              pathname === item.href ||
                              (item.href === '/overview' && pathname === '/');
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-all border',
                                  isActive
                                    ? 'border-sky-500/40 bg-sky-500/10 text-white'
                                    : 'border-transparent text-white/60 hover:text-white'
                                )}
                              >
                                <Icon className={cn('h-4.5 w-4.5', isActive ? 'text-sky-400' : 'text-white/50')} />
                                <span>{item.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </nav>
                </div>
                <div className="border-t border-white/[0.08] pt-4">
                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[15px] text-white/60 hover:text-white"
                  >
                    <Settings className="h-4.5 w-4.5" />
                    <span>Settings</span>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
