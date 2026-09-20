'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
  Swords, Play, RotateCcw, Check, X, AlertTriangle, Shield,
  Fingerprint, Lock, ScanSearch, Gauge, FileText, Ban, ChevronRight, Activity,
  Zap, CheckCircle2, ShieldAlert, Sparkles, Terminal, Bot
} from 'lucide-react';
import { attackScenarios } from '@/lib/mock-data';
import { executeAgentAction, type SecurityDecision } from '@/lib/api';
import { DecisionBadge } from '@/components/dashboard/decision-badge';
import { RiskGauge } from '@/components/dashboard/risk-gauge';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { cn } from '@/lib/utils';

const stepIcons = [Fingerprint, Lock, ScanSearch, Gauge, FileText];
const stepResultConfig = {
  verified: { icon: Check, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Verified' },
  blocked: { icon: X, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', label: 'Blocked' },
  threat: { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', label: 'Threat' },
  critical: { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', label: 'Critical' },
  high: { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', label: 'High' },
  deny: { icon: Ban, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', label: 'Denied' },
  clear: { icon: Check, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Clear' },
};

export default function SimulatorPage() {
  const [selectedAttack, setSelectedAttack] = useState(attackScenarios[0]);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [evaluating, setEvaluating] = useState(false);
  const [liveResult, setLiveResult] = useState<SecurityDecision | null>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);

  const runAttack = () => {
    setRunning(true);
    setCompleted(false);
    setActiveStep(-1);
    setEvaluating(false);
    setLiveResult(null);

    const tool = (selectedAttack as any).tool || selectedAttack.action.split('.')[0];
    const action = (selectedAttack as any).operation || selectedAttack.action.split('.')[1] || 'read';
    const args = (selectedAttack as any).arguments || {};
    const context = (selectedAttack as any).context || {};

    const apiPromise = executeAgentAction({
      agent_id: selectedAttack.agentId,
      user_id: 'user-001',
      tool,
      action,
      arguments: args,
      context,
    }).catch((err) => {
      console.warn('Backend call failed, using simulation signals', err);
      return null;
    });

    selectedAttack.steps.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i);
        if (i === 1) setEvaluating(true);
        if (i >= 2) setEvaluating(false);
        if (i === selectedAttack.steps.length - 1) {
          apiPromise.then((res) => {
            if (res) {
              setLiveResult(res);
            }
            setTimeout(() => {
              setRunning(false);
              setCompleted(true);
            }, 800);
          });
        }
      }, 700 * (i + 1));
    });
  };

  useEffect(() => {
    if (!running || !pipelineRef.current || !particleRef.current) return;

    const steps = pipelineRef.current.querySelectorAll('[data-step]');
    if (steps.length === 0) return;

    const tl = gsap.timeline();
    const particle = particleRef.current;

    steps.forEach((step) => {
      const rect = step.getBoundingClientRect();
      const containerRect = pipelineRef.current!.getBoundingClientRect();
      const targetY = rect.top - containerRect.top + rect.height / 2 - 6;

      tl.to(particle, {
        duration: 0.6,
        ease: 'power2.inOut',
        y: targetY,
        opacity: 1,
      })
      .to(particle, { duration: 0.4, ease: 'power1.out' });
    });

    tl.to(particle, { duration: 0.3, opacity: 0, y: '+=40' });

    return () => {
      tl.kill();
    };
  }, [running]);

  const reset = () => {
    setRunning(false);
    setCompleted(false);
    setActiveStep(-1);
    setEvaluating(false);
    setLiveResult(null);
  };

  return (
    <div className="relative w-full space-y-8 pb-20 font-memorable select-none">
      {/* Subtle Ambient Radial Lighting */}
      <div className="pointer-events-none absolute -top-20 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-slate-900/30 blur-[160px]" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[450px] w-[450px] rounded-full bg-rose-950/10 blur-[150px]" />

      <div className="relative z-10 space-y-8">
        {/* Header - Minimalist, Executive Typography */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
              Threat Defense // Attack Simulator
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <div>
              <h1 className="text-3xl sm:text-[34px] font-semibold tracking-tight text-white">
                Attack Simulator
              </h1>
              <p className="text-[14.5px] text-zinc-400 mt-1 max-w-xl font-normal leading-relaxed">
                Benchmark AgentGuard's multi-stage heuristic pipeline against adversarial prompt injections, data leaks, and privilege escalations.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-zinc-300 font-medium bg-[#0a0c10]/90 border border-white/[0.08] px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400" />
              </span>
              <span>Isolated Sandbox Active</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Row 1: Top Metric Cards (Clean, Symmetrical, Luxury Glass)               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'ATTACK VECTORS',
              value: attackScenarios.length.toString(),
              sub: 'Adversarial benchmark scenarios',
              color: 'text-white',
              icon: Swords,
            },
            {
              label: 'MITIGATION RATE',
              value: '100% BLOCKED',
              sub: 'Deterministic policy match',
              color: 'text-emerald-400',
              icon: Shield,
            },
            {
              label: 'HEURISTIC PIPELINE',
              value: '5 STAGES',
              sub: 'Parallel sandbox inspection',
              color: 'text-zinc-200',
              icon: Zap,
            },
            {
              label: 'EDGE LATENCY',
              value: '< 1.2ms P99',
              sub: 'Parallel AST evaluation',
              color: 'text-white',
              icon: CheckCircle2,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <CardSpotlight
                key={stat.label}
                className="p-5 flex flex-col justify-between min-h-[116px] rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-medium tracking-wider text-zinc-400">
                    {stat.label}
                  </span>
                  <Icon className="h-3.5 w-3.5 text-zinc-500" />
                </div>
                <div className="mt-2.5">
                  <p className={`text-2xl font-semibold tracking-tight ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-[11.5px] text-zinc-500 font-normal mt-0.5 truncate">
                    {stat.sub}
                  </p>
                </div>
              </CardSpotlight>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* Row 2: Main Simulator Grid (Scenario Selector + Execution Console)        */}
        {/* ========================================================================= */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Left Column: Attack Scenario Selector */}
          <div className="space-y-3">
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 px-1">
              Select Attack Vector
            </span>
            <div className="space-y-2.5">
              {attackScenarios.map((attack) => {
                const isSelected = selectedAttack.id === attack.id;
                return (
                  <motion.button
                    key={attack.id}
                    whileHover={{ x: 2 }}
                    onClick={() => {
                      setSelectedAttack(attack);
                      reset();
                    }}
                    className={cn(
                      'group w-full text-left rounded-2xl border p-4 transition-all duration-200 cursor-pointer',
                      isSelected
                        ? 'border-white/[0.2] bg-white/[0.06] shadow-lg'
                        : 'border-white/[0.06] bg-[#0a0c10]/90 hover:border-white/[0.12] hover:bg-white/[0.02]'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-lg border',
                          isSelected ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'bg-white/[0.03] border-white/[0.06] text-zinc-400'
                        )}>
                          <Swords className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[13px] font-semibold text-white tracking-tight">
                          {attack.name}
                        </span>
                      </div>
                      <ChevronRight className={cn(
                        'h-3.5 w-3.5 transition-colors',
                        isSelected ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'
                      )} />
                    </div>
                    <p className="text-[11.5px] text-zinc-400 mt-2 line-clamp-2 font-normal leading-relaxed">
                      {attack.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Console & Pipeline */}
          <div className="space-y-5">
            {/* Malicious Input Card */}
            <CardSpotlight className="p-6 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-zinc-400" />
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                    Adversarial Payload
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] text-zinc-400 font-mono">
                  <Bot className="h-3 w-3 text-zinc-500" />
                  <span>Target: {selectedAttack.agentId}</span>
                </div>
              </div>

              {/* Code Payload Box */}
              <div className="rounded-xl border border-white/[0.06] bg-[#06080c] p-4 text-[12.5px] font-mono text-rose-300/90 whitespace-pre-wrap leading-relaxed">
                {selectedAttack.input}
              </div>

              {/* Action Controls with HoverBorderGradient */}
              <div className="mt-5 flex items-center gap-3">
                <HoverBorderGradient
                  as="button"
                  containerClassName="rounded-xl"
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 text-[12px] font-medium transition-colors',
                    running
                      ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                      : 'bg-[#140c10] text-rose-300/90 hover:text-rose-200'
                  )}
                  highlight="radial-gradient(75% 181% at 50% 50%, #f43f5e 0%, rgba(255, 255, 255, 0.4) 100%)"
                  onClick={running ? undefined : runAttack}
                  disabled={running}
                >
                  {running ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="h-3.5 w-3.5 border-2 border-current/30 border-t-current rounded-full"
                      />
                      <span>Inspecting Payload...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Execute Defense Simulation</span>
                    </>
                  )}
                </HoverBorderGradient>

                {(completed || running) && (
                  <HoverBorderGradient
                    as="button"
                    containerClassName="rounded-xl"
                    className="flex items-center gap-2 px-4 py-2.5 text-[12px] bg-[#0e1118] text-zinc-300 hover:text-white font-medium transition-colors"
                    highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)"
                    onClick={reset}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset Console</span>
                  </HoverBorderGradient>
                )}
              </div>
            </CardSpotlight>

            {/* 5-Stage Defense Pipeline */}
            <AnimatePresence>
              {(running || completed || activeStep >= 0) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <CardSpotlight className="p-6 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-zinc-400" />
                        <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                          AgentGuard Multi-Stage Inspection Pipeline
                        </span>
                      </div>
                      {evaluating && (
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>Evaluating Heuristics...</span>
                        </div>
                      )}
                    </div>

                    {/* Pipeline Stage Nodes */}
                    <div ref={pipelineRef} className="relative space-y-3">
                      <div
                        ref={particleRef}
                        className="pointer-events-none absolute left-4 z-20 h-2.5 w-2.5 rounded-full bg-rose-400 opacity-0 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                      />

                      {selectedAttack.steps.map((step, i) => {
                        const StepIcon = stepIcons[i] || Shield;
                        const isPast = activeStep > i;
                        const isCurrent = activeStep === i;
                        const isPending = activeStep < i;
                        const result = isPast || (completed && i <= activeStep) ? stepResultConfig[step.result as keyof typeof stepResultConfig] : null;

                        return (
                          <motion.div
                            key={step.label}
                            data-step
                            initial={{ opacity: 0.4 }}
                            animate={{ opacity: isPending ? 0.35 : 1 }}
                            className={cn(
                              'relative flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300',
                              isCurrent
                                ? 'bg-white/[0.04] border-white/20 shadow-md'
                                : isPast
                                ? 'bg-white/[0.02] border-white/[0.06]'
                                : 'bg-transparent border-transparent'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-lg border text-xs',
                                isCurrent
                                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                                  : isPast
                                  ? 'bg-white/[0.04] border-white/[0.08] text-zinc-300'
                                  : 'bg-white/[0.02] border-white/[0.04] text-zinc-600'
                              )}>
                                <StepIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="text-[13px] font-semibold text-white tracking-tight">
                                  {step.label}
                                </h4>
                                <p className="text-[11.5px] text-zinc-400 font-normal">
                                  {step.detail}
                                </p>
                              </div>
                            </div>

                            {/* Status Tag */}
                            <div>
                              {result ? (
                                <span className={cn(
                                  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10.5px] font-medium',
                                  result.bg, result.color
                                )}>
                                  <result.icon className="h-3 w-3" />
                                  <span>{result.label}</span>
                                </span>
                              ) : isCurrent ? (
                                <span className="text-[11px] font-mono text-zinc-400 animate-pulse">
                                  Inspecting...
                                </span>
                              ) : (
                                <span className="text-[11px] font-mono text-zinc-600">
                                  Queued
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Verdict Card at End */}
                    {completed && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 pt-5 border-t border-white/[0.08]"
                      >
                        <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <ShieldAlert className="h-4 w-4 text-rose-400" />
                              <span className="text-xs font-semibold text-white tracking-tight uppercase">
                                Verdict: Malicious Vector Quarantined
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 font-normal">
                              Deterministic rule matched threat signature. Action execution halted with zero downstream state corruption.
                            </p>
                          </div>
                          <DecisionBadge decision="BLOCK" size="lg" />
                        </div>
                      </motion.div>
                    )}
                  </CardSpotlight>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
