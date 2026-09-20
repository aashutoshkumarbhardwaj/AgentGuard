'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface DocsCodeBlockProps {
  title?: string;
  code: string;
  children?: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

export function DocsCodeBlock({
  title,
  code,
  children,
  className = '',
  headerRight,
}: DocsCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={`group relative rounded-xl bg-[#090a0f]/90 border border-white/[0.09] hover:border-white/20 backdrop-blur-xl shadow-2xl transition-all duration-300 overflow-hidden ${className}`}
    >
      {/* Top Header Bar if title or copy is present */}
      {(title || code) && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.07] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            {title && (
              <span className="font-mono text-[12px] text-white/70 font-medium tracking-wide">
                {title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {headerRight}
            {code && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-white/50 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/20 transition-all cursor-pointer select-none active:scale-95"
                aria-label="Copy code"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-sky-400" />
                    <span className="text-sky-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Code / Content Area */}
      <div className="p-4 font-mono text-[12.5px] leading-relaxed overflow-x-auto selection:bg-sky-500/30">
        {children || <pre className="text-white/80 font-mono">{code}</pre>}
      </div>
    </div>
  );
}
