'use client';

import { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';

interface SpringPoint {
  x: number;
  y: number;
  restX: number;
  restY: number;
  vx: number;
  vy: number;
}

interface WireSegment {
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  mid: SpringPoint;
  type: 'ray' | 'frame';
}

export function PreFooterTalk() {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cardHovered, setCardHovered] = useState(false);

  // 3D Card tilt on hover
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const handleMove = (event: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect || !cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Calculate relative mouse position (-1 to 1)
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

        // Tilt card smoothly
        gsap.to(cardRef.current, {
          rotateX: -y * 8,
          rotateY: x * 12,
          duration: 0.6,
          ease: 'power3.out',
          transformPerspective: 1200,
        });
      };

      const handleLeave = () => {
        gsap.to(cardRef.current, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: 'power3.out',
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

  // Spider-like 3D Wireframe Perspective Tunnel with Stretchable Elastic Lines
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const card = cardRef.current;
    if (!canvas || !container || !card) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    let targetMouseX = -9999;
    let targetMouseY = -9999;
    let isHovering = false;

    let segments: WireSegment[] = [];

    const buildGrid = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cardRect = card.getBoundingClientRect();
      const cLeft = cardRect.left - rect.left;
      const cTop = cardRect.top - rect.top;
      const cRight = cLeft + cardRect.width;
      const cBottom = cTop + cardRect.height;

      const cx = (cLeft + cRight) / 2;
      const cy = (cTop + cBottom) / 2;

      segments = [];

      // 4 Card Corners
      const CTL = { x: cLeft, y: cTop };
      const CTR = { x: cRight, y: cTop };
      const CBR = { x: cRight, y: cBottom };
      const CBL = { x: cLeft, y: cBottom };

      // 4 Screen Corners
      const STL = { x: 0, y: 0 };
      const STR = { x: width, y: 0 };
      const SBR = { x: width, y: height };
      const SBL = { x: 0, y: height };

      // Helper to add stretchable line segment
      const addSeg = (p1: { x: number; y: number }, p2: { x: number; y: number }, type: 'ray' | 'frame') => {
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        segments.push({
          p1,
          p2,
          mid: {
            x: mx,
            y: my,
            restX: mx,
            restY: my,
            vx: 0,
            vy: 0,
          },
          type,
        });
      };

      // 1. Concentric Perspective Rectangles
      // Interpolate along the 4 corner diagonals between Card Corners and Screen Corners
      // Spaced with perspective (matching reference screenshot)
      const tValues = [0.22, 0.46, 0.72, 0.98];
      const frameCorners = tValues.map((t) => ({
        tl: { x: (1 - t) * CTL.x + t * STL.x, y: (1 - t) * CTL.y + t * STL.y },
        tr: { x: (1 - t) * CTR.x + t * STR.x, y: (1 - t) * CTR.y + t * STR.y },
        br: { x: (1 - t) * CBR.x + t * SBR.x, y: (1 - t) * CBR.y + t * SBR.y },
        bl: { x: (1 - t) * CBL.x + t * SBL.x, y: (1 - t) * CBL.y + t * SBL.y },
      }));

      // Add the segments of each concentric frame (subdivided at crosshair intersections)
      frameCorners.forEach((fc) => {
        // Top edge: divided at center x
        const midTop = { x: cx, y: fc.tl.y };
        addSeg(fc.tl, midTop, 'frame');
        addSeg(midTop, fc.tr, 'frame');

        // Right edge: divided at center y
        const midRight = { x: fc.tr.x, y: cy };
        addSeg(fc.tr, midRight, 'frame');
        addSeg(midRight, fc.br, 'frame');

        // Bottom edge: divided at center x
        const midBottom = { x: cx, y: fc.bl.y };
        addSeg(fc.bl, midBottom, 'frame');
        addSeg(midBottom, fc.br, 'frame');

        // Left edge: divided at center y
        const midLeft = { x: fc.tl.x, y: cy };
        addSeg(fc.tl, midLeft, 'frame');
        addSeg(midLeft, fc.bl, 'frame');
      });

      // 2. Radiating Perspective Rays ("Spider" web lines)
      // 4 Corner diagonal rays (subdivided between frames so each section stretches elastically)
      const prevCorners = [{ tl: CTL, tr: CTR, br: CBR, bl: CBL }, ...frameCorners];
      for (let i = 0; i < prevCorners.length - 1; i++) {
        const c1 = prevCorners[i];
        const c2 = prevCorners[i + 1];
        addSeg(c1.tl, c2.tl, 'ray');
        addSeg(c1.tr, c2.tr, 'ray');
        addSeg(c1.br, c2.br, 'ray');
        addSeg(c1.bl, c2.bl, 'ray');
      }

      // Connect last frame to screen corners
      const lastFc = frameCorners[frameCorners.length - 1];
      addSeg(lastFc.tl, STL, 'ray');
      addSeg(lastFc.tr, STR, 'ray');
      addSeg(lastFc.br, SBR, 'ray');
      addSeg(lastFc.bl, SBL, 'ray');

      // 3. Center Crosshair Rays (Top ceiling, Bottom floor, Left wall, Right wall)
      // Top Center Ray: from top-center of card straight up to screen top
      let prevY = cTop;
      frameCorners.forEach((fc) => {
        addSeg({ x: cx, y: prevY }, { x: cx, y: fc.tl.y }, 'ray');
        prevY = fc.tl.y;
      });
      addSeg({ x: cx, y: prevY }, { x: cx, y: 0 }, 'ray');

      // Bottom Center Ray: from bottom-center of card straight down to screen bottom
      prevY = cBottom;
      frameCorners.forEach((fc) => {
        addSeg({ x: cx, y: prevY }, { x: cx, y: fc.bl.y }, 'ray');
        prevY = fc.bl.y;
      });
      addSeg({ x: cx, y: prevY }, { x: cx, y: height }, 'ray');

      // Left Center Ray: from left-center of card straight left to screen left
      let prevX = cLeft;
      frameCorners.forEach((fc) => {
        addSeg({ x: prevX, y: cy }, { x: fc.tl.x, y: cy }, 'ray');
        prevX = fc.tl.x;
      });
      addSeg({ x: prevX, y: cy }, { x: 0, y: cy }, 'ray');

      // Right Center Ray: from right-center of card straight right to screen right
      prevX = cRight;
      frameCorners.forEach((fc) => {
        addSeg({ x: prevX, y: cy }, { x: fc.tr.x, y: cy }, 'ray');
        prevX = fc.tr.x;
      });
      addSeg({ x: prevX, y: cy }, { x: width, y: cy }, 'ray');
    };

    buildGrid();
    window.addEventListener('resize', buildGrid);

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
      isHovering = true;
    };

    const handlePointerLeave = () => {
      targetMouseX = -9999;
      targetMouseY = -9999;
      isHovering = false;
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mouseleave', handlePointerLeave);

    // Spring physics constants for stretchable spider lines
    const STRETCH_RADIUS = 150; // Influence distance around cursor
    const MAX_STRETCH = 55; // Max stretch displacement in px
    const SPRING_K = 0.085; // Spring tension
    const DAMPING = 0.82; // Friction damping

    let time = 0;

    const render = () => {
      time += 0.02;

      // Smooth mouse follow
      if (isHovering) {
        mouseX += (targetMouseX - mouseX) * 0.35;
        mouseY += (targetMouseY - mouseY) * 0.35;
      } else {
        mouseX = -9999;
        mouseY = -9999;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw and update each elastic wire segment
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const mid = seg.mid;

        // Calculate distance from cursor to rest midpoint
        const dx = mouseX - mid.restX;
        const dy = mouseY - mid.restY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = mid.restX;
        let targetY = mid.restY;

        // Subtle ambient breathing motion
        const ambientWave = Math.sin(time + (mid.restX * 0.004 + mid.restY * 0.004)) * 1.2;
        targetX += ambientWave * 0.4;
        targetY += ambientWave * 0.4;

        // Interactive elastic stretch towards cursor
        if (dist < STRETCH_RADIUS) {
          const power = Math.pow(1 - dist / STRETCH_RADIUS, 1.5);
          const stretch = power * MAX_STRETCH;
          const angle = Math.atan2(dy, dx);
          targetX += Math.cos(angle) * stretch;
          targetY += Math.sin(angle) * stretch;
        }

        // Spring physics step
        const ax = (targetX - mid.x) * SPRING_K;
        const ay = (targetY - mid.y) * SPRING_K;
        mid.vx = (mid.vx + ax) * DAMPING;
        mid.vy = (mid.vy + ay) * DAMPING;
        mid.x += mid.vx;
        mid.y += mid.vy;

        // Stretch intensity for dynamic illumination
        const isStretched = dist < STRETCH_RADIUS;
        const stretchIntensity = isStretched ? Math.pow(1 - dist / STRETCH_RADIUS, 1.2) : 0;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(seg.p1.x, seg.p1.y);

        // Draw curved stretchable line with quadratic bezier
        // Control point derived from stretched midpoint
        const cxPoint = 2 * mid.x - 0.5 * (seg.p1.x + seg.p2.x);
        const cyPoint = 2 * mid.y - 0.5 * (seg.p1.y + seg.p2.y);
        ctx.quadraticCurveTo(cxPoint, cyPoint, seg.p2.x, seg.p2.y);

        // Dynamic stroke styling: glows when stretched
        if (stretchIntensity > 0.04) {
          ctx.strokeStyle = `rgba(${170 + Math.floor(stretchIntensity * 85)}, ${
            190 + Math.floor(stretchIntensity * 65)
          }, 255, ${0.2 + stretchIntensity * 0.5})`;
          ctx.lineWidth = 1 + stretchIntensity * 1.4;
          ctx.shadowColor = 'rgba(147, 197, 253, 0.7)';
          ctx.shadowBlur = 8 * stretchIntensity;
        } else {
          // Clean, crisp wireframe lines matching screenshot
          ctx.strokeStyle = seg.type === 'ray' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 1;
        }

        ctx.stroke();

        // Subtle node joints at intersection midpoints
        if (isStretched && stretchIntensity > 0.3) {
          ctx.fillStyle = 'rgba(191, 219, 254, 0.8)';
          ctx.beginPath();
          ctx.arc(mid.x, mid.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', buildGrid);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="landing-pre-footer relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-black py-16 px-4 md:px-8 select-none"
    >
      {/* Interactive 3D Stretchable Spider Wireframe Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 3D Perspective Card Wrapper */}
      <div
        ref={cardRef}
        className="landing-talk-card-wrapper relative z-10 w-full max-w-[820px] h-[370px] sm:h-[400px] md:h-[420px]"
      >
        <div
          className="landing-talk-card group relative w-full h-full rounded-xl border border-white/[0.2] overflow-hidden flex flex-col items-center justify-center bg-[#07080d] shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
        >
          {/* CanvasRevealEffect: Pink/Violet/Purple from the 3 demo colors - ALWAYS VISIBLE */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <CanvasRevealEffect
              animationSpeed={cardHovered ? 4.8 : 2.6}
              containerClassName="bg-[#07080d] absolute inset-0 w-full h-full"
              colors={[
                [236, 72, 153], // Hot Pink
                [232, 121, 249], // Glowing Violet
                [168, 85, 247], // Deep Purple
              ]}
              dotSize={2.4}
              showGradient={false}
            />
          </div>

          {/* Deep Violet & Amber Nebula Gradients blended over shader */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-[1] mix-blend-screen opacity-70">
            {/* Top-left deep violet/purple nebula */}
            <div
              className="absolute -top-12 -left-12 w-[460px] h-[460px] rounded-full blur-[65px] opacity-90 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.75) 0%, rgba(99, 102, 241, 0.45) 45%, transparent 70%)',
              }}
            />

            {/* Bottom-right glowing amber/copper nebula */}
            <div
              className="absolute -bottom-12 -right-12 w-[460px] h-[460px] rounded-full blur-[65px] opacity-90 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.65) 0%, rgba(217, 119, 6, 0.45) 45%, transparent 70%)',
              }}
            />

            {/* Center deep cosmic dark blue hue */}
            <div
              className="absolute inset-0 opacity-50 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 65% 35%, rgba(56, 189, 248, 0.3) 0%, transparent 60%)',
              }}
            />
          </div>

          {/* Authentic Fine Dithered Dot Matrix Texture matching image */}
          <div
            className="absolute inset-0 pointer-events-none z-[2] opacity-35 mix-blend-overlay"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.5) 0.8px, transparent 0.8px)',
              backgroundSize: '3.2px 3.2px',
            }}
          />

          {/* Micro-noise overlay */}
          <div className="landing-talk-noise pointer-events-none opacity-20 z-[2]" />

          {/* Card Border Hover Glow */}
          <div className="absolute inset-0 rounded-xl border border-white/0 group-hover:border-white/35 transition-colors duration-500 pointer-events-none z-[3]" />

          {/* Centered Content */}
          <div className="relative z-20 text-center flex flex-col items-center justify-center px-6">
            {/* Pill / Kicker */}
            <span className="font-mono text-[11px] sm:text-[12px] tracking-[0.25em] text-white/70 uppercase mb-4 sm:mb-5 select-none">
              ( LET&apos;S TALK )
            </span>

            {/* Main Title */}
            <h2
              className="text-[42px] sm:text-[52px] md:text-[62px] lg:text-[66px] font-normal tracking-[-0.03em] text-white leading-[1.1] mb-7 sm:mb-8 select-none"
              style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              Let&apos;s Build Something<br />Memorable
            </h2>

            {/* Call to Action Button */}
            <button
              type="button"
              className="px-7 py-2.5 rounded-md bg-white/[0.07] hover:bg-white/[0.14] border border-white/20 hover:border-white/40 text-white font-mono text-[12.5px] tracking-wide transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95 cursor-pointer"
            >
              Book a Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
