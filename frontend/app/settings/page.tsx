'use client';

import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Globe, Webhook } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const settingsSections = [
  {
    title: 'Notifications',
    icon: Bell,
    items: [
      { label: 'Threat alerts', description: 'Get notified when threats are detected', enabled: true },
      { label: 'Approval requests', description: 'Notify when actions require human review', enabled: true },
      { label: 'Policy violations', description: 'Alert on any policy violation', enabled: true },
      { label: 'Audit summaries', description: 'Daily digest of all security events', enabled: false },
    ],
  },
  {
    title: 'Security',
    icon: Shield,
    items: [
      { label: 'Auto-block critical threats', description: 'Automatically block actions with risk > 90', enabled: true },
      { label: 'Require approval for external', description: 'All external destinations need approval', enabled: true },
      { label: 'Prompt injection detection', description: 'Enable ML-based injection detection', enabled: true },
      { label: 'Hash chain verification', description: 'Verify audit trail integrity on startup', enabled: true },
    ],
  },
  {
    title: 'Integration',
    icon: Globe,
    items: [
      { label: 'MCP Gateway', description: 'Enable Model Context Protocol routing', enabled: true },
      { label: 'Webhook notifications', description: 'Send security events to external webhook', enabled: false },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure AgentGuard behavior and notifications" />

      <div className="space-y-6">
        {settingsSections.map((section, si) => {
          const SectionIcon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1 }}
              className="rounded-xl border border-border bg-card/30 backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/20 border border-border">
                  <SectionIcon className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-sm font-semibold">{section.title}</h2>
              </div>

              <div className="space-y-1">
                {section.items.map((item, i) => (
                  <div key={item.label}>
                    {i > 0 && <Separator className="my-2" />}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                      <Switch defaultChecked={item.enabled} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
