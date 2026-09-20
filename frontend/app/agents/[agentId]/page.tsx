'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, Shield, Activity, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { API_URL, fetchAuditLogs } from '@/lib/api';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { DecisionBadge } from '@/components/dashboard/decision-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskGauge } from '@/components/dashboard/risk-gauge';
import { LiveActivityStream } from '@/components/dashboard/live-activity-stream';
import { cn } from '@/lib/utils';

const statusConfig = {
  ACTIVE: { color: 'text-sky-400', dot: 'bg-sky-400', label: 'ACTIVE', badge: 'bg-sky-500/10 border-sky-500/30 text-sky-400' },
  IDLE: { color: 'text-white/40', dot: 'bg-white/40', label: 'IDLE', badge: 'bg-white/[0.04] border-white/10 text-white/50' },
  SUSPENDED: { color: 'text-rose-400', dot: 'bg-rose-400', label: 'SUSPENDED', badge: 'bg-rose-500/10 border-rose-500/30 text-rose-400' },
};

export default function AgentDetailPage() {
  const params = useParams<{ agentId: string }>();
  const router = useRouter();
  const [agent, setAgent] = useState<any | null>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [agentEvents, setAgentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.agentId) return;
    fetch(`${API_URL}/agents/${params.agentId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setAgent({
            id: data.id,
            name: data.name || data.id,
            framework: data.framework || 'MCP Agent',
            description: `Registered agent runtime owned by ${data.owner || 'system'}.`,
            status: 'ACTIVE',
            riskScore: 12,
            actions: 0,
            blocked: 0,
            permissions: (data.allowed_tools || []).length,
            tools: data.allowed_tools || [],
          });
          const perms = (data.allowed_tools || []).map((toolName: string) => ({
            action: toolName,
            category: toolName.split('.')[0] || 'tool',
            status: 'GRANTED',
            riskLevel: toolName.includes('delete') || toolName.includes('modify') ? 'HIGH' : 'LOW',
            lastUsed: 'Dynamic',
          }));
          setPermissions(perms);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    fetchAuditLogs().then((logs) => {
      const relevant = (logs || []).filter((l: any) => l.agent_id === params.agentId);
      setAgentEvents(relevant);
    });
  }, [params.agentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/50 font-memorable">
        <p className="text-sm font-mono">Loading agent telemetry...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/50 font-memorable">
        <p className="text-lg">Agent not found.</p>
        <button
          onClick={() => router.push('/app/agents')}
          className="mt-4 px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition-colors"
        >
          Back to Agents
        </button>
      </div>
    );
  }

  const status = (statusConfig as any)[agent.status] || statusConfig.ACTIVE;

  return (
    <div className="relative w-full space-y-8 pb-16 font-memorable select-none">
      {/* Background Ambience 1: Ambient Cosmic Radial Glows */}
      <div className="pointer-events-none absolute -top-16 left-1/4 h-[500px] w-[550px] -translate-x-1/2 rounded-full bg-sky-950/20 blur-[150px]" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[450px] w-[500px] rounded-full bg-blue-950/15 blur-[140px]" />

      {/* Background Ambience 2: Authentic Dithered Dot Matrix Texture Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.45) 0.8px, transparent 0.8px)',
          backgroundSize: '3.5px 3.5px',
        }}
      />

      <div className="relative z-10 space-y-6">
        {/* Back Link */}
        <button
          onClick={() => router.push('/agents')}
          className="inline-flex items-center gap-2 text-[14px] text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Agents</span>
        </button>

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/30 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <Bot className="h-6 w-6 text-sky-400" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {agent.name}
              </h1>
              <p className="text-xs font-mono text-white/40">{agent.id}</p>
            </div>
          </div>

          <div className={cn('flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider', status.badge)}>
            <span className={cn('h-2 w-2 rounded-full', status.dot)} />
            <span>{status.label}</span>
          </div>
        </div>

        {/* Top 4 Meta Cards with CardSpotlight Hover Effect */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Framework', value: agent.framework, icon: Bot },
            { label: 'Owner', value: agent.owner, icon: Shield },
            { label: 'Permissions', value: String(agent.permissions), icon: Lock },
            { label: 'Total Actions', value: agent.actions.toLocaleString(), icon: Activity },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <CardSpotlight key={item.label} className="p-5 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-white/40">
                    {item.label}
                  </span>
                  <Icon className="h-3.5 w-3.5 text-sky-400/80" />
                </div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-white mt-2 tabular-nums">
                  {item.value}
                </p>
              </CardSpotlight>
            );
          })}
        </div>

        {/* Tabs with CardSpotlight Containers */}
        <Tabs defaultValue="overview">
          <TabsList className="bg-[#090b12]/80 border border-white/[0.08] backdrop-blur-md p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg text-[13px] font-memorable">
              Overview
            </TabsTrigger>
            <TabsTrigger value="permissions" className="rounded-lg text-[13px] font-memorable">
              Permissions
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg text-[13px] font-memorable">
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-5">
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Left Info Card */}
              <CardSpotlight className="p-6 flex flex-col justify-between min-h-[320px]">
                <div>
                  <h3 className="text-[17px] font-bold text-white tracking-tight mb-4">
                    Agent Configuration
                  </h3>
                  <p className="text-[14px] text-white/60 leading-relaxed mb-5">
                    {agent.description}
                  </p>

                  <div className="border-t border-white/[0.08] pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Bound MCP Tools</span>
                      <span className="font-mono text-sky-400 font-bold">{agent.tools.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(agent.tools || []).map((tool: string) => (
                        <span
                          key={tool}
                          className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs font-mono text-white/80"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] text-xs font-mono text-white/40 flex justify-between">
                  <span>Runtime: sandboxed</span>
                  <span className="text-sky-400">Deterministic</span>
                </div>
              </CardSpotlight>

              {/* Right Risk Profile Card */}
              <CardSpotlight className="p-6 flex flex-col justify-between min-h-[320px]">
                <div>
                  <h3 className="text-[17px] font-bold text-white tracking-tight mb-4">
                    Risk Assessment
                  </h3>
                  <RiskGauge score={agent.blocked > 10 ? 72 : 35} level={agent.blocked > 10 ? 'HIGH' : 'LOW'} />

                  <div className="mt-5 space-y-2.5 border-t border-white/[0.08] pt-4 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-white/50">Blocked attempts</span>
                      <span className="text-rose-400 font-bold">{agent.blocked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Approval required</span>
                      <span className="text-amber-400 font-bold">2.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Allow rate</span>
                      <span className="text-sky-400 font-bold">96.8%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] text-xs font-mono text-white/40 flex justify-between">
                  <span>Inspection: real-time</span>
                  <span className="text-sky-400">Zero data leakage</span>
                </div>
              </CardSpotlight>
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="mt-5">
            <div className="space-y-3">
              {permissions.map((perm) => (
                <CardSpotlight
                  key={perm.tool}
                  className="p-4 sm:p-5 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-white font-mono">{perm.tool}</span>
                      <span className="text-xs text-white/40">•</span>
                      <span className="text-xs text-white/50 font-mono">{perm.category}</span>
                    </div>
                    <p className="text-xs text-white/40">{perm.description}</p>
                  </div>
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-semibold font-mono uppercase tracking-wider',
                      perm.allowed
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    )}
                  >
                    {perm.allowed ? 'ALLOWED' : 'BLOCKED'}
                  </span>
                </CardSpotlight>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-5">
            <CardSpotlight className="p-6">
              <h3 className="text-[16px] font-bold text-white tracking-tight mb-4">
                Recent Agent Tool Calls ({agentEvents.length})
              </h3>
              <LiveActivityStream events={agentEvents} />
            </CardSpotlight>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
