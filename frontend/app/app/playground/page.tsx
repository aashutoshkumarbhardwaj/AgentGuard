'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FlaskConical,
  Play,
  Server,
  Wrench,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Lock,
  ChevronRight,
  CheckCircle2,
  FileCode,
  Shield,
  Cpu,
  Sparkles,
} from 'lucide-react';
import {
  fetchMcpServers,
  fetchServerTools,
  fetchMcpTools,
  executePlaygroundTool,
  McpServer,
  McpTool,
  PlaygroundToolResult,
} from '@/lib/api';
import { cn } from '@/lib/utils';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

export default function PlaygroundPage() {
  const router = useRouter();
  const [servers, setServers] = useState<McpServer[]>([]);
  const [tools, setTools] = useState<McpTool[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [selectedToolName, setSelectedToolName] = useState<string>('');
  const [argsJson, setArgsJson] = useState<string>('{}');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<PlaygroundToolResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Load servers on mount
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const serverList = await fetchMcpServers();
        setServers(serverList);
        if (serverList.length > 0) {
          const firstConnected = serverList.find((s) => s.connected) || serverList[0];
          setSelectedServerId(firstConnected.id);
        }
      } catch (err) {
        console.error('Failed to load servers:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // When selected server changes, load its discovered tools
  useEffect(() => {
    if (!selectedServerId) {
      setTools([]);
      setSelectedToolName('');
      return;
    }

    async function loadTools() {
      try {
        const serverTools = await fetchServerTools(selectedServerId);
        setTools(serverTools);
        if (serverTools.length > 0) {
          // Select first tool
          const firstTool = serverTools[0];
          const toolIdent = firstTool.original_name || firstTool.name;
          setSelectedToolName(toolIdent);
          populateDefaultArgs(firstTool);
        } else {
          setSelectedToolName('');
          setArgsJson('{}');
        }
      } catch (err) {
        console.error(`Failed to load tools for ${selectedServerId}:`, err);
        setTools([]);
      }
    }
    loadTools();
    setResult(null);
  }, [selectedServerId]);

  // When selected tool changes, populate schema template
  const handleToolChange = (toolIdent: string) => {
    setSelectedToolName(toolIdent);
    setResult(null);
    const matched = tools.find(
      (t) => (t.original_name || t.name) === toolIdent || t.name === toolIdent
    );
    if (matched) {
      populateDefaultArgs(matched);
    }
  };

  const populateDefaultArgs = (tool: McpTool) => {
    const schema = tool.input_schema;
    if (!schema || !schema.properties || Object.keys(schema.properties).length === 0) {
      setArgsJson('{}');
      setJsonError(null);
      return;
    }

    const template: Record<string, any> = {};
    for (const [key, prop] of Object.entries<any>(schema.properties)) {
      if (key === 'item_id') {
        template[key] = 'demo-001';
      } else if (key === 'name') {
        template[key] = 'New Item';
      } else if (key === 'command') {
        template[key] = 'ls -la';
      } else if (key === 'secret_type') {
        template[key] = 'api_key';
      } else if (prop.type === 'string') {
        template[key] = prop.default || (prop.description ? `sample_${key}` : 'example');
      } else if (prop.type === 'number' || prop.type === 'integer') {
        template[key] = prop.default || 1;
      } else if (prop.type === 'boolean') {
        template[key] = prop.default !== undefined ? prop.default : true;
      } else if (prop.type === 'array') {
        template[key] = [];
      } else if (prop.type === 'object') {
        template[key] = {};
      } else {
        template[key] = '';
      }
    }

    setArgsJson(JSON.stringify(template, null, 2));
    setJsonError(null);
  };

  const handleTestCall = async () => {
    setJsonError(null);
    let parsed: Record<string, any> = {};
    try {
      parsed = argsJson.trim() ? JSON.parse(argsJson) : {};
    } catch (e: any) {
      setJsonError('Invalid JSON format. Please check your arguments.');
      return;
    }

    if (!selectedServerId || !selectedToolName) return;

    setExecuting(true);
    setResult(null);

    try {
      const res = await executePlaygroundTool(selectedServerId, selectedToolName, parsed);
      setResult(res);
    } catch (err: any) {
      setResult({
        decision: 'BLOCK',
        risk_score: 100,
        risk_level: 'CRITICAL',
        policy_id: 'GATEWAY_ERROR',
        reason: err.message || 'Execution failed',
        factors: ['Error during execution'],
        status: 'ERROR',
        upstream_called: false,
        server_id: selectedServerId,
        tool_name: selectedToolName,
        error: err.message,
      });
    } finally {
      setExecuting(false);
    }
  };

  const copyResult = () => {
    if (!result) return;
    const text = typeof result.result === 'string' ? result.result : JSON.stringify(result.result, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedTool = useMemo(() => {
    return tools.find(
      (t) => (t.original_name || t.name) === selectedToolName || t.name === selectedToolName
    );
  }, [tools, selectedToolName]);

  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-300 font-memorable">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ========================================================================= */}
        {/* Header                                                                    */}
        {/* ========================================================================= */}
        <div className="border-b border-white/[0.08] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    AgentGuard Playground
                  </h1>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Test MCP tool calls through the AgentGuard security gateway.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/app/settings"
                className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] flex items-center gap-1.5 transition-all"
              >
                <Cpu className="h-3.5 w-3.5 text-sky-400" />
                <span>Decision Keys</span>
              </Link>
              <Link
                href="/app/mcp"
                className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] flex items-center gap-1.5 transition-all"
              >
                <Server className="h-3.5 w-3.5" />
                <span>MCP Servers</span>
              </Link>
              <Link
                href="/app/approvals"
                className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] flex items-center gap-1.5 transition-all"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Approvals</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Zero State: No MCP Servers Connected                                      */}
        {/* ========================================================================= */}
        {!loading && servers.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#0a0c10]/95 border border-dashed border-white/15 text-center flex flex-col items-center justify-center max-w-xl mx-auto space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400">
              <Server className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">No MCP servers connected.</h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                Connect an MCP server first to discover its tools and test runtime security interception.
              </p>
            </div>
            <Link
              href="/app/mcp"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
            >
              <span>GO TO MCP SERVERS</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ===================================================================== */}
            {/* Left Column: Tool Call Controls (5 cols)                              */}
            {/* ===================================================================== */}
            <div className="lg:col-span-5 space-y-5">
              <CardSpotlight className="p-5 rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5 text-emerald-400" />
                    Invocation Target
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">Gateway Boundary</span>
                </div>

                {/* Server Selector */}
                <div>
                  <label className="text-[11.5px] font-medium text-zinc-300 block mb-1.5">
                    MCP Server
                  </label>
                  <select
                    value={selectedServerId}
                    onChange={(e) => setSelectedServerId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    {servers.map((srv) => (
                      <option key={srv.id} value={srv.id} className="bg-[#0e1117] text-white">
                        {srv.name} ({srv.transport}) {srv.connected ? '●' : '○'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tool Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11.5px] font-medium text-zinc-300">
                      Tool
                    </label>
                    <span className="text-[10.5px] text-zinc-500 font-mono">
                      {tools.length} discovered
                    </span>
                  </div>

                  {tools.length === 0 ? (
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-zinc-500 text-center">
                      No tools discovered for this MCP server.
                    </div>
                  ) : (
                    <select
                      value={selectedToolName}
                      onChange={(e) => handleToolChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-emerald-500 font-mono"
                    >
                      {tools.map((t) => {
                        const name = t.original_name || t.name;
                        return (
                          <option key={name} value={name} className="bg-[#0e1117] text-white">
                            {name}
                          </option>
                        );
                      })}
                    </select>
                  )}

                  {selectedTool?.description && (
                    <p className="text-[11px] text-zinc-400 mt-1.5 italic">
                      {selectedTool.description}
                    </p>
                  )}
                </div>

                {/* Arguments JSON Editor */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11.5px] font-medium text-zinc-300 flex items-center gap-1.5">
                      <FileCode className="h-3.5 w-3.5 text-zinc-400" />
                      Arguments (JSON)
                    </label>
                    {selectedTool && (
                      <button
                        type="button"
                        onClick={() => populateDefaultArgs(selectedTool)}
                        className="text-[10.5px] text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Reset to schema</span>
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={8}
                    value={argsJson}
                    onChange={(e) => {
                      setArgsJson(e.target.value);
                      setJsonError(null);
                    }}
                    placeholder="{}"
                    className={cn(
                      'w-full p-3 text-xs rounded-xl font-mono bg-black/40 border text-emerald-300 placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all',
                      jsonError
                        ? 'border-rose-500/60 focus:ring-rose-500/40'
                        : 'border-white/10 focus:border-emerald-500 focus:ring-emerald-500/30'
                    )}
                  />

                  {jsonError && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {jsonError}
                    </p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleTestCall}
                    disabled={executing || tools.length === 0}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200',
                      executing || tools.length === 0
                        ? 'bg-white/[0.05] text-zinc-500 cursor-not-allowed border border-white/[0.08]'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)]'
                    )}
                  >
                    {executing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Interception in progress...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>TEST TOOL CALL</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-zinc-500 mt-2 font-mono">
                    Invoked through AgentGuard Gateway · Upstream protected
                  </p>
                </div>
              </CardSpotlight>

              {/* Security Boundary Notice */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-400 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                  <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Gateway Security Guarantee</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  The Playground calls the tool through the AgentGuard security engine.
                  Every call is checked against Cedar policy, threat detector, and risk scoring.
                  Upstream servers execute <strong className="text-zinc-300">only when allowed</strong>.
                </p>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* Right Column: Execution & Security Result (7 cols)                    */}
            {/* ===================================================================== */}
            <div className="lg:col-span-7">
              {!result && !executing && (
                <div className="h-full min-h-[420px] rounded-2xl bg-[#0a0c10]/70 border border-white/[0.08] p-8 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-zinc-500">
                    <Play className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Ready for Interception</h3>
                    <p className="text-xs text-zinc-500 max-w-sm mt-1">
                      Select an MCP server and tool, adjust arguments, then click [ TEST TOOL CALL ]
                      to see real-time security decision and execution result.
                    </p>
                  </div>
                </div>
              )}

              {executing && (
                <div className="h-full min-h-[420px] rounded-2xl bg-[#0a0c10]/70 border border-white/[0.08] p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">Evaluating Tool Call</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Passing through Cedar Authorization, Risk Engine & Threat Detector...
                    </p>
                  </div>
                </div>
              )}

              {result && !executing && (
                <div className="space-y-4">
                  {/* 1. Primary Decision Banner */}
                  {result.decision === 'ALLOW' && (
                    <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start justify-between">
                      <div className="flex items-start gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-emerald-400">🟢 ALLOW</span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                              STATUS: EXECUTED
                            </span>
                          </div>
                          <p className="text-xs text-emerald-200/80 mt-1">
                            Action permitted by security policy. Forwarded to upstream MCP server.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.decision === 'APPROVE' && (
                    <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                          <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-amber-400">🟡 APPROVAL REQUIRED</span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                              STATUS: PENDING APPROVAL
                            </span>
                          </div>
                          <p className="text-xs text-amber-200/80 mt-1">
                            Tool execution has been paused. The upstream MCP must NOT execute without authorization.
                          </p>
                        </div>
                      </div>

                      {result.approval_id && (
                        <Link
                          href={`/app/approvals`}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_20px_rgba(245,158,11,0.25)] shrink-0 transition-all"
                        >
                          <span>OPEN APPROVAL</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  )}

                  {result.decision === 'BLOCK' && (
                    <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start justify-between">
                      <div className="flex items-start gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                          <ShieldAlert className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-rose-400">🔴 BLOCKED</span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold">
                              STATUS: BLOCKED
                            </span>
                          </div>
                          <p className="text-xs text-rose-200/80 mt-1">
                            Tool execution was prevented. The upstream MCP server was not called.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Security Metrics Strip */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                      <span className="text-[10.5px] uppercase font-mono text-zinc-500 block">Risk Score</span>
                      <p className={cn(
                        'text-sm font-bold mt-1 font-mono',
                        result.risk_level === 'LOW' && 'text-emerald-400',
                        result.risk_level === 'HIGH' && 'text-amber-400',
                        result.risk_level === 'CRITICAL' && 'text-rose-400',
                      )}>
                        {result.risk_score} / 100 — {result.risk_level}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                      <span className="text-[10.5px] uppercase font-mono text-zinc-500 block">Upstream Execution</span>
                      <p className={cn(
                        'text-sm font-bold mt-1 font-mono',
                        result.upstream_called ? 'text-emerald-400' : 'text-rose-400'
                      )}>
                        {result.upstream_called ? 'EXECUTED' : 'NOT EXECUTED'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                      <span className="text-[10.5px] uppercase font-mono text-zinc-500 block">Policy ID</span>
                      <p className="text-xs font-mono text-zinc-300 truncate mt-1">
                        {result.policy_id || 'DEFAULT_POLICY'}
                      </p>
                    </div>
                  </div>

                  {/* 3. Reason & Factors */}
                  {result.reason && (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1.5">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                        Interception Details
                      </span>
                      <p className="text-xs text-zinc-200">
                        {result.reason}
                      </p>
                      {result.factors && result.factors.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {result.factors.map((factor, idx) => (
                            <span
                              key={idx}
                              className="text-[10.5px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-400 border border-white/[0.06]"
                            >
                              {factor}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3b. System One Decision Intelligence */}
                  {result.decision_engine && (
                    <div className="p-4 rounded-xl bg-gradient-to-b from-[#0e121a] to-[#0a0c10] border border-sky-500/20 space-y-3.5 shadow-[0_0_25px_rgba(14,165,233,0.06)]">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                            <Cpu className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-[11.5px] font-bold uppercase tracking-wider text-sky-300">
                            System One Decision Intelligence
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {result.decision_engine.fallback_used && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                              Fallback Active
                            </span>
                          )}
                          {result.decision_engine.hard_policy_enforced && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold">
                              Cedar Authority Enforced
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                            Confidence {Math.round(result.decision_engine.confidence * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Probability Distribution */}
                      <div className="space-y-2.5 pt-0.5">
                        <div className="flex items-center justify-between text-[10.5px] font-mono text-zinc-400">
                          <span>PROBABILISTIC ACTION MATRIX</span>
                          <span className="text-zinc-500">
                            Decision: <strong className="text-white">{result.decision_engine.decision}</strong>
                          </span>
                        </div>

                        {/* ALLOW Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-emerald-400 font-mono font-semibold text-[11px]">ALLOW</span>
                            <span className="font-mono text-[11px] text-zinc-300">
                              {Math.round((result.decision_engine.probabilities?.ALLOW ?? 0) * 100)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                              style={{ width: `${Math.round((result.decision_engine.probabilities?.ALLOW ?? 0) * 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* APPROVE Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-amber-400 font-mono font-semibold text-[11px]">APPROVE</span>
                            <span className="font-mono text-[11px] text-zinc-300">
                              {Math.round((result.decision_engine.probabilities?.APPROVE ?? 0) * 100)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all duration-500"
                              style={{ width: `${Math.round((result.decision_engine.probabilities?.APPROVE ?? 0) * 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* BLOCK Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-rose-400 font-mono font-semibold text-[11px]">BLOCK</span>
                            <span className="font-mono text-[11px] text-zinc-300">
                              {Math.round((result.decision_engine.probabilities?.BLOCK ?? 0) * 100)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-400 rounded-full transition-all duration-500"
                              style={{ width: `${Math.round((result.decision_engine.probabilities?.BLOCK ?? 0) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Metadata telemetry */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-white/[0.06] text-[11px] font-mono text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500">Provider:</span>
                          <span className="text-white font-semibold capitalize">
                            {result.decision_engine.provider === 'typesafe'
                              ? 'TypeSafe Jev (Primary)'
                              : result.decision_engine.provider === 'openjev'
                              ? 'OpenJev (Fallback)'
                              : 'Deterministic (Fail-Safe)'}
                          </span>
                        </div>
                        {result.decision_engine.model && (
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500">Model:</span>
                            <span className="text-sky-300">{result.decision_engine.model}</span>
                          </div>
                        )}
                        {result.decision_engine.latency_ms !== null && result.decision_engine.latency_ms !== undefined && (
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500">Latency:</span>
                            <span className="text-zinc-300">{result.decision_engine.latency_ms} ms</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 4. Real MCP Response / Output */}
                  <div className="rounded-2xl bg-[#0a0c10]/95 border border-white/[0.08] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Upstream Response</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400">
                          {result.server_id}:{result.tool_name}
                        </span>
                      </div>

                      {result.result && (
                        <button
                          type="button"
                          onClick={copyResult}
                          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="p-4">
                      {result.decision === 'ALLOW' && result.result ? (
                        <pre className="text-xs font-mono text-emerald-300 bg-black/50 p-3.5 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-white/[0.04]">
                          {typeof result.result === 'string' ? result.result : JSON.stringify(result.result, null, 2)}
                        </pre>
                      ) : result.decision === 'APPROVE' ? (
                        <div className="text-xs text-zinc-400 py-3 text-center space-y-2">
                          <p>
                            The tool has not been executed yet. To authorize this call, navigate to Approvals.
                          </p>
                          {result.approval_id && (
                            <p className="text-[11px] font-mono text-amber-400">
                              Approval ID: {result.approval_id}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-zinc-400 py-3 text-center space-y-1">
                          <p className="text-rose-400 font-semibold">
                            Execution Prevented by Policy
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            Upstream server was not contacted. No data was read, modified, or exfiltrated.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
