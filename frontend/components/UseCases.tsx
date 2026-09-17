import React from "react";
import { Terminal, Shield, GitPullRequest, DollarSign, LifeBuoy, Search, Server, ArrowRight } from "lucide-react";

export default function UseCases() {
  const cases = [
    {
      title: "Enterprise Copilots",
      role: "Internal Knowledge & Communications",
      desc: "Prevent enterprise agents from exfiltrating executive strategy documents, confidential HR compensation sheets, or sending unauthorized all-hands emails.",
      protectedActions: ["document.read(unauthorized_tier)", "email.broadcast()", "slack.post_channel(#executives)"],
      icon: Shield,
      riskDefault: "APPROVAL REQUIRED",
    },
    {
      title: "Autonomous Coding Agents",
      role: "Repository & Pipeline Automation",
      desc: "Stop coding agents from injecting malicious dependencies, pushing unreviewed commits directly to main branches, or reading .env secret credentials.",
      protectedActions: ["git.push(branch='main')", "credential.read(AWS_KEY)", "filesystem.rm('-rf')"],
      icon: GitPullRequest,
      riskDefault: "BLOCKED",
    },
    {
      title: "Customer Support Agents",
      role: "Ticketing & Client Communications",
      desc: "Restrict support agents from leaking personally identifiable information (PII), issuing unapproved chargebacks, or transmitting customer transcripts externally.",
      protectedActions: ["stripe.refund(> $200)", "pii.export(ssn_records)", "email.send(external_domain)"],
      icon: LifeBuoy,
      riskDefault: "APPROVAL REQUIRED",
    },
    {
      title: "Research & Browsing Agents",
      role: "Web Intelligence & Data Harvesting",
      desc: "Enforce strict network egress boundaries so browsing agents cannot be tricked by malicious web-page prompt injections into exfiltrating session tokens.",
      protectedActions: ["browser.download_file()", "http.post(untrusted_c2)", "cookie.extract()"],
      icon: Search,
      riskDefault: "BLOCKED",
    },
    {
      title: "Autonomous Finance Agents",
      role: "Billing & Ledger Management",
      desc: "Gate high-consequence monetary operations behind deterministic dual-custody human approvals. No agent can unilaterally initiate a wire transfer.",
      protectedActions: ["banking.wire_transfer()", "ledger.delete_entry()", "invoice.approve(> $5,000)"],
      icon: DollarSign,
      riskDefault: "MANDATORY APPROVAL",
    },
    {
      title: "DevOps & SRE Agents",
      role: "Cloud Infrastructure Management",
      desc: "Prevent autonomous infrastructure agents from dropping production databases, deleting Kubernetes clusters, or opening security group 0.0.0.0/0 ports.",
      protectedActions: ["rds.delete_cluster()", "security_group.allow_all()", "s3.make_public()"],
      icon: Server,
      riskDefault: "HARD BLOCKED",
    },
  ];

  return (
    <section className="py-24 border-b border-slate-800 bg-[#070A12] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3 py-1 font-mono text-xs font-semibold text-emerald-400 mb-3">
            <Terminal className="h-3.5 w-3.5" />
            <span>REAL-WORLD DEPLOYMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            Securing agents by their real-world actions.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            We don&apos;t build security for generic industry categories. We govern the high-consequence tools and APIs your agents actually invoke.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((cs, idx) => {
            const Icon = cs.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-[#090D18] p-6 hover:border-slate-700 transition-all font-mono text-xs flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                      {cs.riskDefault}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base font-sans mb-1">
                    {cs.title}
                  </h3>
                  <div className="text-cyan-400 text-[11px] mb-3">
                    {cs.role}
                  </div>

                  <p className="text-slate-300 font-sans text-xs leading-relaxed mb-4">
                    {cs.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">
                    Intercepted Actions:
                  </span>
                  {cs.protectedActions.map((act, i) => (
                    <div key={i} className="text-[11px] text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800/60 truncate font-mono">
                      {act}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
