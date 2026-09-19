'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Copy } from 'lucide-react';
import { steps } from './constants';


export function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.from('[data-workflow="heading"] > *', { y: 26, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
      gsap.from('[data-workflow="terminal"]', { x: -35, opacity: 0, duration: 0.85, delay: 0.2, ease: 'power3.out' });
      gsap.from('[data-workflow="cards"] > *', { x: 35, opacity: 0, duration: 0.7, stagger: 0.13, delay: 0.25, ease: 'power3.out' });
    }, sectionRef);
    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo('[data-step-copy]', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
      gsap.fromTo('[data-terminal-line]', { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.045, ease: 'power2.out' });
    }, sectionRef);
    return () => context.revert();
  }, [activeStep]);

  return (
    <section id="workflow" ref={sectionRef} className="landing-section landing-workflow">
      <div data-workflow="heading" className="text-center">
        <span className="landing-kicker">A better default</span>
        <h2 className="landing-section-title mx-auto mt-4 max-w-[660px]">Make every run<br /><span>more observable.</span></h2>
        <p className="landing-section-copy mx-auto mt-5 max-w-[500px]">Three pieces, one quiet control plane. Start small and grow into a system your team can trust.</p>
      </div>
      <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
        <div data-workflow="terminal" className="landing-terminal-wrap">
          <div className="landing-terminal-glow" aria-hidden="true" />
          <div className="landing-terminal">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-1.5"><span className="landing-terminal-dot bg-[#ff716b]" /><span className="landing-terminal-dot bg-[#f1bf4a]" /><span className="landing-terminal-dot bg-[#65e6bc]" /></div>
              <span className="text-[10px] font-mono text-white/35">agentguard / live trace</span>
              <Copy className="h-3.5 w-3.5 text-white/35" />
            </div>
            <div className="mt-6 space-y-3 text-[11px] font-mono leading-5 sm:text-[12px]">
              <p data-terminal-line className="text-white/35">$ agentguard observe --run latest</p>
              <p data-terminal-line className="text-[#8d75ff]">→ trace <span className="text-white/60">run_6f23a9</span></p>
              <p data-terminal-line className="text-white/50">  agent <span className="text-white/85">research-agent</span></p>
              <p data-terminal-line className="text-white/50">  intent <span className="text-[#65e6bc]">calendar.read</span></p>
              <p data-terminal-line className="text-white/50">  policy <span className="text-[#65e6bc]">permitted</span></p>
              <p data-terminal-line className="text-white/50">  risk   <span className="text-[#f1bf4a]">12 / low</span></p>
              <p data-terminal-line className="text-white/50">  threat <span className="text-[#65e6bc]">clear</span></p>
              <p data-terminal-line className="pt-2 text-[#65e6bc]">✓ action allowed <span className="text-white/35">(18ms)</span></p>
            </div>
            <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] font-mono text-white/35"><span>hash chain valid</span><span className="text-[#65e6bc]">● recording</span></div>
          </div>
        </div>
        <div data-workflow="cards" className="relative space-y-3">
          {steps.map((step, index) => {
            const active = activeStep === index;
            return (
              <button
                type="button"
                key={step.number}
                onClick={() => setActiveStep(index)}
                className={`landing-step-card ${active ? 'landing-step-card-active' : ''}`}
              >
                <span className="landing-number">{step.number}</span>
                <div className="min-w-0 flex-1 text-left">
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/35">{step.label}</span>
                  <h3 className="mt-2 text-[19px] font-medium text-white">{step.title}</h3>
                  {active && <p data-step-copy className="mt-2 max-w-[330px] text-[12px] leading-5 text-white/48">{step.copy}</p>}
                </div>
                <ArrowRight className={`h-4 w-4 shrink-0 transition-transform ${active ? 'translate-x-1 text-white' : 'text-white/25'}`} />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
