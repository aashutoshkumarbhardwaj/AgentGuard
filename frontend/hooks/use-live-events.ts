'use client';

import { useEffect, useState } from 'react';
import { liveEvents, agents } from '@/lib/mock-data';
import type { SecurityEvent } from '@/lib/types';

const eventTemplates = [
  {
    agentId: 'research-agent',
    action: 'calendar.read',
    decision: 'ALLOW' as const,
    riskScore: 12,
    riskLevel: 'LOW' as const,
    policyId: 'allow-calendar-read',
    reason: 'Within permitted scope',
    context: { source: 'calendar', destination: 'internal' },
    arguments: '{"range": "today"}',
  },
  {
    agentId: 'support-agent',
    action: 'email.read',
    decision: 'ALLOW' as const,
    riskScore: 8,
    riskLevel: 'LOW' as const,
    policyId: 'allow-email-read',
    reason: 'Within permitted scope',
    context: { source: 'email', destination: 'internal' },
    arguments: '{"folder": "inbox"}',
  },
  {
    agentId: 'research-agent',
    action: 'file.read',
    decision: 'ALLOW' as const,
    riskScore: 15,
    riskLevel: 'LOW' as const,
    policyId: 'allow-file-read',
    reason: 'Within permitted scope',
    context: { source: 'file', destination: 'local' },
    arguments: '{"path": "/docs/readme.md"}',
  },
  {
    agentId: 'external-agent',
    action: 'file.read',
    decision: 'BLOCK' as const,
    riskScore: 85,
    riskLevel: 'HIGH' as const,
    policyId: 'deny-external-sensitive',
    reason: 'External agent accessing sensitive path',
    context: { source: 'external', destination: 'local' },
    arguments: '{"path": "/secrets/keys.json"}',
  },
  {
    agentId: 'support-agent',
    action: 'email.send',
    decision: 'APPROVE' as const,
    riskScore: 65,
    riskLevel: 'HIGH' as const,
    policyId: 'email-send-policy',
    reason: 'External destination detected',
    context: { source: 'email', destination: 'client@external.com' },
    arguments: '{"to": "client@external.com"}',
  },
  {
    agentId: 'research-agent',
    action: 'file.delete',
    decision: 'BLOCK' as const,
    riskScore: 98,
    riskLevel: 'CRITICAL' as const,
    policyId: 'deny-file-delete',
    reason: 'Destructive action not permitted',
    context: { source: 'file', destination: 'local' },
    arguments: '{"path": "/data/important.json"}',
  },
  {
    agentId: 'support-agent',
    action: 'calendar.read',
    decision: 'ALLOW' as const,
    riskScore: 5,
    riskLevel: 'LOW' as const,
    policyId: 'allow-calendar-read',
    reason: 'Within permitted scope',
    context: { source: 'calendar', destination: 'internal' },
    arguments: '{"range": "week"}',
  },
];

let eventCounter = 100;

export function useLiveEvents(maxEvents = 12, pollInterval = 3000) {
  const [events, setEvents] = useState<SecurityEvent[]>(liveEvents);

  useEffect(() => {
    const interval = setInterval(() => {
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
      const now = new Date();
      const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const newEvent: SecurityEvent = {
        ...template,
        id: `evt-live-${eventCounter++}`,
        timestamp,
      };

      setEvents((prev) => [newEvent, ...prev].slice(0, maxEvents));
    }, pollInterval);

    return () => clearInterval(interval);
  }, [maxEvents, pollInterval]);

  return events;
}
