import React from "react";
import { Cloud, Shield, Database, Server, Code, Lock } from "lucide-react";

export default function TechStack() {
  const stack = [
    {
      category: "AI & ORCHESTRATION",
      name: "Amazon Bedrock",
      role: "Agent Runtime & Observability",
      description: "Powers autonomous multi-turn agent reasoning and generates contextual, human-readable security explanations for intercepted actions.",
      icon: Cloud,
      tag: "AWS Bedrock",
      color: "cyan",
    },
    {
      category: "SECURITY POLICIES",
      name: "Cedar Policy Language",
      role: "Deterministic Authorization",
      description: "AWS-developed high-performance policy engine providing provable least-privilege guarantees with sub-millisecond evaluation times.",
      icon: Shield,
      tag: "Cedar Engine",
      color: "emerald",
    },
    {
      category: "RUNTIME BACKEND",
      name: "Python & FastAPI",
      role: "Gateway Microservice",
      description: "Asynchronous, high-throughput REST and WebSocket proxy sitting directly in-line between the AI agent and the external tool ecosystem.",
      icon: Server,
      tag: "FastAPI",
      color: "emerald",
    },
    {
      category: "IMMUTABLE STORAGE",
      name: "AWS DynamoDB & S3",
      role: "Hash-Chained Audit Ledger",
      description: "High-durability document and object storage storing SHA-256 hash-chained telemetry records with zero retroactive mutability.",
      icon: Database,
      tag: "DynamoDB + S3",
      color: "amber",
    },
    {
      category: "EVENT ESCALATION",
      name: "Amazon EventBridge",
      role: "Human-in-the-Loop Webhooks",
      description: "Publishes high-risk authorization events to human notification channels, Security Operations Centers, and incident workflows.",
      icon: Lock,
      tag: "EventBridge",
      color: "purple",
    },
    {
      category: "OPERATOR CONSOLE",
      name: "Next.js & Tailwind CSS",
      role: "Real-time Security Cockpit",
      description: "Responsive, high-density cybersecurity interface with live telemetry feeds, policy sandboxes, and cryptographic ledger verification.",
      icon: Code,
      tag: "Next.js 14",
      color: "cyan",
    },
  ];

  return (
    <section id="tech-stack" className="py-24 border-b border-slate-800 bg-[#070A12] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-3 py-1 font-mono text-xs font-semibold text-cyan-400 mb-3">
            <Cloud className="h-3.5 w-3.5" />
            <span>TECHNOLOGY FOUNDATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            Built for enterprise-grade AI security.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Engineered on the AWS and modern security stack to deliver provable least privilege, sub-millisecond evaluation, and cryptographic auditability.
          </p>
        </div>

        {/* Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stack.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-[#090D18] p-6 hover:border-slate-700 transition-all font-mono text-xs flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
                    <span>{item.category}</span>
                    <span className="text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      {item.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <Icon className="h-5 w-5 text-emerald-400 shrink-0" />
                    <h3 className="font-bold text-white text-base font-sans">{item.name}</h3>
                  </div>

                  <div className="text-emerald-400 font-mono text-[11px] mb-3">
                    {item.role}
                  </div>

                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
                  Zero external telemetry leaks • Enterprise VPC ready
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
