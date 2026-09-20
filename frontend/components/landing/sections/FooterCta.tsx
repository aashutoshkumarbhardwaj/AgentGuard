'use client';

import React, { useState, MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useMotionTemplate } from 'motion/react';
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';
import { cn } from '@/lib/utils';

// Individual Interactive Button with CanvasRevealEffect on hover
function FooterSpotlightButton({
  children,
  onClick,
  className,
  colors = [[147, 51, 234], [59, 130, 246]],
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  colors?: number[][];
  href?: string;
}) {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-md border border-white/20 bg-black/70 backdrop-blur-md px-3.5 py-2.5 transition-all duration-300 hover:border-purple-400/60 hover:shadow-[0_0_24px_rgba(168,85,247,0.35)] cursor-pointer select-none",
        className
      )}
    >
      {/* Canvas reveal effect: active ONLY during hover */}
      {hovered && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-md">
          <CanvasRevealEffect
            animationSpeed={4}
            containerClassName="bg-transparent absolute inset-0"
            colors={colors}
            dotSize={2}
            showGradient={false}
          />
          {/* Subtle dark gradient overlay to ensure crystal-clear text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Button content (z-10 on top of canvas) */}
      <div className="relative z-10 flex items-center gap-2.5 text-[13px] font-semibold text-white">
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="block">
        {inner}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="text-left">
      {inner}
    </button>
  );
}

