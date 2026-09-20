'use client';

import SidebarDemo from '@/components/sidebar-demo';

export default function SidebarDemoPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-10 flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Aceternity Sidebar Demo</h1>
        <p className="text-sm text-neutral-400">
          Interactive collapsible &amp; expandable sidebar component with Framer Motion.
        </p>
      </div>
      <div className="w-full max-w-6xl">
        <SidebarDemo />
      </div>
    </div>
  );
}
