'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { pipeline } from './constants';
import { LayerCard } from './LayerCard';

export function LayerSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.from('[data-sequence="title"]', { y: 28, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('[data-layer-callout]', { opacity: 0, y: 16, duration: 0.65, stagger: 0.12, delay: 0.18, ease: 'power3.out' });
      gsap.from('[data-stack-layer]', { opacity: 0, y: 24, rotateX: 16, duration: 0.8, stagger: 0.1, delay: 0.2, transformPerspective: 800, ease: 'power3.out' });

      const zoom = gsap.quickTo(stackRef.current, 'scale', { duration: 0.5, ease: 'power2.out' });
      const lift = gsap.quickTo(stackRef.current, 'y', { duration: 0.5, ease: 'power2.out' });
      let frame = 0;
      const handleScroll = () => {
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          const section = sectionRef.current;
          if (!section) return;
          const bounds = section.getBoundingClientRect();
          const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
          zoom(0.94 + progress * 0.12);
          lift((0.5 - progress) * 18);
        });
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (frame) window.cancelAnimationFrame(frame);
      };
    }, sectionRef);
    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="landing-sequence-section">
      <h2 data-sequence="title" className="landing-sequence-title">How it works</h2>
      <div className="landing-sequence-layout">
        <div className="landing-callout-column landing-callout-left">
          <div data-layer-callout className="landing-layer-callout">
            <div className="landing-callout-top"><span>LAYER 3</span><strong>Graph Assembly</strong></div>
            <h3>Connect every workflow.</h3>
            <p>Shared steps and prefixes reveal new paths, allowing agents to compose workflows and learn implicit skills.</p>
            <i className="landing-callout-line" />
          </div>
          <div data-layer-callout className="landing-layer-callout">
            <div className="landing-callout-top"><span>LAYER 1</span><strong>Traces</strong></div>
            <h3>The raw record of an agent session.</h3>
            <p>A prompt, followed by the tool calls it produced: files read, commands run, and results returned, in order.</p>
            <i className="landing-callout-line" />
          </div>
        </div>
        <div ref={stackRef} className="landing-layer-stack-wrap">
          <div className="landing-layer-stack" aria-label="Replaceable layered system artwork">
            <div data-stack-layer className="landing-stack-panel landing-stack-retrieval" />
            <div data-stack-layer className="landing-stack-panel landing-stack-graph"><span /><span /><span /><span /><span /></div>
            <div data-stack-layer className="landing-stack-panel landing-stack-workflow"><span /><span /><span /><span /><span /><span /><span /></div>
            <div data-stack-layer className="landing-stack-panel landing-stack-traces"><b>trace / run_6f23a9</b><b>tool  calendar.read</b><b>policy permitted</b><b>risk   12 / low</b></div>
          </div>
        </div>
        <div className="landing-callout-column landing-callout-right">
          <div data-layer-callout className="landing-layer-callout">
            <div className="landing-callout-top"><span>LAYER 4</span><strong>Retrieval</strong></div>
            <h3>The layer agents interact with.</h3>
            <p>When an agent starts a task, AgentGuard automatically finds the relevant workflow and guides the agent through it.</p>
            <i className="landing-callout-line" />
          </div>
          <div data-layer-callout className="landing-layer-callout">
            <div className="landing-callout-top"><span>LAYER 2</span><strong>Workflow Synthesis</strong></div>
            <h3>Turn a successful run into a reusable workflow.</h3>
            <p>Memorable removes dead ends and keeps the sequence of steps that reached the goal.</p>
            <i className="landing-callout-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
