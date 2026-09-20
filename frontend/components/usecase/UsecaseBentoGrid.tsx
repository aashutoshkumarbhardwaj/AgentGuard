'use client';

import { useState } from 'react';
import { 
  ShieldCheck, 
  Layout, 
  Repeat, 
  Search, 
  CheckSquare, 
  GitFork, 
  ArrowRight, 
  Terminal, 
  Check, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export function UsecaseBentoGrid() {
  const [activeAudioBar, setActiveAudioBar] = useState(false);

  return (
    <div className="w-full space-y-12">
      {/* Page Title Section matching screenshot */}
      <div className="text-center max-w-4xl mx-auto pt-6 pb-2">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-normal tracking-[-0.035em] text-white leading-[1.06]"
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          Use, Voice, Research, Ops.
        </h1>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ========================================================================= */}
        {/* Card 1: Coding Agents (Left column, tall card - lg:col-span-6)            */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 rounded-2xl bg-[#090a10]/85 border border-white/[0.09] hover:border-white/[0.2] backdrop-blur-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group">
          <div>
            <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors mb-5">
              <ShieldCheck className="w-5 h-5 text-zinc-300" />
            </div>

            <h3 className="text-2xl font-semibold text-white tracking-tight">Coding Agents</h3>
            <p className="mt-2 text-[14.5px] text-white/55 leading-relaxed">
              The fix is stored once. The second run skips the reading.
            </p>

            <a
              href="#coding-agents"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white mt-4 transition-colors group/link"
            >
              <span>READ MORE</span>
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Graphic: GitHub Actions + Terminal + MCP Tools */}
          <div className="relative mt-8 pt-4 pb-2">
            <div className="rounded-xl bg-black/80 border border-white/[0.08] p-4 relative overflow-hidden font-mono text-[11px] shadow-2xl">
              {/* Top Hub Connection Wire & Logo */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-[10px] text-white/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span>AGENTGUARD // RUNTIME ROUTING</span>
                </div>
                <span>NODE 0x2A</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                {/* Left: GitHub Actions */}
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 space-y-2">
                  <div className="text-white/40 text-[9.5px] flex items-center gap-1">
                    <GitFork className="w-3 h-3 text-white/50" />
                    <span>GITHUB ACTIONS</span>
                  </div>
                  <div className="space-y-1.5 text-[10px]">
                    <div className="text-sky-300 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" />
                      <span className="truncate">Fix auth session</span>
                    </div>
                    <div className="text-white/50 truncate">Update test cases</div>
                    <div className="text-white/50 truncate">Refactor user svc</div>
                    <div className="text-white/35 truncate">Add session utils</div>
                  </div>
                </div>

                {/* Center: Live Terminal */}
                <div className="rounded-lg bg-[#06070b] border border-sky-400/25 p-3 space-y-1.5 text-[10px] shadow-[0_0_20px_rgba(56,189,248,0.1)]">
                  <div className="flex items-center gap-1 text-white/40 text-[9px] pb-1 border-b border-white/5">
                    <Terminal className="w-2.5 h-2.5 text-sky-400" />
                    <span>Terminal</span>
                  </div>
                  <div className="text-white/80">$ fix auth test</div>
                  <div className="text-red-400/90 text-[9px]">1 test failed</div>
                  <div className="text-sky-300">$ apply_patch auth.ts</div>
                  <div className="text-white/80">$ npm test</div>
                  <div className="text-sky-300 flex items-center gap-1 text-[9.5px]">
                    <Check className="w-2.5 h-2.5" />
                    <span>test passed (exit 0)</span>
                  </div>
                </div>

                {/* Right: MCP Tools */}
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 space-y-2">
                  <div className="text-white/40 text-[9.5px] flex items-center gap-1">
                    <Layers className="w-3 h-3 text-white/50" />
                    <span>MCP TOOLS</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-white/60">
                    <div>Filesystem</div>
                    <div>Search</div>
                    <div>Web Fetch</div>
                    <div>Database</div>
                    <div className="text-sky-300 font-semibold">&gt; Execute</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Stack: Computer-Use Agents + Voice Agents */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* ======================================================================= */}
          {/* Card 2: Computer-Use Agents (lg:col-span-6)                             */}
          {/* ======================================================================= */}
          <div className="rounded-2xl bg-[#090a10]/85 border border-white/[0.09] hover:border-white/[0.2] backdrop-blur-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-sm">
                <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors mb-4">
                  <Layout className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="text-2xl font-semibold text-white tracking-tight">Computer-Use Agents</h3>
                <p className="mt-2 text-[14px] text-white/55 leading-relaxed">
                  Screen steps stored as diffs. Targets named by meaning, not coordinates.
                </p>
                <a
                  href="#computer-use"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white mt-4 transition-colors group/link"
                >
                  <span>READ MORE</span>
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Graphic: Screen diff inspector */}
              <div className="flex-1 rounded-xl bg-black/80 border border-white/[0.08] p-3.5 font-mono text-[11px] space-y-2">
                <div className="flex items-center justify-between text-[10px] text-white/40 pb-1.5 border-b border-white/5">
                  <span className="text-sky-300">@ Source</span>
                  <span>DIFF ENGINE</span>
                </div>
                <div className="text-[10.5px]">
                  <span className="text-white/40">What app is this?</span>
                  <div className="text-white/90 font-medium pl-2">Figma (desktop)</div>
                </div>
                <div className="text-[10px] text-white/50 pt-1 border-t border-white/5 space-y-0.5">
                  <div className="text-white/35">Recorded Steps:</div>
                  <div className="text-sky-300 pl-2">click_layer.json</div>
                  <div className="text-white/70 pl-2">drag_frame.json</div>
                  <div className="text-white/70 pl-2">export_asset.json</div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* Card 3: Voice Agents (lg:col-span-6)                                     */}
          {/* ======================================================================= */}
          <div 
            onMouseEnter={() => setActiveAudioBar(true)}
            onMouseLeave={() => setActiveAudioBar(false)}
            className="rounded-2xl bg-[#090a10]/85 border border-white/[0.09] hover:border-white/[0.2] backdrop-blur-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-sm">
                <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors mb-4">
                  <Repeat className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="text-2xl font-semibold text-white tracking-tight">Voice Agents</h3>
                <p className="mt-2 text-[14px] text-white/55 leading-relaxed">
                  Routines come back whole, on the device.
                </p>
                <a
                  href="#voice-agents"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white mt-4 transition-colors group/link"
                >
                  <span>READ MORE</span>
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Graphic: Live soundwave voice equalizer */}
              <div className="flex-1 rounded-xl bg-black/80 border border-white/[0.08] p-4 flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                </div>
                
                {/* Audio Wave Bars */}
                <div className="flex items-center gap-1 h-12 px-2">
                  {[24, 40, 16, 48, 32, 20, 44, 28, 52, 36, 18, 42, 26].map((height, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-gradient-to-t from-sky-500 to-white/90 transition-all duration-300"
                      style={{
                        height: activeAudioBar ? `${Math.min(48, height * 1.2)}px` : `${height * 0.7}px`,
                        opacity: activeAudioBar ? 0.95 : 0.6,
                      }}
                    />
                  ))}
                </div>

                <span className="font-mono text-[10px] text-sky-300 font-medium">LIVE 24kHz</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* Card 4: Research Agents (Left column, bottom - lg:col-span-6)             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 rounded-2xl bg-[#090a10]/85 border border-white/[0.09] hover:border-white/[0.2] backdrop-blur-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group">
          <div>
            <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors mb-4">
              <Search className="w-5 h-5 text-zinc-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white tracking-tight">Research Agents</h3>
            <p className="mt-2 text-[14.5px] text-white/55 leading-relaxed">
              Gather steps stored once, reused on the next report.
            </p>
            <a
              href="#research-agents"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white mt-4 transition-colors group/link"
            >
              <span>READ MORE</span>
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Graphic: Data cards / analytics breakdown */}
          <div className="relative mt-6 rounded-xl bg-black/80 border border-white/[0.08] p-4 font-mono text-[11px] space-y-3">
            <div className="flex items-center justify-between text-[10px] text-white/40 pb-2 border-b border-white/5">
              <span className="text-zinc-300 font-semibold">SYNTHESIS ENGINE</span>
              <span className="text-sky-300">PASS_VERIFIED</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                <div className="text-white/40 text-[9.5px]">PAPERS INGESTED</div>
                <div className="text-lg font-bold text-white">12,450</div>
              </div>
              <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                <div className="text-white/40 text-[9.5px]">LATENCY PER CITATION</div>
                <div className="text-lg font-bold text-sky-300">3.4ms</div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Card 5: Ops Agents (Right column, bottom - lg:col-span-6)                 */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 rounded-2xl bg-[#090a10]/85 border border-white/[0.09] hover:border-white/[0.2] backdrop-blur-2xl p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group">
          <div>
            <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors mb-4">
              <CheckSquare className="w-5 h-5 text-zinc-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white tracking-tight">Ops Agents</h3>
            <p className="mt-2 text-[14.5px] text-white/55 leading-relaxed">
              Remediations replay only in the state they were learned in. Writes ask.
            </p>
            <a
              href="#ops-agents"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white mt-4 transition-colors group/link"
            >
              <span>READ MORE</span>
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Graphic: Multi-app pipeline: Figma, Blender, VS Code */}
          <div className="relative mt-6 rounded-xl bg-black/80 border border-white/[0.08] p-4 font-mono text-[11px] space-y-3">
            <div className="flex items-center justify-between text-[10px] text-white/40 pb-2 border-b border-white/5">
              <span>CONNECTED APPS</span>
              <span className="text-sky-300">STATE_ISOLATED</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/80 text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                <span>Figma</span>
              </div>
              <div className="text-white/20">→</div>
              <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/80 text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Blender 5.1 LTS</span>
              </div>
              <div className="text-white/20">→</div>
              <div className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-400/30 text-sky-300 text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                <span>VS Code</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Card 6: Browser Agents (Full width bottom card - lg:col-span-12)           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-12 rounded-2xl bg-[#090a10]/85 border border-white/[0.09] hover:border-white/[0.2] backdrop-blur-2xl p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] group">
          <div className="max-w-xl">
            <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors mb-4">
              <Activity className="w-5 h-5 text-zinc-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white tracking-tight">Browser Agents</h3>
            <p className="mt-2 text-[14.5px] text-white/55 leading-relaxed">
              Known paths through a site replay. New pages fall back to reasoning.
            </p>
            <a
              href="#browser-agents"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white mt-4 transition-colors group/link"
            >
              <span>READ MORE</span>
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Graphic: Neural constellation / web graph */}
          <div className="w-full md:w-80 rounded-xl bg-black/80 border border-white/[0.08] p-4 font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-[10px] text-white/40 pb-1.5 border-b border-white/5">
              <span className="text-sky-300 font-semibold">RECALL PATH</span>
              <span>SITE REPLAY</span>
            </div>
            <div className="flex items-center justify-center py-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-white/[0.05] border border-white/10 text-white/70">/login</span>
                <span className="text-sky-400">→</span>
                <span className="px-2.5 py-1 rounded bg-sky-500/15 border border-sky-400/40 text-sky-200 font-bold shadow-[0_0_12px_rgba(56,189,248,0.3)]">/billing</span>
                <span className="text-sky-400">→</span>
                <span className="px-2.5 py-1 rounded bg-white/[0.05] border border-white/10 text-white/70">/checkout</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
