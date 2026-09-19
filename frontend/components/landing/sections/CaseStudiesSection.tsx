'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';
import { ArrowUpRight, Plus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CaseStudyCardData {
  id: string;
  kicker?: string;
  title?: string;
  copy?: string;
  verticalLabel?: string;
  colors: number[][];
  gradientStyle: React.CSSProperties;
  borderColor: string;
  kickerColor: string;
  widthClass: string;
  hasArrow?: boolean;
  hasPlus?: boolean;
}

const CASE_STUDIES: CaseStudyCardData[] = [
  {
    id: 'openhome',
    verticalLabel: 'OPENHOME',
    colors: [
      [245, 158, 11], // Warm Amber
      [234, 88, 12],  // Sunset Orange
      [217, 119, 6],  // Rich Copper
    ],
    gradientStyle: {
      background:
        'radial-gradient(circle at 45% 45%, rgba(245, 158, 11, 0.95) 0%, rgba(234, 88, 12, 0.7) 35%, rgba(180, 83, 9, 0.4) 65%, rgba(15, 12, 10, 0.95) 100%)',
    },
    borderColor: 'rgba(245, 158, 11, 0.3)',
    kickerColor: '#fcd34d',
    widthClass: 'w-[260px] sm:w-[300px] md:w-[320px]',
    hasPlus: true,
  },
  {
    id: 'gstack',
    kicker: 'GSTACK',
    title: '98% less context per prompt',
    copy: 'The learned procedure is 293 tokens against 15,593 for the /investigate skill, on Claude Code with gbrain memory.',
    colors: [
      [168, 85, 247], // Deep Purple
      [232, 121, 249], // Glowing Violet
      [147, 51, 234], // Radiant Orchid
    ],
    gradientStyle: {
      background:
        'radial-gradient(circle at 65% 40%, rgba(168, 85, 247, 0.95) 0%, rgba(147, 51, 234, 0.7) 35%, rgba(126, 34, 206, 0.4) 65%, rgba(12, 10, 18, 0.95) 100%)',
    },
    borderColor: 'rgba(168, 85, 247, 0.3)',
    kickerColor: '#d8b4fe',
    widthClass: 'w-[380px] sm:w-[480px] md:w-[540px]',
  },
  {
    id: 'quartermaster',
    kicker: 'QUARTERMASTER',
    title: '40% fewer tool calls',
    copy: '5 to 3 tool calls on the same tasks. Pass rate 91% with memory, 80% without.',
    colors: [
      [56, 189, 248], // Sky Blue
      [14, 165, 233], // Electric Cyan
      [59, 130, 246], // Vibrant Blue
    ],
    gradientStyle: {
      background:
        'radial-gradient(circle at 65% 45%, rgba(56, 189, 248, 0.95) 0%, rgba(14, 165, 233, 0.7) 35%, rgba(3, 105, 161, 0.4) 65%, rgba(8, 14, 22, 0.95) 100%)',
    },
    borderColor: 'rgba(56, 189, 248, 0.3)',
    kickerColor: '#7dd3fc',
    widthClass: 'w-[380px] sm:w-[480px] md:w-[540px]',
    hasArrow: true,
  },
];

export function CaseStudiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // GSAP Animations: Entrance Stagger, Scroll Scrub, and Smooth Parallax
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const title = titleRef.current;
      if (!section || !track) return;

      // 1. Heading Entrance Animation
      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
            },
          }
        );
      }

      // 2. Cards Entrance Stagger
      gsap.fromTo(
        '.case-study-item-card',
        { opacity: 0, y: 45, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
        }
      );

      // 3. Smooth Horizontal Scroll on Page Scroll
      const getScrollDistance = () => {
        const trackWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        return trackWidth > viewportWidth ? -(trackWidth - viewportWidth + 80) : -40;
      };

      gsap.to(track, {
        x: () => getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 20%',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black py-24 sm:py-32 overflow-hidden border-t border-white/[0.06]"
    >
      {/* Ambient background atmosphere */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="text-[38px] sm:text-[48px] lg:text-[52px] font-normal tracking-[-0.03em] text-white text-center mb-12 sm:mb-16 px-6"
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          Case Studies From Design Partners.
        </h2>

        {/* Card Track Container */}
        <div className="w-full overflow-x-auto scrollbar-none px-6 sm:px-10 lg:px-16 pb-4">
          <div
            ref={trackRef}
            className="flex items-center gap-6 sm:gap-7 will-change-transform select-none min-w-max"
          >
            {CASE_STUDIES.map((card) => {
              const isHovered = hoveredCard === card.id;

              return (
                <div
                  key={card.id}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`case-study-item-card group relative shrink-0 ${card.widthClass} h-[340px] sm:h-[370px] md:h-[380px] rounded-2xl overflow-hidden border border-white/[0.18] hover:border-white/40 p-7 sm:p-9 flex flex-col justify-end transition-all duration-300 shadow-[0_25px_60px_rgba(0,0,0,0.9)] cursor-pointer`}
                  style={{
                    backgroundColor: '#0c0d14',
                  }}
                >
                  {/* Layer 1: Vibrant Glowing Nebula Gradient (Always 100% Visible) */}
                  <div
                    className="absolute inset-0 w-full h-full pointer-events-none z-0 transition-transform duration-700 group-hover:scale-105"
                    style={card.gradientStyle}
                  />

                  {/* Layer 2: CanvasRevealEffect Overlay for Dynamic Dots */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-70 mix-blend-screen">
                    <CanvasRevealEffect
                      animationSpeed={isHovered ? 4.8 : 2.2}
                      containerClassName="bg-transparent absolute inset-0 w-full h-full"
                      colors={card.colors}
                      dotSize={2.4}
                      showGradient={false}
                    />
                  </div>

                  {/* Layer 3: Fine Dithered Halftone Matrix Texture Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none z-[2] opacity-45 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        'radial-gradient(rgba(255, 255, 255, 0.7) 0.85px, transparent 0.85px)',
                      backgroundSize: '3.2px 3.2px',
                    }}
                  />

                  {/* Layer 4: Card Border Glow on Hover */}
                  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-white/35 transition-colors duration-500 pointer-events-none z-[3]" />

                  {/* Content: Vertical label for Card 1 (OPENHOME) */}
                  {card.verticalLabel && (
                    <div
                      className="absolute right-7 sm:right-8 top-7 sm:top-8 font-mono text-[11px] tracking-[0.25em] text-white/90 uppercase z-10 select-none font-semibold"
                      style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                      }}
                    >
                      {card.verticalLabel}
                    </div>
                  )}

                  {/* Plus icon on bottom right for OPENHOME */}
                  {card.hasPlus && (
                    <div className="absolute right-7 sm:right-8 bottom-7 sm:bottom-8 w-9 h-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300 z-10 shadow-lg backdrop-blur-sm">
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  )}

                  {/* Content for GSTACK and QUARTERMASTER */}
                  {(card.kicker || card.title || card.copy) && (
                    <div className="relative z-10 flex flex-col justify-end">
                      {card.kicker && (
                        <span
                          className="font-mono text-[11px] tracking-[0.2em] font-semibold uppercase mb-3 select-none"
                          style={{ color: card.kickerColor }}
                        >
                          {card.kicker}
                        </span>
                      )}

                      {card.title && (
                        <h3 className="text-[23px] sm:text-[27px] md:text-[29px] font-normal tracking-[-0.02em] text-white leading-[1.2] mb-3 select-none drop-shadow-sm">
                          {card.title}
                        </h3>
                      )}

                      {card.copy && (
                        <p className="text-[13.5px] sm:text-[14px] text-white/80 font-normal leading-relaxed max-w-[460px] select-none">
                          {card.copy}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Arrow link on bottom right for QUARTERMASTER */}
                  {card.hasArrow && (
                    <div className="absolute right-7 sm:right-8 bottom-7 sm:bottom-8 w-9 h-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300 z-10 shadow-lg backdrop-blur-sm">
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
