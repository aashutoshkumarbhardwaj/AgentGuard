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
} from 'lucide-react';
import { agents, permissionsByAgent } from '@/lib/mock-data';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>(permissionsByAgent);
  const [revoking, setRevoking] = useState<string | null>(null);

  const agentPermissions = permissions[selectedAgent] || [];

  const handleRevoke = (tool: string) => {
    setPermissions((prev) => ({
      ...prev,
      [selectedAgent]: prev[selectedAgent].map((p) =>
        p.tool === tool ? { ...p, allowed: false } : p
      ),
    }));
    setRevoking(tool);
    setTimeout(() => setRevoking(null), 2000);
  };

  const handleGrant = (tool: string) => {
    setPermissions((prev) => ({
      ...prev,
      [selectedAgent]: prev[selectedAgent].map((p) =>
        p.tool === tool ? { ...p, allowed: true } : p
      ),
    }));
  };

  return (
    <div>
      <PageHeader title="Permissions" subtitle="Manage tool-level access for each agent">
        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
          <SelectTrigger className="w-56 bg-card/30 border-border">
            <SelectValue placeholder="Select agent" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      <div className="mb-4 flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Tool Permissions</h2>
        <span className="text-xs text-muted-foreground">
          ({agentPermissions.filter((p) => p.allowed).length} allowed, {agentPermissions.filter((p) => !p.allowed).length} blocked)
        </span>
      </div>

      <div className="space-y-2">
        {agentPermissions.map((perm, i) => {
          const Icon = categoryIcons[perm.category] || Wrench;
          return (
            <motion.div
              key={perm.tool}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className={cn(
                'flex items-center justify-between rounded-lg border bg-card/30 p-4 transition-colors',
                perm.allowed ? 'border-border' : 'border-danger/20',
                revoking === perm.tool && 'border-success/40 bg-success/5'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg border',
                  perm.allowed ? 'bg-success/10 border-success/20' : 'bg-danger/10 border-danger/20'
                )}>
                  <Icon className={cn('h-4 w-4', perm.allowed ? 'text-success' : 'text-danger')} />
                </div>
                <div>
                  <p className="text-sm font-mono">{perm.tool}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{perm.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Status */}
                <div className={cn(
                  'flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider',
                  perm.allowed
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'border-danger/30 bg-danger/10 text-danger'
                )}>
                  {perm.allowed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  {perm.allowed ? 'Allowed' : 'Blocked'}
                </div>

                {/* Action button */}
                {perm.allowed ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-danger border-danger/30 hover:bg-danger/10">
                        Revoke
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke permission?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Revoke <span className="font-mono text-foreground">{perm.tool}</span> from{' '}
                          <span className="font-mono text-foreground">{selectedAgent}</span>?
                          This will immediately block the agent from using this tool.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRevoke(perm.tool)}
                          className="bg-danger text-destructive-foreground hover:bg-danger/80"
                        >
                          Revoke
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-success border-success/30 hover:bg-success/10"
                    onClick={() => handleGrant(perm.tool)}
                  >
                    Allow
                  </Button>
                )}
              </div>

              {/* Revoke flash */}
              <AnimatePresence>
                {revoking === perm.tool && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-end pr-4"
                  >
                    <span className="text-xs font-semibold text-success bg-success/10 px-3 py-1 rounded-md">
                      Permission revoked
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
