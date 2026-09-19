'use client';

import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center" aria-label="AgentGuard home">
      <span className="relative flex h-7 w-7 items-end justify-center gap-0.5 p-1.5">
        <span className="h-3 w-1 bg-white" />
        <span className="h-4 w-1 bg-white" />
        <span className="h-5 w-1 bg-white" />
      </span>
    </Link>
  );
}
