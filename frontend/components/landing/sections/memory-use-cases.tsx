'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Copy, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CARDS_DATA = [
  {
    number: '01',
    title: 'Install in one command',
    description: 'Point it at Claude Code, Codex, Cursor, or any other harness you run.',
    commandHighlight: 'login'
  },
  {
    number: '02',
    title: 'Set up once',
    description: 'Run the commands on the left to set up and sign in.\nMemorable then works in the background.',
    commandHighlight: 'enable'
  },
  {
    number: '03',
    title: 'Create new\nmemorables',
    description: 'Capture every workflow your agents run or recall as a\nreusable memorable.',
    commandHighlight: 'recall'
  },
  {
    number: '04',
    title: 'Recall in\n~60ms',
    description: 'Three matchers at once: exact, lexical, semantic so your\nagent hits the fastest verified path.',
    commandHighlight: 'show'
  },
  {
    number: '05',
    title: 'What is\nstored',
    description: 'The files touched, the command that proved it worked, and the order with real exit codes. The transcript is never sent.',
    commandHighlight: 'disable'
  }
];

export function MemoryUseCases() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const auraFrameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<'cli' | 'claude' | 'harness'>('cli');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Ripple effect over the background mesh
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = auraFrameRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      speed: number;
      color: string;
      lineWidth: number;
    }
    const ripples: Ripple[] = [];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const addRipple = (x: number, y: number, isAmbient = false) => {
      const colors = [
        'rgba(244, 114, 182, ', // pink/magenta
        'rgba(251, 146, 60, ',  // coral/amber
        'rgba(192, 132, 252, '  // purple
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      ripples.push({
        x,
        y,
        radius: isAmbient ? 20 : 10,
        maxRadius: isAmbient ? 220 : 180,
        alpha: isAmbient ? 0.45 : 0.65,
        speed: isAmbient ? 1.4 : 1.8,
        color,
        lineWidth: isAmbient ? 2.5 : 2
      });
      // Limit simultaneous ripples
      if (ripples.length > 12) ripples.shift();
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // throttle slightly
      if (Math.random() > 0.6) {
        addRipple(x, y, false);
      }
    };
    container.addEventListener('pointermove', handlePointerMove);

    // Ambient ripple loop every 2.4s
    const ambientInterval = setInterval(() => {
      const rect = container.getBoundingClientRect();
      const cx = rect.width / 2 + (Math.random() - 0.5) * 80;
      const cy = rect.height * 0.75 + (Math.random() - 0.5) * 60;
      addRipple(cx, cy, true);
    }, 2400);

    const loop = () => {
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha -= 0.007;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${r.color}${r.alpha})`;
        ctx.lineWidth = r.lineWidth;
        ctx.shadowColor = `${r.color}0.6)`;
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Second subtle inner echo ring
        if (r.radius > 25) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius - 14, 0, Math.PI * 2);
          ctx.strokeStyle = `${r.color}${r.alpha * 0.45})`;
          ctx.lineWidth = r.lineWidth * 0.75;
          ctx.stroke();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', handlePointerMove);
      clearInterval(ambientInterval);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleCopy = () => {
    let text = '';
    if (activeTab === 'cli') {
      text = 'npx memorable-cli';
    } else if (activeTab === 'claude') {
      text = `$memorable login\n$memorable install-hooks\n$memorable enable\n$memorable recall "fix the failing auth test"`;
    } else {
      text = `curl -X POST https://api.memorable.sh/v1/extract`;
    }
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length < 5) return;

      // Card 0 (01) starts centered and active
      gsap.set(cards[0], { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, zIndex: 10 });

      // Cards 1..4 start in the bottom-right corner at rotation angle (-7.5 deg)
      gsap.set(cards[1], { x: 90, y: 260, rotation: -7.5, scale: 0.98, opacity: 0, zIndex: 20 });
      gsap.set(cards[2], { x: 110, y: 300, rotation: -8, scale: 0.98, opacity: 0, zIndex: 25 });
      gsap.set(cards[3], { x: 110, y: 300, rotation: -8, scale: 0.98, opacity: 0, zIndex: 30 });
      gsap.set(cards[4], { x: 110, y: 300, rotation: -8, scale: 0.98, opacity: 0, zIndex: 35 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=3400',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const newIndex = Math.min(4, Math.floor(p * 5));
            setActiveCardIndex(newIndex);
          }
        }
      });

      // Segment 1 (Card 01 recedes to top-left; Card 02 glides from bottom-right corner to center)
      tl.to(cards[0], {
        x: -28,
        y: -36,
        scale: 0.96,
        opacity: 0.38,
        ease: 'power2.inOut',
        duration: 1
      }, 0)
      .fromTo(cards[1],
        { x: 90, y: 260, rotation: -7.5, opacity: 0 },
        { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, ease: 'power2.out', duration: 1 },
        0
      );

      // Segment 2 (Card 01 fades away; Card 02 recedes to top-left; Card 03 glides from bottom-right corner to center)
      tl.to(cards[0], {
        x: -52,
        y: -64,
        scale: 0.92,
        opacity: 0,
        ease: 'power2.inOut',
        duration: 1
      }, 1)
      .to(cards[1], {
        x: -28,
        y: -36,
        scale: 0.96,
        opacity: 0.38,
        ease: 'power2.inOut',
        duration: 1
      }, 1)
      .fromTo(cards[2],
        { x: 90, y: 260, rotation: -7.5, opacity: 0 },
        { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, ease: 'power2.out', duration: 1 },
        1
      );

      // Segment 3 (Card 02 fades away; Card 03 recedes to top-left; Card 04 glides from bottom-right corner to center)
      tl.to(cards[1], {
        x: -52,
        y: -64,
        scale: 0.92,
        opacity: 0,
        ease: 'power2.inOut',
        duration: 1
      }, 2)
      .to(cards[2], {
        x: -28,
        y: -36,
        scale: 0.96,
        opacity: 0.38,
        ease: 'power2.inOut',
        duration: 1
      }, 2)
      .fromTo(cards[3],
        { x: 90, y: 260, rotation: -7.5, opacity: 0 },
        { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, ease: 'power2.out', duration: 1 },
        2
      );

      // Segment 4 (Card 03 fades away; Card 04 recedes to top-left; Card 05 glides from bottom-right corner to center)
      tl.to(cards[2], {
        x: -52,
        y: -64,
        scale: 0.92,
        opacity: 0,
        ease: 'power2.inOut',
        duration: 1
      }, 3)
      .to(cards[3], {
        x: -28,
        y: -36,
        scale: 0.96,
        opacity: 0.38,
        ease: 'power2.inOut',
        duration: 1
      }, 3)
      .fromTo(cards[4],
        { x: 90, y: 260, rotation: -7.5, opacity: 0 },
        { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, ease: 'power2.out', duration: 1 },
        3
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="memorable-section-root">
      <div className="memorable-section-grid">
        
        {/* Left Column: Terminal with Image Mesh + Ripple Effect */}
        <div className="memorable-terminal-col">
          <div ref={auraFrameRef} className="memorable-aura-frame">
            
            {/* Background Texture Image from font/images/premium_photo-1664443577598-cb50602ee207.avif */}
            <div className="memorable-mesh-image-bg" />
            
            {/* Color vignette shaping the glow around the borders */}
            <div className="memorable-mesh-vignette" />

            {/* Perforated Dot Matrix Pattern where mesh glows through */}
            <div className="memorable-dot-matrix" />

            {/* Ambient Animated Ripple Waves (CSS) */}
            <div className="memorable-ripple-ring ring-1" />
            <div className="memorable-ripple-ring ring-2" />
            <div className="memorable-ripple-ring ring-3" />

            {/* Interactive Dynamic Ripple Canvas */}
            <canvas ref={canvasRef} className="memorable-ripple-canvas" />

            {/* Sunset Rim Glow at bottom */}
            <div className="memorable-sunset-glow" />

            {/* Terminal Window */}
            <div className="memorable-terminal-window">
              
              {/* Terminal Title Bar */}
              <div className="memorable-terminal-header">
                <div className="memorable-terminal-tabs">
                  <div className="memorable-window-controls">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setActiveTab('cli')}
                    className={`memorable-tab-btn ${activeTab === 'cli' ? 'active' : ''}`}
                  >
                    npx memorable-cli
                    {activeTab === 'cli' && <span className="memorable-tab-line" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('claude')}
                    className={`memorable-tab-btn ${activeTab === 'claude' ? 'active' : ''}`}
                  >
                    Claude Code
                    {activeTab === 'claude' && <span className="memorable-tab-line" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('harness')}
                    className={`memorable-tab-btn ${activeTab === 'harness' ? 'active' : ''}`}
                  >
                    Any harness
                    {activeTab === 'harness' && <span className="memorable-tab-line" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="memorable-copy-btn"
                  title="Copy commands"
                >
                  {copied ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white font-mono">
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </span>
                  )}
                </button>
              </div>

              {/* Terminal Code Body */}
              <div className="memorable-terminal-body">
                {activeTab === 'cli' && (
                  <pre className="memorable-code-pre">
                    <code>
                      <span className="text-white font-semibold">memorable</span> <span className="code-comment">0.5.18</span>{'\n'}
                      <span className="text-white/60">procedural memory for agents, stored on your own machine</span>{'\n'}
                      {'\n'}
                      <span className="text-white/50">backend    </span> <span className="text-white/80">gbrain · your own gbrain database</span>{'\n'}
                      <span className="text-white/50">extraction </span> <span className="text-white/80">configured · no model in the loop</span>{'\n'}
                      {'\n'}
                      <span className="text-white/40 text-[11px] uppercase tracking-wider">COMMANDS</span>{'\n'}
                      <span className="text-white/90">setup      </span> <span className="text-white/70">init setup login install-hooks agents-md</span>{'\n'}
                      <span className="text-white/90">memory     </span> <span className="text-white/70">record ingest backfill recall show list chain</span>{'\n'}
                      <span className="text-white/90">upkeep     </span> <span className="text-white/70">prune enable disable forget flush</span>{'\n'}
                      <span className="text-white/90">inspect    </span> <span className="text-white/70">status doctor eval notices</span>{'\n'}
                      {'\n'}
                      <div className="terminal-divider" />
                      {'\n'}
                      <span className="code-amber font-semibold">start</span>{'\n'}
                      <span className="text-white/40 text-[11px] uppercase tracking-wider">RUN</span>{'\n'}
                      <span className="text-white/90 font-medium">memorable start</span>{'\n'}
                      <span className="text-white/60">Sets all of this up for you.</span>{'\n'}
                      <span className="code-cursor">█</span>
                    </code>
                  </pre>
                )}

                {activeTab === 'claude' && (
                  <pre className="memorable-code-pre">
                    <code>
                      <span className="text-white/90">$memorable login</span>{'\n'}
                      <span className="code-comment"># opens a browser, approves this machine</span>{'\n'}
                      {'\n'}
                      <span className="text-white/90">$memorable install-hooks</span>{'\n'}
                      <span className="code-comment"># recall runs on every new prompt</span>{'\n'}
                      {'\n'}
                      <span className="text-white/90">$memorable enable</span>{'\n'}
                      <span className="code-comment"># explicit write consent, nothing stored before this</span>{'\n'}
                      {'\n'}
                      <span className="text-white/90">$memorable recall "fix the failing auth test"</span>{'\n'}
                      <span className="code-cyan">0.866 procedures/89f11bab-fix-failing-auth-test</span>{'\n'}
                      <span className="code-cyan">[lexical,semantic]</span>{'\n'}
                      {'\n'}
                      <span className="text-white/90">$memorable show procedures/89f11bab-fix-failing-auth-test</span>{'\n'}
                      <span className="code-cyan font-medium">THE FIX LANDED IN: tests/auth/session.test.ts</span>{'\n'}
                      <span className="text-white/70">Verified last time by: npm test -- auth</span>{'\n'}
                      {'\n'}
                      <span className="text-white/90">$memorable disable</span>{'\n'}
                      <span className="code-comment"># memory goes read-only. Recall still works, nothing new is recorded.</span>{'\n'}
                      <span className="code-cursor">█</span>
                    </code>
                  </pre>
                )}

                {activeTab === 'harness' && (
                  <pre className="memorable-code-pre">
                    <code>
                      <span className="code-comment"># Any harness sends one JSON trace to POST /v1/extract</span>{'\n'}
                      <span className="text-white/90">curl -X POST https://api.memorable.sh/v1/extract \</span>{'\n'}
                      <span className="text-white/70">  -H "Authorization: Bearer $MEMORABLE_KEY" \</span>{'\n'}
                      <span className="text-white/70">  -H "Content-Type: application/json" \</span>{'\n'}
                      <span className="text-white/70">  -d '&#123;</span>{'\n'}
                      <span className="code-cyan">    "session_id": "sess_89f11bab",</span>{'\n'}
                      <span className="code-cyan">    "harness": "custom_agent",</span>{'\n'}
                      <span className="text-white/70">    "steps": [</span>{'\n'}
                      <span className="text-white/80">      &#123; "action": "test.run", "exit_code": 0 &#125;,</span>{'\n'}
                      <span className="text-white/80">      &#123; "action": "patch.apply", "verified": true &#125;</span>{'\n'}
                      <span className="text-white/70">    ]</span>{'\n'}
                      <span className="text-white/70">  &#125;'</span>{'\n'}
                      {'\n'}
                      <span className="code-comment"># Stored locally, on your gbrain DB, or Postgres.</span>{'\n'}
                      <span className="code-cursor">█</span>
                    </code>
                  </pre>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: 5 Stacking Cards on Scroll */}
        <div className="memorable-cards-col">
          <div className="memorable-cards-deck">
            {CARDS_DATA.map((card, index) => {
              const isForeground = activeCardIndex === index;
              return (
                <div
                  key={card.number}
                  ref={(el) => { cardsRef.current[index] = el; }}
                  className={`memorable-stack-card ${isForeground ? 'card-foreground' : ''}`}
                >
                  <div className="memorable-card-number">{card.number}</div>
                  
                  <div className="memorable-card-content">
                    <h3 className="memorable-card-title">{card.title}</h3>
                  </div>

                  <p className="memorable-card-desc">{card.description}</p>

                  <div className="memorable-card-border-glow" />
                </div>
              );
            })}
          </div>

          {/* Step indicators */}
          <div className="memorable-step-dots">
            {CARDS_DATA.map((card, idx) => (
              <span
                key={card.number}
                className={`memorable-step-dot ${activeCardIndex === idx ? 'active' : ''}`}
                title={`Step ${card.number}: ${card.title.replace('\n', ' ')}`}
              >
                <span className="dot-label">{card.number}</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
