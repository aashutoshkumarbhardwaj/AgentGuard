"use client";

import React, { useState } from "react";
import { ShieldCheck, Terminal, Github, ExternalLink, Menu, X, Lock } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#06080D]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 glow-emerald">
            <ShieldCheck className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <span className="font-mono text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Agent<span className="text-emerald-400">Guard</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest text-slate-400 border-l border-slate-700 pl-2 ml-1">
              Runtime Security Layer
            </span>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3 py-1 font-mono text-xs text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SYSTEM ACTIVE</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">0 ACTIVE BREACHES</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-emerald-400 transition-colors">Security Engines</a>
          <a href="#attack-demo" className="hover:text-emerald-400 transition-colors">Attack Defense</a>
          <a href="#policy-sandbox" className="hover:text-emerald-400 transition-colors">Policy Sandbox</a>
          <a href="#audit-ledger" className="hover:text-emerald-400 transition-colors">Audit Ledger</a>
          <a href="#architecture" className="hover:text-emerald-400 transition-colors">Architecture</a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#attack-demo"
            className="flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-950/20 px-3 py-1.5 font-mono text-xs font-semibold text-red-300 transition-all hover:border-red-500/60 hover:bg-red-950/40 hover:text-red-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
            Simulate Attack
          </a>
          <a
            href="#live-interceptor"
            className="flex items-center gap-1.5 rounded-md bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow transition-all hover:bg-emerald-400 hover:shadow-emerald-500/25"
          >
            <Terminal className="h-3.5 w-3.5" />
            Live Demo
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-[#0A0D15] px-4 py-4 sm:hidden">
          <nav className="flex flex-col gap-3 font-mono text-sm text-slate-300">
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-emerald-400">How It Works</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-emerald-400">Security Engines</a>
            <a href="#attack-demo" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-emerald-400">Attack Defense</a>
            <a href="#policy-sandbox" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-emerald-400">Policy Sandbox</a>
            <a href="#audit-ledger" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-emerald-400">Audit Ledger</a>
            <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-emerald-400">Architecture</a>
            <div className="mt-2 pt-2 border-t border-slate-800 flex flex-col gap-2">
              <a
                href="#attack-demo"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-md border border-red-500/30 bg-red-950/20 py-2 text-xs font-mono text-red-300"
              >
                Simulate Attack
              </a>
              <a
                href="#live-interceptor"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-md bg-emerald-500 py-2 text-xs font-semibold text-slate-950"
              >
                Launch Console
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