export function FooterCta() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isFooterHovered, setIsFooterHovered] = useState(false);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: ReactMouseEvent<HTMLElement>) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <footer
      id="get-started"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFooterHovered(true)}
      onMouseLeave={() => setIsFooterHovered(false)}
      className="group relative w-full overflow-hidden bg-[#000] text-white pt-24 pb-8 min-h-[600px] flex flex-col justify-between font-mono"
    >
      {/* Video Background (Always present and playing) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0d] via-transparent to-[#0a0a0d] z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/fixed-matrix-loop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-transparent to-transparent z-10" />
      </div>

      {/* Spotlight Canvas Reveal on Footer Hover (Follows mouse over the video) */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          maskImage: useMotionTemplate`
            radial-gradient(
              450px circle at ${mouseX}px ${mouseY}px,
              white 0%,
              rgba(255,255,255,0.6) 40%,
              transparent 80%
            )
          `,
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              450px circle at ${mouseX}px ${mouseY}px,
              white 0%,
              rgba(255,255,255,0.6) 40%,
              transparent 80%
            )
          `,
        }}
      >
        {isFooterHovered && (
          <CanvasRevealEffect
            animationSpeed={3.5}
            containerClassName="bg-transparent absolute inset-0 pointer-events-none"
            colors={[
              [147, 51, 234], // Purple
              [59, 130, 246], // Blue
              [236, 72, 153], // Pink
            ]}
            opacities={[0.2, 0.3, 0.4, 0.5, 0.7, 0.9, 1]}
            dotSize={2.5}
            showGradient={false}
          />
        )}
      </motion.div>

      <div className="relative z-20 max-w-[1400px] mx-auto w-full px-6 md:px-12 flex-1 flex flex-col justify-between h-full">
        <div className="flex flex-col md:flex-row justify-between w-full">
          {/* Left Column - Memorable Brand */}
          <div className="max-w-[400px]">
            <div className="flex items-baseline gap-2 mb-6">
              <h2 className="text-[32px] tracking-tight text-white leading-none" style={{ fontFamily: 'Memorable Serif, serif' }}>memorable</h2>
              <span className="text-white/50 text-[13px] font-mono">/&apos;mɛm(ə)rəb(ə)l/ <i style={{ fontFamily: 'Memorable Serif, serif' }}>adj</i></span>
            </div>

            <div className="space-y-4 mb-8 text-white/70 text-[13px] border-b border-white/10 pb-6">
              <div className="flex gap-4">
                <span className="text-[10px] text-white/40 mt-0.5">1</span>
                <p>not to be forgotten; remarkable.</p>
              </div>
              <div className="flex gap-4">
                <span className="text-[10px] text-white/40 mt-0.5">2</span>
                <p>easy to remember; recalled without effort.</p>
              </div>
            </div>

            {/* Email Button with Spotlight on Hover */}
            <FooterSpotlightButton
              href="mailto:info@memorable.sh"
              className="w-auto inline-flex"
              colors={[[147, 51, 234], [59, 130, 246]]}
            >
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>info@memorable.sh</span>
            </FooterSpotlightButton>
          </div>

          {/* Middle Columns - Links */}
          <div className="flex flex-wrap gap-12 md:gap-24 mt-16 md:mt-0 font-mono">
            <div>
              <h3 className="text-white mb-5 text-[14px]">Quick Links</h3>
              <ul className="space-y-3.5 text-white/60 text-[13px]">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Docs</Link></li>
                <li><Link href="/mcp" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white mb-5 text-[14px]">Use Cases</h3>
              <ul className="space-y-3.5 text-white/60 text-[13px]">
                <li><a href="#use-case" className="hover:text-white transition-colors">Coding agents</a></li>
                <li><a href="#use-case" className="hover:text-white transition-colors">Browser agents</a></li>
                <li><a href="#use-case" className="hover:text-white transition-colors">Computer use</a></li>
                <li><a href="#use-case" className="hover:text-white transition-colors">Voice agents</a></li>
                <li><a href="#use-case" className="hover:text-white transition-colors">Research agents</a></li>
                <li><a href="#use-case" className="hover:text-white transition-colors">Ops agents</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white mb-5 text-[14px]">Company</h3>
              <ul className="space-y-3.5 text-white/60 text-[13px]">
                <li><a href="#case-studies" className="hover:text-white transition-colors">Case Studies</a></li>
              </ul>
            </div>
          </div>

          {/* Right Column - Research with AI with Spotlight on Hover */}
          <div className="mt-16 md:mt-0">
            <h3 className="text-white/40 text-[10px] uppercase tracking-[0.15em] mb-4 font-bold">RESEARCH WITH AI</h3>
            <div className="space-y-2.5 flex flex-col items-start">
              <FooterSpotlightButton
                className="w-[170px]"
                colors={[[16, 185, 129], [59, 130, 246]]}
                onClick={() => window.open('https://chatgpt.com', '_blank')}
              >
                <div className="w-4 h-4 flex items-center justify-center bg-white/10 rounded-sm">
                  <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.28 11.23a10 10 0 0 0-1.28-7.89 1 1 0 0 0-.58-.45 10 10 0 0 0-8-.44A10 10 0 0 0 4 2.89a1 1 0 0 0-.58.45 10 10 0 0 0-1.28 7.89v1.54a10 10 0 0 0 1.28 7.89 1 1 0 0 0 .58.45 10 10 0 0 0 8 .44 10 10 0 0 0 8.42-4.44 1 1 0 0 0 .58-.45 10 10 0 0 0 1.28-7.89v-1.54zm-14.7 6.46A8 8 0 0 1 5 12h2a6 6 0 0 0 6 6v2a8 8 0 0 1-5.42-2.31zM19 12a6 6 0 0 0-6-6V4a8 8 0 0 1 8 8h-2z" />
                  </svg>
                </div>
                <span>Ask ChatGPT</span>
              </FooterSpotlightButton>

              <FooterSpotlightButton
                className="w-[170px]"
                colors={[[217, 119, 87], [168, 85, 247]]}
                onClick={() => window.open('https://claude.ai', '_blank')}
              >
                <svg className="w-4 h-4 text-[#d97757]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z" />
                </svg>
                <span>Ask Claude</span>
              </FooterSpotlightButton>

              <FooterSpotlightButton
                className="w-[170px]"
                colors={[[45, 181, 196], [139, 92, 246]]}
                onClick={() => window.open('https://perplexity.ai', '_blank')}
              >
                <svg className="w-4 h-4 text-[#2db5c4]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span>Ask Perplexity</span>
              </FooterSpotlightButton>
            </div>
          </div>
        </div>

        {/* Large Memorable Text */}
        <div className="mt-32 w-full flex justify-center items-end relative overflow-visible">
          <h1 className="text-[14vw] sm:text-[18vw] leading-[0.75] font-bold text-white tracking-[-0.03em] select-none" style={{ fontFamily: 'Memorable, sans-serif' }}>
            Memorable
          </h1>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[12px] text-white/40">
          <p>© 2026 Memorable. All Rights Reserved.</p>
          <p className="mt-4 md:mt-0">Website By <span className="text-white">Lumina</span></p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
