import re
import os

filepath = 'frontend/components/landing/landing-page.tsx'
with open(filepath, 'r') as f:
    content = f.read()

os.makedirs('frontend/components/landing/sections', exist_ok=True)

# Shared constants block
shared_consts = """
export const glyphs = Array.from(
  '01{}[]<>/\\#@$%&*+=~:;ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

export const pipeline = [
  { number: '01', title: 'Observe', copy: 'See every agent action before it reaches your tools.', tone: 'cyan' },
  { number: '02', title: 'Understand', copy: 'Trace intent, context, and risk across the whole run.', tone: 'violet' },
  { number: '03', title: 'Control', copy: 'Allow, approve, or block with policies that stay in your hands.', tone: 'amber' },
];

export const steps = [
  { number: '01', label: 'Connect', title: 'Connect your agents', copy: 'Drop AgentGuard between your agents and the tools they use. No model changes required.' },
  { number: '02', label: 'Observe', title: 'Watch the system learn', copy: 'Every call becomes a trace. See behavior, relationships, and risk assemble in real time.' },
  { number: '03', label: 'Protect', title: 'Ship with confidence', copy: 'Turn insight into policy. Keep the useful actions moving and stop the dangerous ones.' },
];
"""
with open('frontend/components/landing/sections/constants.ts', 'w') as f:
    f.write(shared_consts)


components = [
    'GlyphField', 'Logo', 'Header', 'Hero', 'LayerCard', 'LayerSequence',
    'BrandMarkFrame', 'HowItWorks', 'WorkflowSection', 'FooterCta',
    'PreFooterTalk', 'BenchmarksSection', 'CaseStudiesSection', 'TestimonialsSection'
]

base_imports = """'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import {
  ArrowRight,
  ChevronRight,
  Copy,
  Github,
  Menu,
  Shield,
  Sparkles,
  Terminal,
  X,
  Zap,
} from 'lucide-react';
import { glyphs, pipeline, steps } from './constants';

"""

index_exports = []
exported_names = []

for comp in components:
    pattern = r'(?:export\s+)?function\s+' + comp + r'\s*\(.*?\)\s*{'
    match = re.search(pattern, content)
    if not match:
        continue
    
    start_idx = match.start()
    
    brace_count = 0
    end_idx = -1
    in_string = False
    string_char = ''
    
    for i in range(start_idx, len(content)):
        char = content[i]
        
        if char in ["'", '"', '`'] and content[i-1] != '\\':
            if not in_string:
                in_string = True
                string_char = char
            elif string_char == char:
                in_string = False
                
        if not in_string:
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    end_idx = i + 1
                    break
                    
    if end_idx != -1:
        comp_code = content[start_idx:end_idx]
        if not comp_code.startswith('export '):
            comp_code = 'export ' + comp_code
        
        filename = f"{comp}.tsx"
        with open(f"frontend/components/landing/sections/{filename}", 'w') as f:
            f.write(base_imports + comp_code + "\n")
        
        index_exports.append(f"export * from './{comp}';")
        exported_names.append(comp)

with open('frontend/components/landing/sections/index.ts', 'w') as f:
    f.write("\n".join(index_exports) + "\n")

# Now rewrite landing-page.tsx
new_landing_page = """'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Zap } from 'lucide-react';
import {
  Header,
  Hero,
  LayerSequence,
  BrandMarkFrame,
  HowItWorks,
  WorkflowSection,
  CaseStudiesSection,
  TestimonialsSection,
  BenchmarksSection,
  PreFooterTalk,
  FooterCta
} from './sections';

gsap.registerPlugin(ScrollTrigger);

function MainScrollSequence() {
  const containerRef = useRef<HTMLElement>(null);
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const howItWorksWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        }
      });

      tl.to(heroWrapperRef.current, { scale: 0.85, opacity: 0, ease: 'none' }, 0);
      tl.fromTo(howItWorksWrapperRef.current, { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none' }, 0);
    }, containerRef);
    return () => context.revert();
  }, []);

  return (
    <section ref={containerRef} className="landing-main-sequence-container">
      <div ref={heroWrapperRef} className="landing-sequence-screen landing-sequence-hero">
        <Hero />
      </div>
      <div ref={howItWorksWrapperRef} className="landing-sequence-screen landing-sequence-how">
        <HowItWorks />
      </div>
    </section>
  );
}

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
      <MainScrollSequence />
      <LayerSequence />
      <BrandMarkFrame />
      <WorkflowSection />
      <CaseStudiesSection />
      <TestimonialsSection />
      <BenchmarksSection />
      <PreFooterTalk />
      <FooterCta />
      <span data-spark className="landing-spark landing-spark-one" aria-hidden="true"><Sparkles className="h-3 w-3" /></span>
      <span data-spark className="landing-spark landing-spark-two" aria-hidden="true"><Zap className="h-3 w-3" /></span>
    </main>
  );
}
"""

with open(filepath, 'w') as f:
    f.write(new_landing_page)

print("Modularization complete.")
