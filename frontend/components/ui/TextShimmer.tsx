import React from "react";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
}

export default function TextShimmer({ children, className = "" }: TextShimmerProps) {
  return (
    <span
      className={`inline-flex animate-text-shimmer bg-[linear-gradient(110deg,#E2E8F0,45%,#10B981,55%,#E2E8F0)] bg-[length:250%_100%] bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}
