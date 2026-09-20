'use client';

import Link from 'next/link';
import { ChevronRight, Copy } from 'lucide-react';
import { useState } from 'react';

export function Scene1() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('pip install agentguard-shield');
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
          <span className="scene1-yc-name">JUGAAD LABS INC.</span>
        </div>

        {/* Main heading */}
        <h1
          className="scene1-heading"
          style={{
            fontSize: 'clamp(46px, 7vw, 84px)',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            marginTop: 'clamp(2.5rem, 5vh, 3.5rem)',
          }}
        >
          <span
            style={{
              fontFamily: "'Memorable', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 800,
            }}
            className="tracking-tight text-white block"
          >
            Secure AI Agents
          </span>
          <span
            style={{
              fontFamily: "'Memorable Serif', 'Playfair Display', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 400,
              letterSpacing: '-0.015em',
            }}
            className="text-white/95 block my-0.5"
          >
            Before They
          </span>
          <span
            style={{
              fontFamily: "'Memorable', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 900,
            }}
            className="tracking-tight text-white block"
          >
            Act.
          </span>
        </h1>

        {/* CTA row */}
        <div className="scene1-cta-row">
          <Link href="/overview" prefetch={true} className="scene1-dashboard-btn">
            DASHBOARD <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          <button type="button" className="scene1-terminal-btn" onClick={handleCopy}>
            <span className="scene1-terminal-prompt">pip install agentguard-shield</span>
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
