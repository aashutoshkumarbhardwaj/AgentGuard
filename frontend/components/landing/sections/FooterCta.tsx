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

export function FooterCta() {
  return (
    <footer id="get-started" className="relative w-full overflow-hidden bg-[#000] text-white pt-24 pb-8 min-h-[600px] flex flex-col justify-between font-mono">
      {/* Video Background */}
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

      <div className="relative z-20 max-w-[1400px] mx-auto w-full px-6 md:px-12 flex-1 flex flex-col justify-between h-full">
        <div className="flex flex-col md:flex-row justify-between w-full">
          {/* Left Column - Memorable Brand */}
          <div className="max-w-[400px]">
            <div className="flex items-baseline gap-2 mb-6">
              <h2 className="text-[32px] tracking-tight text-white leading-none" style={{ fontFamily: 'Memorable Serif, serif' }}>memorable</h2>
              <span className="text-white/50 text-[13px] font-mono">/'mɛm(ə)rəb(ə)l/ <i style={{ fontFamily: 'Memorable Serif, serif' }}>adj</i></span>
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

            <a href="mailto:info@memorable.sh" className="inline-flex items-center gap-3 border border-white/20 px-4 py-2.5 rounded text-[13px] hover:bg-white/5 transition-colors">
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              info@memorable.sh
            </a>
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
                <li><a href="#" className="hover:text-white transition-colors">Coding agents</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Browser agents</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Computer use</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Voice agents</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research agents</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ops agents</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white mb-5 text-[14px]">Company</h3>
              <ul className="space-y-3.5 text-white/60 text-[13px]">
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              </ul>
            </div>
          </div>

          {/* Right Column - Ask AI */}
          <div className="mt-16 md:mt-0">
            <h3 className="text-white/40 text-[10px] uppercase tracking-[0.15em] mb-4 font-bold">RESEARCH WITH AI</h3>
            <div className="space-y-2.5 flex flex-col items-start">
              <button className="bg-white text-black px-3 py-2 rounded-md text-[13px] font-semibold flex items-center gap-2.5 hover:bg-white/90 transition-colors w-[150px]">
                <div className="w-4 h-4 flex items-center justify-center bg-black rounded-sm">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M22.28 11.23a10 10 0 0 0-1.28-7.89 1 1 0 0 0-.58-.45 10 10 0 0 0-8-.44A10 10 0 0 0 4 2.89a1 1 0 0 0-.58.45 10 10 0 0 0-1.28 7.89v1.54a10 10 0 0 0 1.28 7.89 1 1 0 0 0 .58.45 10 10 0 0 0 8 .44 10 10 0 0 0 8.42-4.44 1 1 0 0 0 .58-.45 10 10 0 0 0 1.28-7.89v-1.54zm-14.7 6.46A8 8 0 0 1 5 12h2a6 6 0 0 0 6 6v2a8 8 0 0 1-5.42-2.31zM19 12a6 6 0 0 0-6-6V4a8 8 0 0 1 8 8h-2z" /></svg>
                </div>
                Ask ChatGPT
              </button>
              <button className="bg-white text-black px-3 py-2 rounded-md text-[13px] font-semibold flex items-center gap-2.5 hover:bg-white/90 transition-colors w-[150px]">
                <svg className="w-4 h-4 text-[#d97757]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z" /></svg>
                Ask Claude
              </button>
              <button className="bg-white text-black px-3 py-2 rounded-md text-[13px] font-semibold flex items-center gap-2.5 hover:bg-white/90 transition-colors w-[150px]">
                <svg className="w-4 h-4 text-[#2db5c4]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                Ask Perplexity
              </button>
            </div>
          </div>
        </div>

        {/* Large Memorable Text */}
        <div className="mt-32 w-full flex justify-center items-end relative overflow-visible">
          <h1 className="text-[14vw] sm:text-[18vw] leading-[0.75] font-bold text-white tracking-[-0.03em]" style={{ fontFamily: 'Memorable, sans-serif' }}>
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

function PreFooterTalk() {
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

function BenchmarksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const handleMove = (event: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect || !meshRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Calculate relative mouse position (-0.5 to 0.5)
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

        // Pan the background mesh slightly based on mouse position
        gsap.to(meshRef.current, {
          x: -x * 40,
          y: -y * 40,
          duration: 1,
          ease: 'power3.out',
        });
      };

      const handleLeave = () => {
        gsap.to(meshRef.current, {
          x: 0,
          y: 0,
          duration: 1.5,
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
    <section className="landing-benchmarks-section">
      <h2 className="landing-benchmarks-title">Benchmarks</h2>

      <div className="landing-benchmarks-container" ref={containerRef}>
        {/* Reusing the gradient mesh and noise from PreFooterTalk */}
        <div className="landing-benchmarks-mesh-wrapper" ref={meshRef}>
          <div className="landing-talk-mesh" style={{ opacity: 0.8 }} />
        </div>
        <div className="landing-talk-noise" />

        <div className="landing-benchmarks-cards">
          {/* Card 1 */}
          <div className="landing-benchmark-card">
            <div className="landing-benchmark-header">
              <div className="landing-benchmark-title-group">
                <h4>GBrain, Claude Code</h4>
                <p>TURNS PER TASK, 3-BUG CODING FIXTURE</p>
                <div className="landing-benchmark-dots">
                  <span className="active" />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="landing-benchmark-stat">-19%</div>
            </div>

            <div className="landing-benchmark-bars">
              <div className="landing-benchmark-bar-row">
                <div className="landing-benchmark-bar-labels">
                  <span className="label">Without memory</span>
                  <span className="value">16</span>
                </div>
                <div className="landing-benchmark-bar-track">
                  <div className="landing-benchmark-bar-fill" style={{ width: '100%' }}>
                    <div className="landing-benchmark-bar-cursor" style={{ right: '0' }} />
                  </div>
                </div>
              </div>

              <div className="landing-benchmark-bar-row">
                <div className="landing-benchmark-bar-labels">
                  <span className="label highlight">With Memorable</span>
                  <span className="value highlight">13</span>
                </div>
                <div className="landing-benchmark-bar-track">
                  <div className="landing-benchmark-bar-fill highlight" style={{ width: '81.25%' }}>
                    <div className="landing-benchmark-bar-cursor" style={{ right: '0' }} />
                  </div>
                  <div className="landing-benchmark-bar-fill striped" style={{ left: '81.25%', width: '18.75%', backgroundPosition: 'right' }} />
                </div>
              </div>
            </div>

            <p className="landing-benchmark-footer-text">454 runs, every one passed.</p>
          </div>

          {/* Card 2 */}
          <div className="landing-benchmark-card">
            <div className="landing-benchmark-header">
              <div className="landing-benchmark-title-group">
                <h4>Quartermaster, Codex</h4>
                <p>TOOL CALLS PER TASK, SAME FIXTURE</p>
                <div className="landing-benchmark-dots">
                  <span className="active" />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="landing-benchmark-stat">-40%</div>
            </div>

            <div className="landing-benchmark-bars">
              <div className="landing-benchmark-bar-row">
                <div className="landing-benchmark-bar-labels">
                  <span className="label">Without memory</span>
                  <span className="value">5</span>
                </div>
                <div className="landing-benchmark-bar-track">
                  <div className="landing-benchmark-bar-fill" style={{ width: '100%' }}>
                    <div className="landing-benchmark-bar-cursor" style={{ right: '0' }} />
                  </div>
                </div>
              </div>

              <div className="landing-benchmark-bar-row">
                <div className="landing-benchmark-bar-labels">
                  <span className="label highlight">With Memorable</span>
                  <span className="value highlight">3</span>
                </div>
                <div className="landing-benchmark-bar-track">
                  <div className="landing-benchmark-bar-fill highlight" style={{ width: '60%' }}>
                    <div className="landing-benchmark-bar-cursor" style={{ right: '0' }} />
                  </div>
                  <div className="landing-benchmark-bar-fill striped" style={{ left: '60%', width: '40%' }} />
                </div>
              </div>
            </div>

            <p className="landing-benchmark-footer-text">Three replications, same result each time.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseStudiesSection() {
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

function TestimonialsSection() {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.from('.landing-testimonial-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => context.revert();
  }, []);

  return (
    <section ref={containerRef} className="landing-testimonials-section">
      <h2 className="landing-testimonials-title">What People Say.</h2>

      <div className="landing-testimonials-grid">
        {/* Testimonial 1 */}
        <div className="landing-testimonial-card">
          <div className="landing-testimonial-header">
            <div className="landing-testimonial-profile">
              <img src="https://ui-avatars.com/api/?name=Kulveer&background=0D8ABC&color=fff&size=88" alt="Kulveer" className="landing-testimonial-avatar" />
              <div className="landing-testimonial-meta">
                <h4>Kulveer <span>@kul</span></h4>
                <p>Visiting Partner, Y Combinator</p>
              </div>
            </div>
            <div className="landing-testimonial-icon">
              <X className="w-4 h-4" />
            </div>
          </div>
          <p className="landing-testimonial-content">
            Models are commodities. What your agents learn doing your work is the asset. Memorable lets you own it. Excited to be working with @advaiytsane and @nikhilk8754 on @memorablesh. Congrats on the launch!
          </p>
          <div className="landing-testimonial-date">Sep 17</div>
        </div>

        {/* Testimonial 2 */}
        <div className="landing-testimonial-card">
          <div className="landing-testimonial-header">
            <div className="landing-testimonial-profile">
              <img src="https://ui-avatars.com/api/?name=Brycent&background=ff5722&color=fff&size=88" alt="Brycent" className="landing-testimonial-avatar" />
              <div className="landing-testimonial-meta">
                <h4>Brycent <span>@brycent</span></h4>
                <p>Creator and Investor</p>
              </div>
            </div>
            <div className="landing-testimonial-icon">
              <X className="w-4 h-4" />
            </div>
          </div>
          <p className="landing-testimonial-content">
            Bro is in YC headstart, he will be at 10m ARR before starting the batch
          </p>
          <div className="landing-testimonial-date">Sep 17</div>
        </div>

        {/* Testimonial 3 */}
        <div className="landing-testimonial-card">
          <div className="landing-testimonial-header">
            <div className="landing-testimonial-profile">
              <div className="landing-testimonial-avatar-icon">OH</div>
              <div className="landing-testimonial-meta">
                <h4>OpenHome</h4>
                <p>Working with Memorable on Faster, Cheaper Agents</p>
              </div>
            </div>
            <div className="landing-testimonial-icon">
              <X className="w-4 h-4" />
            </div>
          </div>
          <p className="landing-testimonial-content">
            Most memory tools store what happened. Memorable stores how things get done. It watches an agent's own successful runs and turns them into reusable workflows, so the path an agent worked out once becomes a path it can follow.
          </p>
          <div className="landing-testimonial-date">openhome.com</div>
        </div>
      </div>
    </section>
  );
}
