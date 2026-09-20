'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { CommandPalette } from '@/components/layout/command-palette';
import { ActionInspector } from '@/components/dashboard/action-inspector';
import { EventProvider, useEventInspector } from '@/components/providers/event-provider';

function ShellContent({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const pathname = usePathname();
  const { activeEventId, closeInspector } = useEventInspector();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const isLanding =
    pathname === '/' ||
    pathname.startsWith('/docs') ||
    pathname.startsWith('/usecase') ||
    pathname.startsWith('/use-case');

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-mesh">
      <Sidebar />
      <div className="pl-[220px]">
        <Topbar onOpenCommand={() => setCommandOpen(true)} />
        <main key={pathname} className="slide-in-top p-5 lg:p-6">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <ActionInspector
        eventId={activeEventId}
        open={activeEventId !== null}
        onOpenChange={(open) => { if (!open) closeInspector(); }}
      />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <EventProvider>
      <ShellContent>{children}</ShellContent>
    </EventProvider>
  );
}
