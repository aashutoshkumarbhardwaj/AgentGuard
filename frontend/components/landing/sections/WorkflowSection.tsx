'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  Check, 
  RotateCcw,
  Zap,
  Activity,
  Terminal,
  Cpu,
  Layers
} from 'lucide-react';
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';

gsap.registerPlugin(ScrollTrigger);

// Run data for Card 3: Savings per run
const RUN_DATA = [
  { run: 'R1', savings: 20, time: '142ms', tokens: '1.2k', pct: '25%' },
  { run: 'R2', savings: 28, time: '118ms', tokens: '1.8k', pct: '38%' },
  { run: 'R3', savings: 12, time: '155ms', tokens: '0.9k', pct: '18%' },
  { run: 'R4', savings: 35, time: '98ms', tokens: '2.4k', pct: '48%' },
  { run: 'R5', savings: 22, time: '124ms', tokens: '1.5k', pct: '30%' },
  { run: 'R6', savings: 40, time: '82ms', tokens: '2.9k', pct: '56%' },
  { run: 'R7', savings: 15, time: '138ms', tokens: '1.1k', pct: '22%' },
  { run: 'R8', savings: 42, time: '74ms', tokens: '3.2k', pct: '62%' },
  { run: 'R9', savings: 46, time: '65ms', tokens: '3.6k', pct: '68%' },
  { run: 'R10', savings: 60, time: '52ms', tokens: '4.4k', pct: '82%' },
  { run: 'R11', savings: 54, time: '58ms', tokens: '3.8k', pct: '74%' },
  { run: 'R12', savings: 70, time: '38ms', tokens: '5.2k', pct: '94%' },
];

// Reusable Mouse Spotlight overlay
function CardSpotlight({ pos }: { pos: { x: number; y: number } }) {
  return (
    <div
      className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
      style={{
        background: `radial-gradient(550px circle at ${pos.x}px ${pos.y}px, rgba(255, 255, 255, 0.08), transparent 60%)`,
      }}
    />
  );
}

