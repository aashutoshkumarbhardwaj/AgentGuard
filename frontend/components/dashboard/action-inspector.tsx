'use client';

import { motion } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Shield,
  ShieldAlert,
  ShieldX,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileJson,
} from 'lucide-react';
import type { SecurityEvent } from '@/lib/types';
import { liveEvents } from '@/lib/mock-data';
import { getRiskColor, getRiskBarColor } from '@/lib/helpers';
import { cn } from '@/lib/utils';

interface ActionInspectorProps {
  eventId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const decisionConfig = {
  ALLOW: { icon: Shield, color: 'text-success', bg: 'bg-success/10 border-success/30', label: 'ALLOWED' },
  APPROVE: { icon: ShieldAlert, color: 'text-warning', bg: 'bg-warning/10 border-warning/30', label: 'APPROVAL REQUIRED' },
  BLOCK: { icon: ShieldX, color: 'text-danger', bg: 'bg-danger/10 border-danger/30', label: 'BLOCKED' },
};

export function ActionInspector({ eventId, open, onOpenChange }: ActionInspectorProps) {
  const event = liveEvents.find((e) => e.id === eventId);

  if (!event) return null;

  const config = decisionConfig[event.decision];
  const DecisionIcon = config.icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg border-border bg-card/95 backdrop-blur-xl p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Action Inspector
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100%-4rem)]">
          <div className="px-6 pb-6 space-y-5">
            {/* Action name */}
            <div>
              <h2 className="font-mono text-xl font-semibold">{event.action}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{event.reason}</p>
            </div>

            {/* Decision badge */}
            <div className={cn('flex items-center gap-2.5 rounded-lg border px-4 py-3', config.bg)}>
              <DecisionIcon className={cn('h-5 w-5', config.color)} />
              <span className={cn('text-sm font-semibold', config.color)}>{config.label}</span>
            </div>

            {/* Agent */}
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">Agent</p>
              <p className="text-sm font-mono">{event.agentId}</p>
            </div>

            {/* Risk */}
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
                Risk Score
              </p>
              <div className="flex items-center gap-3">
                <span className={cn('text-2xl font-bold font-mono', getRiskColor(event.riskLevel))}>
                  {event.riskScore}
                </span>
                <span className="text-sm text-muted-foreground">/ 100</span>
                <span className={cn('text-xs font-semibold', getRiskColor(event.riskLevel))}>
                  {event.riskLevel}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${event.riskScore}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={cn('h-full rounded-full', getRiskBarColor(event.riskScore))}
                />
              </div>
            </div>

            <Separator />

            {/* Policy */}
            {event.policyId && (
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">Policy</p>
                <p className="text-sm font-mono text-info">{event.policyId}</p>
              </div>
            )}

            {/* Context */}
            {event.context && (
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-2">Context</p>
                <div className="space-y-1.5">
                  {event.context.source && (
                    <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                      <span className="text-xs text-muted-foreground">Source</span>
                      <span className="text-xs font-mono">{event.context.source}</span>
                    </div>
                  )}
                  {event.context.destination && (
                    <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                      <span className="text-xs text-muted-foreground">Destination</span>
                      <span className="text-xs font-mono">{event.context.destination}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Threat Analysis */}
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
                Threat Analysis
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>No prompt injection</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>No sensitive data detected</span>
                </div>
                {event.decision === 'BLOCK' && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span>{event.reason}</span>
                  </div>
                )}
                {event.threatDetails && (
                  <div className="flex items-center gap-2 text-sm">
                    <XCircle className="h-4 w-4 text-danger" />
                    <span>{event.threatType} detected</span>
                  </div>
                )}
              </div>
            </div>

            {/* Arguments */}
            {event.arguments && (
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                  <FileJson className="h-3 w-3" />
                  Arguments
                </p>
                <pre className="rounded-lg border border-border bg-muted/20 p-4 text-xs font-mono overflow-x-auto">
                  {event.arguments}
                </pre>
              </div>
            )}

            {/* Actions */}
            {event.decision === 'APPROVE' && (
              <div className="flex gap-2 pt-2">
                <Button variant="destructive" className="flex-1">Block</Button>
                <Button className="flex-1 bg-success text-success-foreground hover:bg-success/80">Approve</Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
