'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Shield, Bot, Calendar, Mail, FileText, Lock, ScanSearch, Gauge, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface McpRequest {
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

const decisionColors = {
  ALLOW: { color: 'hsl(158 52% 48%)', glow: 'hsl(158 52% 48% / 0.4)' },
  APPROVE: { color: 'hsl(36 82% 56%)', glow: 'hsl(36 82% 56% / 0.4)' },
  BLOCK: { color: 'hsl(0 68% 56%)', glow: 'hsl(0 68% 56% / 0.4)' },
};

export function McpSecurityGraph() {
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
    particle.setAttribute('r', '4');
    particle.setAttribute('fill', color.color);
    particle.setAttribute('opacity', '0');
    particle.style.filter = `drop-shadow(0 0 6px ${color.glow})`;
    svg.appendChild(particle);

    // Path: agent -> gateway -> core (pause) -> tool
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
      tl.to(particle, { opacity: 1, duration: 0.2, attr: { cx: GATEWAY_X, cy: agent.y } });

      // Phase 2: gateway -> core
      tl.to(particle, { duration: 0.4, ease: 'power2.inOut', attr: { cx: CORE_X, cy: 200 } });

      // Phase 3: pause at core (analysis)
      tl.to(particle, { duration: 0.6, ease: 'power1.inOut', attr: { cx: SECURITY_X, cy: 200 } });
      tl.to(particle, { duration: 0.3, attr: { cx: CORE_X, cy: 200 } });

      // Phase 4: core -> tool
      tl.to(particle, { duration: 0.4, ease: 'power2.out', attr: { cx: TOOLS_X, cy: tool.y } });
      tl.to(particle, { opacity: 0, duration: 0.2 });
    }

    // Pulse core
    const coreCircle = svg.querySelector('#core-circle');
    if (coreCircle && !reducedMotion) {
      tl.to(coreCircle, {
        duration: 0.3,
        attr: { r: 36 },
        stroke: color.color,
        strokeWidth: 2,
      }, '<')
      .to(coreCircle, {
        duration: 0.5,
        attr: { r: 32 },
        strokeWidth: 1,
      });
    }

    // Pulse security layers
    if (!reducedMotion) {
      securityLayers.forEach((layer, i) => {
        const node = svg.querySelector(`#sec-${layer.id}`);
        if (node) {
          tl.to(node, {
            duration: 0.2,
            fill: color.color,
            fillOpacity: 0.15,
          }, `<${0.1 * i}`)
          .to(node, {
            duration: 0.3,
            fillOpacity: 0.05,
          });
        }
      });
    }

    setActiveRequest(req);
    setStreamRequests(prev => [req, ...prev].slice(0, 20));

    setTimeout(() => setActiveRequest(null), 2500);
  }, [reducedMotion]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let mounted = true;

    const loop = () => {
      if (!mounted) return;
      const req = generateRequest();
      const pid = particleId + 1;
      setParticleId(pid);
      animateRequest(req, pid);
      timeoutId = setTimeout(loop, 2500 + Math.random() * 2000);
    };

    timeoutId = setTimeout(loop, 1200);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [generateRequest, animateRequest, particleId]);

  const activeColor = activeRequest ? decisionColors[activeRequest.decision] : decisionColors.ALLOW;

  return (
    <div className="space-y-4">
      {/* Graph */}
      <div className="relative rounded-xl border border-border/40 surface-card overflow-hidden">
        <div className="absolute top-3 left-4 z-10 flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">MCP Security Graph</span>
          <span className="text-[10px] text-muted-foreground/30 font-mono">DEMO MODE</span>
        </div>
        <div className="absolute top-3 right-4 z-10 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-success" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          <span className="text-[10px] text-muted-foreground/50">Streaming</span>
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ minHeight: '320px' }}
        >
          {/* Connections — agent to gateway */}
          {agents.map((a) => (
            <path
              key={`ag-${a.id}`}
              d={`M ${AGENTS_X + 40} ${a.y} Q ${(AGENTS_X + GATEWAY_X) / 2} ${a.y} ${GATEWAY_X - 30} ${a.y}`}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.4"
            />
          ))}

          {/* Gateway to core */}
          {agents.map((a) => (
            <path
              key={`gc-${a.id}`}
              d={`M ${GATEWAY_X + 30} ${a.y} Q ${CORE_X} ${a.y} ${CORE_X - 32} 200`}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          {/* Core to security layers */}
          {securityLayers.map((s) => (
            <path
              key={`cs-${s.id}`}
              d={`M ${CORE_X + 32} 200 Q ${(CORE_X + SECURITY_X) / 2} ${(200 + s.y) / 2} ${SECURITY_X - 28} ${s.y}`}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          {/* Security back to core */}
          {securityLayers.map((s) => (
            <path
              key={`sc-${s.id}`}
              d={`M ${SECURITY_X - 28} ${s.y + 8} Q ${(CORE_X + SECURITY_X) / 2 + 20} ${(s.y + 200) / 2 + 20} ${CORE_X + 32} 208`}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.15"
            />
          ))}

          {/* Core to tools */}
          {tools.map((t) => (
            <path
              key={`ct-${t.id}`}
              d={`M ${CORE_X + 32} 200 Q ${(CORE_X + TOOLS_X) / 2} ${(200 + t.y) / 2} ${TOOLS_X - 30} ${t.y}`}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          {/* Agent nodes */}
          {agents.map((a) => (
            <g key={a.id} transform={`translate(${AGENTS_X - 40}, ${a.y - 14})`}>
              <rect width="80" height="28" rx="6" fill="hsl(var(--card) / 0.8)" stroke="hsl(var(--border) / 0.6)" strokeWidth="1" />
              <text x="40" y="18" textAnchor="middle" fill="hsl(var(--muted-foreground) / 0.7)" fontSize="10" fontFamily="var(--font-mono)">
                {a.label.length > 13 ? a.label.slice(0, 12) + '…' : a.label}
              </text>
            </g>
          ))}

          {/* Gateway node */}
          <g transform={`translate(${GATEWAY_X - 35}, 186)`}>
            <rect width="70" height="28" rx="6" fill="hsl(var(--card) / 0.8)" stroke="hsl(var(--info) / 0.3)" strokeWidth="1" />
            <text x="35" y="18" textAnchor="middle" fill="hsl(var(--info) / 0.8)" fontSize="10" fontWeight="600">
              MCP
            </text>
          </g>

          {/* Core — AgentGuard */}
          <g transform={`translate(${CORE_X}, 200)`}>
            <circle
              id="core-circle"
              r="32"
              fill="hsl(var(--card) / 0.6)"
              stroke="hsl(var(--primary) / 0.4)"
              strokeWidth="1"
            />
            <circle r="24" fill="none" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />
            <g transform="translate(-10, -10)">
              <foreignObject width="20" height="20">
                <Shield className="h-5 w-5 text-primary" strokeWidth={2} />
              </foreignObject>
            </g>
            <text y="44" textAnchor="middle" fill="hsl(var(--foreground) / 0.7)" fontSize="9" fontWeight="600">
              AgentGuard
            </text>
          </g>

          {/* Security layer nodes */}
          {securityLayers.map((s) => {
            const Icon = s.icon;
            return (
              <g key={s.id} transform={`translate(${SECURITY_X - 28}, ${s.y - 12})`}>
                <rect
                  id={`sec-${s.id}`}
                  width="56" height="24" rx="5"
                  fill="hsl(var(--primary) / 0.05)"
                  stroke="hsl(var(--border) / 0.5)"
                  strokeWidth="1"
                />
                <g transform="translate(6, 4)">
                  <foreignObject width="14" height="16">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground/50" />
                  </foreignObject>
                </g>
                <text x="36" y="16" textAnchor="middle" fill="hsl(var(--muted-foreground) / 0.5)" fontSize="8" fontWeight="600" fontFamily="var(--font-mono)">
                  {s.label}
                </text>
              </g>
            );
          })}

          {/* Tool nodes */}
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <g key={t.id} transform={`translate(${TOOLS_X - 30}, ${t.y - 14})`}>
                <rect width="60" height="28" rx="6" fill="hsl(var(--card) / 0.8)" stroke="hsl(var(--border) / 0.6)" strokeWidth="1" />
                <g transform="translate(6, 4)">
                  <foreignObject width="16" height="20">
                    <Icon className="h-4 w-4 text-muted-foreground/50" />
                  </foreignObject>
                </g>
                <text x="38" y="18" textAnchor="middle" fill="hsl(var(--muted-foreground) / 0.7)" fontSize="10" fontFamily="var(--font-mono)">
                  {t.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Active request overlay */}
        {activeRequest && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2.5 rounded-lg border border-border/50 bg-background/90 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-muted-foreground/50">{activeRequest.agent}</span>
            <span className="text-muted-foreground/30">→</span>
            <span className="text-[10px] font-mono text-muted-foreground/70">{activeRequest.tool}</span>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: activeColor.color }}
            >
              {activeRequest.decision}
            </span>
          </div>
        )}
      </div>

      {/* Live request stream */}
      <McpRequestStream requests={streamRequests} />
    </div>
  );
}

function McpRequestStream({ requests }: { requests: McpRequest[] }) {
  return (
    <div className="rounded-xl border border-border/40 surface-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-success" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          <h2 className="text-[13px] font-semibold">Live Requests</h2>
          <span className="text-[10px] text-muted-foreground/30 font-mono">DEMO</span>
        </div>
        <span className="text-[10px] text-muted-foreground/40 font-mono tabular-nums">{requests.length} events</span>
      </div>
      <div className="space-y-px">
        {requests.length === 0 && (
          <div className="py-8 text-center text-[12px] text-muted-foreground/30">Awaiting requests...</div>
        )}
        {requests.map((req) => {
          const color = decisionColors[req.decision];
          return (
            <div
              key={req.id}
              className="group flex items-center gap-3 rounded-md px-2.5 py-2 transition-colors hover:bg-foreground/[0.03] cursor-pointer"
            >
              <span className="text-[11px] font-mono text-muted-foreground/40 tabular-nums shrink-0 w-16">
                {req.timestamp}
              </span>
              <span className="text-[12px] text-muted-foreground/70 truncate shrink-0 w-28">
                {req.agent}
              </span>
              <span className="text-[12px] font-mono truncate flex-1 min-w-0">
                {req.tool}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: color.color }}
                />
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider w-14"
                  style={{ color: color.color }}
                >
                  {req.decision}
                </span>
              </div>
              <span className="text-[11px] font-mono font-semibold tabular-nums shrink-0 w-7 text-right"
                style={{
                  color: req.risk >= 80 ? 'hsl(0 68% 56%)' : req.risk >= 50 ? 'hsl(36 82% 56%)' : 'hsl(158 52% 48%)'
                }}
              >
                {req.risk}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
