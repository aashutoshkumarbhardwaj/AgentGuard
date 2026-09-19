'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Shield, X } from 'lucide-react';
import { pipeline } from './constants';
import { LayerCard } from './LayerCard';


export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.from('[data-how="heading"]', {
        scrollTrigger: undefined,
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        immediateRender: false,
      });
      gsap.from('[data-layer]', {
        y: 50,
        opacity: 0,
        rotateX: 12,
        transformPerspective: 800,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.15,
      });
      gsap.to('[data-network-dot]', {
        y: -9,
        opacity: 0.25,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        stagger: 0.12,
        ease: 'sine.inOut',
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="landing-section landing-how">
      <div className="landing-section-heading" data-how="heading">
        <span className="landing-kicker">How it works</span>
        <h2 className="landing-section-title">Security that follows<br /><span>the shape of the work.</span></h2>
        <p className="landing-section-copy">AgentGuard sits quietly between intent and execution. It turns every run into context you can inspect, learn from, and control.</p>
      </div>
      <div className="landing-how-visual">
        <div className="landing-wireframe-grid" aria-hidden="true" />
        <div className="landing-orbit landing-orbit-one" aria-hidden="true" />
        <div className="landing-orbit landing-orbit-two" aria-hidden="true" />
        <div className="landing-network-core">
          <Shield className="h-8 w-8 text-[#d7ceff]" strokeWidth={1.25} />
          <span>AgentGuard</span>
          <small>execution layer</small>
        </div>
        {[
          ['01', 'Agent', 'intent'],
          ['02', 'Policy', 'context'],
          ['03', 'Risk', 'decision'],
          ['04', 'Tool', 'execution'],
        ].map(([number, title, subtitle], index) => (
          <div key={number} data-network-dot className={`landing-network-node landing-network-node-${index + 1}`}>
            <span>{number}</span>
            <strong>{title}</strong>
            <small>{subtitle}</small>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {pipeline.map((item, index) => <div key={item.number} data-layer><LayerCard item={item} index={index} /></div>)}
      </div>
    </section>
  );
}
