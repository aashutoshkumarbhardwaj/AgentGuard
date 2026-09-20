'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Zap } from 'lucide-react';

import {
  Header,
  CinematicIntro,
  MemoryUseCases,
  LayerSequence,
  WorkflowSection,
  AgentTypesSection,
  CaseStudiesSection,
  GeminiAnimationSection,
  TestimonialsSection,
  BenchmarksSection,
  PreFooterTalk,
  FooterCta
} from './sections';
import { StickyBanner } from '@/components/ui/sticky-banner';

gsap.registerPlugin(ScrollTrigger);
export function LandingPage() {
  const mainRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.to('[data-spark]', { y: -12, opacity: 0.45, duration: 2.3, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.2 });
    }, mainRef);
    return () => context.revert();
  }, []);

  return (
    <main ref={mainRef} className="landing-page">
      <StickyBanner className="bg-gradient-to-b from-blue-500 to-blue-600 z-[60] min-h-16 py-3">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md text-[14.5px] tracking-wide text-center">
          Announcing $10M seed funding from project mayhem ventures.{" "}
          <a href="#" className="transition duration-200 hover:underline font-semibold ml-1.5 underline-offset-4">
            Read announcement
          </a>
        </p>
      </StickyBanner>
      <Header />
      <CinematicIntro />
      <MemoryUseCases />
      <LayerSequence />
      <WorkflowSection />
      <AgentTypesSection />
      <BenchmarksSection />
      <PreFooterTalk />
      <CaseStudiesSection />
      <GeminiAnimationSection />
      <TestimonialsSection />
      <FooterCta />
      <span data-spark className="landing-spark landing-spark-one" aria-hidden="true"><Sparkles className="h-3 w-3" /></span>
      <span data-spark className="landing-spark landing-spark-two" aria-hidden="true"><Zap className="h-3 w-3" /></span>
    </main>
  );
}
