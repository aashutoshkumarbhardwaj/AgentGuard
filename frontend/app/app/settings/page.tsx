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
} from 'lucide-react';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { fetchHealth, HealthResponse } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function LocalConsoleSettings() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth().then(setHealth);
  }, []);

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
