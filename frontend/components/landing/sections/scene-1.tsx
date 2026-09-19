'use client';

import Link from 'next/link';
import { ChevronRight, Copy } from 'lucide-react';
import { useState } from 'react';

export function Scene1() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npx memorable-cli@latest');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="scene1-root">
      {/* Full-screen video background */}
      <video
        className="scene1-video-bg"
        src="/videos/fixed-matrix-loop.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Dark gradient overlay so text is readable */}
      <div className="scene1-overlay" />

      {/* Content: bottom-left aligned */}
      <div className="scene1-content">
        {/* Y Combinator badge */}
        <div className="scene1-yc-badge">
          <span className="scene1-yc-backed">BACKED BY</span>
          <span className="scene1-yc-logo">Y</span>
          <span className="scene1-yc-name">COMBINATOR</span>
        </div>

        {/* Main heading */}
        <h1 className="scene1-heading">
          Procedural, Graph Based<br />Memory For Agents.
        </h1>

        {/* CTA row */}
        <div className="scene1-cta-row">
          <Link href="/mcp" className="scene1-dashboard-btn">
            DASHBOARD <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          <button type="button" className="scene1-terminal-btn" onClick={handleCopy}>
            <span className="scene1-terminal-prompt">npx memorable-cli@latest</span>
            <Copy className="h-3.5 w-3.5 scene1-copy-icon" />
            {copied && <span className="scene1-copied-label">Copied!</span>}
          </button>
        </div>

        {/* Live on */}
        <div className="scene1-live-on">
          <span className="scene1-live-label">LIVE ON</span>
          <span className="scene1-live-partner">GBRAIN</span>
          <span className="scene1-live-partner">GSTACK</span>
          <span className="scene1-live-partner">QM</span>
        </div>
      </div>
    </div>
  );
}
