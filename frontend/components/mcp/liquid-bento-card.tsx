'use client';

import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface LiquidBentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g. 'rgba(56, 189, 248, 0.09)'
  spotlightSize?: number;
}

export function LiquidBentoCard({
  children,
  className,
  glowColor = 'rgba(56, 189, 248, 0.08)',
  spotlightSize = 450,
  ...props
}: LiquidBentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePos(null);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'bento-item group relative overflow-hidden rounded-2xl',
        'bg-[#08090e]/85 backdrop-blur-2xl',
        'border border-white/[0.08] hover:border-white/[0.18]',
        'shadow-[0_15px_35px_rgba(0,0,0,0.6)]',
        'transition-all duration-300',
        className
      )}
      {...props}
    >
      {/* Liquid specular spotlight following mouse */}
      {isHovered && mousePos && (
        <>
          {/* Ambient Glow */}
          <div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(${spotlightSize}px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 65%)`,
            }}
          />
          {/* Border specular light */}
          <div
            className="pointer-events-none absolute -inset-[1px] rounded-2xl z-0 opacity-40 transition-opacity duration-300"
            style={{
              background: `radial-gradient(${spotlightSize * 0.7}px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.25), transparent 70%)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
          />
        </>
      )}

      {/* Subtle top gloss sheen line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Card content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
