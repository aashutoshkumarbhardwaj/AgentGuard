'use client';

import '../landing.css';
import '../film-section.css';
import '../layer-sequence.css';

import { Header } from '@/components/landing/sections/Header';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { DocsContent } from '@/components/docs/DocsContent';
import { DocsTableOfContents } from '@/components/docs/DocsTableOfContents';
import { PreFooterTalk } from '@/components/landing/sections/PreFooterTalk';
import { FooterCta } from '@/components/landing/sections/FooterCta';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-sky-500/30 selection:text-white">
      {/* Shared Header Navigation */}
      <Header />

      {/* Main Documentation Container (3-column layout) */}
      <main className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-28 sm:pt-32 pb-20">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 xl:gap-16">
          {/* Left Sidebar Navigation */}
          <DocsSidebar />

          {/* Center Main Documentation Sections */}
          <DocsContent />

          {/* Right On This Page Table of Contents */}
          <DocsTableOfContents />
        </div>
      </main>

      {/* "Let's Build Something Memorable" Interactive 3D Canvas Pre-Footer */}
      <PreFooterTalk />

      {/* Shared Footer CTA */}
      <FooterCta />
    </div>
  );
}
