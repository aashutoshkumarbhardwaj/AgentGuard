'use client';

import { useState, useEffect } from 'react';

const TOC_ITEMS = [
  { id: 'overview', title: 'Overview' },
  { id: 'features', title: 'Features' },
  { id: 'quickstart', title: 'Quickstart' },
  { id: 'for-agents', title: 'Agent Extensions' },
  { id: 'measured', title: 'Measured' },
  { id: 'extraction-api', title: 'Authorization API' },
];

export function DocsTableOfContents() {
  const [activeId, setActiveId] = useState('overview');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    TOC_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <aside className="hidden xl:block w-52 flex-shrink-0 select-none">
      <div className="sticky top-28 pl-4 border-l border-white/[0.08] space-y-3">
        <h4 className="font-mono text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-3">
          On this page
        </h4>

        <nav className="space-y-2">
          {TOC_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`relative block text-[12.5px] transition-all duration-200 py-1 pl-3 ${
                  isActive
                    ? 'text-white font-medium'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute -left-[17px] top-1 bottom-1 w-[2px] rounded-full bg-gradient-to-b from-rose-400 to-amber-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
                )}
                <span>{item.title}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
