'use client';

import '../landing.css';
import '../film-section.css';
import '../layer-sequence.css';

import { Header } from '@/components/landing/sections/Header';
import { UsecaseBentoGrid } from '@/components/usecase/UsecaseBentoGrid';
import { PreFooterTalk } from '@/components/landing/sections/PreFooterTalk';
import { FooterCta } from '@/components/landing/sections/FooterCta';

export default function UsecasePage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-sky-500/30 selection:text-white">
      {/* Shared Header Navigation */}
      <Header />

      {/* Main Container */}
      <main className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-28 sm:pt-32 pb-24">
        <UsecaseBentoGrid />
      </main>

      {/* "Let's Build Something Memorable" Interactive 3D Canvas Pre-Footer */}
      <PreFooterTalk />

      {/* Shared Footer */}
      <FooterCta />
    </div>
  );
}
