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

export function PreFooterTalk() {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const handleMove = (event: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect || !cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Calculate relative mouse position (-0.5 to 0.5)
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

        // Tilt the card based on mouse position
        gsap.to(cardRef.current, {
          rotateX: -y * 10,
          rotateY: x * 15,
          duration: 0.6,
          ease: 'power3.out',
          transformPerspective: 1000
        });
      };

      const handleLeave = () => {
        gsap.to(cardRef.current, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: 'power3.out'
        });
      };

      const container = containerRef.current;
      if (container) {
        container.addEventListener('mousemove', handleMove);
        container.addEventListener('mouseleave', handleLeave);
      }

      return () => {
        if (container) {
          container.removeEventListener('mousemove', handleMove);
          container.removeEventListener('mouseleave', handleLeave);
        }
      };
    }, containerRef);
    return () => context.revert();
  }, []);

  return (
    <section ref={containerRef} className="landing-pre-footer">
      <div className="landing-perspective-grid">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,100 M100,0 L0,100 M50,0 L50,100 M0,50 L100,50" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2" fill="none" />
          <path d="M25,25 L75,25 L75,75 L25,75 Z M10,10 L90,10 L90,90 L10,90 Z" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2" fill="none" />
          <path d="M40,40 L60,40 L60,60 L40,60 Z" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2" fill="none" />
        </svg>
      </div>

      <div className="landing-talk-card-wrapper" ref={cardRef}>
        <div className="landing-talk-card">
          <div className="landing-talk-mesh" />
          <div className="landing-talk-noise" />

          <div className="landing-talk-content">
            <span className="landing-talk-pill">( LET'S TALK )</span>
            <h2 className="landing-talk-title">
              Let's Build Something<br />Memorable
            </h2>
            <button className="landing-talk-button">
              Book a Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
