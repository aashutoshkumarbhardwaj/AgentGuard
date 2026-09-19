'use client';

import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { LiveActivityStream } from '@/components/dashboard/live-activity-stream';
import { useLiveEvents } from '@/hooks/use-live-events';

export default function ActivityPage() {
  const events = useLiveEvents(30, 2500);

  return (
    <div>
      <PageHeader title="Activity" subtitle="Real-time security event stream" />

      <div className="rounded-xl border border-border bg-card/30 backdrop-blur-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <h2 className="text-sm font-semibold">Live Security Activity</h2>
            <span className="text-xs text-muted-foreground">polling every 2.5s</span>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Radio className="h-3 w-3 text-primary" />
            {events.length} events
          </span>
        </div>
        <LiveActivityStream events={events} />
      </div>
    </div>
  );
}
