'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Menu, X } from 'lucide-react';
import { Logo } from './Logo';

const NAV_ITEMS = [
  { label: 'DOCS', href: '#docs' },
  { label: 'USE-CASE', href: '#use-case' },
  { label: 'CASE STUDIES', href: '#case-studies' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('USE-CASE');
  const [clickedNav, setClickedNav] = useState<string | null>(null);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string, href: string) => {
    setActiveNav(label);
    setClickedNav(label);
    setTimeout(() => setClickedNav(null), 400);

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="landing-header-wrapper">
      <header className="landing-header">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex" aria-label="Marketing navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.label;
            const isClicked = clickedNav === item.label;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.label, item.href)}
                className={
                  isActive
                    ? `use-case-badge ${isClicked ? 'is-clicked' : ''}`
                    : 'landing-nav-link'
                }
              >
                {item.label}
              </a>
            );
          })}
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
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.label;
              return (
                <a
                  key={`mob-${item.label}`}
                  href={item.href}
                  onClick={(e) => {
                    handleNavClick(e, item.label, item.href);
                    setOpen(false);
                  }}
                  className={
                    isActive
                      ? 'block my-1 text-center use-case-badge w-full py-2.5 text-xs'
                      : 'block rounded-lg px-3 py-2.5 text-sm font-mono tracking-wider text-white/65 hover:bg-white/[0.05] hover:text-[#b4a6ff]'
                  }
                >
                  {item.label}
                </a>
              );
            })}
            <a href="mailto:hello@agentguard.dev" className="mt-2 block rounded-lg border border-white/10 text-center px-3 py-2.5 text-sm font-mono tracking-wider text-white">BOOK A CALL</a>
            <Link href="/mcp" className="mt-2 flex items-center justify-center rounded-lg bg-white px-3 py-2.5 text-sm font-bold tracking-wider text-black">DASHBOARD</Link>
          </div>
        )}
      </header>
    </div>
  );
}
