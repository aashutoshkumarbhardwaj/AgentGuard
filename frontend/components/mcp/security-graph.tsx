'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Shield, Bot, Calendar, Mail, FileText, Lock, ScanSearch, Gauge, FileCheck, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LiquidBentoCard } from './liquid-bento-card';

export interface McpRequest {
  id: string;
  agent: string;
  tool: string;
  decision: 'ALLOW' | 'APPROVE' | 'BLOCK';
  risk: number;
  timestamp: string;
}

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'agent' | 'gateway' | 'core' | 'security' | 'tool';
  icon: typeof Shield;
}

const agents = [
  { id: 'research-agent', label: 'research-agent', y: 80 },
  { id: 'support-agent', label: 'support-agent', y: 200 },
  { id: 'external-agent', label: 'external-agent', y: 320 },
];

const tools = [
  { id: 'calendar', label: 'calendar', icon: Calendar, y: 80 },
  { id: 'email', label: 'email', icon: Mail, y: 200 },
  { id: 'file', label: 'file', icon: FileText, y: 320 },
];

const securityLayers = [
  { id: 'policy', label: 'POLICY', icon: FileCheck, y: 100 },
  { id: 'risk', label: 'RISK', icon: Gauge, y: 200 },
  { id: 'threat', label: 'THREAT', icon: ScanSearch, y: 300 },
];

const W = 720;
const H = 400;
const GATEWAY_X = 230;
const CORE_X = 360;
const SECURITY_X = 480;
const TOOLS_X = 600;
const AGENTS_X = 100;

export const decisionColors = {
  ALLOW: { color: 'hsl(158 64% 52%)', glow: 'hsl(158 64% 52% / 0.5)', hex: '#10b981' },
  APPROVE: { color: 'hsl(38 92% 56%)', glow: 'hsl(38 92% 56% / 0.5)', hex: '#f59e0b' },
  BLOCK: { color: 'hsl(0 78% 60%)', glow: 'hsl(0 78% 60% / 0.5)', hex: '#ef4444' },
};

interface McpSecurityGraphProps {
  layout?: 'bento' | 'stacked';
}

