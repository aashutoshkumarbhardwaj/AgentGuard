'use client';

import React, { useRef } from 'react';
import { useScroll, useTransform } from 'motion/react';
import { GoogleGeminiEffect } from '@/components/ui/google-gemini-effect';

export function GeminiAnimationSection() {
  const ref = useRef<HTMLDivElement>(null);
  
  // Fast scroll response: 1 single scroll gesture triggers full 0% -> 100% path draw
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'start 20%'],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 1], [0, 1.05]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 1], [0, 1.05]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 1], [0, 1.05]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 1], [0, 1.05]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 1], [0, 1.05]);

  return (
    <section
      ref={ref}
      aria-hidden="true"
      className="relative w-full min-h-[380px] sm:min-h-[460px] md:min-h-[560px] bg-black overflow-hidden flex items-center justify-center select-none pointer-events-none z-10 py-8"
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-center">
        <GoogleGeminiEffect
          className="relative top-0 w-full flex items-center justify-center my-auto"
          svgClassName="!relative !top-0 w-full max-w-[1350px] h-auto block my-auto"
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
        />
      </div>
    </section>
  );
}
