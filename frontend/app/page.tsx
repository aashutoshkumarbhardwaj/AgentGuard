import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LiveInterceptor from "@/components/LiveInterceptor";
import ProblemComparison from "@/components/ProblemComparison";
import SolutionPillars from "@/components/SolutionPillars";
import FeatureGrid from "@/components/FeatureGrid";
import AttackSimulation from "@/components/AttackSimulation";
import ContextAwareness from "@/components/ContextAwareness";
import PolicySandbox from "@/components/PolicySandbox";
import HumanApprovalModal from "@/components/HumanApprovalModal";
import AuditLedger from "@/components/AuditLedger";
import DeterministicSecurity from "@/components/DeterministicSecurity";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import TechStack from "@/components/TechStack";
import DeveloperSdk from "@/components/DeveloperSdk";
import UseCases from "@/components/UseCases";
import SecurityPrinciples from "@/components/SecurityPrinciples";
import Footer from "@/components/Footer";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import ThreatRadar from "@/components/ui/ThreatRadar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000000] text-zinc-100 selection:bg-white/20 selection:text-white relative">
      {/* Subtle Ambient Background */}
      <ParticlesBackground />

      <div className="relative z-10">
        {/* 01 Navigation Bar */}
        <Navbar />

        {/* 02 Hero Section - Superset Style */}
        <Hero />

        {/* 03 Live Security Interceptor Demo */}
        <LiveInterceptor />

        {/* 03b Real-Time Telemetry & Incident Monitor */}
        <section id="threat-radar" className="py-16 border-b border-white/[0.08] bg-[#000000] relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ThreatRadar />
          </div>
        </section>

        {/* 04 Architectural Problem Comparison */}
        <ProblemComparison />

        {/* 05 Solution: Three Pillars (Intercept, Decide, Enforce) */}
        <SolutionPillars />

        {/* 06 Six Security Engines Grid with Mouse Spotlights */}
        <FeatureGrid />

        {/* 07 The Killer Feature: Prompt Injection & Attack Simulation */}
        <AttackSimulation />

        {/* 08 Context-Aware Multi-Dimensional Authorization */}
        <ContextAwareness />

        {/* 09 Interactive Policy Editor & Runtime Simulator */}
        <PolicySandbox />

        {/* 10 Human-in-the-Loop Supervisory Approvals */}
        <HumanApprovalModal />

        {/* 11 Tamper-Evident SHA-256 Audit Ledger */}
        <AuditLedger />

        {/* 12 Deterministic Safety vs LLM Self-Policing */}
        <DeterministicSecurity />

        {/* 13 Amazon Bedrock & AgentGuard Architecture Flow */}
        <ArchitectureDiagram />

        {/* 14 Enterprise AWS Technology Stack */}
        <TechStack />

        {/* 15 Developer SDK Integration (Python & TypeScript) */}
        <DeveloperSdk />

        {/* 16 Concrete Agent Action Use Cases */}
        <UseCases />

        {/* 17 The Five Axioms of Agent Governance */}
        <SecurityPrinciples />

        {/* 18 Hackathon Evaluator Call to Action & Footer */}
        <Footer />
      </div>
    </main>
  );
}
