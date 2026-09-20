'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Maximize2, 
  Minimize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShieldCheck,
  Cpu,
  Lock,
  Zap
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function LayerSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  const [explodedPercent, setExplodedPercent] = useState<number>(0);
  const [manualMode, setManualMode] = useState<'scroll' | 'compact' | 'exploded'>('scroll');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // GSAP ScrollTrigger Master Scrub Timeline
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const scanLine = scanLineRef.current;
      const video = videoRef.current;
      if (!section || !stage) return;

      // Master pinned scrub timeline: Disassembly physics on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=1800',
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = Math.round(self.progress * 100);
            setExplodedPercent(p);
            if (progressTextRef.current) {
              progressTextRef.current.innerText = `${p}%`;
            }
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${p}%`;
            }

            // Sync video scrubbing directly with scroll progress
            if (video && video.duration && !isNaN(video.duration)) {
              video.currentTime = self.progress * video.duration;
            }
          },
        },
      });

      // Step 1: Laser Scanner sweeps across hardware
      if (scanLine) {
        tl.fromTo(
          scanLine,
          { top: '0%', opacity: 0 },
          { top: '100%', opacity: 1, duration: 0.35, ease: 'power1.inOut' },
          0
        );
      }

      // Step 2: 3D stage subtle lift & perspective enhancement
      tl.to(
        stage,
        {
          scale: 1.02,
          rotateY: 3,
          rotateX: -2,
          duration: 0.6,
          ease: 'power2.out',
        },
        0.2
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 3D Parallax & Gyro Tilt on Mouse Movement
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = stage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      gsap.to(stage, {
        rotateX: -y * 4,
        rotateY: x * 6,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1200,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(stage, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Time update handler when video plays naturally
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;
    const progress = video.currentTime / video.duration;
    const p = Math.min(100, Math.max(0, Math.round(progress * 100)));
    setExplodedPercent(p);
    if (progressTextRef.current) progressTextRef.current.innerText = `${p}%`;
    if (progressBarRef.current) progressBarRef.current.style.width = `${p}%`;
  };

  // Manual Toggle Handler
  const handleToggleMode = (mode: 'compact' | 'exploded') => {
    setManualMode(mode);
    const video = videoRef.current;

    if (mode === 'compact') {
      if (video) {
        video.currentTime = 0.4;
        video.play().catch(() => {});
        setIsPlaying(true);
      }
      setExplodedPercent(0);
      if (progressTextRef.current) progressTextRef.current.innerText = '0%';
      if (progressBarRef.current) progressBarRef.current.style.width = '0%';
    } else {
      if (video) {
        video.currentTime = 5.2; // apex of 3D exploded architecture
        video.play().catch(() => {});
        setIsPlaying(true);
      }
      setExplodedPercent(100);
      if (progressTextRef.current) progressTextRef.current.innerText = '100%';
      if (progressBarRef.current) progressBarRef.current.style.width = '100%';
    }
  };

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative w-full bg-black min-h-screen text-white overflow-hidden select-none border-t border-white/[0.08] flex items-center"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[700px] h-[500px] bg-sky-950/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[350px] bg-cyan-950/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Dithered Matrix Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.5) 0.8px, transparent 0.8px)',
          backgroundSize: '3.5px 3.5px',
        }}
      />

      <div ref={containerRef} className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-16 lg:py-24 w-full">
        
        {/* Split Two-Column Layout: Heading & Controls (Left) | 3D Video (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center w-full">
          
          {/* Left Column: Heading, Subtitle & Interactive Disassembly Controls */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            {/* Kicker Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400 font-medium">
                HOW IT WORKS • ARCHITECTURE DECOMPOSITION
              </span>
            </div>

            {/* Section Heading (Larger & with Memorable Font) */}
            <h2
              className="text-[42px] sm:text-[54px] lg:text-[62px] xl:text-[70px] font-normal tracking-[-0.035em] text-white leading-[1.05] mb-6"
              style={{ fontFamily: 'Memorable, sans-serif' }}
            >
              Security That Follows<br /> The Shape Of The Work.
            </h2>

            {/* Supporting Description */}
            <p className="text-[15px] sm:text-[17px] text-white/60 leading-relaxed font-normal max-w-[500px] mb-8">
              Real-time microarchitectural isolation and deterministic policy enforcement for autonomous AI agents. Inspect the multi-layer hardware enclave deconstruct inline.
            </p>

            {/* Controls: Mode Switcher & Live Disassembly Gauge */}
            <div className="flex flex-col gap-4 pt-4 border-t border-white/[0.08] max-w-[440px]">
              
              {/* View Toggle Buttons */}
              <div className="flex items-center bg-white/[0.05] border border-white/[0.12] rounded-xl p-1 gap-1.5 backdrop-blur-md w-fit">
                <button
                  type="button"
                  onClick={() => handleToggleMode('compact')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[11.5px] transition-all cursor-pointer ${
                    explodedPercent < 45
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>COMPACT</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleMode('exploded')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[11.5px] transition-all cursor-pointer ${
                    explodedPercent >= 45
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>EXPLODED VIEW</span>
                </button>
              </div>

              {/* Gauge Indicator */}
              <div className="flex items-center gap-3 font-mono text-[11px] text-white/50">
                <span className="tracking-wider text-white/70">DISASSEMBLY:</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-gradient-to-r from-zinc-200 via-sky-300 to-white rounded-full transition-all duration-150"
                    style={{ width: `${explodedPercent}%` }}
                  />
                </div>
                <span ref={progressTextRef} className="text-white font-medium min-w-[36px] text-right">
                  {explodedPercent}%
                </span>
              </div>

              {/* Hardware Telemetry Spec Chips */}
              <div className="grid grid-cols-2 gap-2.5 pt-3">
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-white/40 mb-0.5">ENCLAVE STATUS</div>
                  <div className="font-mono text-[11px] text-sky-300 font-medium">TAMPER_SECURE</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-white/40 mb-0.5">POLICY ENGINE</div>
                  <div className="font-mono text-[11px] text-zinc-200 font-medium">142 GATES ACTIVE</div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: 3D Video Player Canvas */}
          <div className="lg:col-span-7 flex items-center justify-center w-full">
            <div
              ref={stageRef}
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/[0.14] bg-[#05060a] shadow-[0_30px_90px_rgba(0,0,0,0.95)] will-change-transform z-10 group/stage"
            >
              {/* Grid overlay lines on the canvas */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 z-[3]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Laser scanning line sweeping down on disassembly initiation */}
              <div
                ref={scanLineRef}
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] pointer-events-none z-[4] opacity-0"
              />

              {/* 3D Hardware Explainer Video (Cleanly Cropped & Loop-Ready) */}
              <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden z-[1]">
                <video
                  ref={videoRef}
                  src="/videos/product-explainer.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full h-full object-cover select-none"
                />
              </div>

              {/* Floating Video Controls (Play/Pause, Sound) */}
              <div className="absolute top-3.5 right-4 z-[7] flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => {
                    const video = videoRef.current;
                    if (!video) return;
                    if (isPlaying) {
                      video.pause();
                      setIsPlaying(false);
                    } else {
                      video.play().catch(() => {});
                      setIsPlaying(true);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer backdrop-blur-md"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const video = videoRef.current;
                    if (!video) return;
                    video.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer backdrop-blur-md"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Corner Tech Watermarks */}
              <div className="absolute top-3.5 left-4 font-mono text-[9px] text-white/40 tracking-widest pointer-events-none z-[6]">
                AGENTGUARD // ENCLAVE v2.4
              </div>
              <div className="absolute bottom-3.5 right-4 font-mono text-[9px] text-white/40 tracking-widest pointer-events-none z-[6]">
                SECURE ELEMENT 0x8849
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
