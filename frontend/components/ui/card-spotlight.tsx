'use client';

import { useMotionValue, motion, useMotionTemplate } from 'framer-motion';
import React, { MouseEvent as ReactMouseEvent, useState } from 'react';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';
import { cn } from '@/lib/utils';

export const CardSpotlight = React.forwardRef<
  HTMLDivElement,
  {
    radius?: number;
    color?: string;
    colors?: number[][];
    children: React.ReactNode;
  } & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      children,
      radius = 350,
      color = '#171923',
      // Professional glacier cyan & electric blue (no purple, no green)
      colors = [
        [56, 189, 248],
        [37, 99, 235],
      ],
      className,
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    function handleMouseMove({
      currentTarget,
      clientX,
      clientY,
    }: ReactMouseEvent<HTMLDivElement>) {
      const { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    const [isHovering, setIsHovering] = useState(false);
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    return (
      <div
        ref={ref}
        className={cn(
          'group/spotlight p-8 sm:p-10 rounded-2xl relative border border-white/[0.08] bg-[#08090e]/90 dark:border-white/[0.08] dark:bg-[#08090e]/90 overflow-hidden shadow-2xl transition-all duration-300',
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.div
          className="pointer-events-none absolute z-0 -inset-px rounded-2xl opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
          style={{
            backgroundColor: color,
            maskImage: useMotionTemplate`
              radial-gradient(
                ${radius}px circle at ${mouseX}px ${mouseY}px,
                white,
                transparent 80%
              )
            `,
            WebkitMaskImage: useMotionTemplate`
              radial-gradient(
                ${radius}px circle at ${mouseX}px ${mouseY}px,
                white,
                transparent 80%
              )
            `,
          }}
        >
          {isHovering && (
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-transparent absolute inset-0 pointer-events-none"
              colors={colors}
              dotSize={2.5}
            />
          )}
        </motion.div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);
CardSpotlight.displayName = 'CardSpotlight';
