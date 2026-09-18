"use client";

import React, { useState } from "react";
import { Code, Copy, Check, Terminal, ArrowRight } from "lucide-react";

export default function DeveloperSdk() {
  const [lang, setLang] = useState<"python" | "typescript">("python");
  const [copied, setCopied] = useState(false);

  const pythonCode = `import agentguard

# 1. Initialize the AgentGuard runtime client
client = agentguard.Client(
    api_key="ag_live_secops_94821a",
    cluster_endpoint="https://gateway.agentguard.io"
)

# 2. Intercept tool invocation before execution
@client.wrap_tool
def send_customer_email(recipient: str, subject: str, attachment: str):
    # AgentGuard evaluates Cedar policies, context entropy, and quantitative risk
    verdict = client.authorize(
        agent="bedrock-sales-copilot-v2",
        action="email.send",
        resource=attachment,
        destination=recipient,
        user_intent="Summarize and transmit monthly sales report"
    )

    if verdict.is_blocked:
        raise agentguard.SecurityViolation(f"Execution halted: {verdict.reason}")

    if verdict.requires_approval:
        print(f"Paused for human sign-off: ticket #{verdict.approval_id}")
        verdict.wait_for_approval(timeout_seconds=300)

    # Proceed safely with execution
    return smtp_client.send(to=recipient, subject=subject, file=attachment)`;

  const tsCode = `import { AgentGuardClient } from "@agentguard/sdk";

// 1. Initialize AgentGuard in-line client
const guard = new AgentGuardClient({
  apiKey: process.env.AGENTGUARD_API_KEY,
  endpoint: "https://gateway.agentguard.io"
});

// 2. Wrap LangChain / Bedrock agent tool call
async function executeAgentTool(toolName: string, params: Record<string, any>) {
  const verdict = await guard.authorize({
    agentId: "claude-devops-agent",
    action: toolName,
    resource: params.targetPath,
    destination: params.externalUrl,
    metadata: { session: params.sessionId }
  });

  if (verdict.decision === "BLOCK") {
    console.error(\`AgentGuard blocked action: \${verdict.reason}\`);
    return { status: "TERMINATED_BY_SECURITY_POLICY", reason: verdict.reason };
  }

  if (verdict.decision === "REQUIRE_APPROVAL") {
    await verdict.awaitHumanSupervisor({ timeoutMinutes: 10 });
  }

  return dispatchToLocalSystem(toolName, params);
}`;

  const currentCode = lang === "python" ? pythonCode : tsCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developer-sdk" className="py-24 border-b border-slate-800 bg-[#06080E] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3 py-1 font-mono text-xs font-semibold text-emerald-400 mb-3">
            <Code className="h-3.5 w-3.5" />
            <span>DEVELOPER INTEGRATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            Three lines of code to secure any agent.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Drop AgentGuard between your LLM orchestrator and your tools. Native support for Amazon Bedrock, LangChain, CrewAI, AutoGen, and custom Python/Node backends.
          </p>
        </div>

        {/* Code Snippet Box */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-[#0A0E1A] shadow-2xl overflow-hidden font-mono text-xs">
          
          {/* Code Window Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#070A12] px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang("python")}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  lang === "python" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Python SDK (agentguard-python)
              </button>
              <button
                onClick={() => setLang("typescript")}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  lang === "typescript" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                TypeScript SDK (@agentguard/sdk)
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-3 py-1 rounded"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied!" : "Copy Snippet"}</span>
            </button>
          </div>

          {/* Code Content */}
          <div className="p-6 overflow-x-auto bg-[#070910] text-slate-300 leading-relaxed font-mono">
            <pre className="text-xs">
              <code>{currentCode}</code>
            </pre>
          </div>

          {/* Footer Ribbon */}
          <div className="border-t border-slate-800 bg-[#0A0E1A] px-6 py-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>pip install agentguard  |  npm install @agentguard/sdk</span>
            <span className="text-emerald-400 flex items-center gap-1">
              Zero agent re-training needed <ArrowRight className="h-3 w-3" />
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
