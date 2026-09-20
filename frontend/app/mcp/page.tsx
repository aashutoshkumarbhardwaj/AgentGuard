'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  Shield, Github, Star, Sparkles, Activity, Layers, Terminal, ArrowRight,
  Zap, CheckCircle2, Bot, Wrench, ShieldAlert, Check, Plus, RefreshCw,
  Trash2, ExternalLink, Copy, AlertTriangle, Radio, Server, ChevronRight,
  Info, Cpu, Lock, Eye, X, Loader2
} from 'lucide-react';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import {
  fetchMcpServers,
  addMcpServer,
  removeMcpServer,
  reconnectMcpServer,
  fetchMcpTools,
  fetchAuditLogs,
  McpServer,
  McpTool
} from '@/lib/api';
import { cn } from '@/lib/utils';
import { GatewayArchitecture } from '@/components/mcp/gateway-architecture';

export default function McpPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [servers, setServers] = useState<McpServer[]>([]);
  const [tools, setTools] = useState<McpTool[]>([]);
  const [recentAudit, setRecentAudit] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [reconnectingId, setReconnectingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Add Server Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addId, setAddId] = useState('');
  const [addTransport, setAddTransport] = useState<'stdio' | 'streamable-http'>('stdio');
  const [addCommand, setAddCommand] = useState('npx');
  const [addArgs, setAddArgs] = useState('-y @modelcontextprotocol/server-filesystem /tmp');
  const [addUrl, setAddUrl] = useState('http://localhost:3001/mcp');
  const [addEnv, setAddEnv] = useState('');
  const [connectionStage, setConnectionStage] = useState<number | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client Config Tab
  const [activeClientTab, setActiveClientTab] = useState<'generic' | 'claude' | 'cursor' | 'python'>('generic');

  // Load servers, tools, and recent events
  const loadData = async () => {
    try {
      const [serverList, toolList, auditLogs] = await Promise.all([
        fetchMcpServers(),
        fetchMcpTools(),
        fetchAuditLogs(),
      ]);
      setServers(serverList);
      setTools(toolList);
      setRecentAudit(auditLogs.slice(0, 6));
    } catch (err) {
      console.error('Error loading MCP data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 5000);
    return () => clearInterval(timer);
  }, []);

  // GSAP entrance stagger animation on mount
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bento-item',
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.6,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleReconnect = async (id: string) => {
    setReconnectingId(id);
    try {
      await reconnectMcpServer(id);
      await loadData();
    } catch (err) {
      console.error('Reconnect failed:', err);
    } finally {
      setReconnectingId(null);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm(`Are you sure you want to remove MCP server '${id}'?`)) return;
    setRemovingId(id);
    try {
      await removeMcpServer(id);
      await loadData();
      if (selectedServerId === id) setSelectedServerId(null);
    } catch (err) {
      console.error('Remove failed:', err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addId.trim()) return;

    setIsSubmitting(true);
    setConnectionError(null);

    // Progressive visual steps
    setConnectionStage(1); // Connecting...
    await new Promise((r) => setTimeout(r, 400));

    setConnectionStage(2); // MCP Handshake...
    await new Promise((r) => setTimeout(r, 400));

    setConnectionStage(3); // Discovering tools...
    await new Promise((r) => setTimeout(r, 400));

    setConnectionStage(4); // Applying AgentGuard security boundary...

    // Parse env variables
    const envObj: Record<string, string> = {};
    if (addEnv.trim()) {
      addEnv.split('\n').forEach((line) => {
        const [k, ...v] = line.split('=');
        if (k && v.length) envObj[k.trim()] = v.join('=').trim();
      });
    }

    const payload = {
      id: addId.trim().toLowerCase(),
      name: addName.trim() || addId.trim(),
      transport: addTransport,
      command: addTransport === 'stdio' ? addCommand.trim() : undefined,
      args:
        addTransport === 'stdio'
          ? addArgs.trim()
            ? addArgs.trim().split(/\s+/)
            : []
          : undefined,
      url: addTransport === 'streamable-http' ? addUrl.trim() : undefined,
      env: envObj,
    };

    const res = await addMcpServer(payload);

    if (res.error) {
      setConnectionStage(null);
      setConnectionError(res.error);
      setIsSubmitting(false);
    } else {
      setConnectionStage(5); // Connected
      await new Promise((r) => setTimeout(r, 600));
      await loadData();
      setIsSubmitting(false);
      setShowAddModal(false);
      setConnectionStage(null);
      // Reset form
      setAddId('');
      setAddName('');
      setAddArgs('');
      setAddEnv('');
    }
  };

  const filteredTools = selectedServerId
    ? tools.filter((t) => t.server === selectedServerId)
    : tools;

  const connectedCount = servers.filter((s) => s.connected).length;
  const totalToolsCount = tools.length;
  const threatCount = recentAudit.filter(
    (e) => e.decision === 'BLOCK' || e.decision === 'APPROVE'
  ).length;

  return (
    <div ref={containerRef} className="relative w-full min-h-screen pb-20 select-none font-memorable">
      {/* Ambient Lighting */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-slate-900/30 blur-[160px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[450px] w-[500px] rounded-full bg-emerald-950/10 blur-[150px]" />

      <div className="relative z-10 space-y-8">
        {/* ========================================================================= */}
        {/* Header Section                                                            */}
        {/* ========================================================================= */}
        <div className="bento-item pt-2 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
                Protocol Security // Local MCP Gateway
              </span>
            </div>
            <h1 className="text-3xl sm:text-[34px] font-semibold tracking-tight text-white">
              MCP Gateway &amp; Registry
            </h1>
            <p className="text-[14.5px] text-zinc-400 mt-1 max-w-xl font-normal leading-relaxed">
              Zero-trust security proxy for Model Context Protocol. AI clients connect to AgentGuard, which inspects and governs every tool call before upstream execution.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Gateway Endpoint Badge */}
            <button
              onClick={() => copyToClipboard('http://localhost:8000/mcp', 'gateway')}
              className="flex items-center gap-2 text-[12px] text-zinc-300 font-mono bg-[#0a0c10]/90 border border-white/[0.08] hover:border-emerald-500/40 px-3.5 py-2 rounded-xl backdrop-blur-md transition-all group"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>http://localhost:8000/mcp</span>
              <Copy className="h-3 w-3 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              {copiedText === 'gateway' && (
                <span className="text-[10px] text-emerald-400 font-sans">Copied!</span>
              )}
            </button>

            {/* Add Server Button */}
            <HoverBorderGradient
              as="button"
              containerClassName="rounded-xl"
              className="flex items-center gap-2 px-4 py-2 text-[12.5px] font-medium bg-[#0a0c10] text-white hover:text-emerald-300 transition-colors"
              highlight="radial-gradient(75% 181% at 50% 50%, #10b981 0%, rgba(255, 255, 255, 0) 100%)"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-3.5 w-3.5 text-emerald-400" />
              <span>+ Add MCP Server</span>
            </HoverBorderGradient>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Stat Cards Row                                                            */}
        {/* ========================================================================= */}
        <div className="bento-item grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'CONNECTED MCP SERVERS',
              value: `${connectedCount} / ${servers.length}`,
              sub: `${connectedCount} active upstream sessions`,
              color: 'text-white',
              icon: Server,
            },
            {
              label: 'DISCOVERED TOOLS',
              value: totalToolsCount.toString(),
              sub: 'Dynamic tools registered',
              color: 'text-emerald-400',
              icon: Wrench,
            },
            {
              label: 'SECURITY INSPECTIONS',
              value: `${recentAudit.length} Recent`,
              sub: 'Deterministic evaluation',
              color: 'text-white',
              icon: Zap,
            },
            {
              label: 'CONTAINED THREATS',
              value: threatCount.toString(),
              sub: 'Zero-trust mitigations',
              color: threatCount > 0 ? 'text-amber-400' : 'text-emerald-400',
              icon: ShieldAlert,
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
        {/* MCP SERVERS Registry Grid                                                 */}
        {/* ========================================================================= */}
        <div className="bento-item space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="text-[10.5px] font-medium uppercase tracking-wider text-zinc-500">
                01
              </span>
              <span className="text-zinc-600 text-xs">•</span>
              <h2 className="text-[15px] font-semibold text-white tracking-tight">
                Upstream MCP Servers
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {servers.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#0a0c10]/95 border border-dashed border-white/10 text-center flex flex-col items-center justify-center">
              <Server className="h-8 w-8 text-zinc-600 mb-3" />
              <h3 className="text-sm font-semibold text-white">No MCP Servers Connected</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                Add an upstream MCP server (stdio or Streamable HTTP). AgentGuard will discover its tools and enforce runtime security boundaries.
              </p>
              <HoverBorderGradient
                as="button"
                containerClassName="rounded-xl mt-4"
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium bg-[#0a0c10] text-white"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="h-3.5 w-3.5 text-emerald-400" />
                <span>Connect First MCP Server</span>
              </HoverBorderGradient>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {servers.map((server) => {
                const isSelected = selectedServerId === server.id;
                return (
                  <CardSpotlight
                    key={server.id}
                    className={cn(
                      'p-5 flex flex-col justify-between rounded-2xl bg-[#0a0c10]/95 border transition-all duration-300',
                      isSelected
                        ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                        : 'border-white/[0.08] hover:border-white/[0.18]'
                    )}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-white tracking-tight">
                              {server.name}
                            </h3>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-zinc-400">
                              {server.transport}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-zinc-500 mt-0.5">
                            id: {server.id}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={cn(
                            'flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border',
                            server.connected
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                          )}
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              server.connected ? 'bg-emerald-400' : 'bg-rose-400'
                            )}
                          />
                          <span>{server.connected ? 'Connected' : 'Disconnected'}</span>
                        </div>
                      </div>

                      {/* Tool & Command Details */}
                      <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Discovered Tools</span>
                          <span className="font-semibold text-white font-mono">
                            {server.tools} {server.tools === 1 ? 'tool' : 'tools'}
                          </span>
                        </div>

                        {server.command && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500">Command</span>
                            <span className="font-mono text-zinc-300 text-[11px] truncate max-w-[180px]">
                              {server.command} {server.args?.join(' ')}
                            </span>
                          </div>
                        )}

                        {server.url && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500">URL</span>
                            <span className="font-mono text-zinc-300 text-[11px] truncate max-w-[180px]">
                              {server.url}
                            </span>
                          </div>
                        )}

                        {server.env_keys && server.env_keys.length > 0 && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500">Env Vars</span>
                            <span className="text-[10.5px] font-mono text-zinc-400">
                              {server.env_keys.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      <button
                        onClick={() =>
                          setSelectedServerId(isSelected ? null : server.id)
                        }
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors',
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-white/[0.03] border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/20'
                        )}
                      >
                        <Eye className="h-3 w-3" />
                        <span>{isSelected ? 'Viewing Tools' : 'View Tools'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleReconnect(server.id)}
                          disabled={reconnectingId === server.id}
                          title="Reconnect and rediscover tools"
                          className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:border-white/20 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw
                            className={cn(
                              'h-3.5 w-3.5',
                              reconnectingId === server.id && 'animate-spin text-emerald-400'
                            )}
                          />
                        </button>
                        <button
                          onClick={() => handleRemove(server.id)}
                          disabled={removingId === server.id}
                          title="Remove server"
                          className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </CardSpotlight>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DISCOVERED TOOLS Section (Namespaced: server_id:tool_name)                 */}
        {/* ========================================================================= */}
        <div className="bento-item space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="text-[10.5px] font-medium uppercase tracking-wider text-zinc-500">
                02
              </span>
              <span className="text-zinc-600 text-xs">•</span>
              <h2 className="text-[15px] font-semibold text-white tracking-tight">
                Discovered Tools Catalog
              </h2>
              {selectedServerId && (
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Filtered: {selectedServerId}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              {selectedServerId && (
                <button
                  onClick={() => setSelectedServerId(null)}
                  className="hover:text-white underline"
                >
                  Show All Tools
                </button>
              )}
              <span>({filteredTools.length} tools registered)</span>
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.06] text-center text-xs text-zinc-500">
              No tools discovered yet. Connect an MCP server to automatically populate the tool catalog.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredTools.map((tool) => (
                <div
                  key={tool.name}
                  className="p-4 rounded-xl border border-white/[0.06] bg-[#0a0c10]/90 hover:border-white/[0.14] transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        <Wrench className="h-3 w-3 text-emerald-400" />
                      </div>
                      <span className="font-mono text-xs font-semibold text-white truncate">
                        {tool.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06] shrink-0">
                      {tool.server}
                    </span>
                  </div>

                  <p className="text-[11.5px] text-zinc-400 mt-2 font-normal line-clamp-2">
                    {tool.description || 'No description provided.'}
                  </p>

                  {tool.input_schema && tool.input_schema.properties && (
                    <div className="mt-3 pt-2 border-t border-white/[0.04] flex flex-wrap gap-1">
                      {Object.keys(tool.input_schema.properties).map((prop) => (
                        <span
                          key={prop}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/60 text-zinc-400"
                        >
                          {prop}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* LIVE SECURITY PIPELINE & TELEMETRY (Phase 7)                               */}
        {/* ========================================================================= */}
        <div className="bento-item space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="text-[10.5px] font-medium uppercase tracking-wider text-zinc-500">
                03
              </span>
              <span className="text-zinc-600 text-xs">•</span>
              <h2 className="text-[15px] font-semibold text-white tracking-tight">
                Live Security Evaluation View
              </h2>
            </div>
            <span className="text-xs text-zinc-500">Real-time inspection trace</span>
          </div>

          <CardSpotlight className="p-6 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08]">
            <div className="space-y-4">
              <div className="text-xs text-zinc-400">
                Every MCP <code className="text-emerald-400 font-mono">tools/call</code> flows through AgentGuard&apos;s multi-engine security boundary before execution:
              </div>

              {/* Step diagram */}
              <div className="flex flex-wrap items-center gap-2 py-2">
                {[
                  { name: 'Agent ID', color: 'text-zinc-300' },
                  { name: 'Tool Name', color: 'text-sky-300' },
                  { name: 'Cedar Policy', color: 'text-emerald-300' },
                  { name: 'Risk Engine', color: 'text-yellow-300' },
                  { name: 'Threat Detection', color: 'text-rose-300' },
                  { name: 'Sensitive Data', color: 'text-purple-300' },
                  { name: 'Final Decision', color: 'text-white font-bold' },
                ].map((step, i, arr) => (
                  <span key={step.name} className="flex items-center gap-2 text-xs">
                    <span className={cn('px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]', step.color)}>
                      {step.name}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="text-zinc-600 font-bold">→</span>
                    )}
                  </span>
                ))}
              </div>

              {/* Recent evaluations */}
              <div className="mt-4 space-y-2">
                {recentAudit.length === 0 ? (
                  <div className="text-xs text-zinc-500 py-3 text-center border border-white/[0.04] rounded-xl">
                    No recent evaluations yet. Call tools from an MCP client to observe live decisions.
                  </div>
                ) : (
                  recentAudit.map((item, idx) => {
                    const isBlock = item.decision === 'BLOCK';
                    const isApprove = item.decision === 'APPROVE';
                    const isAllow = item.decision === 'ALLOW';

                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex flex-wrap items-center gap-2 font-mono">
                          <span className="text-zinc-400">{item.agent_id || 'research-agent'}</span>
                          <span className="text-zinc-600">→</span>
                          <span className="text-sky-400 font-semibold">{item.tool || item.action}</span>
                          <span className="text-zinc-600">|</span>
                          <span className="text-zinc-500">{item.policy_id || 'DEFAULT_POLICY'}</span>
                          <span className="text-zinc-600">|</span>
                          <span className="text-zinc-400">Risk: {item.risk_level || 'LOW'} ({item.risk_score ?? 20})</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={cn(
                              'px-2.5 py-1 rounded-md font-mono text-[11px] font-bold border',
                              isAllow && 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
                              isApprove && 'bg-amber-500/10 border-amber-500/30 text-amber-400',
                              isBlock && 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            )}
                          >
                            {item.decision}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </CardSpotlight>
        </div>

        {/* ========================================================================= */}
        {/* CONNECT AGENT SECTION (Phase 6)                                           */}
        {/* ========================================================================= */}
        <div className="bento-item space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="text-[10.5px] font-medium uppercase tracking-wider text-zinc-500">
                04
              </span>
              <span className="text-zinc-600 text-xs">•</span>
              <h2 className="text-[15px] font-semibold text-white tracking-tight">
                Connect AI Agent / MCP Client
              </h2>
            </div>
            <span className="text-xs text-zinc-500">Client configuration</span>
          </div>

          <CardSpotlight className="p-6 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08]">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 text-xs text-zinc-300">
                <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Your MCP client connects to AgentGuard</span>, not directly to upstream servers. AgentGuard exposes all upstream tools aggregated under its streamable HTTP endpoint while evaluating zero-trust authorization on every invocation.
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
                {[
                  { id: 'generic', label: 'Generic MCP Client' },
                  { id: 'cursor', label: 'Cursor' },
                  { id: 'claude', label: 'Claude Desktop' },
                  { id: 'python', label: 'Python SDK / Script' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveClientTab(tab.id as any)}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-lg transition-colors font-medium',
                      activeClientTab === tab.id
                        ? 'bg-white/10 text-white'
                        : 'text-zinc-400 hover:text-white'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="relative">
                <button
                  onClick={() => {
                    const codeSnippets: Record<string, string> = {
                      generic: JSON.stringify(
                        {
                          mcpServers: {
                            agentguard: {
                              url: 'http://localhost:8000/mcp',
                            },
                          },
                        },
                        null,
                        2
                      ),
                      cursor: JSON.stringify(
                        {
                          name: 'agentguard',
                          type: 'sse',
                          url: 'http://localhost:8000/mcp',
                        },
                        null,
                        2
                      ),
                      claude: JSON.stringify(
                        {
                          mcpServers: {
                            agentguard: {
                              command: 'npx',
                              args: ['-y', 'mcp-proxy', 'http://localhost:8000/mcp'],
                            },
                          },
                        },
                        null,
                        2
                      ),
                      python: `import asyncio\nfrom mcp.client.streamable_http import streamable_http_client\nfrom mcp.client.session import ClientSession\n\nasync def main():\n    async with streamable_http_client("http://localhost:8000/mcp") as (read, write):\n        async with ClientSession(read, write) as session:\n            await session.initialize()\n            tools = await session.list_tools()\n            print(f"Connected to AgentGuard! Tools: {[t.name for t in tools.tools]}")\n\nasyncio.run(main())`,
                    };
                    copyToClipboard(codeSnippets[activeClientTab], 'snippet');
                  }}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-md bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copiedText === 'snippet' ? 'Copied!' : 'Copy'}</span>
                </button>

                <pre className="p-4 rounded-xl bg-black/60 border border-white/[0.08] text-xs font-mono text-zinc-300 overflow-x-auto">
                  {activeClientTab === 'generic' && (
                    <code>
{`// Add to your client MCP configuration file
{
  "mcpServers": {
    "agentguard": {
      "url": "http://localhost:8000/mcp"
    }
  }
}`}
                    </code>
                  )}

                  {activeClientTab === 'cursor' && (
                    <code>
{`// In Cursor > Features > MCP > Add New MCP Server
{
  "name": "agentguard",
  "type": "sse",
  "url": "http://localhost:8000/mcp"
}`}
                    </code>
                  )}

                  {activeClientTab === 'claude' && (
                    <code>
{`// claude_desktop_config.json (bridges stdio to AgentGuard's Streamable HTTP gateway)
{
  "mcpServers": {
    "agentguard": {
      "command": "npx",
      "args": ["-y", "mcp-proxy", "http://localhost:8000/mcp"]
    }
  }
}`}
                    </code>
                  )}

                  {activeClientTab === 'python' && (
                    <code>
{`import asyncio
from mcp.client.streamable_http import streamable_http_client
from mcp.client.session import ClientSession

async def main():
    async with streamable_http_client("http://localhost:8000/mcp") as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()
            print("Connected to AgentGuard!")
            print("Protected Tools:", [t.name for t in tools.tools])

asyncio.run(main())`}
                    </code>
                  )}
                </pre>
              </div>
            </div>
          </CardSpotlight>
        </div>

        {/* ========================================================================= */}
        {/* End-to-End Gateway Architecture Component                                 */}
        {/* ========================================================================= */}
        <div className="bento-item">
          <GatewayArchitecture />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD MCP SERVER MODAL                                                      */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-6 rounded-2xl bg-[#0d1017] border border-white/10 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-emerald-400" />
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Add MCP Server
                </h3>
              </div>
              <button
                onClick={() => {
                  if (!isSubmitting) setShowAddModal(false);
                }}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddServer} className="space-y-4">
              {/* Name & ID */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11.5px] text-zinc-400 font-medium block mb-1">
                    Server Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GitHub"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11.5px] text-zinc-400 font-medium block mb-1">
                    Server ID (Namespace)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. github"
                    value={addId}
                    onChange={(e) => setAddId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Transport Selector */}
              <div>
                <label className="text-[11.5px] text-zinc-400 font-medium block mb-1">
                  Transport
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAddTransport('stdio')}
                    className={cn(
                      'py-2 px-3 text-xs rounded-xl border text-center font-medium transition-all',
                      addTransport === 'stdio'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-white/[0.02] border-white/[0.08] text-zinc-400 hover:text-white'
                    )}
                  >
                    Local / stdio
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddTransport('streamable-http')}
                    className={cn(
                      'py-2 px-3 text-xs rounded-xl border text-center font-medium transition-all',
                      addTransport === 'streamable-http'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-white/[0.02] border-white/[0.08] text-zinc-400 hover:text-white'
                    )}
                  >
                    Remote / Streamable HTTP
                  </button>
                </div>
              </div>

              {/* stdio fields */}
              {addTransport === 'stdio' ? (
                <>
                  <div>
                    <label className="text-[11.5px] text-zinc-400 font-medium block mb-1">
                      Command
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. npx, python, node"
                      value={addCommand}
                      onChange={(e) => setAddCommand(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] text-zinc-400 font-medium block mb-1">
                      Arguments (space separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. -y @modelcontextprotocol/server-filesystem /path"
                      value={addArgs}
                      onChange={(e) => setAddArgs(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] text-zinc-400 font-medium block mb-1">
                      Environment Variables (KEY=$ENV_VAR, one per line)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="GITHUB_TOKEN=$GITHUB_TOKEN"
                      value={addEnv}
                      onChange={(e) => setAddEnv(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Always use references like $VARIABLE rather than hardcoding secret credentials.
                    </span>
                  </div>
                </>
              ) : (
                /* HTTP fields */
                <div>
                  <label className="text-[11.5px] text-zinc-400 font-medium block mb-1">
                    Endpoint URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. http://localhost:3001/mcp"
                    value={addUrl}
                    onChange={(e) => setAddUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              )}

              {/* Connection Progress Indicator */}
              {connectionStage !== null && (
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                    <span className="font-semibold text-white">
                      {connectionStage === 1 && 'Connecting...'}
                      {connectionStage === 2 && 'MCP handshake...'}
                      {connectionStage === 3 && 'Discovering tools...'}
                      {connectionStage === 4 && 'Applying AgentGuard security boundary...'}
                      {connectionStage === 5 && 'Connected! Tools registered.'}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${(connectionStage / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Box */}
              {connectionError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Connection Failed:</span>
                    <p className="mt-0.5 font-mono text-[11px]">{connectionError}</p>
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <HoverBorderGradient
                  as="button"
                  disabled={isSubmitting}
                  containerClassName="rounded-xl"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-600/90 text-white hover:bg-emerald-500 transition-colors"
                  highlight="radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0) 100%)"
                >
                  {isSubmitting ? 'Connecting...' : 'Connect MCP'}
                </HoverBorderGradient>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
