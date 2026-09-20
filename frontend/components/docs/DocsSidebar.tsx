'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface SidebarItem {
  title: string;
  href: string;
  hasChevron?: boolean;
}

interface SidebarSection {
  heading: string;
  items: SidebarItem[];
}

const SIDEBAR_NAV: SidebarSection[] = [
  {
    heading: 'GETTING STARTED',
    items: [
      { title: 'Overview', href: '#overview' },
      { title: 'Features', href: '#features' },
      { title: 'Quickstart', href: '#quickstart' },
      { title: 'Agent Extensions', href: '#for-agents' },
    ],
  },
  {
    heading: 'PERFORMANCE',
    items: [
      { title: 'Measured Benchmarks', href: '#measured' },
    ],
  },
  {
    heading: 'API',
    items: [
      { title: 'Authorization API', href: '#extraction-api', hasChevron: true },
    ],
  },
  {
    heading: 'INTEGRATIONS',
    items: [
      { title: 'Python SDK', href: '#quickstart' },
      { title: 'MCP Gateway', href: '/mcp' },
    ],
  },
];

interface DocsSidebarProps {
  activeId?: string;
  onSelect?: (href: string) => void;
}

export function DocsSidebar({ activeId = 'overview', onSelect }: DocsSidebarProps) {
  const [activeItem, setActiveItem] = useState(activeId);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setActiveItem(href.replace('#', ''));
    if (onSelect) onSelect(href);

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="w-full lg:w-60 flex-shrink-0 select-none">
      <div className="sticky top-28 space-y-8 pr-4">
        {SIDEBAR_NAV.map((section) => (
          <div key={section.heading} className="space-y-2">
            <h4 className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40 px-2">
              {section.heading}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => {
                const targetId = item.href.replace('#', '');
                const isActive = activeItem === targetId;

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={(e) => handleClick(e, item.href)}
                    className={`group flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-white/[0.12] to-white/[0.04] text-white shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-white/10'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>{item.title}</span>
                    {item.hasChevron && (
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isActive
                            ? 'text-white/80 rotate-90'
                            : 'text-white/30 group-hover:text-white/60'
                        }`}
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
