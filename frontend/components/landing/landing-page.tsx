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
  BrandMarkFrame,
  WorkflowSection,
  AgentTypesSection,
  CaseStudiesSection,
  TestimonialsSection,
  BenchmarksSection,
  PreFooterTalk,
  FooterCta
} from './sections';

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
      <Header />
      <CinematicIntro />
      <MemoryUseCases />
      <LayerSequence />
      <BrandMarkFrame />
      <WorkflowSection />
      <AgentTypesSection />
      <BenchmarksSection />
      <PreFooterTalk />
      <CaseStudiesSection />
      <TestimonialsSection />
      <FooterCta />
      <span data-spark className="landing-spark landing-spark-one" aria-hidden="true"><Sparkles className="h-3 w-3" /></span>
      <span data-spark className="landing-spark landing-spark-two" aria-hidden="true"><Zap className="h-3 w-3" /></span>
    </main>
  );
}
