'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Mail,
  FileText,
  Lock,
  Database,
  Wrench,
  Check,
  X,
  Shield,
  ShieldAlert,
  Search,
  Bot,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { agents, permissionsByAgent as initialPermissions } from '@/lib/mock-data';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { cn } from '@/lib/utils';
import type { Permission } from '@/lib/types';

const categoryIcons: Record<string, typeof Calendar> = {
  calendar: Calendar,
  email: Mail,
  file: FileText,
  credential: Lock,
  data: Database,
};

export default function PermissionsPage() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0].id);
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>(initialPermissions);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ALLOWED' | 'BLOCKED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerm, setSelectedPerm] = useState<Permission | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentAgentPermissions = permissions[selectedAgent] || [];
  const allowedCount = currentAgentPermissions.filter((p) => p.allowed).length;
  const blockedCount = currentAgentPermissions.filter((p) => !p.allowed).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleRevoke = (tool: string) => {
    setPermissions((prev) => ({
      ...prev,
      [selectedAgent]: prev[selectedAgent].map((p) =>
        p.tool === tool ? { ...p, allowed: false } : p
      ),
    }));
    showToast(`Access to ${tool} revoked for ${selectedAgent}`);
  };

  const handleGrant = (tool: string) => {
    setPermissions((prev) => ({
      ...prev,
      [selectedAgent]: prev[selectedAgent].map((p) =>
        p.tool === tool ? { ...p, allowed: true } : p
      ),
    }));
    showToast(`Permission granted for ${tool} to ${selectedAgent}`);
  };

  const filteredPermissions = currentAgentPermissions.filter((perm) => {
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'ALLOWED'
        ? perm.allowed
        : !perm.allowed;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : perm.tool.toLowerCase().includes(searchQuery.toLowerCase()) ||
          perm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          perm.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="relative w-full space-y-8 pb-20 font-memorable select-none">
      {/* Subtle Ambient Radial Lighting */}
      <div className="pointer-events-none absolute -top-20 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-slate-900/30 blur-[160px]" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[450px] w-[450px] rounded-full bg-blue-950/15 blur-[150px]" />

      <div className="relative z-10 space-y-8">
        {/* Header - Minimalist, Executive Typography */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
              Access Control // RBAC Guard
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <div>
              <h1 className="text-3xl sm:text-[34px] font-semibold tracking-tight text-white">
                Tool Permissions
              </h1>
              <p className="text-[14.5px] text-zinc-400 mt-1 max-w-xl font-normal leading-relaxed">
                Least-privilege capabilities, granular API scopes, and instant runtime access revocation.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-zinc-300 font-medium bg-[#0a0c10]/90 border border-white/[0.08] px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>Hardware Sandboxing Active</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Row 1: Top Metric Cards (Clean, Symmetrical, Luxury Glass)               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'TOTAL CAPABILITIES',
              value: currentAgentPermissions.length.toString(),
              sub: `Configured for ${selectedAgent}`,
              color: 'text-white',
              icon: Wrench,
            },
            {
              label: 'AUTHORIZED TOOLS',
              value: allowedCount.toString(),
              sub: 'Granted runtime execution',
              color: 'text-emerald-400',
              icon: CheckCircle2,
            },
            {
              label: 'RESTRICTED / BLOCKED',
              value: blockedCount.toString(),
              sub: 'Explicitly denied access',
              color: blockedCount > 0 ? 'text-rose-400/90' : 'text-zinc-400',
              icon: Lock,
            },
            {
              label: 'ISOLATION PROFILE',
              value: 'HARDENED',
              sub: 'Kernel sandboxed execution',
              color: 'text-zinc-200',
              icon: Shield,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <CardSpotlight
                key={stat.label}
                className="p-5 flex flex-col justify-between min-h-[116px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-medium tracking-wider text-zinc-400">
                    {stat.label}
                  </span>
                  <Icon className="h-3.5 w-3.5 text-zinc-500" />
                </div>
                <div className="mt-2.5">
                  <p className={`text-2xl font-semibold tracking-tight ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-[11.5px] text-zinc-500 font-normal mt-0.5 truncate">
                    {stat.sub}
                  </p>
                </div>
              </CardSpotlight>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* Agent Selector & Control Strip (Powered by HoverBorderGradient)           */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          {/* Agent Selection Strip */}
          <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-[#0a0c10]/90 border border-white/[0.08] backdrop-blur-xl">
            <span className="text-xs text-zinc-500 uppercase font-medium px-2 font-mono">
              Agent Runtime:
            </span>
            {agents.map((agent) => (
              <HoverBorderGradient
                key={agent.id}
                as="button"
                containerClassName="rounded-xl"
                className={cn(
                  'px-3.5 py-1.5 text-[12px] font-medium transition-all flex items-center gap-1.5',
                  selectedAgent === agent.id
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'bg-transparent text-zinc-400 hover:text-white'
                )}
                highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
                onClick={() => setSelectedAgent(agent.id)}
              >
                <Bot className="h-3.5 w-3.5 text-zinc-400" />
                <span>{agent.name}</span>
                <span className="text-[10px] text-zinc-500 font-mono">({agent.id})</span>
              </HoverBorderGradient>
            ))}
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-[#0a0c10]/90 border border-white/[0.08] backdrop-blur-xl">
            <div className="flex items-center gap-1.5">
              <HoverBorderGradient
                as="button"
                containerClassName="rounded-xl"
                className={cn(
                  'px-3.5 py-1.5 text-[12px] font-medium transition-all',
                  statusFilter === 'ALL'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'bg-transparent text-zinc-400 hover:text-white'
                )}
                highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
                onClick={() => setStatusFilter('ALL')}
              >
                All Tools ({currentAgentPermissions.length})
              </HoverBorderGradient>

              <HoverBorderGradient
                as="button"
                containerClassName="rounded-xl"
                className={cn(
                  'px-3.5 py-1.5 text-[12px] font-medium transition-all',
                  statusFilter === 'ALLOWED'
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : 'bg-transparent text-zinc-400 hover:text-emerald-300'
                )}
                highlight="radial-gradient(75% 181% at 50% 50%, #10b981 0%, rgba(255, 255, 255, 0.4) 100%)"
                onClick={() => setStatusFilter('ALLOWED')}
              >
                Allowed ({allowedCount})
              </HoverBorderGradient>

              <HoverBorderGradient
                as="button"
                containerClassName="rounded-xl"
                className={cn(
                  'px-3.5 py-1.5 text-[12px] font-medium transition-all',
                  statusFilter === 'BLOCKED'
                    ? 'bg-rose-500/15 text-rose-300'
                    : 'bg-transparent text-zinc-400 hover:text-rose-300'
                )}
                highlight="radial-gradient(75% 181% at 50% 50%, #f43f5e 0%, rgba(255, 255, 255, 0.4) 100%)"
                onClick={() => setStatusFilter('BLOCKED')}
              >
                Restricted ({blockedCount})
              </HoverBorderGradient>
            </div>

            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tool or category..."
                className="w-full pl-9 pr-7 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-[12px] text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Row 2: Rich Bento Grid of Permission Cards                                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredPermissions.map((perm) => {
              const Icon = categoryIcons[perm.category] || Wrench;
              const isAllowed = perm.allowed;

              return (
                <motion.div
                  key={perm.tool}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="relative"
                >
                  <CardSpotlight className="p-6 relative flex flex-col justify-between min-h-[290px] rounded-2xl transition-all duration-300 bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.18]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                    <div>
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                            <Icon className="h-4.5 w-4.5 text-zinc-300" strokeWidth={2.2} />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-medium tracking-wider text-zinc-500 block">
                              {perm.category}
                            </span>
                            <h3 className="text-[16px] font-semibold text-white tracking-tight">
                              {perm.tool}
                            </h3>
                          </div>
                        </div>

                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium',
                            isAllowed
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                          )}
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              isAllowed ? 'bg-emerald-400' : 'bg-rose-400'
                            )}
                          />
                          {isAllowed ? 'PERMITTED' : 'BLOCKED'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="mt-4 space-y-2">
                        <p className="text-[13.5px] text-zinc-400 font-normal leading-relaxed">
                          {perm.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer & Actions */}
                    <div className="mt-5 space-y-3.5 pt-4 border-t border-white/[0.06]">
                      <div className="flex items-center justify-between text-xs text-zinc-500 font-normal">
                        <span>Agent Scope</span>
                        <span className="text-zinc-300 font-mono">{selectedAgent}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <HoverBorderGradient
                          as="button"
                          containerClassName="rounded-xl"
                          className="bg-[#0e1118] text-zinc-300 hover:text-white text-[11.5px] font-medium px-3.5 py-2 flex items-center gap-1.5"
                          highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
                          onClick={() => setSelectedPerm(perm)}
                        >
                          <span>View Scope</span>
                        </HoverBorderGradient>

                        {isAllowed ? (
                          <HoverBorderGradient
                            as="button"
                            containerClassName="rounded-xl"
                            className="bg-[#120c10] text-rose-300/90 hover:text-rose-200 text-[12px] font-medium px-4 py-2 flex items-center gap-1.5"
                            highlight="radial-gradient(75% 181% at 50% 50%, #f43f5e 0%, rgba(255, 255, 255, 0.5) 100%)"
                            onClick={() => handleRevoke(perm.tool)}
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={2.2} />
                            <span>Revoke Access</span>
                          </HoverBorderGradient>
                        ) : (
                          <HoverBorderGradient
                            as="button"
                            containerClassName="rounded-xl"
                            className="bg-[#0c1410] text-emerald-300/90 hover:text-emerald-200 text-[12px] font-medium px-4 py-2 flex items-center gap-1.5"
                            highlight="radial-gradient(75% 181% at 50% 50%, #10b981 0%, rgba(255, 255, 255, 0.5) 100%)"
                            onClick={() => handleGrant(perm.tool)}
                          >
                            <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} />
                            <span>Grant Permission</span>
                          </HoverBorderGradient>
                        )}
                      </div>
                    </div>
                  </CardSpotlight>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Toast Notification Banner                                                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-[#0a0c10] border border-white/[0.15] shadow-2xl text-xs font-medium text-white flex items-center gap-2.5 backdrop-blur-xl"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* Permission Scope Details Modal Drawer                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedPerm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPerm(null)}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 p-4"
            >
              <CardSpotlight className="p-6 sm:p-7 shadow-2xl rounded-2xl bg-[#0a0c10] border border-white/[0.12] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <Shield className="h-5 w-5 text-zinc-300" />
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight">
                        Permission Scope Detail
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">{selectedPerm.tool} • {selectedAgent}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPerm(null)}
                    className="h-8 w-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4 space-y-4 text-[13px]">
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Tool Method</span>
                      <span className="text-white font-semibold text-xs mt-0.5 block">{selectedPerm.tool}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Capability Status</span>
                      <span className={cn(
                        'font-semibold text-xs mt-0.5 block',
                        selectedPerm.allowed ? 'text-emerald-400' : 'text-rose-400'
                      )}>
                        {selectedPerm.allowed ? 'ALLOWED' : 'BLOCKED'}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Category</span>
                      <span className="text-zinc-200 font-mono text-xs uppercase block mt-0.5">{selectedPerm.category}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] text-zinc-500 uppercase font-medium block">Assigned Agent</span>
                      <span className="text-zinc-200 font-mono text-xs mt-0.5 block">{selectedAgent}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-xs block mb-1.5 font-medium">Capability Description</span>
                    <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06] text-xs text-zinc-300 leading-relaxed font-normal">
                      {selectedPerm.description}
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-xs block mb-1.5 font-medium">Sandbox Isolation Configuration</span>
                    <div className="p-3.5 rounded-xl bg-[#06080c] border border-white/[0.06] text-[11px] font-mono text-zinc-300 overflow-x-auto">
                      <pre>{`sandbox:
  runtime: "${selectedAgent}"
  tool: "${selectedPerm.tool}"
  permission_granted: ${selectedPerm.allowed}
  resource_boundary:
    network_egress: ${selectedPerm.category === 'email' ? 'quarantined' : 'internal_only'}
    filesystem_access: ${selectedPerm.category === 'file' ? 'scoped_read' : 'disabled'}
  revocation_policy: "instantaneous"`}</pre>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  {selectedPerm.allowed ? (
                    <HoverBorderGradient
                      as="button"
                      containerClassName="rounded-xl flex-1 w-full"
                      className="w-full bg-[#120c10] text-rose-300/90 hover:text-rose-200 font-medium text-xs py-2.5 flex items-center justify-center gap-1.5"
                      highlight="radial-gradient(75% 181% at 50% 50%, #f43f5e 0%, rgba(255, 255, 255, 0.4) 100%)"
                      onClick={() => {
                        handleRevoke(selectedPerm.tool);
                        setSelectedPerm((prev) => prev ? { ...prev, allowed: false } : null);
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Revoke Access</span>
                    </HoverBorderGradient>
                  ) : (
                    <HoverBorderGradient
                      as="button"
                      containerClassName="rounded-xl flex-1 w-full"
                      className="w-full bg-[#0c1410] text-emerald-300/90 hover:text-emerald-200 font-medium text-xs py-2.5 flex items-center justify-center gap-1.5"
                      highlight="radial-gradient(75% 181% at 50% 50%, #10b981 0%, rgba(255, 255, 255, 0.4) 100%)"
                      onClick={() => {
                        handleGrant(selectedPerm.tool);
                        setSelectedPerm((prev) => prev ? { ...prev, allowed: true } : null);
                      }}
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} />
                      <span>Grant Permission</span>
                    </HoverBorderGradient>
                  )}

                  <HoverBorderGradient
                    as="button"
                    containerClassName="rounded-xl flex-1 w-full"
                    className="w-full bg-[#0e1118] text-zinc-300 hover:text-white font-medium text-xs py-2.5 flex items-center justify-center gap-1.5"
                    highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
                    onClick={() => setSelectedPerm(null)}
                  >
                    <span>Close Scope</span>
                  </HoverBorderGradient>
                </div>
              </CardSpotlight>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