export function McpSecurityGraph({ layout = 'bento' }: McpSecurityGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeRequest, setActiveRequest] = useState<McpRequest | null>(null);
  const [streamRequests, setStreamRequests] = useState<McpRequest[]>([]);
  const [particleId, setParticleId] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  const generateRequest = useCallback((): McpRequest => {
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const tool = tools[Math.floor(Math.random() * tools.length)];
    const decisions: ('ALLOW' | 'APPROVE' | 'BLOCK')[] = ['ALLOW', 'ALLOW', 'ALLOW', 'APPROVE', 'BLOCK'];
    const decision = decisions[Math.floor(Math.random() * decisions.length)];
    const risk = decision === 'BLOCK' ? 80 + Math.floor(Math.random() * 20)
      : decision === 'APPROVE' ? 55 + Math.floor(Math.random() * 25)
      : 5 + Math.floor(Math.random() * 30);
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    return {
      id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      agent: agent.label,
      tool: `${tool.label}.${['read', 'send', 'modify'][Math.floor(Math.random() * 3)]}`,
      decision,
      risk,
      timestamp: ts,
    };
  }, []);

  const animateRequest = useCallback((req: McpRequest, pid: number) => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const color = decisionColors[req.decision];

    const agent = agents.find(a => a.label === req.agent) || agents[0];
    const toolBase = req.tool.split('.')[0];
    const tool = tools.find(t => t.id === toolBase) || tools[0];

    // Create particle element
    const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    particle.setAttribute('r', '5');
    particle.setAttribute('fill', color.hex);
    particle.setAttribute('opacity', '0');
    particle.style.filter = `drop-shadow(0 0 8px ${color.glow})`;
    svg.appendChild(particle);

    // Timeline for packet trajectory
    const tl = gsap.timeline({
      onComplete: () => {
        particle.remove();
      },
    });

    if (reducedMotion) {
      gsap.set(particle, { opacity: 1, attr: { cx: AGENTS_X, cy: agent.y } });
      tl.to(particle, { duration: 0.3, attr: { cx: TOOLS_X, cy: tool.y } });
    } else {
      // Phase 1: agent -> gateway
      tl.set(particle, { opacity: 0, attr: { cx: AGENTS_X, cy: agent.y } });
      tl.to(particle, { opacity: 1, duration: 0.25, attr: { cx: GATEWAY_X, cy: agent.y } });

      // Phase 2: gateway -> core
      tl.to(particle, { duration: 0.45, ease: 'power2.inOut', attr: { cx: CORE_X, cy: 200 } });

      // Phase 3: pause at core (analysis / policy / risk / threat)
      tl.to(particle, { duration: 0.5, ease: 'power1.inOut', attr: { cx: SECURITY_X, cy: 200 } });
      tl.to(particle, { duration: 0.25, attr: { cx: CORE_X, cy: 200 } });

      // Phase 4: core -> tool
      tl.to(particle, { duration: 0.45, ease: 'power2.out', attr: { cx: TOOLS_X, cy: tool.y } });
      tl.to(particle, { opacity: 0, duration: 0.25 });
    }

    // Pulse core
    const coreCircle = svg.querySelector('#core-circle');
    if (coreCircle && !reducedMotion) {
      tl.to(coreCircle, {
        duration: 0.3,
        attr: { r: 38 },
        stroke: color.hex,
        strokeWidth: 2.5,
      }, '<')
      .to(coreCircle, {
        duration: 0.5,
        attr: { r: 32 },
        strokeWidth: 1.5,
      });
    }

    // Pulse security layers
    if (!reducedMotion) {
      securityLayers.forEach((layer, i) => {
        const node = svg.querySelector(`#sec-${layer.id}`);
        if (node) {
          tl.to(node, {
            duration: 0.2,
            fill: color.hex,
            fillOpacity: 0.2,
          }, `<${0.08 * i}`)
          .to(node, {
            duration: 0.35,
            fillOpacity: 0.05,
          });
        }
      });
    }

    setActiveRequest(req);
    setStreamRequests(prev => [req, ...prev].slice(0, 20));

    setTimeout(() => setActiveRequest(null), 2400);
  }, [reducedMotion]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let mounted = true;

    // Seed initial mock requests if empty
    if (streamRequests.length === 0) {
      const initial: McpRequest[] = [
        { id: 'init-1', agent: 'support-agent', tool: 'email.send', decision: 'BLOCK', risk: 94, timestamp: '14:05:22' },
        { id: 'init-2', agent: 'support-agent', tool: 'file.send', decision: 'APPROVE', risk: 65, timestamp: '14:05:21' },
        { id: 'init-3', agent: 'external-agent', tool: 'file.send', decision: 'ALLOW', risk: 5, timestamp: '14:05:20' },
        { id: 'init-4', agent: 'research-agent', tool: 'email.read', decision: 'BLOCK', risk: 94, timestamp: '14:05:18' },
        { id: 'init-5', agent: 'support-agent', tool: 'email.modify', decision: 'APPROVE', risk: 76, timestamp: '14:05:16' },
        { id: 'init-6', agent: 'external-agent', tool: 'file.send', decision: 'ALLOW', risk: 21, timestamp: '14:05:15' },
        { id: 'init-7', agent: 'research-agent', tool: 'calendar.send', decision: 'ALLOW', risk: 22, timestamp: '14:05:14' },
        { id: 'init-8', agent: 'research-agent', tool: 'calendar.modify', decision: 'BLOCK', risk: 94, timestamp: '14:05:13' },
        { id: 'init-9', agent: 'external-agent', tool: 'file.modify', decision: 'ALLOW', risk: 25, timestamp: '14:05:11' },
        { id: 'init-10', agent: 'external-agent', tool: 'calendar.send', decision: 'ALLOW', risk: 30, timestamp: '14:05:10' },
        { id: 'init-11', agent: 'external-agent', tool: 'calendar.modify', decision: 'BLOCK', risk: 99, timestamp: '14:05:09' },
        { id: 'init-12', agent: 'research-agent', tool: 'file.read', decision: 'ALLOW', risk: 25, timestamp: '14:05:08' },
      ];
      setStreamRequests(initial);
    }

    const loop = () => {
      if (!mounted) return;
      const req = generateRequest();
      const pid = particleId + 1;
      setParticleId(pid);
      animateRequest(req, pid);
      timeoutId = setTimeout(loop, 2200 + Math.random() * 1800);
    };

    timeoutId = setTimeout(loop, 1200);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [generateRequest, animateRequest, particleId, streamRequests.length]);

  const activeColor = activeRequest ? decisionColors[activeRequest.decision] : decisionColors.ALLOW;

  // Render SVG Graph canvas
  const renderSvgGraph = () => (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 pb-0 z-10">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-white/50">
            MCP Security Graph
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-white/40">
            DEMO MODE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] font-medium text-emerald-400/90 font-mono">Streaming</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full flex-1 flex items-center justify-center p-2 sm:p-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto max-h-[380px]"
          style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))' }}
        >
          <defs>
            <linearGradient id="core-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="wire-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="50%" stopColor="rgba(56,189,248,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
            </linearGradient>
          </defs>

          {/* Connections — agent to gateway */}
          {agents.map((a) => (
            <path
              key={`ag-${a.id}`}
              d={`M ${AGENTS_X + 40} ${a.y} Q ${(AGENTS_X + GATEWAY_X) / 2} ${a.y} ${GATEWAY_X - 35} ${a.y}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
          ))}

          {/* Gateway to core */}
          {agents.map((a) => (
            <path
              key={`gc-${a.id}`}
              d={`M ${GATEWAY_X + 35} ${a.y} Q ${CORE_X} ${a.y} ${CORE_X - 32} 200`}
              fill="none"
              stroke="rgba(56, 189, 248, 0.2)"
              strokeWidth="1.2"
            />
          ))}

          {/* Core to security layers */}
          {securityLayers.map((s) => (
            <path
              key={`cs-${s.id}`}
              d={`M ${CORE_X + 32} 200 Q ${(CORE_X + SECURITY_X) / 2} ${(200 + s.y) / 2} ${SECURITY_X - 30} ${s.y}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1.2"
            />
          ))}

          {/* Security back to core */}
          {securityLayers.map((s) => (
            <path
              key={`sc-${s.id}`}
              d={`M ${SECURITY_X - 30} ${s.y + 8} Q ${(CORE_X + SECURITY_X) / 2 + 20} ${(s.y + 200) / 2 + 20} ${CORE_X + 32} 208`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          ))}

          {/* Core to tools */}
          {tools.map((t) => (
            <path
              key={`ct-${t.id}`}
              d={`M ${CORE_X + 32} 200 Q ${(CORE_X + TOOLS_X) / 2} ${(200 + t.y) / 2} ${TOOLS_X - 30} ${t.y}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1.2"
            />
          ))}

          {/* Agent nodes */}
          {agents.map((a) => (
            <g key={a.id} transform={`translate(${AGENTS_X - 45}, ${a.y - 15})`} className="cursor-pointer">
              <rect
                width="90"
                height="30"
                rx="8"
                fill="rgba(10, 12, 18, 0.9)"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
              <text
                x="45"
                y="19"
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.75)"
                fontSize="11"
                fontFamily="var(--font-mono)"
                fontWeight="500"
              >
                {a.label.length > 13 ? a.label.slice(0, 12) + '…' : a.label}
              </text>
            </g>
          ))}

          {/* Gateway node */}
          <g transform={`translate(${GATEWAY_X - 35}, 185)`} className="cursor-pointer">
            <rect
              width="70"
              height="30"
              rx="8"
              fill="rgba(14, 25, 45, 0.9)"
              stroke="rgba(56, 189, 248, 0.4)"
              strokeWidth="1.2"
            />
            <text
              x="35"
              y="19"
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="11"
              fontWeight="700"
              fontFamily="var(--font-mono)"
              letterSpacing="0.05em"
            >
              MCP
            </text>
          </g>

          {/* Core — AgentGuard */}
          <g transform={`translate(${CORE_X}, 200)`} className="cursor-pointer">
            {/* Ambient animated ripple */}
            <circle
              r="46"
              fill="none"
              stroke="rgba(16, 185, 129, 0.15)"
              strokeWidth="1"
              className="animate-pulse"
            />
            <circle
              id="core-circle"
              r="34"
              fill="rgba(8, 12, 20, 0.95)"
              stroke="#10b981"
              strokeWidth="1.5"
              style={{ filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.35))' }}
            />
            <circle r="26" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" />
            <g transform="translate(-11, -11)">
              <foreignObject width="22" height="22">
                <Shield className="h-5 w-5 text-emerald-400" strokeWidth={2.2} />
              </foreignObject>
            </g>
            <text
              y="48"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="10"
              fontWeight="600"
              letterSpacing="0.02em"
            >
              AgentGuard
            </text>
          </g>

          {/* Security layer nodes */}
          {securityLayers.map((s) => {
            const Icon = s.icon;
            return (
              <g key={s.id} transform={`translate(${SECURITY_X - 32}, ${s.y - 13})`} className="cursor-pointer">
                <rect
                  id={`sec-${s.id}`}
                  width="64"
                  height="26"
                  rx="6"
                  fill="rgba(10, 15, 25, 0.9)"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                />
                <g transform="translate(6, 5)">
                  <foreignObject width="16" height="16">
                    <Icon className="h-3.5 w-3.5 text-zinc-400" />
                  </foreignObject>
                </g>
                <text
                  x="41"
                  y="17"
                  textAnchor="middle"
                  fill="rgba(255, 255, 255, 0.7)"
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.05em"
                >
                  {s.label}
                </text>
              </g>
            );
          })}

          {/* Tool nodes */}
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <g key={t.id} transform={`translate(${TOOLS_X - 32}, ${t.y - 15})`} className="cursor-pointer">
                <rect
                  width="68"
                  height="30"
                  rx="8"
                  fill="rgba(10, 12, 18, 0.9)"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                />
                <g transform="translate(7, 5)">
                  <foreignObject width="18" height="18">
                    <Icon className="h-4 w-4 text-zinc-400" />
                  </foreignObject>
                </g>
                <text
                  x="44"
                  y="19"
                  textAnchor="middle"
                  fill="rgba(255, 255, 255, 0.75)"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                >
                  {t.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Active request overlay badge */}
      <div className="p-4 pt-0 z-10 flex justify-center">
        {activeRequest ? (
          <div
            className="flex items-center gap-3 rounded-xl border px-3.5 py-1.5 backdrop-blur-md shadow-xl transition-all duration-300"
            style={{
              borderColor: `${activeColor.hex}40`,
              background: 'rgba(10, 12, 20, 0.85)',
              boxShadow: `0 0 20px ${activeColor.glow}`,
            }}
          >
            <span className="text-[11px] font-mono text-white/50">{activeRequest.agent}</span>
            <span className="text-white/30 font-mono">→</span>
            <span className="text-[11px] font-mono text-white/80 font-medium">{activeRequest.tool}</span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                color: activeColor.hex,
                background: `${activeColor.hex}18`,
              }}
            >
              {activeRequest.decision}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/30 py-1.5">
            <Radio className="w-3 h-3 text-emerald-400/60 animate-pulse" />
            <span>Listening for AI agent tool invocations...</span>
          </div>
        )}
      </div>
    </div>
  );

  // Render Live Requests Stream
  const renderRequestStream = () => (
    <div className="flex flex-col h-full p-5">
      <div className="flex items-center justify-between pb-3.5 mb-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <h2 className="text-[13px] font-semibold text-white tracking-tight">Live Requests</h2>
          <span className="text-[9px] text-white/40 font-mono px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/5">
            DEMO
          </span>
        </div>
        <span className="text-[11px] text-white/40 font-mono tabular-nums">{streamRequests.length} events</span>
      </div>

      <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[360px] pr-1 select-none">
        {streamRequests.length === 0 ? (
          <div className="py-12 text-center text-[12px] text-white/30 font-mono">
            Awaiting intercepted requests...
          </div>
        ) : (
          streamRequests.map((req) => {
            const isBlock = req.decision === 'BLOCK';
            const isApprove = req.decision === 'APPROVE';
            return (
              <div
                key={req.id}
                className="group flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 transition-all duration-200 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.03] hover:border-white/[0.09]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] font-mono text-white/35 tabular-nums shrink-0">
                    {req.timestamp}
                  </span>
                  <span className="text-[11px] text-white/60 truncate shrink-0 max-w-[85px] font-mono">
                    {req.agent}
                  </span>
                  <span className="text-[11px] font-mono text-white/80 truncate">
                    {req.tool}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={cn(
                      'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9.5px] font-semibold tracking-wider uppercase border',
                      isBlock
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : isApprove
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    )}
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        isBlock ? 'bg-rose-400' : isApprove ? 'bg-amber-400' : 'bg-emerald-400'
                      )}
                    />
                    <span>{req.decision}</span>
                  </div>
                  <span
                    className={cn(
                      'text-[11px] font-mono font-bold tabular-nums w-6 text-right',
                      req.risk >= 80 ? 'text-rose-400' : req.risk >= 50 ? 'text-amber-400' : 'text-emerald-400'
                    )}
                  >
                    {req.risk}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  if (layout === 'bento') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Main Bento Card: Security Graph (8 cols) */}
        <LiquidBentoCard
          className="lg:col-span-8 p-0 min-h-[420px] flex flex-col justify-between"
          glowColor="rgba(56, 189, 248, 0.08)"
        >
          {renderSvgGraph()}
        </LiquidBentoCard>

        {/* Side Bento Card: Live Requests Stream (4 cols) */}
        <LiquidBentoCard
          className="lg:col-span-4 p-0 min-h-[420px] flex flex-col justify-between"
          glowColor="rgba(16, 185, 129, 0.08)"
        >
          {renderRequestStream()}
        </LiquidBentoCard>
      </div>
    );
  }

  // Fallback stacked view
  return (
    <div className="space-y-4">
      <div className="relative rounded-xl border border-border/40 surface-card overflow-hidden">
        {renderSvgGraph()}
      </div>
      <div className="rounded-xl border border-border/40 surface-card">
        {renderRequestStream()}
      </div>
    </div>
  );
}

export function McpRequestStream({ requests }: { requests: McpRequest[] }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#08090e]/85 backdrop-blur-2xl p-4">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <h2 className="text-[13px] font-semibold text-white">Live Requests</h2>
          <span className="text-[10px] text-white/40 font-mono">DEMO</span>
        </div>
        <span className="text-[10px] text-white/40 font-mono tabular-nums">{requests.length} events</span>
      </div>
      <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between gap-2 rounded px-2.5 py-1.5 text-[11px] font-mono bg-white/[0.02] hover:bg-white/[0.05]"
          >
            <span className="text-white/40 tabular-nums">{req.timestamp}</span>
            <span className="text-white/60 truncate max-w-[90px]">{req.agent}</span>
            <span className="text-white/90 truncate flex-1">{req.tool}</span>
            <span
              className={cn(
                'font-semibold uppercase text-[10px]',
                req.decision === 'BLOCK' ? 'text-rose-400' : req.decision === 'APPROVE' ? 'text-amber-400' : 'text-emerald-400'
              )}
            >
              {req.decision}
            </span>
            <span className="font-bold tabular-nums text-white/80">{req.risk}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
