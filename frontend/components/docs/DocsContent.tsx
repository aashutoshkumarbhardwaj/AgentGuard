'use client';

import { ChevronRight, FolderArchive, Boxes, Sparkles, Search, Compass, ShieldCheck } from 'lucide-react';
import { DocsLiquidCard } from './DocsLiquidCard';
import { DocsCodeBlock } from './DocsCodeBlock';

export function DocsContent() {
  const quickTerminal = `$ npx memorable-cli@latest login
$ memorable enable
$ memorable recall "fix the tests"`;

  const connectMachineCode = `> npx memorable-cli@latest login       # opens a browser, approves this machine
> memorable enable                     # explicit write consent, nothing is stored before this`;

  const noNodeCode = `> curl -fsSL https://memorable.sh/install.sh | sh
> # then: memorable login`;

  const storeProcedureCode = `> memorable ingest trace.json
> memorable recall 'rotate the TLS cert'
> memorable show <slug>                  # guarded, injection-safe rendering
> memorable list                         # everything stored, newest first`;

  const agentOneLineCode = `> memorable agents-md >> AGENTS.md`;

  const measuredBenchmarkCode = `agent turns      -19%, replicated
pass rate        every run passed
injected size    ~293 tokens
vs a 15,593-token skill: 0% turns`;

  const apiRequestCode = `BASE=https://memorable-extraction-api.memorable.workers.dev

curl $BASE/v1/extract \\
  -H "Authorization: Bearer \\$MEMORABLE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "session_id": "run-183",
    "task_description": "rotate the TLS cert",
    "harness": "my-orchestrator",
    "tool_calls": [
      {
        "name": "shell",
        "input": {"command": "certbot renew"},
        "result": {"ok": true}
      }
    ]
  }'`;

  const apiResponseCode = `{
  "draft": {
    "title": "Rotate the TLS cert",
    "schema_version": "1.0.0",
    "steps": [
      {
        "seq": 1,
        "action": "shell",
        "activity_class": "execute",
        "command": "certbot renew",
        "repeat_count": 1
      }
    ],
    "postconditions": [
      "final command exited successfully: certbot renew"
    ],
    "embedding": [],
    "embedding_model": ""
  },
  "request_id": "82886df0-91a4-49c0-9fa5"
}`;

  return (
    <div className="flex-1 min-w-0 space-y-16 lg:space-y-20">
      
      {/* ========================================================================= */}
      {/* Section 1: Overview                                                       */}
      {/* ========================================================================= */}
      <section id="overview" className="scroll-mt-28 space-y-6">
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.08]"
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          Memorable
        </h1>

        <p className="text-[16px] sm:text-[17.5px] text-white/60 leading-relaxed max-w-3xl">
          An agent finishes a task; Memorable stores how it was done and replays it when a similar
          task returns. Storage stays on your side and consent is fail-closed.
        </p>

        {/* Quick CLI Terminal Box */}
        <div className="max-w-2xl pt-2">
          <DocsCodeBlock code={quickTerminal} className="border-white/[0.12] bg-[#07080d]/95">
            <div className="space-y-1.5 text-[13px] text-white/80">
              <div className="flex items-center gap-2">
                <span className="text-white/40 select-none">$</span>
                <span className="text-white/90">npx memorable-cli@latest login</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40 select-none">$</span>
                <span className="text-white/90">memorable enable</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40 select-none">$</span>
                <span className="text-sky-300">memorable recall &quot;fix the tests&quot;</span>
              </div>
            </div>
          </DocsCodeBlock>
        </div>

        {/* Quickstart Action Button */}
        <div className="pt-2">
          <a
            href="#quickstart"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black font-mono text-[12.5px] font-semibold hover:bg-white/90 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] active:scale-95 cursor-pointer"
          >
            <span>QUICKSTART</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* Section 2: Features Grid (Liquid Glassmorphic Bento)                      */}
      {/* ========================================================================= */}
      <section id="features" className="scroll-mt-28 space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          
          {/* Card 1: Store your first procedure */}
          <DocsLiquidCard
            icon={<FolderArchive className="w-4 h-4" />}
            title="Store your first procedure"
            description="Sign in, give consent, recall. Three commands."
          >
            <div className="rounded-lg bg-black/70 border border-white/[0.08] p-3.5 font-mono text-[11px] space-y-1 text-white/70 min-h-[96px]">
              <div><span className="text-white/30">$</span> npx memorable-cli@latest login</div>
              <div><span className="text-white/30">$</span> memorable enable</div>
              <div className="text-sky-300"><span className="text-white/30">$</span> memorable recall &quot;fix the tests&quot;</div>
            </div>
          </DocsLiquidCard>

          {/* Card 2: Wire up your harness */}
          <DocsLiquidCard
            icon={<Boxes className="w-4 h-4" />}
            title="Wire up your harness"
            description="Claude Code, Codex, gbrain, QM, or yours. The harness field is any string."
          >
            <div className="rounded-lg bg-black/70 border border-white/[0.08] p-3.5 flex flex-wrap gap-2 items-center min-h-[96px] justify-start content-center">
              <span className="px-2.5 py-1 rounded bg-white/[0.05] border border-white/15 font-mono text-[11px] text-white/70">
                Claude Code
              </span>
              <span className="px-2.5 py-1 rounded bg-white/[0.05] border border-white/15 font-mono text-[11px] text-white/70">
                Codex
              </span>
              <span className="px-2.5 py-1 rounded bg-white/[0.05] border border-white/15 font-mono text-[11px] text-white/70">
                Cursor
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/40 font-mono text-[11px] text-amber-300 font-medium">
                yours
              </span>
            </div>
          </DocsLiquidCard>

          {/* Card 3: Connect Claude */}
          <DocsLiquidCard
            icon={<Sparkles className="w-4 h-4" />}
            title="Connect Claude"
            description="One link, pasted into Claude. No terminal, nothing installed."
          >
            <div className="rounded-lg bg-black/70 border border-white/[0.08] p-3.5 flex items-center justify-center gap-3 min-h-[96px]">
              <div className="px-3 py-1.5 rounded bg-white/[0.05] border border-white/15 font-mono text-[11.5px] text-white/80">
                Claude
              </div>
              <div className="h-px w-10 border-t border-dashed border-white/30" />
              <div className="px-3 py-1.5 rounded bg-sky-500/10 border border-sky-400/40 font-mono text-[11.5px] text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                memorable
              </div>
            </div>
          </DocsLiquidCard>

          {/* Card 4: How recall finds it */}
          <DocsLiquidCard
            icon={<Search className="w-4 h-4" />}
            title="How recall finds it"
            description="Procedures name a target by what it is about. Semantic and lexical resolution blended."
          >
            <div className="rounded-lg bg-black/70 border border-white/[0.08] p-3.5 font-mono text-[11px] space-y-1.5 min-h-[96px]">
              <div className="text-white/60">$ memorable recall &quot;auth tests&quot;</div>
              <div className="flex justify-between text-white/40 text-[10px]">
                <span>exact</span>
                <span>miss</span>
              </div>
              <div className="flex justify-between text-sky-300 text-[10px]">
                <span>lexical</span>
                <span>0.86 hit</span>
              </div>
              <div className="flex justify-between text-white/40 text-[10px]">
                <span>semantic</span>
                <span>0.79</span>
              </div>
            </div>
          </DocsLiquidCard>

          {/* Card 5: One endpoint */}
          <DocsLiquidCard
            icon={<Compass className="w-4 h-4" />}
            title="One endpoint"
            description="One API call converts a tool-call trace into a verified, parameterized procedure."
          >
            <div className="rounded-lg bg-black/70 border border-white/[0.08] p-3.5 flex items-center justify-between gap-2 min-h-[96px] font-mono text-[10px]">
              <div className="space-y-0.5 text-white/60">
                <div>POST</div>
                <div>/v1/extract</div>
                <div className="text-white/30">tool_calls[]</div>
              </div>
              <div className="text-sky-400">→</div>
              <div className="px-2.5 py-1.5 rounded bg-white/[0.04] border border-sky-400/30 text-sky-300 space-y-0.5">
                <div className="font-semibold">procedure</div>
                <div className="text-white/40">steps[]</div>
              </div>
            </div>
          </DocsLiquidCard>

          {/* Card 6: Keep the store yours */}
          <DocsLiquidCard
            icon={<ShieldCheck className="w-4 h-4" />}
            title="Keep the store yours"
            description="Local filesystem by default or backed by your own database with memorable init."
          >
            <div className="rounded-lg bg-black/70 border border-white/[0.08] p-3.5 font-mono text-[10px] space-y-1 text-white/60 min-h-[96px]">
              <div>memorable init this machine</div>
              <div>memorable init gbrain your db</div>
              <div className="text-amber-300/90 font-medium">memorable init qm QM postgres</div>
            </div>
          </DocsLiquidCard>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* Section 3: Quickstart                                                     */}
      {/* ========================================================================= */}
      <section id="quickstart" className="scroll-mt-28 space-y-6 pt-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Quickstart
        </h2>

        <p className="text-[15px] sm:text-[16px] text-white/60 leading-relaxed max-w-3xl">
          Two minutes. Signing in links this machine to your workspace; the default backend is a
          standalone local store, and on a machine running gbrain you can point it at your own database with{' '}
          <code className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white text-[13px]">
            memorable init gbrain
          </code>{' '}
          afterwards.
        </p>

        {/* Side-by-side Install Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocsCodeBlock title="connect this machine" code={connectMachineCode}>
            <div className="space-y-1 text-[12px] text-white/75">
              <div>
                <span className="text-white/30 mr-2">&gt;</span>
                <span className="text-white font-medium">npx memorable-cli@latest login</span>
                <span className="text-white/35 ml-3"># opens browser</span>
              </div>
              <div>
                <span className="text-white/30 mr-2">&gt;</span>
                <span className="text-white font-medium">memorable enable</span>
                <span className="text-white/35 ml-3"># explicit write consent</span>
              </div>
            </div>
          </DocsCodeBlock>

          <DocsCodeBlock title="no node or npm on this machine" code={noNodeCode}>
            <div className="space-y-1 text-[12px] text-white/75">
              <div>
                <span className="text-white/30 mr-2">&gt;</span>
                <span className="text-white font-medium">curl -fsSL https://memorable.sh/install.sh | sh</span>
              </div>
              <div>
                <span className="text-white/30 mr-2">&gt;</span>
                <span className="text-white/40"># then: memorable login</span>
              </div>
            </div>
          </DocsCodeBlock>
        </div>

        {/* Wide Store & Find Procedure Container */}
        <DocsCodeBlock title="store a procedure, then find it" code={storeProcedureCode}>
          <div className="space-y-1.5 text-[12.5px] text-white/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white/30 mr-2">&gt;</span>
                <span className="text-white font-medium">memorable ingest trace.json</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white/30 mr-2">&gt;</span>
                <span className="text-white font-medium">memorable recall &apos;rotate the TLS cert&apos;</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-white/30 mr-2">&gt;</span>
                <span className="text-white font-medium">memorable show &lt;slug&gt;</span>
              </div>
              <span className="text-white/40 text-[11px]"># guarded, injection-safe rendering</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-white/30 mr-2">&gt;</span>
                <span className="text-white font-medium">memorable list</span>
              </div>
              <span className="text-white/40 text-[11px]"># everything stored, newest first</span>
            </div>
          </div>
        </DocsCodeBlock>
      </section>

      {/* ========================================================================= */}
      {/* Section 4: For agents                                                     */}
      {/* ========================================================================= */}
      <section id="for-agents" className="scroll-mt-28 space-y-6 pt-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          For agents
        </h2>

        <p className="text-[15px] sm:text-[16px] text-white/60 leading-relaxed max-w-3xl">
          Telling a coding agent &quot;use memorable&quot; is enough. Every step is a plain CLI call
          it can run itself. The drop-in file lives on{' '}
          <code className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white text-[13px]">
            AGENTS.md
          </code>.
        </p>

        <div className="max-w-2xl">
          <DocsCodeBlock title="one line" code={agentOneLineCode}>
            <div className="text-[12.5px] text-white/80">
              <span className="text-white/30 mr-2">&gt;</span>
              <span className="text-sky-300 font-medium">memorable agents-md &gt;&gt; AGENTS.md</span>
            </div>
          </DocsCodeBlock>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* Section 5: Measured                                                       */}
      {/* ========================================================================= */}
      <section id="measured" className="scroll-mt-28 space-y-6 pt-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Measured
        </h2>

        <p className="text-[15px] sm:text-[16px] text-white/60 leading-relaxed max-w-3xl">
          Against the same tasks run without memory, on two independent runs.
        </p>

        <div className="max-w-2xl">
          <DocsCodeBlock title="Recall vs no recall" code={measuredBenchmarkCode}>
            <div className="space-y-1.5 text-[12.5px] font-mono text-white/80">
              <div className="flex justify-between">
                <span className="text-white/50">agent turns</span>
                <span className="text-sky-300 font-semibold">-19%, replicated</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">pass rate</span>
                <span className="text-zinc-200">every run passed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">injected size</span>
                <span className="text-white/90">~293 tokens</span>
              </div>
              <div className="flex justify-between text-white/40 text-[11.5px] pt-1 border-t border-white/[0.06]">
                <span>vs a 15,593-token skill:</span>
                <span>0% turns</span>
              </div>
            </div>
          </DocsCodeBlock>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* Section 6: Extraction API                                                 */}
      {/* ========================================================================= */}
      <section id="extraction-api" className="scroll-mt-28 space-y-6 pt-4 pb-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Extraction API
        </h2>

        <p className="text-[15px] sm:text-[16px] text-white/60 leading-relaxed max-w-3xl">
          One endpoint converts a tool-call trace into a procedure. Full reference on the{' '}
          <span className="text-white font-semibold underline underline-offset-4 decoration-white/30">
            API
          </span>{' '}
          page.
        </p>

        {/* Dual Code Columns: POST Request vs Response 200 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Request Payload */}
          <DocsCodeBlock title="POST /v1/extract" code={apiRequestCode} className="h-full">
            <pre className="text-[11.5px] text-white/75 leading-relaxed font-mono overflow-x-auto">
              <span className="text-white/40">BASE=</span><span className="text-sky-300">https://memorable-extraction-api.memorable.workers.dev</span>{'\n\n'}
              <span className="text-white/90">curl $BASE/v1/extract \</span>{'\n'}
              <span className="text-white/70">  -H &quot;Authorization: Bearer \$MEMORABLE_API_KEY&quot; \</span>{'\n'}
              <span className="text-white/70">  -H &quot;Content-Type: application/json&quot; \</span>{'\n'}
              <span className="text-white/70">  -d &apos;{'{'}</span>{'\n'}
              <span className="text-white/70">    &quot;session_id&quot;: &quot;run-183&quot;,</span>{'\n'}
              <span className="text-white/70">    &quot;task_description&quot;: &quot;rotate the TLS cert&quot;,</span>{'\n'}
              <span className="text-white/70">    &quot;harness&quot;: &quot;my-orchestrator&quot;,</span>{'\n'}
              <span className="text-white/70">    &quot;tool_calls&quot;: [</span>{'\n'}
              <span className="text-white/70">      {'{'}</span>{'\n'}
              <span className="text-white/70">        &quot;name&quot;: &quot;shell&quot;,</span>{'\n'}
              <span className="text-white/70">        &quot;input&quot;: {'{'}&quot;command&quot;: &quot;certbot renew&quot;{'}'},</span>{'\n'}
              <span className="text-white/70">        &quot;result&quot;: {'{'}&quot;ok&quot;: true{'}'}</span>{'\n'}
              <span className="text-white/70">      {'}'}</span>{'\n'}
              <span className="text-white/70">    ]</span>{'\n'}
              <span className="text-white/70">  {'}'}&apos;</span>
            </pre>
          </DocsCodeBlock>

          {/* Response Payload */}
          <DocsCodeBlock title="Response · 200" code={apiResponseCode} className="h-full">
            <pre className="text-[11.5px] text-white/75 leading-relaxed font-mono overflow-x-auto">
              {`{
  "draft": {
    "title": "Rotate the TLS cert",
    "schema_version": "1.0.0",
    "steps": [
      {
        "seq": 1,
        "action": "shell",
        "activity_class": "execute",
        "command": "certbot renew",
        "repeat_count": 1
      }
    ],
    "postconditions": [
      "final command exited successfully: certbot renew"
    ],
    "embedding": [],
    "embedding_model": ""
  },
  "request_id": "82886df0-91a4-49c0-9fa5"
}`}
            </pre>
          </DocsCodeBlock>
        </div>
      </section>

    </div>
  );
}
