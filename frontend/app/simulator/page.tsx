'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
  Swords, Play, RotateCcw, Check, X, AlertTriangle, Shield,
  Fingerprint, Lock, ScanSearch, Gauge, FileText, Ban, ChevronRight, Activity,
} from 'lucide-react';
import { attackScenarios } from '@/lib/mock-data';
import { executeAgentAction, type SecurityDecision } from '@/lib/api';
import { DecisionBadge } from '@/components/dashboard/decision-badge';
import { RiskGauge } from '@/components/dashboard/risk-gauge';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { cn } from '@/lib/utils';

const stepIcons = [Fingerprint, Lock, ScanSearch, Gauge, FileText];
const stepResultConfig = {
  verified: { icon: Check, color: 'text-success', bg: 'bg-success/10 border-success/30', label: 'Verified' },
  blocked: { icon: X, color: 'text-danger', bg: 'bg-danger/10 border-danger/30', label: 'Blocked' },
  threat: { icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10 border-danger/30', label: 'Threat' },
  critical: { icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10 border-danger/30', label: 'Critical' },
  high: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10 border-warning/30', label: 'High' },
  deny: { icon: Ban, color: 'text-danger', bg: 'bg-danger/10 border-danger/30', label: 'Denied' },
  clear: { icon: Check, color: 'text-success', bg: 'bg-success/10 border-success/30', label: 'Clear' },
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

    // Call live backend in parallel
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

  // GSAP particle animation along pipeline
  useEffect(() => {
    if (!running || !pipelineRef.current || !particleRef.current) return;

    const steps = pipelineRef.current.querySelectorAll('[data-step]');
    if (steps.length === 0) return;

    const tl = gsap.timeline();
    const particle = particleRef.current;

    steps.forEach((step, i) => {
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
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between pt-2"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Swords className="h-4 w-4 text-danger" strokeWidth={2.2} />
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">Attack Simulator</span>
          </div>
          <h1 className="text-[26px] font-bold tracking-tight-tightest leading-tight">Test AgentGuard's defenses</h1>
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        {/* Attack selection */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Choose an attack
          </p>
          {attackScenarios.map((attack) => (
            <motion.button
              key={attack.id}
              whileHover={{ x: 2 }}
              onClick={() => {
                setSelectedAttack(attack);
                reset();
              }}
              className={cn(
                'group w-full text-left rounded-lg border p-3.5 transition-colors',
                selectedAttack.id === attack.id
                  ? 'border-danger/40 bg-danger/10'
                  : 'border-border/40 bg-muted/10 hover:border-border/70'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Swords className={cn(
                    'h-4 w-4',
                    selectedAttack.id === attack.id ? 'text-danger' : 'text-muted-foreground/60'
                  )} />
                  <span className={cn(
                    'text-[13px] font-medium',
                    selectedAttack.id === attack.id ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {attack.name}
                  </span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-foreground transition-colors" />
              </div>
              <p className="text-[11px] text-muted-foreground/60 mt-2 line-clamp-2">{attack.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Simulator panel */}
        <div className="space-y-4">
          {/* Malicious input */}
          <div className="rounded-xl border border-border/40 surface-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                Malicious Input
              </p>
              <span className="text-[10px] font-mono text-muted-foreground/30">{selectedAttack.agentId}</span>
            </div>
            <div className="rounded-lg border border-danger/20 bg-danger/[0.04] p-3.5">
              <pre className="text-[13px] font-mono whitespace-pre-wrap text-muted-foreground/80">{selectedAttack.input}</pre>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <HoverBorderGradient
                as="button"
                containerClassName="rounded-xl"
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-[13px] font-semibold transition-colors',
                  running
                    ? 'bg-muted/40 text-muted-foreground cursor-not-allowed'
                    : 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.35)]'
                )}
                highlight="radial-gradient(75% 181% at 50% 50%, #f43f5e 0%, rgba(255, 255, 255, 0) 100%)"
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
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" /> Run Attack
                  </>
                )}
              </HoverBorderGradient>
              {(completed || running) && (
                <HoverBorderGradient
                  as="button"
                  containerClassName="rounded-xl"
                  className="flex items-center gap-2 px-3.5 py-2 text-[13px] bg-[#090b12] text-muted-foreground hover:text-foreground transition-colors"
                  highlight="radial-gradient(75% 181% at 50% 50%, #38bdf8 0%, rgba(255, 255, 255, 0) 100%)"
                  onClick={reset}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </HoverBorderGradient>
              )}
            </div>
          </div>

          {/* Pipeline */}
          <AnimatePresence>
            {(running || completed || activeStep >= 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border border-border/40 surface-card p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                    AgentGuard Pipeline
                  </p>
                  {evaluating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="text-[10px] font-mono text-primary"
                      >
                        evaluating...
                      </motion.span>
                    </motion.div>
                  )}
                </div>

                <div ref={pipelineRef} className="relative space-y-1">
                  {/* Animated particle */}
                  {running && (
                    <div
                      ref={particleRef}
                      className="absolute left-5 w-2 h-2 rounded-full bg-danger opacity-0 z-10 pointer-events-none"
                      style={{
                        filter: 'drop-shadow(0 0 6px hsl(0 68% 56% / 0.6))',
                        top: 0,
                      }}
                    />
                  )}

                  {/* Request entry */}
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/20 border border-border/40">
                      <Shield className="h-4 w-4 text-muted-foreground/60" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium">Tool Request</p>
                      <p className="text-[11px] font-mono text-muted-foreground/50">
                        {selectedAttack.agentId} → {selectedAttack.action}
                      </p>
                    </div>
                  </div>

                  {/* Pipeline steps */}
                  {selectedAttack.steps.map((step, i) => {
                    const Icon = stepIcons[i] || Shield;
                    const resultConfig = stepResultConfig[step.result as keyof typeof stepResultConfig];
                    const ResultIcon = resultConfig.icon;
                    const isActive = activeStep === i;
                    const isDone = activeStep > i || completed;

                    return (
                      <div key={i} data-step={i}>
                        {/* Connector */}
                        <div className="flex items-center justify-center">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: isDone || isActive ? '20px' : '14px', opacity: 1 }}
                            className={cn(
                              'w-px',
                              isDone ? 'bg-success/30' : isActive ? 'bg-primary/40' : 'bg-border/50'
                            )}
                          >
                            {isActive && !isDone && (
                              <motion.div
                                animate={{ y: [0, 14, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity }}
                                className="w-px h-2 bg-primary"
                              />
                            )}
                          </motion.div>
                        </div>

                        {/* Step */}
                        <motion.div
                          data-step={i}
                          initial={{ opacity: 0.3 }}
                          animate={{
                            opacity: isDone || isActive ? 1 : 0.3,
                            scale: isActive ? 1.01 : 1,
                          }}
                          className={cn(
                            'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                            isActive || isDone ? resultConfig.bg : 'border-border/40 bg-muted/5'
                          )}
                        >
                          <div className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                            isDone || isActive ? resultConfig.bg : 'bg-muted/20'
                          )}>
                            <Icon className={cn('h-4 w-4', isDone || isActive ? resultConfig.color : 'text-muted-foreground/50')} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-[13px] font-medium',
                              isDone || isActive ? 'text-foreground' : 'text-muted-foreground/50'
                            )}>
                              {step.label}
                            </p>
                            <AnimatePresence>
                              {(isDone || isActive) && (
                                <motion.p
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={cn('text-[11px] mt-0.5', resultConfig.color)}
                                >
                                  {step.detail}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                          <AnimatePresence>
                            {(isDone || isActive) && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={cn(
                                  'flex items-center gap-1.5 rounded-md border px-2 py-1 text-[9px] font-semibold uppercase tracking-wider',
                                  resultConfig.bg,
                                  resultConfig.color
                                )}
                              >
                                <ResultIcon className="h-2.5 w-2.5" />
                                {resultConfig.label}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    );
                  })}

                  {/* Final decision */}
                  <div className="flex items-center justify-center">
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: completed ? '20px' : '14px', opacity: 1 }}
                      className={cn(
                        'w-px',
                        completed
                          ? (liveResult?.decision || selectedAttack.finalDecision) === 'ALLOW'
                            ? 'bg-success/30'
                            : (liveResult?.decision || selectedAttack.finalDecision) === 'APPROVE'
                            ? 'bg-warning/30'
                            : 'bg-danger/30'
                          : 'bg-border/50'
                      )}
                    />
                  </div>
                  <AnimatePresence>
                    {completed && (() => {
                      const dec = liveResult?.decision || selectedAttack.finalDecision;
                      const isAllowed = dec === 'ALLOW';
                      const isApprove = dec === 'APPROVE';

                      return (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className={cn(
                            'flex items-center justify-center gap-3 rounded-xl border p-4',
                            isAllowed
                              ? 'border-success/40 bg-success/10'
                              : isApprove
                              ? 'border-warning/40 bg-warning/10'
                              : 'border-danger/40 bg-danger/10'
                          )}
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                          >
                            {isAllowed ? (
                              <Check className="h-5 w-5 text-success" />
                            ) : isApprove ? (
                              <AlertTriangle className="h-5 w-5 text-warning" />
                            ) : (
                              <Ban className="h-5 w-5 text-danger" />
                            )}
                          </motion.div>
                          <div className="text-center">
                            <p className={cn(
                              'text-[18px] font-bold uppercase tracking-wider',
                              isAllowed ? 'text-success' : isApprove ? 'text-warning' : 'text-danger'
                            )}>
                              {isAllowed ? 'Allowed' : isApprove ? 'Approval Required' : 'Blocked'}
                            </p>
                            <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                              {isAllowed
                                ? 'Safe operation — tool executed'
                                : isApprove
                                ? 'Escalated to human supervisor — tool not yet executed'
                                : 'Action stopped — tool NEVER executed'}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Risk summary */}
          <AnimatePresence>
            {completed && (() => {
              const dec = liveResult?.decision || selectedAttack.finalDecision;
              const score = liveResult?.risk_score ?? selectedAttack.riskScore;
              const level = (liveResult?.risk_level || selectedAttack.riskLevel) as any;
              const executionStatus = liveResult?.status || (dec === 'ALLOW' ? 'EXECUTED' : dec === 'APPROVE' ? 'PENDING' : 'BLOCKED');
              const bedrockSignal = liveResult?.bedrock;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  <div className="rounded-xl border border-border/40 surface-card p-4">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-3">Risk Assessment</p>
                    <RiskGauge score={score} level={level} />
                  </div>
                  <div className="rounded-xl border border-border/40 surface-card p-4">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-3">Final Decision</p>
                    <div className="flex items-center gap-3">
                      <DecisionBadge decision={dec} size="lg" />
                    </div>
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-muted-foreground/60">Execution</span>
                        <span className={cn(
                          'font-mono text-[11px]',
                          dec === 'ALLOW' ? 'text-success' : 'text-danger'
                        )}>
                          {dec === 'ALLOW' ? 'EXECUTED' : 'NEVER EXECUTED'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-muted-foreground/60">Bedrock Signal</span>
                        <span className="font-mono text-muted-foreground text-[11px]">
                          {bedrockSignal?.prompt_attack_detected ? 'ATTACK' : bedrockSignal?.sensitive_information_detected ? 'PII' : 'PASS'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-muted-foreground/60">Audit Event</span>
                        <span className="font-mono text-success text-[11px]">Recorded</span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-muted-foreground/60">Hash Chain</span>
                        <span className="font-mono text-success text-[11px]">Updated</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
