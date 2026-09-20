'use client';

import { useState, useRef } from 'react';

interface DocsLiquidCardProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export function DocsLiquidCard({
  children,
  className = '',
  icon,
  title,
  description,
}: DocsLiquidCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-2xl p-6 flex flex-col justify-between overflow-hidden bg-[#090a10]/85 border border-white/[0.09] hover:border-white/[0.22] backdrop-blur-2xl transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(56,189,248,0.12)] ${className}`}
    >
      {/* Liquid Spotlight Radial Highlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.12), rgba(255, 255, 255, 0.05) 40%, transparent 80%)`,
        }}
      />

      {/* Liquid specular edge glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(220px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.15), transparent 70%)`,
          maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* Top Preview / Interactive Graphic */}
      <div className="relative z-10 w-full mb-5">{children}</div>

      {/* Card Info: Title, Icon, Description */}
      <div className="relative z-10">
        {title && (
          <h3 className="flex items-center gap-2.5 text-[17px] font-semibold text-white tracking-tight group-hover:text-white transition-colors">
            {icon && <span className="text-white/60 group-hover:text-sky-300 transition-colors">{icon}</span>}
            <span>{title}</span>
          </h3>
        )}
        {description && (
          <p className="mt-2 text-[13px] leading-relaxed text-white/55 font-normal">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
