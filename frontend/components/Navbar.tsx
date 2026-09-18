"use client";

import React, { useState } from "react";
import { Github, ChevronDown, Download, Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#000000]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Brand Logo - Matching Superset Typography */}
        <div className="flex items-center gap-3">
          <a href="#" className="font-sans text-xl font-black tracking-tighter text-white hover:opacity-90 transition-opacity">
            AGENTGUARD
          </a>
        </div>

        {/* Center Navigation - Matching Superset Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-zinc-400">
          <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors group">
            <span>Product</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-500 group-hover:text-white transition-transform group-hover:rotate-180" />
          </div>
          <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors group">
            <span>Architecture</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-500 group-hover:text-white transition-transform group-hover:rotate-180" />
          </div>
          <a href="#features" className="hover:text-white transition-colors">
            Security Engines
          </a>
          <a href="#policy-sandbox" className="hover:text-white transition-colors">
            Policy Engine
          </a>
          <a href="#audit-ledger" className="hover:text-white transition-colors">
            Audit Ledger
          </a>
          <a href="#attack-demo" className="hover:text-white transition-colors">
            Attack Sandbox
          </a>
        </nav>

        {/* Right Actions - Matching Superset GitHub Stars & White CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="https://github.com/aashutoshkumarbhardwaj/Titan"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-white transition-colors py-1 px-2 rounded-md hover:bg-zinc-900"
          >
            <Github className="h-4 w-4" />
            <span className="font-semibold text-zinc-300">13.9k</span>
          </a>

          <a
            href="#live-interceptor"
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-mono text-xs font-bold text-black uppercase tracking-wider transition-all hover:bg-zinc-200 active:scale-95 shadow-sm"
          >
            <span>Deploy Gateway</span>
            <Download className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-white/[0.08] bg-black px-6 py-5 md:hidden space-y-4 text-sm font-medium">
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-400 hover:text-white">Product</a>
          <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-400 hover:text-white">Architecture</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-400 hover:text-white">Security Engines</a>
          <a href="#policy-sandbox" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-400 hover:text-white">Policy Engine</a>
          <a href="#audit-ledger" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-400 hover:text-white">Audit Ledger</a>
          <a href="#attack-demo" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-400 hover:text-white">Attack Defense</a>
          <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
            <a
              href="https://github.com/aashutoshkumarbhardwaj/Titan"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-zinc-300"
            >
              <Github className="h-4 w-4" />
              <span>GitHub (13.9k stars)</span>
            </a>
            <a
              href="#live-interceptor"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center rounded-lg bg-white py-2.5 font-mono text-xs font-bold text-black uppercase tracking-wider"
            >
              Deploy Gateway
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
