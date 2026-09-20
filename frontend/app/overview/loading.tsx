import React from 'react';
import { LoaderOne } from '@/components/ui/loader';

export default function OverviewLoading() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[75vh] w-full select-none">
      {/* Ambient Radial Glow */}
      <div className="pointer-events-none absolute h-[320px] w-[320px] rounded-full bg-sky-500/10 blur-[120px]" />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        <LoaderOne size={56} />
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-[13px] font-mono tracking-widest uppercase text-white/80 font-medium">
            Loading Overview
          </span>
          <span className="text-[11px] font-mono text-white/40">
            Initializing security telemetry...
          </span>
        </div>
      </div>
    </div>
  );
}
