'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot } from 'lucide-react';
import { agents, permissionsByAgent, liveEvents } from '@/lib/mock-data';
import { PageHeader } from '@/components/layout/page-header';
import { DecisionBadge } from '@/components/dashboard/decision-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskGauge } from '@/components/dashboard/risk-gauge';
import { LiveActivityStream } from '@/components/dashboard/live-activity-stream';
import { cn } from '@/lib/utils';

const statusConfig = {
  ACTIVE: { color: 'text-success', dot: 'bg-success', label: 'ACTIVE' },
  IDLE: { color: 'text-muted-foreground', dot: 'bg-muted-foreground', label: 'IDLE' },
  SUSPENDED: { color: 'text-danger', dot: 'bg-danger', label: 'SUSPENDED' },
};

export default function AgentDetailPage() {
  const params = useParams<{ agentId: string }>();
  const router = useRouter();
  const agent = agents.find((a) => a.id === params.agentId);
  const permissions = permissionsByAgent[params.agentId] || [];
  const agentEvents = liveEvents.filter((e) => e.agentId === params.agentId);

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p>Agent not found.</p>
        <button onClick={() => router.push('/agents')} className="mt-4 text-primary">
          Back to Agents
        </button>
      </div>
    );
  }

  const status = statusConfig[agent.status];

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => router.push('/agents')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Agents
      </button>

      <PageHeader title={agent.name} subtitle={agent.id}>
        <div className={cn('flex items-center gap-2 rounded-full border border-border px-3 py-1.5', status.color)}>
          <span className={cn('h-2 w-2 rounded-full', status.dot)} />
          <span className="text-xs font-semibold uppercase tracking-wider">{status.label}</span>
        </div>
      </PageHeader>

      {/* Meta info */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: 'Framework', value: agent.framework },
          { label: 'Owner', value: agent.owner },
          { label: 'Permissions', value: String(agent.permissions) },
          { label: 'Total Actions', value: agent.actions.toLocaleString() },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-border bg-card/30 p-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{item.label}</p>
            <p className="text-sm font-mono mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-card/30 border border-border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card/30 p-5">
              <h3 className="text-sm font-semibold mb-4">Agent Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.description}</p>
                  </div>
                </div>
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Registered tools</span>
                    <span className="font-mono">{agent.tools.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.tools.map((tool) => (
                      <span key={tool} className="rounded-md border border-border bg-muted/20 px-2 py-0.5 text-[10px] font-mono">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/30 p-5">
              <h3 className="text-sm font-semibold mb-4">Risk Profile</h3>
              <RiskGauge score={agent.blocked > 10 ? 72 : 35} level={agent.blocked > 10 ? 'HIGH' : 'LOW'} />
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Blocked actions</span>
                  <span className="font-mono text-danger">{agent.blocked}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Approval rate</span>
                  <span className="font-mono text-warning">2.1%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Allow rate</span>
                  <span className="font-mono text-success">96.8%</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Permissions */}
        <TabsContent value="permissions" className="mt-4">
          <div className="space-y-2">
            {permissions.map((perm) => (
              <div
                key={perm.tool}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-4',
                  perm.allowed ? 'border-border bg-card/30' : 'border-danger/20 bg-danger/5'
                )}
              >
                <div>
                  <p className="text-sm font-mono">{perm.tool}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{perm.description}</p>
                </div>
                <DecisionBadge decision={perm.allowed ? 'ALLOW' : 'BLOCK'} />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Activity */}
        <TabsContent value="activity" className="mt-4">
          <div className="rounded-xl border border-border bg-card/30 p-5">
            <LiveActivityStream events={agentEvents.length > 0 ? agentEvents : liveEvents.slice(0, 6)} />
          </div>
        </TabsContent>

        {/* Threats */}
        <TabsContent value="threats" className="mt-4">
          <div className="rounded-xl border border-border bg-card/30 p-5">
            <p className="text-sm text-muted-foreground">No active threats for this agent.</p>
          </div>
        </TabsContent>

        {/* Audit */}
        <TabsContent value="audit" className="mt-4">
          <div className="rounded-xl border border-border bg-card/30 p-5">
            <p className="text-sm text-muted-foreground">Audit trail entries for this agent are available in the Audit section.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