export function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Spotlight positions for each of the 5 cards
  const [spotlight1, setSpotlight1] = useState({ x: 200, y: 200 });
  const [spotlight2, setSpotlight2] = useState({ x: 200, y: 200 });
  const [spotlight3, setSpotlight3] = useState({ x: 200, y: 200 });
  const [spotlight4, setSpotlight4] = useState({ x: 400, y: 200 });
  const [spotlight5, setSpotlight5] = useState({ x: 200, y: 200 });

  // State for Card 1: Agent Registry
  const [selectedAgent, setSelectedAgent] = useState<'claude' | 'codex' | 'opencode' | 'gbrain'>('claude');

  // State for Card 2: Chained Plans Execution Step
  const [planStep, setPlanStep] = useState(0);

  // State for Card 3: Savings chart active hovered run
  const [activeRunIndex, setActiveRunIndex] = useState<number>(11); // default to R12 peak

  // State for Card 4: Scrubbed Identifiers Animation
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubCycle, setScrubCycle] = useState(0);

  // State for Card 5: Terminal typing simulation
  const [terminalText, setTerminalText] = useState('');
  const [terminalScore, setTerminalScore] = useState(0.86);

  // Auto-cycle Chained Plans execution steps
  useEffect(() => {
    const timer = setInterval(() => {
      setPlanStep((prev) => (prev + 1) % 4);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  // Auto-cycle Scrubbing sweep every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsScrubbing(true);
      setTimeout(() => {
        setIsScrubbing(false);
        setScrubCycle((c) => c + 1);
      }, 1200);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Terminal Typing simulator for Card 5
  useEffect(() => {
    const queries = [
      "process a customer refund",
      "verify webhook signature & update order",
      "fetch user context and evaluate tools"
    ];
    let queryIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      const currentQuery = queries[queryIdx];
      if (!isDeleting) {
        setTerminalText(currentQuery.substring(0, charIdx + 1));
        charIdx++;
        if (charIdx === currentQuery.length) {
          isDeleting = true;
          setTerminalScore(Number((0.88 + Math.random() * 0.1).toFixed(2)));
          timeoutId = setTimeout(tick, 2200);
          return;
        }
        timeoutId = setTimeout(tick, 55);
      } else {
        setTerminalText(currentQuery.substring(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          queryIdx = (queryIdx + 1) % queries.length;
          timeoutId = setTimeout(tick, 400);
          return;
        }
        timeoutId = setTimeout(tick, 25);
      }
    };

    timeoutId = setTimeout(tick, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Liquid ripple & matrix canvas background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = sectionRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    interface RippleWave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      speed: number;
      color: string;
    }

    const ripples: RippleWave[] = [];

    const addRipple = (x: number, y: number, isAmbient = false) => {
      const colors = [
        'rgba(255, 255, 255, ', // pure white
        'rgba(212, 212, 216, ', // silver zinc
        'rgba(161, 161, 170, ', // neutral zinc
        'rgba(56, 189, 248, '   // subtle cyan
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      ripples.push({
        x,
        y,
        radius: isAmbient ? 30 : 15,
        maxRadius: isAmbient ? 360 : 260,
        alpha: isAmbient ? 0.35 : 0.55,
        speed: isAmbient ? 1.6 : 2.2,
        color
      });
      if (ripples.length > 14) ripples.shift();
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (Math.random() > 0.65) {
        addRipple(x, y, false);
      }
    };
    container.addEventListener('pointermove', handlePointerMove);

    const ambientTimer = setInterval(() => {
      const rx = width * (0.2 + Math.random() * 0.6);
      const ry = height * (0.2 + Math.random() * 0.6);
      addRipple(rx, ry, true);
    }, 2800);

    // Matrix characters pool for glyph rain
    const glyphs = '01{}[]<>/#@$%&*+=~:;ABCDEFXYZ0123456789';
    const glyphColumns: { x: number; y: number; speed: number; char: string; alpha: number }[] = [];
    const colCount = Math.floor(width / 36);
    for (let i = 0; i < colCount; i++) {
      glyphColumns.push({
        x: i * 36 + 18,
        y: Math.random() * height,
        speed: 0.4 + Math.random() * 0.8,
        char: glyphs[Math.floor(Math.random() * glyphs.length)],
        alpha: 0.12 + Math.random() * 0.22
      });
    }

    let frameCount = 0;
    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw matrix glyph background stream
      ctx.font = '11px monospace';
      for (const col of glyphColumns) {
        col.y += col.speed;
        if (col.y > height) {
          col.y = -20;
          col.char = glyphs[Math.floor(Math.random() * glyphs.length)];
        }
        if (frameCount % 45 === 0 && Math.random() > 0.7) {
          col.char = glyphs[Math.floor(Math.random() * glyphs.length)];
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${col.alpha * 0.35})`;
        ctx.fillText(col.char, col.x, col.y);
      }

      // 2. Draw liquid ripple waves
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha -= 0.005;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${r.color}${r.alpha})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = `${r.color}0.5)`;
        ctx.shadowBlur = 16;
        ctx.stroke();

        if (r.radius > 30) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius - 20, 0, Math.PI * 2);
          ctx.strokeStyle = `${r.color}${r.alpha * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', handlePointerMove);
      clearInterval(ambientTimer);
      cancelAnimationFrame(animId);
    };
  }, []);

  // GSAP ScrollTrigger Entrance & Tilt
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.bento-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 50,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bento-section-root relative w-full py-24 bg-black overflow-hidden select-none">
      {/* Dynamic Matrix & Liquid Ripple Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" />
      
      {/* Ambient Gradient Glows (Subtle Monochromatic) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-zinc-800/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* ========================================================================= */}
          {/* Card 1: Works with your agent (Live Radar & Orbiting Harness Badges)      */}
          {/* ========================================================================= */}
          <div 
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setSpotlight1({ x: e.clientX - r.left, y: e.clientY - r.top });
            }}
            className="bento-card bento-card-hover group relative rounded-2xl p-7 flex flex-col justify-between overflow-hidden bg-[#0c0d14]/90 border border-white/10 backdrop-blur-xl min-h-[460px] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(255,255,255,0.04)]"
          >
            <CardSpotlight pos={spotlight1} />
            <DottedGlowBackground
              className="pointer-events-none z-0 opacity-40 group-hover:opacity-75 transition-opacity duration-500"
              gap={13}
              radius={1.5}
              color="rgba(255, 255, 255, 0.12)"
              darkColor="rgba(255, 255, 255, 0.15)"
              glowColor="rgba(255, 255, 255, 0.4)"
              darkGlowColor="rgba(255, 255, 255, 0.4)"
              opacity={0.6}
              speedMin={0.3}
              speedMax={1.4}
              speedScale={1}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[9.5px] uppercase tracking-wider text-zinc-300 font-semibold px-2 py-0.5 rounded border border-white/15 bg-white/[0.04]">
                  HARNESS INTEROP
                </span>
                <span className="font-mono text-[9.5px] text-white/40 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                  <span>4 MOUNTED</span>
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white tracking-tight">Works with your agent</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">
                Claude Code, Codex, OpenCode and gbrain have curated tool registries. Any other harness sends one JSON trace.
              </p>
            </div>

            {/* Radar Orbital Graphic with Animated Rings & Scanning Beam */}
            <div className="relative z-10 w-full h-60 mt-4 flex items-center justify-center overflow-hidden">
              
              {/* Outer orbit ring */}
              <div className="absolute w-52 h-52 rounded-full border border-white/10" />
              
              {/* Mid orbit ring */}
              <div className="absolute w-40 h-40 rounded-full border border-white/10 border-dashed animate-[spin_40s_linear_infinite]" />
              
              {/* Inner orbit ring with subtle rotation */}
              <div className="absolute w-28 h-28 rounded-full border border-white/15 animate-[spin_24s_linear_infinite_reverse]" />

              {/* 360° Sweeping Radar Beam */}
              <div 
                className="absolute w-52 h-52 rounded-full pointer-events-none animate-[spin_6s_linear_infinite]"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(255, 255, 255, 0.15) 0deg, rgba(255, 255, 255, 0.02) 45deg, transparent 60deg)',
                }}
              />

              {/* Center Logo with Breathing Pulse Aura */}
              <div className="relative z-20 w-12 h-12 rounded-xl bg-gradient-to-b from-white/15 to-white/5 border border-white/25 flex items-center justify-center shadow-lg shadow-black/80 group-hover:scale-105 transition-transform duration-300">
                <div className="absolute -inset-1 rounded-xl bg-white/10 blur-sm animate-pulse" />
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <div className="w-1.5 h-4 bg-white/90 rounded-sm mr-0.5" />
                  <div className="w-1.5 h-3 bg-white/60 rounded-sm mr-0.5" />
                  <div className="w-1.5 h-5 bg-white rounded-sm" />
                </div>
              </div>

              {/* Orbiting Agent Badge 1: Claude Code (Orange) */}
              <button
                type="button"
                onClick={() => setSelectedAgent('claude')}
                className={`absolute top-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 cursor-pointer ${
                  selectedAgent === 'claude'
                    ? 'bg-[#d97757]/30 border-2 border-[#d97757] text-[#ff9367] shadow-[0_0_15px_rgba(217,119,87,0.6)] scale-110'
                    : 'bg-[#d97757]/15 border border-[#d97757]/40 text-[#d97757] hover:scale-110'
                }`}
                title="Claude Code Registry"
              >
                ✻
              </button>

              {/* Orbiting Agent Badge 2: OpenAI Codex (Glacier Cyan) */}
              <button
                type="button"
                onClick={() => setSelectedAgent('codex')}
                className={`absolute right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 cursor-pointer ${
                  selectedAgent === 'codex'
                    ? 'bg-sky-500/25 border-2 border-sky-400 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.5)] scale-110'
                    : 'bg-white/10 border border-white/20 text-zinc-300 hover:scale-110'
                }`}
                title="Codex Registry"
              >
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              </button>

              {/* Orbiting Agent Badge 3: OpenCode (Silver) */}
              <button
                type="button"
                onClick={() => setSelectedAgent('opencode')}
                className={`absolute bottom-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-300 cursor-pointer ${
                  selectedAgent === 'opencode'
                    ? 'bg-white/20 border-2 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-110'
                    : 'bg-white/10 border border-white/20 text-white/80 hover:scale-110'
                }`}
                title="OpenCode Registry"
              >
                𝕏
              </button>

              {/* Orbiting Agent Badge 4: gbrain (Silver / Zinc) */}
              <button
                type="button"
                onClick={() => setSelectedAgent('gbrain')}
                className={`absolute left-4 w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 cursor-pointer ${
                  selectedAgent === 'gbrain'
                    ? 'bg-white/25 border-2 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-110'
                    : 'bg-white/10 border border-white/20 text-zinc-300 hover:scale-110'
                }`}
                title="gbrain Registry"
              >
                ✦
              </button>
            </div>

            {/* Live Registry Tag Footer */}
            <div className="relative z-10 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
              <span className="text-white/45">ACTIVE HARNESS:</span>
              <span className="text-sky-300 font-semibold uppercase flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-sky-400" />
                {selectedAgent === 'claude' && 'CLAUDE • 18 CURATED TOOLS'}
                {selectedAgent === 'codex' && 'CODEX • 24 CURATED TOOLS'}
                {selectedAgent === 'opencode' && 'OPENCODE • 12 CURATED TOOLS'}
                {selectedAgent === 'gbrain' && 'GBRAIN • 16 CURATED TOOLS'}
              </span>
            </div>
            
            <div className="card-border-glow" />
          </div>

          {/* ========================================================================= */}
          {/* Card 2: Chained plans (Live Pulsing Network Graph with Directed Paths)   */}
          {/* ========================================================================= */}
          <div 
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setSpotlight2({ x: e.clientX - r.left, y: e.clientY - r.top });
            }}
            className="bento-card bento-card-hover group relative rounded-2xl p-7 flex flex-col justify-between overflow-hidden bg-[#0c0d14]/90 border border-white/10 backdrop-blur-xl min-h-[460px] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(129,140,248,0.15)]"
          >
            <CardSpotlight pos={spotlight2} />
            <DottedGlowBackground
              className="pointer-events-none z-0 opacity-40 group-hover:opacity-75 transition-opacity duration-500"
              gap={13}
              radius={1.5}
              color="rgba(255, 255, 255, 0.12)"
              darkColor="rgba(255, 255, 255, 0.15)"
              glowColor="rgba(255, 255, 255, 0.4)"
              darkGlowColor="rgba(255, 255, 255, 0.4)"
              opacity={0.6}
              speedMin={0.3}
              speedMax={1.4}
              speedScale={1}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[9.5px] uppercase tracking-wider text-zinc-300 font-semibold px-2 py-0.5 rounded border border-white/15 bg-white/[0.04]">
                  PROCEDURAL ORDERING
                </span>
                <span className="font-mono text-[9.5px] text-zinc-300 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3 text-sky-400" />
                  0 GAPS DETECTED
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white tracking-tight">Chained plans</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">
                When a task is several things, recall returns an ordered plan of procedures and names any gap.
              </p>
            </div>

            {/* Dynamic Graph Canvas */}
            <div className="relative z-10 w-full h-60 mt-4 flex items-center justify-center overflow-hidden">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 240">
                <defs>
                  <linearGradient id="activeLineGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>

                {/* Inactive connection lines */}
                <line x1="160" y1="120" x2="90" y2="75" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="160" y1="120" x2="75" y2="135" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="160" y1="120" x2="245" y2="175" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="160" y1="120" x2="245" y2="130" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="3 3" />

                {/* Primary Active Flow Path 1: Center -> Issue Refund */}
                <line 
                  x1="160" 
                  y1="120" 
                  x2="235" 
                  y2="60" 
                  stroke="url(#activeLineGrad)" 
                  strokeWidth={planStep % 2 === 0 ? "2.5" : "1.5"}
                  className="transition-all duration-500"
                />

                {/* Primary Active Flow Path 2: Center -> Close Ticket */}
                <line 
                  x1="160" 
                  y1="120" 
                  x2="140" 
                  y2="190" 
                  stroke="url(#activeLineGrad)" 
                  strokeWidth={planStep % 2 === 1 ? "2.5" : "1.5"}
                  className="transition-all duration-500"
                />

                {/* Animated laser packet traveling along Path 1 */}
                <circle cx="160" cy="120" r="3" fill="#38bdf8">
                  <animate attributeName="cx" from="160" to="235" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="cy" from="120" to="60" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;1;0" dur="1.8s" repeatCount="indefinite" />
                </circle>

                {/* Animated laser packet traveling along Path 2 */}
                <circle cx="160" cy="120" r="3" fill="#ffffff">
                  <animate attributeName="cx" from="160" to="140" dur="2.2s" begin="0.8s" repeatCount="indefinite" />
                  <animate attributeName="cy" from="120" to="190" dur="2.2s" begin="0.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;1;0" dur="2.2s" begin="0.8s" repeatCount="indefinite" />
                </circle>
              </svg>

              {/* Center Glowing Hub Node */}
              <div className="relative z-10 w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-400 via-white to-zinc-300 p-0.5 shadow-lg shadow-white/20 flex items-center justify-center animate-pulse">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              {/* Node 1: Issue Refund (Top Right) */}
              <div className={`absolute top-5 right-2 flex items-center gap-1.5 text-[10px] font-mono transition-all duration-300 ${
                planStep === 0 || planStep === 2 ? 'scale-105 opacity-100' : 'opacity-70'
              }`}>
                <span className="w-2 h-2 rounded-full border border-sky-400 bg-sky-950 animate-ping" />
                <span className="text-white/40">* escalation-policy</span>
                <span className="text-zinc-200 font-medium px-2 py-0.5 rounded bg-white/[0.08] border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.06)]">issue_refund</span>
              </div>

              {/* Node 2: Shipping Delay (Top Left) */}
              <div className="absolute top-11 left-3 text-[10px] font-mono text-white/40">
                shipping-delay-mutes *
              </div>

              {/* Node 3: Customer History (Mid Left) */}
              <div className="absolute top-26 left-2 text-[10px] font-mono text-white/40">
                customer-history *
              </div>

              {/* Node 4: Close Ticket (Bottom Left) */}
              <div className={`absolute bottom-4 left-10 flex items-center gap-1.5 text-[10px] font-mono transition-all duration-300 ${
                planStep === 1 || planStep === 3 ? 'scale-105 opacity-100' : 'opacity-70'
              }`}>
                <span className="text-white/40">old-refund-script *</span>
                <span className="w-2 h-2 rounded-full border border-sky-400 bg-sky-950 animate-ping" />
                <span className="text-zinc-200 font-medium px-2 py-0.5 rounded bg-white/[0.08] border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.06)]">close_ticket</span>
              </div>

              {/* Node 5: Support Macros (Bottom Right) */}
              <div className="absolute bottom-14 right-3 text-[10px] font-mono text-white/40">
                * support-macros
              </div>

              {/* Node 6: Workspace Setup (Bottom Far Right) */}
              <div className="absolute bottom-4 right-2 text-[10px] font-mono text-white/40">
                * workspace-setup
              </div>
            </div>

            {/* Live Pipeline Status Step */}
            <div className="relative z-10 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
              <span className="text-white/45">CHAIN RESOLUTION:</span>
              <span className="text-sky-300 font-semibold">
                {planStep === 0 && 'STEP 1: FETCH_ESCALATION_POLICY'}
                {planStep === 1 && 'STEP 2: RUN_REFUND_SUBROUTINE'}
                {planStep === 2 && 'STEP 3: POST_TO_CLOSE_TICKET'}
                {planStep === 3 && 'VERIFIED: 100% SUCCESS PATH'}
              </span>
            </div>

            <div className="card-border-glow" />
          </div>

          {/* ========================================================================= */}
          {/* Card 3: Savings per run (Interactive Live Sparkline & Cursor Tooltip)     */}
          {/* ========================================================================= */}
          <div 
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setSpotlight3({ x: e.clientX - r.left, y: e.clientY - r.top });
            }}
            className="bento-card bento-card-hover group relative rounded-2xl p-7 flex flex-col justify-between overflow-hidden bg-[#0c0d14]/90 border border-white/10 backdrop-blur-xl min-h-[460px] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(34,197,94,0.15)]"
          >
            <CardSpotlight pos={spotlight3} />
            <DottedGlowBackground
              className="pointer-events-none z-0 opacity-40 group-hover:opacity-75 transition-opacity duration-500"
              gap={13}
              radius={1.5}
              color="rgba(255, 255, 255, 0.12)"
              darkColor="rgba(255, 255, 255, 0.15)"
              glowColor="rgba(56, 189, 248, 0.65)"
              darkGlowColor="rgba(56, 189, 248, 0.65)"
              opacity={0.6}
              speedMin={0.3}
              speedMax={1.4}
              speedScale={1}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[9.5px] uppercase tracking-wider text-sky-300 font-semibold px-2 py-0.5 rounded border border-sky-400/30 bg-sky-500/10">
                  TOKEN EFFICIENCY
                </span>
                <span className="font-mono text-[9.5px] text-white/50 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-sky-400" />
                  +84.2% NET GAIN
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white tracking-tight">Savings per run</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">
                Tokens, money and time, next to the run they came from, including the runs where memory did not help.
              </p>
            </div>

            {/* Live Interactive Savings Chart Graphic */}
            <div className="relative z-10 w-full mt-4 p-4 rounded-xl bg-black/75 border border-white/10 flex flex-col justify-between">
              
              {/* Header live metrics */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-4 bg-sky-400 rounded-sm shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                  <div>
                    <div className="text-xs font-semibold text-white">Savings Velocity</div>
                    <div className="text-[9.5px] text-white/40">vs. unguided cold harness</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-sky-200 font-medium font-mono bg-sky-950/50 px-2.5 py-1 rounded-full border border-sky-400/30 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                  <span>{RUN_DATA[activeRunIndex].pct} Saved</span>
                </div>
              </div>

              {/* Chart SVG with Interactive Point Hovering */}
              <div className="relative w-full h-28 my-3">
                <svg className="w-full h-full" viewBox="0 0 280 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Fill area */}
                  <polygon
                    points="0,60 25,52 50,68 75,45 100,58 125,40 150,65 175,38 200,34 225,20 250,26 275,10 275,80 0,80"
                    fill="url(#savingsGrad)"
                  />
                  
                  {/* Glowing Stroke line */}
                  <polyline
                    points="0,60 25,52 50,68 75,45 100,58 125,40 150,65 175,38 200,34 225,20 250,26 275,10"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="filter drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                  />
                  
                  {/* Peak Point on R12 */}
                  <circle cx="275" cy="10" r="5" fill="#38bdf8" className="animate-ping" opacity="0.7" />
                  <circle cx="275" cy="10" r="3.5" fill="#ffffff" stroke="#38bdf8" strokeWidth="2" />
                </svg>

                {/* Interactive Scrub Guide Line */}
                <div
                  className="absolute top-0 bottom-0 w-[1px] bg-sky-400/60 pointer-events-none transition-all duration-150"
                  style={{ left: `${(activeRunIndex / 11) * 100}%` }}
                />
              </div>

              {/* X axis interactive selector buttons */}
              <div className="flex justify-between text-[8.5px] font-mono text-white/40 pt-1.5 border-t border-white/10">
                {RUN_DATA.map((item, idx) => (
                  <button
                    key={item.run}
                    type="button"
                    onMouseEnter={() => setActiveRunIndex(idx)}
                    className={`transition-colors cursor-pointer hover:text-sky-300 ${
                      activeRunIndex === idx ? 'text-sky-400 font-bold underline decoration-sky-400' : ''
                    }`}
                  >
                    {item.run}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Run Telemetry Footer */}
            <div className="relative z-10 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
              <span className="text-white/45">RUN #{activeRunIndex + 1} METRIC:</span>
              <span className="text-sky-300 font-medium">
                {RUN_DATA[activeRunIndex].tokens} TOKENS • {RUN_DATA[activeRunIndex].time} VERIFIED
              </span>
            </div>

            <div className="card-border-glow" />
          </div>

          {/* ========================================================================= */}
          {/* Card 4: Scrubbed identifiers (Dual Terminal with Live Redaction Pipeline) */}
          {/* ========================================================================= */}
          <div 
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setSpotlight4({ x: e.clientX - r.left, y: e.clientY - r.top });
            }}
            className="bento-card bento-card-hover group relative rounded-2xl p-7 flex flex-col justify-between overflow-hidden bg-[#0c0d14]/90 border border-white/10 backdrop-blur-xl min-h-[460px] lg:col-span-2 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(56,189,248,0.15)]"
          >
            <CardSpotlight pos={spotlight4} />
            <DottedGlowBackground
              className="pointer-events-none z-0 opacity-40 group-hover:opacity-75 transition-opacity duration-500"
              gap={13}
              radius={1.5}
              color="rgba(255, 255, 255, 0.12)"
              darkColor="rgba(255, 255, 255, 0.15)"
              glowColor="rgba(56, 189, 248, 0.85)"
              darkGlowColor="rgba(56, 189, 248, 0.85)"
              opacity={0.6}
              speedMin={0.3}
              speedMax={1.4}
              speedScale={1}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[9.5px] uppercase tracking-wider text-cyan-400 font-semibold px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10">
                  ZERO EXFILTRATION GUARANTEE
                </span>
                <span className="font-mono text-[9.5px] text-sky-300 flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  PII STRIPPER ACTIVE
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white tracking-tight">Scrubbed identifiers</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">
                Only the prompt and allow-listed tool arguments leave the machine. Session IDs, env vars, and client mail never transit.
              </p>
            </div>

            {/* Dual Terminal Inspector with Animated Pipeline */}
            <div className="relative z-10 w-full mt-6 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
              
              {/* Left Box: local_trace.py (Local Raw State) */}
              <div className={`rounded-xl bg-black/85 border transition-all duration-300 p-4 font-mono text-[11px] space-y-2.5 ${
                isScrubbing ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-white/10'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-white/5 text-[10px] text-white/40">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-amber-400" />
                    <span>local_trace.py <span className="text-white/25">raw_session.json</span></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  </div>
                </div>

                <div className="space-y-1.5 text-white/70">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">t.session_id</span>
                    <span className={`transition-all duration-300 px-1.5 py-0.5 rounded text-[10.5px] ${
                      isScrubbing ? 'bg-red-500/20 text-red-300 line-through' : 'text-white/70'
                    }`}>
                      &quot;sess_8f2e1a9c&quot;
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">t.user_email</span>
                    <span className={`transition-all duration-300 px-1.5 py-0.5 rounded text-[10.5px] ${
                      isScrubbing ? 'bg-red-500/20 text-red-300 line-through' : 'text-white/70'
                    }`}>
                      &quot;jordan@acme.com&quot;
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">t.cwd</span>
                    <span className={`transition-all duration-300 px-1.5 py-0.5 rounded text-[10.5px] ${
                      isScrubbing ? 'bg-red-500/20 text-red-300 line-through' : 'text-white/50'
                    }`}>
                      &quot;/Users/jordan/billing&quot;
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">t.tool_calls</span>
                    <span className="text-white/40">[ ... raw args ]</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">t.prompt</span>
                    <span className="text-cyan-300">&quot;process refund&quot;</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-center">
                  <span className="px-3 py-1 rounded-md text-[10px] font-mono tracking-wider border border-white/20 text-white/60 bg-white/5 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-amber-400" />
                    STAYS ON THIS MACHINE
                  </span>
                </div>
              </div>

              {/* Animated Transition Arrow */}
              <div className="flex md:flex-col items-center justify-center px-1">
                <div className="relative w-10 h-10 rounded-full bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.3)] group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </div>
              </div>

              {/* Right Box: network_payload.py (Scrubbed State) */}
              <div className="rounded-xl bg-black/85 border border-cyan-500/30 p-4 font-mono text-[11px] space-y-2.5 shadow-[0_0_25px_rgba(56,189,248,0.1)]">
                <div className="flex items-center justify-between pb-2 border-b border-white/5 text-[10px] text-white/40">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    <span>network_payload.py <span className="text-cyan-300/40">received.json</span></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                </div>

                <div className="space-y-1 text-white/70">
                  <div><span className="text-cyan-400">payload</span> = &#123;</div>
                  <div className="pl-3">
                    <span className="text-cyan-300">&quot;prompt&quot;</span>: <span className="text-white/90">&quot;process refund&quot;</span>,
                  </div>
                  <div className="pl-3">
                    <span className="text-cyan-300">&quot;tool_args&quot;</span>: &#123;
                  </div>
                  <div className="pl-6">
                    <span className="text-cyan-300">&quot;command&quot;</span>: <span className="text-white/80">&quot;pytest refund&quot;</span>,
                  </div>
                  <div className="pl-6">
                    <span className="text-cyan-300">&quot;file_path&quot;</span>: <span className="text-white/80">&quot;refund.py&quot;</span>
                  </div>
                  <div className="pl-3">&#125;</div>
                  <div>&#125;</div>
                  <div className="text-white/35 text-[9.5px]"># PII, session IDs & env stripped</div>
                </div>

                <div className="pt-1.5 flex justify-center">
                  <span className="px-3 py-1 rounded-md text-[10px] font-mono tracking-wider border border-white/20 text-white bg-white/[0.08] shadow-[0_0_16px_rgba(255,255,255,0.06)] flex items-center gap-1.5 font-semibold">
                    <Check className="w-3 h-3 text-sky-400" />
                    ONLY THIS LEAVES
                  </span>
                </div>
              </div>

            </div>

            {/* Live Filter Telemetry Footer */}
            <div className="relative z-10 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
              <span className="text-white/45">ENCLAVE REDACTION RATE:</span>
              <span className="text-cyan-300 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                100% SENSITIVE FIELDS DROPPED
              </span>
            </div>

            <div className="card-border-glow" />
          </div>

          {/* ========================================================================= */}
          {/* Card 5: Survives a tool changing shape (Live Terminal Typing & Matcher)   */}
          {/* ========================================================================= */}
          <div 
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setSpotlight5({ x: e.clientX - r.left, y: e.clientY - r.top });
            }}
            className="bento-card bento-card-hover group relative rounded-2xl p-7 flex flex-col justify-between overflow-hidden bg-[#0c0d14]/90 border border-white/10 backdrop-blur-xl min-h-[460px] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(56,189,248,0.12)]"
          >
            <CardSpotlight pos={spotlight5} />
            <DottedGlowBackground
              className="pointer-events-none z-0 opacity-40 group-hover:opacity-75 transition-opacity duration-500"
              gap={13}
              radius={1.5}
              color="rgba(255, 255, 255, 0.12)"
              darkColor="rgba(255, 255, 255, 0.15)"
              glowColor="rgba(255, 255, 255, 0.4)"
              darkGlowColor="rgba(255, 255, 255, 0.4)"
              opacity={0.6}
              speedMin={0.3}
              speedMax={1.4}
              speedScale={1}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[9.5px] uppercase tracking-wider text-zinc-300 font-semibold px-2 py-0.5 rounded border border-white/15 bg-white/[0.04]">
                  SEMANTIC RESOLUTION
                </span>
                <span className="font-mono text-[9.5px] text-white/50 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                  <span>3-WAY MATCHER</span>
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white tracking-tight">Survives a tool changing shape</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">
                Procedures name a target by what it is about. In the cross-tool test every run hit the fastest path on a tool with no shared vocabulary.
              </p>
            </div>

            {/* Interactive Animated Terminal Window */}
            <div className="relative z-10 w-full mt-4 p-4 rounded-xl bg-black/85 border border-white/10 font-mono text-[11px] leading-relaxed shadow-lg">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-[10px]">
                <div className="flex items-center gap-1.5 text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  <span>memorable recall</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                </div>
              </div>

              {/* Typing Line */}
              <div className="space-y-2">
                <div className="text-white/90 flex items-center gap-1">
                  <span className="text-sky-400 font-bold">$</span>
                  <span>memorable recall &apos;{terminalText}&apos;</span>
                  <span className="inline-block w-1.5 h-3.5 bg-white animate-pulse" />
                </div>
                
                <div className="text-white/40 text-[10px]">
                  # matched on shared tokens, not field names
                </div>

                {/* Simulated Semantic Match Result Badge */}
                <div className="p-2 rounded bg-white/[0.04] border border-white/15 flex items-center justify-between text-[10.5px]">
                  <div className="text-zinc-200 font-medium">
                    <span className="text-sky-300 font-bold">{terminalScore}</span> <span className="text-white/80">procedures/9f21ac4d</span>
                  </div>
                  <span className="text-sky-300 text-[9.5px] font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3 text-sky-400" />
                    ~61ms
                  </span>
                </div>

                <div className="text-white/90 pt-1 text-[10.5px] flex items-center gap-1">
                  <span className="text-cyan-400 font-bold">$</span>
                  <span>memorable show &lt;slug&gt;</span>
                </div>
                <div className="text-white/40 text-[9.5px]">
                  # 4 steps, 2 files verified, real exit code 0
                </div>
              </div>
            </div>

            {/* Semantic Matcher Progress Footer */}
            <div className="relative z-10 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
              <span className="text-white/45">CROSS-TOOL RECALL:</span>
              <span className="text-sky-300 font-medium">FASTEST VERIFIED PATH</span>
            </div>

            <div className="card-border-glow" />
          </div>

        </div>
      </div>
    </section>
  );
}
