'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Code2, Key, Terminal } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

const codeSnippets = {
  Python: `from agentguard import AgentGuard

guard = AgentGuard(
    api_key="ag_live_..."
)

decision = guard.authorize(
    agent="research-agent",
    action="file.modify"
)`,
  JavaScript: `import { AgentGuard } from '@agentguard/sdk';

const guard = new AgentGuard({
  apiKey: 'ag_live_...'
});

const decision = await guard.authorize({
  agent: 'research-agent',
  action: 'file.modify'
});`,
  MCP: `{
  "mcpServers": {
    "agentguard": {
      "command": "agentguard",
      "args": ["--mcp"],
      "env": {
        "AGENTGUARD_API_KEY": "ag_live_..."
      }
    }
  }
}`,
  REST: `curl -X POST https://api.agentguard.io/v1/authorize \\
  -H "Authorization: Bearer ag_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent": "research-agent",
    "action": "file.modify"
  }'`,
};

type SdkType = keyof typeof codeSnippets;

export default function DeveloperPage() {
  const [activeSdk, setActiveSdk] = useState<SdkType>('Python');
  const [copied, setCopied] = useState(false);
  const [keyVisible, setKeyVisible] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeSdk]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <PageHeader title="Developer" subtitle="API access and SDK integration" />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* API credentials */}
        <div className="rounded-xl border border-border bg-card/30 backdrop-blur-sm p-6">
          <h2 className="text-sm font-semibold mb-4">API Configuration</h2>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">API Endpoint</p>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                <Code2 className="h-4 w-4 text-info shrink-0" />
                <code className="text-sm font-mono text-muted-foreground truncate">https://api.agentguard.io</code>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">API Key</p>
              <button
                onClick={() => setKeyVisible(!keyVisible)}
                className="flex w-full items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-left hover:border-border/80 transition-colors"
              >
                <Key className="h-4 w-4 text-warning shrink-0" />
                <code className="text-sm font-mono flex-1">
                  {keyVisible ? 'ag_live_8f3a9b2c1d5e7f0a' : 'ag_live_••••••••••••••••'}
                </code>
                <span className="text-xs text-muted-foreground">{keyVisible ? 'Hide' : 'Reveal'}</span>
              </button>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Environment</p>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                <span className="flex h-2 w-2 rounded-full bg-success" />
                <code className="text-sm font-mono">production</code>
              </div>
            </div>
          </div>
        </div>

        {/* SDK code viewer */}
        <div className="rounded-xl border border-border bg-card/30 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" /> SDK
            </h2>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* SDK tabs */}
          <div className="flex gap-1 mb-3">
            {(Object.keys(codeSnippets) as SdkType[]).map((sdk) => (
              <button
                key={sdk}
                onClick={() => setActiveSdk(sdk)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  activeSdk === sdk
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground border border-transparent'
                )}
              >
                {sdk}
              </button>
            ))}
          </div>

          <motion.pre
            key={activeSdk}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg border border-border bg-muted/20 p-4 text-xs font-mono overflow-x-auto leading-relaxed"
          >
            {codeSnippets[activeSdk]}
          </motion.pre>
        </div>
      </div>
    </div>
  );
}
