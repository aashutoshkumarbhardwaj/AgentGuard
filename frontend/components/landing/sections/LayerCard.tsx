'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { pipeline } from './constants';

export function LayerCard({ item, index }: { item: typeof pipeline[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
    gsap.to(cardRef.current, { rotateX: y, rotateY: x, duration: 0.35, ease: 'power2.out', transformPerspective: 700 });
  };

  const handleLeave = () => gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.55, ease: 'power3.out' });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`landing-layer-card landing-layer-${item.tone}`}
    >
      <div className="flex items-center justify-between">
        <span className="landing-number">{item.number}</span>
        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/35">Layer {index + 1}</span>
      </div>
      <div className="mt-16 sm:mt-20">
        <h3 className="text-[24px] font-medium tracking-tight text-white sm:text-[30px]">{item.title}</h3>
        <p className="mt-3 max-w-[280px] text-[13px] leading-6 text-white/48">{item.copy}</p>
      </div>
      <span className="landing-card-orb" aria-hidden="true" />
    </div>
  );
}
