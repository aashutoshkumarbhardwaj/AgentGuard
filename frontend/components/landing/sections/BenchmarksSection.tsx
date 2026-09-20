'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
}

export function BenchmarksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Floating & Interactive Particle Animation on Hover
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Particles array
    const particles: Particle[] = [];
    const colors = [
      'rgba(125, 211, 252, ', // sky-300
      'rgba(56, 189, 248, ',  // sky-400
      'rgba(14, 165, 233, ',  // sky-500
      'rgba(186, 230, 253, ', // sky-200
    ];

    // Spawn ambient floating particles
    const ambientCount = 35;
    for (let i = 0; i < ambientCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.15,
        radius: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.5 + 0.2,
        maxAlpha: Math.random() * 0.5 + 0.4,
        decay: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Spawn particle burst on mouse move
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });

      // Add interactive spark particles at cursor
      const burstCount = 3;
      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.8 + 0.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          radius: Math.random() * 2.5 + 1.2,
          alpha: 0.9,
          maxAlpha: 0.9,
          decay: Math.random() * 0.015 + 0.012,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      // Limit particle count
      if (particles.length > 120) {
        particles.splice(ambientCount, particles.length - 120);
      }
    };

    container.addEventListener('mousemove', handlePointerMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Interactive or ambient lifecycle
        if (p.decay > 0) {
          p.alpha -= p.decay;
          if (p.alpha <= 0) {
            particles.splice(i, 1);
            i--;
            continue;
          }
        } else {
          // Ambient bounce / wrap
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.save();
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="landing-benchmarks-section relative w-full py-28 md:py-36 flex flex-col items-center bg-black overflow-hidden select-none">
      <h2 className="landing-benchmarks-title text-center text-white text-[42px] md:text-[56px] font-normal tracking-tight mb-14">
        Benchmarks
      </h2>

      <div
        ref={containerRef}
        className="landing-benchmarks-container group relative w-full max-w-[1200px] h-[520px] rounded-2xl overflow-hidden border border-white/[0.12] bg-[#020b17]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Blue CanvasRevealEffect - ALWAYS VISIBLE without hover */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <CanvasRevealEffect
            animationSpeed={isHovered ? 4.8 : 2.5}
            containerClassName="bg-[#020b17] absolute inset-0 w-full h-full"
            colors={[
              [125, 211, 252],
              [56, 189, 248],
              [14, 165, 233],
            ]}
            dotSize={2.8}
            showGradient={false}
          />
        </div>

        {/* Ambient Dark Gradient Vignette for depth */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(2, 11, 23, 0.4) 0%, rgba(0, 0, 0, 0.85) 100%)',
          }}
        />

        {/* Dynamic Interactive Cursor Glow on Hover */}
        <div
          className={`absolute inset-0 pointer-events-none z-[2] transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.22), transparent 75%)`,
          }}
        />

        {/* Interactive Particle Animation Canvas */}
        <canvas
          ref={particleCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
        />

        {/* Benchmark Cards Overlay */}
        <div className="landing-benchmarks-cards relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 p-6 md:p-12 pointer-events-none">
          
          {/* Card 1: Claude 3.5, MCP Gateway */}
          <div className="landing-benchmark-card pointer-events-auto group/card w-full max-w-[440px] p-7 rounded-2xl bg-[#090d16]/85 backdrop-blur-xl border border-white/[0.1] hover:border-sky-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)] flex flex-col justify-between min-h-[300px]">
            <div className="landing-benchmark-header flex justify-between items-start">
              <div className="landing-benchmark-title-group">
                <h4 className="text-[17px] font-medium text-white tracking-tight">Claude 3.5, MCP Gateway</h4>
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-1">
                  UNGUARDED TOOL ACTIONS, 16-TOOL FIXTURE
                </p>
                <div className="landing-benchmark-dots flex gap-1 mt-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white active" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
              </div>
              <div className="landing-benchmark-stat text-[28px] font-normal tracking-tight text-white">
                -19%
              </div>
            </div>

            <div className="landing-benchmark-bars space-y-4 my-6">
              <div className="landing-benchmark-bar-row">
                <div className="landing-benchmark-bar-labels flex justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                  <span className="label">Without AgentGuard</span>
                  <span className="value">16</span>
                </div>
                <div className="landing-benchmark-bar-track relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="landing-benchmark-bar-fill h-full bg-zinc-400 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="landing-benchmark-bar-row">
                <div className="landing-benchmark-bar-labels flex justify-between text-[11px] font-mono text-white mb-1.5">
                  <span className="label font-medium text-white">With AgentGuard</span>
                  <span className="value font-medium text-white">13</span>
                </div>
                <div className="landing-benchmark-bar-track relative w-full h-1 bg-white/10 rounded-full overflow-hidden flex">
                  <div className="landing-benchmark-bar-fill highlight h-full bg-white rounded-full" style={{ width: '81.25%' }} />
                  <div
                    className="landing-benchmark-bar-fill striped h-full opacity-40"
                    style={{
                      width: '18.75%',
                      backgroundImage: 'repeating-linear-gradient(45deg, #fff, #fff 1px, transparent 1px, transparent 4px)',
                    }}
                  />
                </div>
              </div>
            </div>

            <p className="landing-benchmark-footer-text text-[11px] font-mono text-zinc-500">
              454 security evaluation runs, zero policy bypasses.
            </p>
          </div>

          {/* Card 2: DevOps Agent, Codex */}
          <div className="landing-benchmark-card pointer-events-auto group/card w-full max-w-[440px] p-7 rounded-2xl bg-[#090d16]/85 backdrop-blur-xl border border-white/[0.1] hover:border-sky-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)] flex flex-col justify-between min-h-[300px]">
            <div className="landing-benchmark-header flex justify-between items-start">
              <div className="landing-benchmark-title-group">
                <h4 className="text-[17px] font-medium text-white tracking-tight">DevOps Agent, Codex</h4>
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-1">
                  UNVERIFIED ACTIONS PER TASK, SAME FIXTURE
                </p>
                <div className="landing-benchmark-dots flex gap-1 mt-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white active" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
              </div>
              <div className="landing-benchmark-stat text-[28px] font-normal tracking-tight text-white">
                -40%
              </div>
            </div>

            <div className="landing-benchmark-bars space-y-4 my-6">
              <div className="landing-benchmark-bar-row">
                <div className="landing-benchmark-bar-labels flex justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                  <span className="label">Without AgentGuard</span>
                  <span className="value">5</span>
                </div>
                <div className="landing-benchmark-bar-track relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="landing-benchmark-bar-fill h-full bg-zinc-400 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="landing-benchmark-bar-row">
                <div className="landing-benchmark-bar-labels flex justify-between text-[11px] font-mono text-white mb-1.5">
                  <span className="label font-medium text-white">With AgentGuard</span>
                  <span className="value font-medium text-white">3</span>
                </div>
                <div className="landing-benchmark-bar-track relative w-full h-1 bg-white/10 rounded-full overflow-hidden flex">
                  <div className="landing-benchmark-bar-fill highlight h-full bg-white rounded-full" style={{ width: '60%' }} />
                  <div
                    className="landing-benchmark-bar-fill striped h-full opacity-40"
                    style={{
                      width: '40%',
                      backgroundImage: 'repeating-linear-gradient(45deg, #fff, #fff 1px, transparent 1px, transparent 4px)',
                    }}
                  />
                </div>
              </div>
            </div>

            <p className="landing-benchmark-footer-text text-[11px] font-mono text-zinc-500">
              Deterministic Cedar authorization, verified across every run.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
