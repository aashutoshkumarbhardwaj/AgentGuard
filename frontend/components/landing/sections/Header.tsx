'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Menu, X } from 'lucide-react';
import { Logo } from './Logo';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <div className="landing-header-wrapper">
      <header className="landing-header">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Marketing navigation">
          <a href="#docs" className="landing-nav-link active">DOCS</a>
          <a href="#use-case" className="landing-nav-link">USE-CASE</a>
          <a href="#case-studies" className="landing-nav-link">CASE STUDIES</a>
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <a href="mailto:hello@agentguard.dev" className="landing-outline-button">BOOK A CALL</a>
          <Link href="/mcp" className="landing-solid-button">
            DASHBOARD <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-white md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
        {open && (
          <div className="absolute left-0 right-0 top-[60px] z-40 rounded-xl border border-white/10 bg-[#0a0a0d]/95 p-3 shadow-2xl backdrop-blur-xl md:hidden">
            <a href="#docs" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-mono tracking-wider text-white/65 hover:bg-white/[0.05] hover:text-[#b4a6ff]">DOCS</a>
            <a href="#use-case" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-mono tracking-wider text-white/65 hover:bg-white/[0.05] hover:text-[#b4a6ff]">USE-CASE</a>
            <a href="#case-studies" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-mono tracking-wider text-white/65 hover:bg-white/[0.05] hover:text-[#b4a6ff]">CASE STUDIES</a>
            <a href="mailto:hello@agentguard.dev" className="mt-2 block rounded-lg border border-white/10 text-center px-3 py-2.5 text-sm font-mono tracking-wider text-white">BOOK A CALL</a>
            <Link href="/mcp" className="mt-2 flex items-center justify-center rounded-lg bg-white px-3 py-2.5 text-sm font-bold tracking-wider text-black">DASHBOARD</Link>
          </div>
        )}
      </header>
    </div>
  );
}
