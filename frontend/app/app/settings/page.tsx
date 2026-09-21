'use client';

import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Server,
  Network,
  Database,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Cpu,
  Sparkles,
  Play,
  Loader2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import {
  fetchHealth,
  HealthResponse,
  fetchDecisionStatus,
  evaluateDecisionTest,
  updateDecisionKeys,
  clearDecisionKey,
  DecisionStatusResponse,
  DecisionEngineTelemetry,
} from '@/lib/api';
import { cn } from '@/lib/utils';

export default function LocalConsoleSettings() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [decisionStatus, setDecisionStatus] = useState<DecisionStatusResponse | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testingEngine, setTestingEngine] = useState(false);
  const [testResult, setTestResult] = useState<DecisionEngineTelemetry | null>(null);

  // API Key Configuration State
  const [typesafeKeyInput, setTypesafeKeyInput] = useState('');
  const [openjevKeyInput, setOpenjevKeyInput] = useState('');
  const [savingKeys, setSavingKeys] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth().then(setHealth);
    fetchDecisionStatus().then(setDecisionStatus);
  }, []);

  const handleSaveKeys = async () => {
    setSavingKeys(true);
    setSaveMessage(null);
    try {
      const payload: any = {};
      if (typesafeKeyInput.trim()) payload.typesafe_api_key = typesafeKeyInput.trim();
      if (openjevKeyInput.trim()) payload.openjev_api_key = openjevKeyInput.trim();

      const res = await updateDecisionKeys(payload);
      if (res.decision_status) {
        setDecisionStatus(res.decision_status);
      } else {
        const refreshed = await fetchDecisionStatus();
        setDecisionStatus(refreshed);
      }
      setSaveMessage('✓ Keys saved and active immediately.');
      setTypesafeKeyInput('');
      setOpenjevKeyInput('');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage(`Error saving keys: ${err.message || 'Network error'}`);
    } finally {
      setSavingKeys(false);
    }
  };

  const handleClearKey = async (provider: 'typesafe' | 'openjev') => {
    try {
      const res = await clearDecisionKey(provider);
      if (res.decision_status) {
        setDecisionStatus(res.decision_status);
      } else {
        const refreshed = await fetchDecisionStatus();
        setDecisionStatus(refreshed);
      }
      setSaveMessage(`✓ ${provider === 'typesafe' ? 'TypeSafe' : 'OpenJev'} key cleared.`);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch {
      // Ignore
    }
  };

  const runDecisionTest = async () => {
    setTestingEngine(true);
    setTestResult(null);
    try {
      const res = await evaluateDecisionTest({
        tool: 'create_item',
        action: 'modify',
        risk_score: 70,
        risk_level: 'HIGH',
      });
      setTestResult(res);
    } catch {
      // Ignore
    } finally {
      setTestingEngine(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const runtimeSettings = [
    {
      key: 'api',
      label: 'REST API Endpoint',
      value: 'http://localhost:8000',
      sub: 'Local API server binding with health and management routes',
      icon: Server,
    },
    {
      key: 'mcp_gateway',
      label: 'Universal MCP Gateway',
      value: 'http://localhost:8000/mcp',
      sub: 'Streamable HTTP MCP endpoint for client connections (Claude, Cursor)',
      icon: Network,
    },
    {
      key: 'config_path',
      label: 'MCP Server Config Path',
      value: 'mcp_servers.json',
      sub: 'Local persistent registry storage (supports environment variable substitution)',
      icon: FileCode,
    },
    {
      key: 'db_path',
      label: 'Security & Audit Database',
      value: 'agentguard.db (SQLite)',
      sub: 'Local ledger containing agent registrations, permissions, and hash-chain audit trail',
      icon: Database,
    },
  ];

  const engineComponents = [
    { name: 'Cedar Authorization Engine', status: 'Active', desc: 'Deterministic policy evaluation' },
    { name: 'Risk Scoring Engine', status: 'Active', desc: 'Real-time 0-100 severity calculation' },
    { name: 'Threat Mitigation Layer', status: 'Active', desc: 'Heuristic and vector injection detection' },
    { name: 'Cryptographic Audit Trail', status: 'Verified', desc: 'SHA-256 genesis-anchored hash chain' },
  ];

  return (
    <div className="relative w-full space-y-8 pb-16 font-memorable select-none">
      {/* Header */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              System Configuration // Local Environment
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Runtime Settings
          </h1>
          <p className="text-[13.5px] text-zinc-400 mt-1">
            Inspecting local network bindings, service configurations, and security engine telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-[#0a0c10]/90 text-xs font-mono text-zinc-300">
          <span className="text-zinc-500">AgentGuard</span>
          <span className="text-emerald-400 font-bold">v{health?.version || '1.0.0'}</span>
        </div>
      </div>

      {/* Network & Service Bindings */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider text-zinc-400">
          Service Endpoints &amp; File Paths
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {runtimeSettings.map((item) => {
            const Icon = item.icon;
            const isCopied = copiedKey === item.key;
            return (
              <CardSpotlight
                key={item.key}
                className="p-5 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-semibold text-white">{item.label}</span>
                    </div>

                    <button
                      onClick={() => copyToClipboard(item.value, item.key)}
                      className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded border border-white/[0.06] bg-white/[0.02]"
                    >
                      {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="mt-4 p-2.5 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-xs text-sky-300">
                    {item.value}
                  </div>
                </div>

                <p className="text-[11.5px] text-zinc-500 mt-3">{item.sub}</p>
              </CardSpotlight>
            );
          })}
        </div>
      </div>

      {/* Decision Intelligence Architecture */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider text-zinc-400">
            Decision Intelligence Architecture
          </h2>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <span className="text-[11px] font-mono text-sky-400 uppercase font-bold">
              System One Active
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0c10]/95 p-6 space-y-6">
          {/* Provider Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Primary */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10.5px] font-mono text-zinc-500 uppercase font-semibold">1. Primary Provider</span>
                  <span className={cn(
                    'text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold',
                    decisionStatus?.primary.configured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                  )}>
                    {decisionStatus?.primary.configured ? 'Configured' : 'No Key (Fallback Ready)'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">TypeSafe Jev</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Early-access System One probabilistic decision model with typed choices and confidence distribution.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-mono text-sky-400 border-t border-white/[0.04]">
                Model: {decisionStatus?.primary.model || 'jev-latest'}
              </div>
            </div>

            {/* 2. Fallback */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10.5px] font-mono text-zinc-500 uppercase font-semibold">2. Fallback Provider</span>
                  <span className={cn(
                    'text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold',
                    decisionStatus?.fallback.configured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                  )}>
                    {decisionStatus?.fallback.configured ? 'Configured' : 'No Key (Failsafe Ready)'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">OpenJev (Jev-compatible)</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Wire-compatible System One fallback endpoint (Codiv / openjev). Automatically invoked on primary timeout or error.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-mono text-sky-400 border-t border-white/[0.04]">
                Model: {decisionStatus?.fallback.model || 'openjev-latest'}
              </div>
            </div>

            {/* 3. Fail-Safe */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.03] space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10.5px] font-mono text-emerald-400 uppercase font-semibold">3. Fail-Safe Provider</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                    Always Active
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">Deterministic Rules</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Zero-latency offline rules fail-safe. If AI credits or networks are unavailable, decisions safely evaluate without failing open.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-mono text-emerald-400 border-t border-emerald-500/10">
                Policy: Cedar + Permissions Root of Trust
              </div>
            </div>
          </div>

          {/* Key Configuration Inputs */}
          <div className="p-5 rounded-xl border border-sky-500/20 bg-gradient-to-b from-[#0e121a] to-[#080a0e] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-sky-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Configure Decision API Keys
                </h3>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono">
                Stored locally in SQLite — Zero telemetry transmission
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              Add any of the two API keys below to activate live System One probabilistic AI decisions. If neither key is provided, AgentGuard automatically and safely uses the built-in Deterministic Fail-Safe.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* TypeSafe Key */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-white">TypeSafe Jev API Key</label>
                  {decisionStatus?.primary.configured ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {decisionStatus.primary.maskedKey || 'Configured'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleClearKey('typesafe')}
                        className="text-[10px] text-zinc-400 hover:text-rose-400 cursor-pointer transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-zinc-500 font-mono">Not configured</span>
                  )}
                </div>
                <input
                  type="password"
                  value={typesafeKeyInput}
                  onChange={(e) => setTypesafeKeyInput(e.target.value)}
                  placeholder={decisionStatus?.primary.configured ? 'Enter new key to update...' : 'sk-typesafe-...'}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              {/* OpenJev Key */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-white">OpenJev / Codiv API Key</label>
                  {decisionStatus?.fallback.configured ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {decisionStatus.fallback.maskedKey || 'Configured'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleClearKey('openjev')}
                        className="text-[10px] text-zinc-400 hover:text-rose-400 cursor-pointer transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-zinc-500 font-mono">Not configured</span>
                  )}
                </div>
                <input
                  type="password"
                  value={openjevKeyInput}
                  onChange={(e) => setOpenjevKeyInput(e.target.value)}
                  placeholder={decisionStatus?.fallback.configured ? 'Enter new key to update...' : 'openjev-...'}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            {/* Save Button & Feedback Message */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-xs text-emerald-400 font-medium">
                {saveMessage}
              </span>
              <button
                type="button"
                onClick={handleSaveKeys}
                disabled={savingKeys || (!typesafeKeyInput.trim() && !openjevKeyInput.trim())}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingKeys && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Save API Keys</span>
              </button>
            </div>
          </div>

          {/* Thresholds & Security Policies */}
          <div className="p-4 rounded-xl border border-white/[0.06] bg-black/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-zinc-500 block text-[10.5px]">ALLOW Threshold</span>
              <span className="text-white font-semibold text-sm">≥ {decisionStatus?.allow_threshold ?? 0.85}</span>
              <p className="text-[10.5px] text-zinc-400 mt-0.5">Uncertainty below 0.85 escalates to APPROVE</p>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10.5px]">Disagreement Escalation</span>
              <span className="text-amber-400 font-semibold text-sm">Human Approval Required</span>
              <p className="text-[10.5px] text-zinc-400 mt-0.5">High provider variance pauses execution</p>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10.5px]">Hard Security Boundary</span>
              <span className="text-rose-400 font-semibold text-sm">Cedar Absolute Authority</span>
              <p className="text-[10.5px] text-zinc-400 mt-0.5">AI can never override hard security policy</p>
            </div>
          </div>

          {/* Test Decision Engine Action */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/[0.06]">
            <div>
              <h4 className="text-xs font-semibold text-white">Test Decision Engine Pipeline</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Simulate a high-risk tool call through the primary → fallback → failsafe provider chain.
              </p>
            </div>

            <button
              onClick={runDecisionTest}
              disabled={testingEngine}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-black shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {testingEngine ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Test Decision Engine</span>
                </>
              )}
            </button>
          </div>

          {/* Test Output if available */}
          {testResult && (
            <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/[0.04] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5 font-mono">
                  <Sparkles className="h-3.5 w-3.5" />
                  Test Result: {testResult.decision}
                </span>
                <span className="text-[10.5px] font-mono text-zinc-400">
                  Latency: {testResult.latency_ms} ms | Provider: {testResult.provider}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-emerald-400 block text-[10px]">ALLOW</span>
                  <span>{Math.round((testResult.probabilities?.ALLOW ?? 0) * 100)}%</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-amber-400 block text-[10px]">APPROVE</span>
                  <span>{Math.round((testResult.probabilities?.APPROVE ?? 0) * 100)}%</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-rose-400 block text-[10px]">BLOCK</span>
                  <span>{Math.round((testResult.probabilities?.BLOCK ?? 0) * 100)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Core Security Engine Components */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider text-zinc-400">
          Security Engine Subsystems
        </h2>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0c10]/95 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {engineComponents.map((comp) => (
              <div key={comp.name} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10.5px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      {comp.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-xs mt-2.5">{comp.name}</h3>
                </div>
                <p className="text-[11px] text-zinc-500 mt-2">{comp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy and Secrets Guarantee Notice */}
      <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/[0.03] flex items-start gap-3">
        <Lock className="h-4 w-4 text-sky-400 mt-0.5 shrink-0" />
        <div className="text-xs">
          <span className="font-semibold text-white block">Zero Secret Exposure Principle</span>
          <p className="text-zinc-400 mt-0.5">
            AgentGuard stores sensitive API keys and tokens in system environment variables or resolved references only.
            Neither the local dashboard nor the REST API metadata returns decrypted secret values.
          </p>
        </div>
      </div>
    </div>
  );
}
