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

export function BrandMarkFrame() {
  const frameRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.from(markRef.current, { scale: 0.82, opacity: 0, duration: 1.1, ease: 'power3.out' });
      gsap.to(markRef.current, { scale: 1.035, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, frameRef);
    return () => context.revert();
  }, []);

  return (
    <section ref={frameRef} className="landing-mark-section">
      <div ref={markRef} className="landing-mark-placeholder" aria-label="Replaceable brand artwork">
        <span className="landing-mark-bars"><i /><i /><i /></span>
      </div>
      <div className="landing-mark-code landing-mark-code-left">+XX80@</div>
      <div className="landing-mark-code landing-mark-code-right">#%$S</div>
      <div className="landing-mark-scroll"><span /> Scroll to continue</div>
    </section>
  );
}
