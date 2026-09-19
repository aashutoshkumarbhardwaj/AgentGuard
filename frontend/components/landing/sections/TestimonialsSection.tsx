'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id: string;
  name: string;
  handle?: string;
  role: string;
  avatarType: 'image' | 'openhome' | 'yc';
  avatarSrc?: string;
  content: React.ReactNode;
  footer: string;
  url: string;
  hasXLogo?: boolean;
  hasSpecialWave?: boolean;
  hasSubtleGlow?: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'brycent',
    name: 'Brycent',
    handle: '@brycent',
    role: 'Creator and Investor',
    avatarType: 'image',
    avatarSrc: '/images/testimonials/brycent.jpg',
    content: 'Bro is in YC headstart, he will be at 10m ARR before starting the batch',
    footer: 'Sep 17',
    url: 'https://x.com/brycent/status/2100761307003642007',
    hasXLogo: true,
    hasSubtleGlow: true,
  },
  {
    id: 'openhome',
    name: 'OpenHome',
    role: 'Working with Memorable on Faster, Cheaper Agents',
    avatarType: 'openhome',
    avatarSrc: '/images/testimonials/openhome.jpg',
    content: "Most memory tools store what happened. Memorable stores how things get done. It watches an agent's own successful runs and turns them into reusable workflows, so the path an agent worked out once becomes a path it can follow.",
    footer: 'openhome.com',
    url: 'https://openhome.com/blog/memorable',
    hasXLogo: false,
  },
  {
    id: 'yc',
    name: 'Y Combinator',
    role: 'Launch YC',
    avatarType: 'yc',
    content: 'Memorable (YC S27) is procedural memory for AI agents.',
    footer: 'Sep 17',
    url: 'https://www.ycombinator.com/launches',
    hasXLogo: false,
    hasSpecialWave: true,
  },
  {
    id: 'garrytan',
    name: 'Garry Tan',
    handle: '@garrytan',
    role: 'President and CEO, Y Combinator',
    avatarType: 'image',
    avatarSrc: '/images/testimonials/garrytan.jpg',
    content: 'Memorable found a way to optimize memory with embeddings instead of more tokens which is a powerful new way to do memory',
    footer: 'Sep 17',
    url: 'https://x.com/garrytan/status/2100668489178456268',
    hasXLogo: true,
  },
  {
    id: 'kulveer',
    name: 'Kulveer',
    handle: '@kul',
    role: 'Visiting Partner, Y Combinator',
    avatarType: 'image',
    avatarSrc: '/images/testimonials/kulveer.jpg',
    content: (
      <>
        Models are commodities. What your agents learn doing your work is the asset. Memorable lets you own it. Excited to be working with{' '}
        <span className="text-[#38bdf8] hover:underline font-normal">@advaiytsane</span> and{' '}
        <span className="text-[#38bdf8] hover:underline font-normal">@nikhilk8754</span> on{' '}
        <span className="text-[#38bdf8] hover:underline font-normal">@memorablesh</span>. Congrats on the launch!
      </>
    ),
    footer: 'Sep 17',
    url: 'https://x.com/kul/status/2100671510252073062',
    hasXLogo: true,
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Heading entrance animation
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // 2. Horizontal infinite marquee with GSAP
      const track = trackRef.current;
      if (!track) return;

      // Duplicate list 3 times so 1 full cycle is exactly 1/3 of the track
      // Seamless wrap modifier
      const totalWidth = track.scrollWidth;
      const singleSetWidth = totalWidth / 3;

      const loopTween = gsap.to(track, {
        x: `-=${singleSetWidth}`,
        duration: 38,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => {
            const current = parseFloat(x);
            // Seamless wrap within [ -singleSetWidth, 0 ]
            const wrapped = ((current % singleSetWidth) - singleSetWidth) % singleSetWidth;
            return wrapped;
          }),
        },
      });

      tweenRef.current = loopTween;

      // 3. ScrollTrigger scrub / velocity boost:
      // When scrolling vertically, speed up the track in sync with scroll velocity
      let resetTimer: NodeJS.Timeout;
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const vel = self.getVelocity();
          if (Math.abs(vel) > 40) {
            // Speed up smoothly on scroll
            const speedBoost = gsap.utils.clamp(-3, 3, vel / 280);
            gsap.to(loopTween, {
              timeScale: 1 + speedBoost,
              duration: 0.2,
              overwrite: 'auto',
            });

            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
              gsap.to(loopTween, {
                timeScale: 1,
                duration: 1.2,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            }, 120);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 0.15, duration: 0.6 });
    }
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.8 });
    }
  };

  // Duplicate 3 times for a seamless loop
  const repeatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="landing-testimonials-wrapper relative w-full overflow-hidden bg-black pt-28 pb-36 flex flex-col items-center select-none"
    >
      {/* Title */}
      <div className="w-full max-w-[1400px] px-6 md:px-12 text-center mb-16 md:mb-20">
        <h2
          ref={headingRef}
          className="text-[42px] sm:text-[52px] md:text-[60px] font-normal tracking-[-0.025em] text-white leading-tight"
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          What People Say.
        </h2>
      </div>

      {/* Scrolling Carousel Viewport */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Soft edge blur vignettes */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-44 bg-gradient-to-r from-black via-black/85 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-44 bg-gradient-to-l from-black via-black/85 to-transparent z-20 pointer-events-none" />

        {/* Marquee Track */}
        <div
          ref={trackRef}
          className="flex gap-6 will-change-transform py-4 px-6 items-stretch w-max cursor-grab active:cursor-grabbing"
        >
          {repeatedTestimonials.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col justify-between w-[380px] sm:w-[440px] min-h-[270px] p-7 rounded-[22px] bg-[#08090d] border border-white/[0.08] hover:border-white/[0.22] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.8)] overflow-hidden shrink-0 ${
                item.hasSubtleGlow ? 'before:absolute before:inset-0 before:bg-gradient-to-b before:from-cyan-500/[0.05] before:to-transparent before:pointer-events-none' : ''
              }`}
            >
              {/* Special Cyan Ribbon Wave for Y Combinator Card */}
              {item.hasSpecialWave && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[22px]">
                  {/* Subtle radial cyan glow */}
                  <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none" />

                  {/* Flowing silk ribbons SVG matching reference image */}
                  <div className="absolute top-0 right-0 w-[80%] h-full opacity-80 pointer-events-none">
                    <svg
                      className="w-full h-full object-cover"
                      viewBox="0 0 400 280"
                      fill="none"
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id="ycRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                          <stop offset="45%" stopColor="#0891b2" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="ycLineGrad" x1="10%" y1="0%" x2="100%" y2="85%">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
                        </linearGradient>
                        <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="6" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Broad luminous ribbons */}
                      <path
                        d="M 140 -10 C 210 70, 260 140, 400 130 L 400 -10 Z"
                        fill="url(#ycRibbonGrad)"
                      />
                      <path
                        d="M 120 40 C 200 120, 250 180, 400 170"
                        stroke="url(#ycRibbonGrad)"
                        strokeWidth="24"
                        strokeLinecap="round"
                        filter="url(#waveGlow)"
                        opacity="0.45"
                      />

                      {/* Wispy flow lines */}
                      <path
                        d="M 130 20 C 215 100, 265 170, 400 160"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeOpacity="0.9"
                      />
                      <path
                        d="M 155 10 C 235 90, 280 150, 400 145"
                        stroke="#22d3ee"
                        strokeWidth="1.8"
                        strokeOpacity="0.75"
                      />
                      <path
                        d="M 180 -5 C 255 75, 290 130, 400 130"
                        stroke="#a5f3fc"
                        strokeWidth="1.2"
                        strokeOpacity="0.9"
                      />
                      <path
                        d="M 140 55 C 225 135, 275 190, 400 185"
                        stroke="#0ea5e9"
                        strokeWidth="2"
                        strokeOpacity="0.6"
                      />
                      <path
                        d="M 125 75 C 205 155, 265 210, 400 210"
                        stroke="#0891b2"
                        strokeWidth="2.5"
                        strokeOpacity="0.4"
                      />
                      <path
                        d="M 200 30 C 265 95, 305 160, 400 165"
                        stroke="#2dd4bf"
                        strokeWidth="1.2"
                        strokeOpacity="0.8"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Card Header: Profile Info + Twitter X Icon */}
              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className="flex items-center gap-3.5">
                  {/* Avatar rendering */}
                  {item.avatarType === 'yc' ? (
                    <div className="w-[42px] h-[42px] rounded-full bg-[#f26522] flex items-center justify-center font-bold text-white text-[20px] shrink-0 shadow-md">
                      Y
                    </div>
                  ) : item.avatarType === 'openhome' ? (
                    <div className="w-[42px] h-[42px] rounded-full bg-black border border-white/10 flex items-center justify-center shrink-0 overflow-hidden p-1.5 shadow-md">
                      <img
                        src={item.avatarSrc}
                        alt="OpenHome"
                        className="w-full h-full object-contain filter invert"
                      />
                    </div>
                  ) : (
                    <img
                      src={item.avatarSrc}
                      alt={item.name}
                      className="w-[42px] h-[42px] rounded-full object-cover shrink-0 border border-white/10 shadow-md"
                    />
                  )}

                  {/* Name and Role */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[15px] font-semibold text-white tracking-[-0.01em]">
                        {item.name}
                      </span>
                      {item.handle && (
                        <span className="text-[13px] font-normal text-zinc-500 font-sans">
                          {item.handle}
                        </span>
                      )}
                    </div>
                    <span className="text-[12.5px] text-zinc-400 font-normal leading-tight mt-0.5">
                      {item.role}
                    </span>
                  </div>
                </div>

                {/* Twitter / X Logo */}
                {item.hasXLogo && (
                  <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0 pt-0.5">
                    <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] fill-current" aria-label="X (formerly Twitter)">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Card Body Content */}
              <div className="relative z-10 text-[14.5px] leading-[1.62] text-zinc-200/90 font-normal flex-1 mb-5">
                {item.content}
              </div>

              {/* Card Footer */}
              <div className="relative z-10 text-[12px] text-zinc-500 font-sans tracking-tight">
                {item.footer}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
