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

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro.from('.landing-hero-title', { y: 24, opacity: 0, duration: 0.8 })
        .from('.landing-hero-subtitle', { y: 16, opacity: 0, duration: 0.6 }, '-=0.5')
        .from('.landing-hero-cta', { y: 16, opacity: 0, duration: 0.6 }, '-=0.4');
    }, heroRef);

    return () => context.revert();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  return (
    <section ref={heroRef} className="landing-hero-section">
      <div className="landing-hero-video-background">
        <video
          ref={videoRef}
          src="/videos/fixed-matrix-loop.mp4"
          className="landing-hero-video-full"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="landing-hero-video-overlay" />
      </div>

      <div className="landing-hero-layout-full">
        <div className="landing-hero-text">
          <div className="landing-hero-eyebrow">
            BACKED BY
            <span className="landing-yc-badge">Y</span>
            JUGAAD LABS INC.
          </div>
          <h1 className="landing-hero-title" style={{ fontFamily: 'Memorable, sans-serif', fontWeight: 700 }}>
            Secure AI Agents<br />Before They Act.
          </h1>
          <div className="landing-hero-actions">
            <Link href="/overview" prefetch={true} className="landing-solid-button">
              DASHBOARD <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
            <div className="landing-code-chip">
              <span className="text-white/50 mr-2">npx</span> memorable-cli@latest
              <Copy className="h-3 w-3 ml-3 text-white/40 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
          <div className="landing-hero-proof">
            <span className="label">LIVE ON</span>
            <span>GBRAIN</span>
            <span className="highlight">GSTACK</span>
            <span>QM</span>
          </div>
        </div>

        <button onClick={toggleMute} className="landing-hero-unmute-absolute">
          UNMUTE <span className="ml-1 text-[10px]">🔇</span>
        </button>
      </div>
    </section>
  );
}
