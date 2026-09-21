'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Server,
  Network,
  Plus,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  FlaskConical,
  X,
  Loader2,
  CheckCircle2,
  Sparkles,
  Layers,
  Wrench,
  Terminal,
} from 'lucide-react';
import {
  fetchMcpServers,
  addMcpServer,
  removeMcpServer,
  reconnectMcpServer,
  fetchServerTools,
  connectDemoMcp,
  McpServer,
  McpTool,
} from '@/lib/api';
import { cn } from '@/lib/utils';
import { CardSpotlight } from '@/components/ui/card-spotlight';

export default function LocalMcpPage() {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedServerId, setExpandedServerId] = useState<string | null>(null);
  const [serverTools, setServerTools] = useState<Record<string, McpTool[]>>({});
  const [loadingTools, setLoadingTools] = useState<Record<string, boolean>>({});

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);

  // Add Server Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addId, setAddId] = useState('');
  const [addTransport, setAddTransport] = useState<'stdio' | 'streamable-http'>('stdio');
  const [addCommand, setAddCommand] = useState('npx');
  const [addArgs, setAddArgs] = useState('-y @modelcontextprotocol/server-filesystem /tmp');
  const [addUrl, setAddUrl] = useState('http://localhost:3001/mcp');
  const [addEnv, setAddEnv] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadServers = async () => {
    try {
      const list = await fetchMcpServers();
      setServers(list);
    } catch (err) {
      console.error('Failed to load servers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServers();
    const interval = setInterval(loadServers, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = async (serverId: string) => {
    if (expandedServerId === serverId) {
      setExpandedServerId(null);
      return;
    }

    setExpandedServerId(serverId);
    if (!serverTools[serverId]) {
      setLoadingTools((prev) => ({ ...prev, [serverId]: true }));
      try {
        const tools = await fetchServerTools(serverId);
        setServerTools((prev) => ({ ...prev, [serverId]: tools }));
      } catch (err) {
        console.error(`Failed to load tools for ${serverId}:`, err);
      } finally {
        setLoadingTools((prev) => ({ ...prev, [serverId]: false }));
      }
    }
  };

  const handleReconnect = async (serverId: string) => {
    setActionLoading(`reconnect-${serverId}`);
    try {
      await reconnectMcpServer(serverId);
      await loadServers();
      if (expandedServerId === serverId) {
        const tools = await fetchServerTools(serverId);
        setServerTools((prev) => ({ ...prev, [serverId]: tools }));
      }
    } catch (err) {
      console.error('Reconnect failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (serverId: string) => {
    if (!confirm(`Disconnect and remove MCP server '${serverId}'?`)) return;
    setActionLoading(`remove-${serverId}`);
    try {
      await removeMcpServer(serverId);
      if (expandedServerId === serverId) setExpandedServerId(null);
      await loadServers();
    } catch (err) {
      console.error('Remove failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleConnectDemo = async () => {
    setDemoLoading(true);
    try {
      await connectDemoMcp();
      await loadServers();
      // Automatically expand Demo MCP tools
      const tools = await fetchServerTools('demo-mcp');
      setServerTools((prev) => ({ ...prev, ['demo-mcp']: tools }));
      setExpandedServerId('demo-mcp');
    } catch (err) {
      console.error('Failed to connect Demo MCP:', err);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleAddServer = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setIsSubmitting(true);

    let parsedArgs: string[] = [];
    if (addArgs.trim()) {
      parsedArgs = addArgs.split(' ').filter(Boolean);
    }

    let parsedEnv: Record<string, string> = {};
    if (addEnv.trim()) {
      try {
        parsedEnv = JSON.parse(addEnv);
      } catch {
        setAddError('Environment variables must be valid JSON (e.g. {"KEY": "$VALUE"}).');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const res = await addMcpServer({
        id: addId.trim().toLowerCase(),
        name: addName.trim() || addId.trim(),
        transport: addTransport,
        command: addTransport === 'stdio' ? addCommand.trim() : undefined,
        args: addTransport === 'stdio' ? parsedArgs : undefined,
        url: addTransport === 'streamable-http' ? addUrl.trim() : undefined,
        env: parsedEnv,
      });

      if (res.error) {
        setAddError(res.error);
      } else {
        setShowAddModal(false);
        setAddName('');
        setAddId('');
        await loadServers();
      }
    } catch (err: any) {
      setAddError(err.message || 'Failed to add MCP server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-100 font-memorable">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ========================================================================= */}
        {/* Header                                                                    */}
        {/* ========================================================================= */}
        <div className="border-b border-white/[0.08] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                  <Network className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    Connected MCP Servers
                  </h1>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    What MCP servers am I protecting? Manage upstream server connections and discover tools.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleConnectDemo}
                disabled={demoLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                title="Connect built-in 5-tool deterministic demo server"
              >
                {demoLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                )}
                <span>Connect Demo MCP</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/10 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add MCP Server</span>
              </button>

              <Link
                href="/app/playground"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)]"
              >
                <FlaskConical className="h-3.5 w-3.5" />
                <span>Playground</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Servers List                                                              */}
        {/* ========================================================================= */}
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            <p className="text-xs text-zinc-500">Checking connected MCP servers...</p>
          </div>
        ) : servers.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#0a0c10]/95 border border-dashed border-white/15 text-center flex flex-col items-center justify-center max-w-lg mx-auto space-y-4">
            <Server className="h-10 w-10 text-zinc-600" />
            <div>
              <h3 className="text-sm font-semibold text-white">No MCP servers connected.</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                Connect an MCP server (stdio or Streamable HTTP) or start with Demo MCP.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleConnectDemo}
                disabled={demoLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
              >
                {demoLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span>Connect Demo MCP (5 tools)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Custom Server</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {servers.map((server) => {
              const isExpanded = expandedServerId === server.id;
              const tools = serverTools[server.id] || [];
              const isToolsLoading = loadingTools[server.id];

              return (
                <div
                  key={server.id}
                  className={cn(
                    'rounded-2xl border transition-all duration-200 overflow-hidden bg-[#0a0c10]/95',
                    isExpanded ? 'border-sky-500/40 shadow-[0_0_20px_rgba(56,189,248,0.08)]' : 'border-white/[0.08] hover:border-white/[0.15]'
                  )}
                >
                  {/* Server Row */}
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div
                      onClick={() => toggleExpand(server.id)}
                      className="flex items-start md:items-center gap-4 cursor-pointer select-none min-w-0 flex-1"
                    >
                      <button
                        type="button"
                        className="text-zinc-500 hover:text-white transition-colors p-1"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-sky-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-sm font-semibold text-white tracking-tight">
                            {server.name}
                          </h3>
                          <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-400">
                            {server.transport}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-500">
                            id: {server.id}
                          </span>
                        </div>

                        {server.command && (
                          <p className="text-[11.5px] font-mono text-zinc-400 mt-1 truncate max-w-lg">
                            {server.command} {server.args?.join(' ')}
                          </p>
                        )}
                        {server.url && (
                          <p className="text-[11.5px] font-mono text-zinc-400 mt-1 truncate max-w-lg">
                            {server.url}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex items-center gap-3 pl-8 md:pl-0 shrink-0">
                      {/* Tool count badge */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(server.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-zinc-300 hover:border-white/20 transition-colors"
                      >
                        <Wrench className="h-3 w-3 text-sky-400" />
                        <span>{server.tools} {server.tools === 1 ? 'tool' : 'tools'}</span>
                      </button>

                      {/* Status badge */}
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

                      {/* Reconnect Action */}
                      <button
                        type="button"
                        onClick={() => handleReconnect(server.id)}
                        disabled={actionLoading === `reconnect-${server.id}`}
                        title="Reconnect and refresh discovered tools"
                        className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] text-zinc-400 hover:text-white transition-all disabled:opacity-50"
                      >
                        <RefreshCw
                          className={cn(
                            'h-3.5 w-3.5',
                            actionLoading === `reconnect-${server.id}` && 'animate-spin text-sky-400'
                          )}
                        />
                      </button>

                      {/* Remove Action */}
                      <button
                        type="button"
                        onClick={() => handleRemove(server.id)}
                        disabled={actionLoading === `remove-${server.id}`}
                        title="Disconnect and remove"
                        className="p-1.5 rounded-lg border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/5 text-rose-400 hover:text-rose-300 transition-all disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Test in Playground */}
                      <Link
                        href="/app/playground"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all"
                      >
                        <FlaskConical className="h-3 w-3" />
                        <span>Test</span>
                      </Link>
                    </div>
                  </div>

                  {/* Expanded Discovered Tools Drawer */}
                  {isExpanded && (
                    <div className="border-t border-white/[0.08] bg-black/30 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                          <Wrench className="h-3.5 w-3.5 text-sky-400" />
                          Discovered Tools ({tools.length})
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          Intercepted by AgentGuard Gateway
                        </span>
                      </div>

                      {isToolsLoading ? (
                        <div className="py-6 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
                          <span>Querying upstream server tools/list...</span>
                        </div>
                      ) : tools.length === 0 ? (
                        <p className="text-xs text-zinc-500 py-3 italic">
                          No tools discovered from this server yet. Try clicking Reconnect.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {tools.map((tool) => {
                            const name = tool.original_name || tool.name;
                            return (
                              <div
                                key={name}
                                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-1"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-mono font-semibold text-emerald-400">
                                    {name}
                                  </span>
                                  <Link
                                    href="/app/playground"
                                    className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-0.5"
                                  >
                                    <span>Run in Playground</span>
                                    <ChevronRight className="h-3 w-3" />
                                  </Link>
                                </div>
                                <p className="text-[11.5px] text-zinc-400 line-clamp-2">
                                  {tool.description || 'No description provided.'}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* Add Server Modal                                                          */}
        {/* ========================================================================= */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg p-6 rounded-2xl bg-[#0d1017] border border-white/10 shadow-2xl space-y-5 font-memorable">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    Add MCP Server
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddServer} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11.5px] text-zinc-400 font-medium block mb-1">
                      Server Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. My Service"
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
                      placeholder="e.g. my-service"
                      value={addId}
                      onChange={(e) => setAddId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

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

                {addTransport === 'stdio' ? (
                  <>
                    <div>
                      <label className="text-[11.5px] text-zinc-400 font-medium block mb-1">
                        Command
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. npx or python"
                        value={addCommand}
                        onChange={(e) => setAddCommand(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11.5px] text-zinc-400 font-medium block mb-1">
                        Arguments (space-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. -y @modelcontextprotocol/server-filesystem /tmp"
                        value={addArgs}
                        onChange={(e) => setAddArgs(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-[11.5px] text-zinc-400 font-medium block mb-1">
                      Endpoint URL
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="http://localhost:3001/mcp"
                      value={addUrl}
                      onChange={(e) => setAddUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                )}

                {addError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{addError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-medium rounded-xl text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>Connect Server</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
