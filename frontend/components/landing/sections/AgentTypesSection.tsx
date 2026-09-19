'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';
import { 
  Plus, 
  Minus, 
  Globe, 
  Monitor, 
  Mic, 
  Code2, 
  Server, 
  Network, 
  Lock 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AgentStep {
  num: string;
  label: string;
  actionTag: string;
}

interface AgentType {
  id: string;
  title: string;
  headline: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  previewUrl: string;
  previewType: 'browser' | 'desktop' | 'voice' | 'code' | 'api' | 'swarm';
  steps: AgentStep[];
}

const AGENT_TYPES: AgentType[] = [
  {
    id: 'browser-use',
    title: 'Browser use',
    headline: 'Browser Use',
    description:
      'Known segments of a site replay from the procedure. A layout change is detected and the agent falls back to reasoning.',
    icon: Globe,
    badge: 'RUNNING_SESSION',
    previewUrl: 'https://example.com/dashboard',
    previewType: 'browser',
    steps: [
      { num: '01', label: 'Open website: example.com', actionTag: 'OPEN_SITE' },
      { num: '02', label: "Click 'Sign In'", actionTag: 'CLICK_ID' },
      { num: '03', label: 'Fill credentials', actionTag: 'FILL_CREDENTIALS' },
      { num: '04', label: 'Navigate to dashboard', actionTag: 'NAV_DASHBOARD' },
      { num: '05', label: 'Extract data', actionTag: 'EXTRACT_DATA' },
      { num: '06', label: 'Save to file', actionTag: 'SAVE_FILE' },
    ],
  },
  {
    id: 'computer-use',
    title: 'Computer use',
    headline: 'Computer Use',
    description:
      'Screen steps stored as diffs. Targets named by meaning, not coordinates.',
    icon: Monitor,
    badge: 'RUNNING_DESKTOP',
    previewUrl: 'Desktop / Applications / Figma',
    previewType: 'desktop',
    steps: [
      { num: '01', label: 'Launch app: Figma Workspace', actionTag: 'LAUNCH_APP' },
      { num: '02', label: 'Locate artboard #04 by OCR', actionTag: 'LOCATE_TARGET' },
      { num: '03', label: 'Export high-res design assets', actionTag: 'EXPORT_PNG' },
      { num: '04', label: 'Open Slack client window', actionTag: 'FOCUS_WINDOW' },
      { num: '05', label: 'Post file to #releases channel', actionTag: 'ATTACH_FILE' },
      { num: '06', label: 'Confirm delivery receipt', actionTag: 'VERIFY_DELIVERY' },
    ],
  },
  {
    id: 'voice-agents',
    title: 'Voice agents',
    headline: 'Voice Routine',
    description:
      'Routines taught in past sessions come back whole. Sensitivity gates at delivery, so the agent can know things it never says.',
    icon: Mic,
    badge: 'VOICE_STREAM_LIVE',
    previewUrl: 'Opus 24kHz / RTP Stream',
    previewType: 'voice',
    steps: [
      { num: '01', label: 'Stream inbound microphone audio', actionTag: 'CONNECT_RTP' },
      { num: '02', label: 'Neural VAD & phoneme chunking', actionTag: 'SEGMENT_VAD' },
      { num: '03', label: 'Match caller intent to routine', actionTag: 'CACHE_LOOKUP' },
      { num: '04', label: 'Hydrate caller context in 0ms', actionTag: 'HYDRATE_STATE' },
      { num: '05', label: 'Synthesize low-latency response', actionTag: 'GENERATE_TTS' },
      { num: '06', label: 'Emit audio buffer to caller', actionTag: 'PLAYBACK_BUFFER' },
    ],
  },
  {
    id: 'coding-agents',
    title: 'Coding agents',
    headline: 'Coding Agent',
    description:
      'The fix is stored once. The second run skips the reading and lands directly in the modified file.',
    icon: Code2,
    badge: 'PATCH_APPLIED',
    previewUrl: 'repo://agentguard/src/auth.ts',
    previewType: 'code',
    steps: [
      { num: '01', label: 'Parse test error trace log', actionTag: 'PARSE_STACK' },
      { num: '02', label: 'Fetch procedure patch #029', actionTag: 'FETCH_PATCH' },
      { num: '03', label: 'Apply unified git diff', actionTag: 'APPLY_DIFF' },
      { num: '04', label: 'Execute targeted test suite', actionTag: 'RUN_TESTS' },
      { num: '05', label: 'Verify clean AST typecheck', actionTag: 'TYPECHECK' },
      { num: '06', label: 'Push verified commit branch', actionTag: 'GIT_PUSH' },
    ],
  },
  {
    id: 'other-custom',
    title: 'Other/custom/enterprise',
    headline: 'Enterprise Flow',
    description:
      'Internal tools and private APIs run from the same procedural graph. Connect any harness via one JSON trace.',
    icon: Server,
    badge: 'API_DISPATCH',
    previewUrl: 'https://internal.corp/api/v1/sync',
    previewType: 'api',
    steps: [
      { num: '01', label: 'Ingest inbound webhook event', actionTag: 'RECV_WEBHOOK' },
      { num: '02', label: 'Validate HMAC token signature', actionTag: 'AUTH_HMAC' },
      { num: '03', label: 'Query internal ERP database', actionTag: 'QUERY_DB' },
      { num: '04', label: 'Transform payload schema graph', actionTag: 'MAP_SCHEMA' },
      { num: '05', label: 'Trigger enterprise SAP sync', actionTag: 'DISPATCH_API' },
      { num: '06', label: 'Emit verified audit trace log', actionTag: 'WRITE_AUDIT' },
    ],
  },
  {
    id: 'multiagent',
    title: 'Multiagent Orchestration',
    headline: 'Swarm Orchestrator',
    description:
      'Shared procedural memory across agent swarms. One agent learns the sequence, all agents execute it.',
    icon: Network,
    badge: 'SWARM_CONSENSUS',
    previewUrl: 'Swarm Mesh / 6 Active Nodes',
    previewType: 'swarm',
    steps: [
      { num: '01', label: 'Leader decomposes high-level goal', actionTag: 'DECOMPOSE_TASK' },
      { num: '02', label: 'Assign sub-routine to Worker #1', actionTag: 'DELEGATE_WORKER' },
      { num: '03', label: 'Worker #2 queries vector index', actionTag: 'QUERY_MEMORY' },
      { num: '04', label: 'Synchronize shared memory state', actionTag: 'SYNC_STATE' },
      { num: '05', label: 'Aggregate multi-agent output', actionTag: 'MERGE_RESULTS' },
      { num: '06', label: 'Broadcast consensus complete', actionTag: 'EMIT_CONSENSUS' },
    ],
  },
];

export function AgentTypesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const windowContentRef = useRef<HTMLDivElement>(null);

  const [activeId, setActiveId] = useState<string>('browser-use');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [cardHovered, setCardHovered] = useState<boolean>(false);

  const activeAgent = AGENT_TYPES.find((a) => a.id === activeId) || AGENT_TYPES[0];

  // Auto-advance step indicator simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % 6);
    }, 2800);
    return () => clearInterval(timer);
  }, [activeId]);

  // Safe GSAP Animations that NEVER leave elements invisible
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Subtle smooth header entrance
      gsap.from('.agent-types-headline', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
      });

      // 2. Card subtle entrance
      if (cardRef.current) {
        gsap.from(cardRef.current, {
          scale: 0.96,
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // GSAP 3D perspective tilt on hover for right card
  useLayoutEffect(() => {
    const cardWrapper = cardWrapperRef.current;
    const card = cardRef.current;
    if (!cardWrapper || !card) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = cardWrapper.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      gsap.to(card, {
        rotateX: -y * 6,
        rotateY: x * 8,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1200,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    };

    cardWrapper.addEventListener('mousemove', handleMouseMove);
    cardWrapper.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cardWrapper.removeEventListener('mousemove', handleMouseMove);
      cardWrapper.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // GSAP animation when switching active agent item
  useEffect(() => {
    if (windowContentRef.current) {
      gsap.fromTo(
        windowContentRef.current,
        { opacity: 0.75, scale: 0.99 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [activeId]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black py-20 sm:py-28 lg:py-32 px-6 sm:px-8 lg:px-12 overflow-hidden border-t border-white/[0.06]"
    >
      {/* Ambient background atmosphere */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Heading, Subtitle & Accordion */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            <div className="agent-types-headline mb-8 sm:mb-10">
              <h2
                className="text-[38px] sm:text-[48px] lg:text-[54px] font-normal tracking-[-0.03em] text-white leading-[1.08] mb-4"
                style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
              >
                One Memory For<br />
                Every Agent Type
              </h2>
              <p className="text-[#888891] text-[15px] sm:text-[16px] leading-relaxed font-normal max-w-[460px]">
                For anyone running agents that do the same work more than once.
              </p>
            </div>

            {/* Accordion Box Matching User Image 2 */}
            <div className="w-full rounded-xl border border-white/[0.12] bg-[#0c0d14]/60 overflow-hidden divide-y divide-white/[0.08] shadow-2xl">
              {AGENT_TYPES.map((agent) => {
                const isOpen = activeId === agent.id;

                return (
                  <div
                    key={agent.id}
                    className={`transition-colors duration-200 ${
                      isOpen ? 'bg-[#12131b]' : 'bg-transparent hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Header Row */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(agent.id);
                        setActiveStepIndex(0);
                      }}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer group"
                    >
                      <span
                        className={`text-[17px] sm:text-[19px] font-medium tracking-[-0.01em] transition-colors duration-200 ${
                          isOpen ? 'text-white' : 'text-[#888891] group-hover:text-white'
                        }`}
                      >
                        {agent.title}
                      </span>

                      {/* Icon */}
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
                          isOpen ? 'text-white' : 'text-[#888891] group-hover:text-white'
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </span>
                    </button>

                    {/* Expandable Description */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key={`content-${agent.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-0">
                            <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-[#9a9aa3] font-normal max-w-[540px]">
                              {agent.description}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Signature Halftone Dusk Card with Live Lifecycle Monitor */}
          <div
            ref={cardWrapperRef}
            className="lg:col-span-6 w-full flex items-center justify-center relative perspective-[1200px]"
          >
            <div
              ref={cardRef}
              onMouseEnter={() => setCardHovered(true)}
              onMouseLeave={() => setCardHovered(false)}
              className="relative w-full min-h-[480px] sm:min-h-[520px] rounded-2xl overflow-hidden border border-white/[0.18] shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex items-center justify-center p-4 sm:p-7 md:p-8 transition-shadow duration-500 bg-[#07080d]"
            >
              {/* Layer 1: CanvasRevealEffect Underneath with All 3 Signature Colors (Always Visible) */}
              <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <CanvasRevealEffect
                  animationSpeed={cardHovered ? 4.2 : 2.2}
                  containerClassName="bg-[#07080d] absolute inset-0 w-full h-full"
                  colors={[
                    [139, 92, 246], // Deep Violet
                    [232, 121, 249], // Radiant Purple
                    [245, 158, 11],  // Warm Amber / Copper
                  ]}
                  dotSize={2.4}
                  showGradient={false}
                />
              </div>

              {/* Layer 2: Signature Dusk/Sunset Nebula Mesh Gradients (Always 100% Visible) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-[1] mix-blend-screen opacity-85">
                {/* Top deep violet/purple nebula */}
                <div
                  className="absolute -top-12 left-1/2 -translate-x-1/2 w-[540px] h-[440px] rounded-full blur-[65px] opacity-95 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(139, 92, 246, 0.85) 0%, rgba(99, 102, 241, 0.5) 45%, transparent 70%)',
                  }}
                />

                {/* Bottom glowing amber/copper sunset horizon */}
                <div
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[540px] h-[440px] rounded-full blur-[65px] opacity-95 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(245, 158, 11, 0.85) 0%, rgba(217, 119, 6, 0.5) 45%, transparent 70%)',
                  }}
                />

                {/* Center subtle cyan/blue tint */}
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.25) 0%, transparent 65%)',
                  }}
                />
              </div>

              {/* Layer 3: Fine Dithered Halftone Dot Matrix Texture */}
              <div
                className="absolute inset-0 pointer-events-none z-[2] opacity-45 mix-blend-overlay"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(255, 255, 255, 0.65) 0.85px, transparent 0.85px)',
                  backgroundSize: '3.2px 3.2px',
                }}
              />

              {/* Layer 4: Card Border Glow on Hover */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-white/35 transition-colors duration-500 pointer-events-none z-[3]" />

              {/* Foreground UI Window: Agent Lifecycle Monitor */}
              <div
                ref={windowContentRef}
                className="relative z-10 w-full max-w-[580px] rounded-xl bg-[#0b0c13]/95 border border-white/[0.14] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-4 sm:p-5 overflow-hidden"
              >
                {/* Top Status Header */}
                <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-white/[0.08]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f59e0b] font-semibold">
                        AGENT LIFECYCLE
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-normal text-white tracking-tight">
                      {activeAgent.headline}
                    </h3>
                  </div>

                  {/* Badges on Top Right */}
                  <div className="flex items-center gap-2">
                    {/* Session Status Pill */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-ping" />
                      <span className="font-mono text-[10px] text-[#f59e0b] font-medium tracking-wide">
                        {activeAgent.badge}
                      </span>
                    </div>

                    {/* Step Counter Pill */}
                    <div className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 font-mono text-[11px] text-white/80">
                      <span className="text-white font-medium">0{activeStepIndex + 1}</span>
                      <span className="text-white/40"> / 06</span>
                    </div>
                  </div>
                </div>

                {/* 3-Column Sub-Layout: Steps, Mockup, Actions */}
                <div className="grid grid-cols-12 gap-3 sm:gap-4 pt-4 items-stretch min-h-[240px] sm:min-h-[260px]">
                  
                  {/* Left Column: Numbered Step List (Col 4) */}
                  <div className="col-span-12 sm:col-span-4 flex flex-col justify-between space-y-1 font-mono text-[11px]">
                    {activeAgent.steps.map((step, idx) => {
                      const isActive = idx === activeStepIndex;
                      const isCompleted = idx < activeStepIndex;

                      return (
                        <button
                          key={step.num}
                          type="button"
                          onClick={() => setActiveStepIndex(idx)}
                          className={`text-left flex items-center gap-2 py-1.5 px-2 rounded-md transition-all duration-200 cursor-pointer ${
                            isActive
                              ? 'bg-white/[0.1] border border-white/20 text-white shadow-sm'
                              : 'text-white/40 hover:text-white/75 hover:bg-white/[0.03]'
                          }`}
                        >
                          <span
                            className={`text-[10px] ${
                              isActive ? 'text-[#f59e0b] font-bold' : isCompleted ? 'text-white/70' : 'text-white/30'
                            }`}
                          >
                            {step.num}
                          </span>
                          <span className="truncate text-[11px] font-sans">
                            {step.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Middle Column: Visual Mockup (Col 5) */}
                  <div className="col-span-12 sm:col-span-5 rounded-lg border border-white/[0.08] bg-[#07080c] p-3 flex flex-col overflow-hidden shadow-inner">
                    {/* Window Title Bar */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#ef4444]/80" />
                        <span className="w-2 h-2 rounded-full bg-[#f59e0b]/80" />
                        <span className="w-2 h-2 rounded-full bg-[#10b981]/80" />
                      </div>
                      <span className="font-mono text-[9px] text-white/40 truncate max-w-[100px]">
                        {activeAgent.previewType === 'browser' ? 'Browser' : activeAgent.previewType === 'code' ? 'Editor' : 'Runner'}
                      </span>
                    </div>

                    {/* URL / Path Bar */}
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/50 border border-white/[0.06] mb-2.5">
                      <Lock className="w-2.5 h-2.5 text-white/40 shrink-0" />
                      <span className="font-mono text-[9px] text-white/60 truncate">
                        {activeAgent.previewUrl}
                      </span>
                    </div>

                    {/* Viewport Content Area */}
                    <div className="flex-1 flex flex-col items-center justify-center p-2.5 text-center rounded bg-white/[0.01] border border-dashed border-white/[0.05]">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center mb-1.5 text-[#f59e0b]">
                        <activeAgent.icon className="w-4 h-4" />
                      </div>
                      <div className="text-[11.5px] font-medium text-white/90 mb-0.5">
                        {activeAgent.steps[activeStepIndex].label}
                      </div>
                      <div className="text-[9.5px] font-mono text-[#f59e0b]/90 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-ping" />
                        Executing procedure...
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Procedure Action Tags (Col 3) */}
                  <div className="col-span-12 sm:col-span-3 flex flex-col justify-between space-y-1 font-mono text-[10px]">
                    {activeAgent.steps.map((step, idx) => {
                      const isActive = idx === activeStepIndex;

                      return (
                        <div
                          key={`tag-${step.num}`}
                          className={`flex items-center gap-1.5 py-1 px-2 rounded transition-all duration-200 ${
                            isActive
                              ? 'text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/30'
                              : 'text-white/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isActive ? 'bg-[#f59e0b] animate-pulse' : 'bg-white/20'
                            }`}
                          />
                          <span className="truncate tracking-wider uppercase text-[9px]">
                            {step.actionTag}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
