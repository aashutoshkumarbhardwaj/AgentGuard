'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Copy, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CARDS_DATA = [
  {
    number: '01',
    title: 'Works with\nyour agent',
    description: 'Connect Claude, Cursor, LangChain, or your custom agent harness to the AgentGuard security proxy.',
    commandHighlight: 'proxy'
  },
  {
    number: '02',
    title: 'Cedar policy\nenforcement',
    description: 'Every tool request is evaluated against Cedar authorization, RBAC rules, and agent permission boundaries.',
    commandHighlight: 'cedar'
  },
  {
    number: '03',
    title: 'Real-time\nrisk scoring',
    description: 'Detect prompt injection, tool chaining anomalies, and high-risk argument payloads before execution.',
    commandHighlight: 'risk'
  },
  {
    number: '04',
    title: 'Decide in\n<5ms',
    description: 'Deterministically returns ALLOW, requests human APPROVE for critical actions, or triggers immediate BLOCK.',
    commandHighlight: 'evaluate'
  },
  {
    number: '05',
    title: 'What is\nstored',
    description: 'Cedar evaluation proofs, decision telemetry, and immutable audit logs. Sensitive secrets are never exposed.',
    commandHighlight: 'audit'
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
      text = 'agentguard start --port 8000';
    } else if (activeTab === 'claude') {
      text = 'claude --mcp-config ./agentguard_mcp.json';
    } else {
      text = `curl -X POST https://api.agentguard.dev/v1/evaluate \\\n  -H "Authorization: Bearer $AGENTGUARD_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"agent_id": "research-agent", "action": "data.export"}'`;
    }
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToCard = (index: number) => {
    setActiveCardIndex(index);
    const st = ScrollTrigger.getById('memorable-scroll');
    if (st) {
      const targetProgress = index / (CARDS_DATA.length - 1);
      const targetY = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length < 5) return;

      // Initial states: Card 0 starts centered; Card 1 visibly rests in the bottom-right corner; Cards 2..4 queued
      gsap.set(cards[0], { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, zIndex: 10 });
      gsap.set(cards[1], { x: 95, y: 260, rotation: -7.5, scale: 0.96, opacity: 0.55, zIndex: 20 });
      gsap.set(cards[2], { x: 95, y: 260, rotation: -7.5, scale: 0.96, opacity: 0, zIndex: 30 });
      gsap.set(cards[3], { x: 95, y: 260, rotation: -7.5, scale: 0.96, opacity: 0, zIndex: 40 });
      gsap.set(cards[4], { x: 95, y: 260, rotation: -7.5, scale: 0.96, opacity: 0, zIndex: 50 });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'memorable-scroll',
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=3400',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const newIndex = Math.min(4, Math.max(0, Math.round(p * 4)));
            setActiveCardIndex(newIndex);
          }
        }
      });

      // Segment 1 (Card 01 recedes to top-left; Card 02 glides from corner into center; Card 03 queues in corner)
      tl.to(cards[0], {
        x: -28,
        y: -36,
        scale: 0.96,
        opacity: 0.38,
        ease: 'power2.inOut',
        duration: 1
      }, 0)
      .fromTo(cards[1],
        { x: 95, y: 260, rotation: -7.5, scale: 0.96, opacity: 0.55 },
        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, ease: 'power2.out', duration: 1 },
        0
      )
      .to(cards[1], {
        opacity: 1,
        ease: 'power1.out',
        duration: 0.25
      }, 0)
      .fromTo(cards[2],
        { x: 95, y: 260, rotation: -7.5, scale: 0.96, opacity: 0 },
        { x: 95, y: 260, rotation: -7.5, scale: 0.96, opacity: 0.55, ease: 'power1.inOut', duration: 0.4 },
        0.6
      );

      // Segment 2 (Card 01 fades away; Card 02 recedes to top-left; Card 03 glides from corner into center; Card 04 queues in corner)
      tl.to(cards[0], {
        x: -54,
        y: -68,
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
        { x: 95, y: 260, rotation: -7.5, scale: 0.96, opacity: 0.55 },
        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, ease: 'power2.out', duration: 1 },
        1
      )
      .to(cards[2], {
        opacity: 1,
        ease: 'power1.out',
        duration: 0.25
      }, 1)
      .fromTo(cards[3],
        { x: 95, y: 260, rotation: -7.5, scale: 0.96, opacity: 0 },
        { x: 95, y: 260, rotation: -7.5, scale: 0.96, opacity: 0.55, ease: 'power1.inOut', duration: 0.4 },
        1.6
      );

      // Segment 3 (Card 02 fades away; Card 03 recedes to top-left; Card 04 glides from corner into center; Card 05 queues in corner)
      tl.to(cards[1], {
        x: -54,
        y: -68,
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
        { x: 95, y: 260, rotation: -7.5, scale: 0.96, opacity: 0.55 },
        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, ease: 'power2.out', duration: 1 },
        2
      )
      .to(cards[3], {
        opacity: 1,
        ease: 'power1.out',
        duration: 0.25
      }, 2)
      .fromTo(cards[4],
        { x: 95, y: 260, rotation: -7.5, scale: 0.96, opacity: 0 },
        { x: 95, y: 260, rotation: -7.5, scale: 0.96, opacity: 0.55, ease: 'power1.inOut', duration: 0.4 },
        2.6
      );

      // Segment 4 (Card 03 fades away; Card 04 recedes to top-left; Card 05 glides from corner into center)
      tl.to(cards[2], {
        x: -54,
        y: -68,
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
        { x: 95, y: 260, rotation: -7.5, scale: 0.96, opacity: 0.55 },
        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, ease: 'power2.out', duration: 1 },
        3
      )
      .to(cards[4], {
        opacity: 1,
        ease: 'power1.out',
        duration: 0.25
      }, 3);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="use-case" ref={sectionRef} className="memorable-section-root">
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
                    agentguard
                    {activeTab === 'cli' && <span className="memorable-tab-line" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('claude')}
                    className={`memorable-tab-btn ${activeTab === 'claude' ? 'active' : ''}`}
                  >
                    Claude / MCP
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
                      <span className="text-white font-semibold">agentguard</span> <span className="code-comment">v1.4.0</span>{'\n'}
                      <span className="text-white/60">runtime security & authorization layer for AI agents</span>{'\n'}
                      {'\n'}
                      <span className="text-white/50">policy     </span> <span className="text-white/80">cedar · sub-millisecond evaluation</span>{'\n'}
                      <span className="text-white/50">threats    </span> <span className="text-white/80">active · prompt injection & exfil defense</span>{'\n'}
                      {'\n'}
                      <span className="text-white/40 text-[11px] uppercase tracking-wider">COMMANDS</span>{'\n'}
                      <span className="text-white/90">gateway    </span> <span className="text-white/70">serve upstream bind mcp-proxy tls</span>{'\n'}
                      <span className="text-white/90">policy     </span> <span className="text-white/70">validate compile format test diff</span>{'\n'}
                      <span className="text-white/90">audit      </span> <span className="text-white/70">tail query export verify-hash</span>{'\n'}
                      <span className="text-white/90">simulate   </span> <span className="text-white/70">run replay benchmark redteam</span>{'\n'}
                      {'\n'}
                      <div className="terminal-divider" />
                      {'\n'}
                      <span className="code-amber font-semibold">start</span>{'\n'}
                      <span className="text-white/40 text-[11px] uppercase tracking-wider">RUN</span>{'\n'}
                      <span className="text-white/90 font-medium">agentguard start --port 8000</span>{'\n'}
                      <span className="text-white/60">Intercepts and authorizes all agent tool calls.</span>{'\n'}
                      <span className="code-cursor">█</span>
                    </code>
                  </pre>
                )}

                {activeTab === 'claude' && (
                  <pre className="memorable-code-pre">
                    <code>
                      <span className="text-white/90">$ agentguard mcp attach --upstream http://localhost:8080/mcp</span>{'\n'}
                      <span className="code-comment"># mounts streamable HTTP security gateway on :8000/mcp</span>{'\n'}
                      {'\n'}
                      <span className="text-white/90">$ claude --mcp-config ./agentguard_mcp.json</span>{'\n'}
                      <span className="code-comment"># Claude connects to agentguard proxy</span>{'\n'}
                      {'\n'}
                      <span className="text-white/90">[evaluating] research-agent -&gt; file.delete &#123;&quot;path&quot;: &quot;/etc/shadow&quot;&#125;</span>{'\n'}
                      <span className="code-amber">CEDAR: ForbidActionOnSystemPaths</span>{'\n'}
                      <span className="code-amber">RISK_SCORE: 0.94 [CRITICAL]</span>{'\n'}
                      {'\n'}
                      <span className="text-rose-400 font-medium">DECISION: BLOCK</span>{'\n'}
                      <span className="text-white/70">Tool call intercepted. Audit proof logged to tamper-proof ledger.</span>{'\n'}
                      {'\n'}
                      <span className="text-emerald-400 font-medium">DECISION: ALLOW · calendar.read</span>{'\n'}
                      <span className="code-comment"># Safe tool passed through to upstream server in 3.8ms</span>{'\n'}
                      <span className="code-cursor">█</span>
                    </code>
                  </pre>
                )}

                {activeTab === 'harness' && (
                  <pre className="memorable-code-pre">
                    <code>
                      <span className="code-comment"># Any agent sends tool requests to POST /v1/evaluate</span>{'\n'}
                      <span className="text-white/90">curl -X POST https://api.agentguard.dev/v1/evaluate \</span>{'\n'}
                      <span className="text-white/70">  -H &quot;Authorization: Bearer $AGENTGUARD_API_KEY&quot; \</span>{'\n'}
                      <span className="text-white/70">  -H &quot;Content-Type: application/json&quot; \</span>{'\n'}
                      <span className="text-white/70">  -d &#39;&#123;</span>{'\n'}
                      <span className="code-cyan">    &quot;agent_id&quot;: &quot;research-agent&quot;,</span>{'\n'}
                      <span className="code-cyan">    &quot;action&quot;: &quot;data.export&quot;,</span>{'\n'}
                      <span className="text-white/70">    &quot;parameters&quot;: &#123; &quot;records&quot;: 500 &#125;,</span>{'\n'}
                      <span className="text-white/70">    &quot;context&quot;: &#123; &quot;user&quot;: &quot;analyst@acme.com&quot; &#125;</span>{'\n'}
                      <span className="text-white/70">  &#125;&#39;</span>{'\n'}
                      {'\n'}
                      <span className="code-comment"># Verdict: &#123; &quot;decision&quot;: &quot;APPROVE&quot;, &quot;risk&quot;: &quot;HIGH&quot; &#125;</span>{'\n'}
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
                  onClick={() => scrollToCard(index)}
                  className={`memorable-stack-card ${isForeground ? 'card-foreground' : ''}`}
                  style={{ cursor: isForeground ? 'default' : 'pointer' }}
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
              <button
                key={card.number}
                type="button"
                onClick={() => scrollToCard(idx)}
                className={`memorable-step-dot ${activeCardIndex === idx ? 'active' : ''}`}
                title={`Step ${card.number}: ${card.title.replace('\n', ' ')}`}
              >
                <span className="dot-label">{card.number}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
