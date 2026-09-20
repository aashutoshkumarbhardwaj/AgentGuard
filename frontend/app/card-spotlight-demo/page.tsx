'use client';

import CardSpotlightDemo from '@/components/card-spotlight-demo';

export default function CardSpotlightDemoPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-12 flex flex-col items-center justify-center space-y-8 font-memorable">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Card Spotlight Demo
        </h1>
        <p className="text-[15px] text-white/50 max-w-md mx-auto">
          Hover over the card to reveal the dynamic dot-matrix shader spotlight effect.
        </p>
      </div>
      <CardSpotlightDemo />
    </div>
  );
}
