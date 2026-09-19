'use client';

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

export function CaseStudiesSection() {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      // Optional: Add scroll trigger animations here if needed
      gsap.from('.landing-case-study-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => context.revert();
  }, []);

  return (
    <section ref={containerRef} className="landing-case-studies-section">
      <h2 className="landing-case-studies-title">Case Studies From Design Partners.</h2>

      <div className="landing-case-studies-scroll">
        {/* Card 1 */}
        <div className="landing-case-study-card">
          <div className="landing-case-study-mesh-wrapper">
            <div className="landing-talk-mesh" style={{ filter: 'blur(60px)', opacity: 0.4 }} />
          </div>
          <div className="landing-talk-noise" />

          <div className="landing-case-study-vertical">OPENHOME</div>
          <div className="landing-case-study-link">
            <span className="text-lg font-light leading-none">+</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="landing-case-study-card">
          <div className="landing-case-study-mesh-wrapper">
            <div className="landing-talk-mesh" style={{ filter: 'blur(60px)', opacity: 0.4 }} />
          </div>
          <div className="landing-talk-noise" />

          <div className="landing-case-study-content">
            <div className="landing-case-study-kicker">GSTACK</div>
            <h3 className="landing-case-study-title">98% less context per prompt</h3>
            <p className="landing-case-study-copy">
              The learned procedure is 293 tokens against 15,593 for the /investigate skill, on Claude Code with gbrain memory.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="landing-case-study-card">
          <div className="landing-case-study-mesh-wrapper">
            <div className="landing-talk-mesh" style={{ filter: 'blur(60px)', opacity: 0.4 }} />
          </div>
          <div className="landing-talk-noise" />

          <div className="landing-case-study-content">
            <div className="landing-case-study-kicker">QUARTERMASTER</div>
            <h3 className="landing-case-study-title">40% fewer tool calls</h3>
            <p className="landing-case-study-copy">
              5 to 3 tool calls on the same tasks. Pass rate 91% with memory, 80% without.
            </p>
          </div>
          <div className="landing-case-study-link">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </div>
        </div>
      </div>
    </section>
  );
}
