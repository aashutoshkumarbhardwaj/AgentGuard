"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LoaderOne = ({
  className,
  size = 48,
}: {
  className?: string;
  size?: number;
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center select-none",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.7, 0.35],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500/40 via-purple-500/40 to-emerald-400/30 blur-lg"
      />

      {/* Outer spinning ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 rounded-full border-2 border-white/10 border-t-white border-r-sky-400"
      />

      {/* Inner counter-rotating ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-2 rounded-full border border-purple-400/20 border-b-purple-400 border-l-sky-300"
      />

      {/* Pulsing center core */}
      <motion.div
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="h-2 w-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
      />
    </div>
  );
};
