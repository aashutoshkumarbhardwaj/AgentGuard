'use client';

import Link from 'next/link';
import { ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { useRef, useState } from 'react';

export function Scene2() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="scene2-root">
      {/* Left column */}
      <div className="scene2-left">
        <h2 className="scene2-heading" style={{ fontFamily: 'Memorable, sans-serif', fontWeight: 700 }}>
          AI Agents<br />Get Security<br />Before Every<br />Action.
        </h2>
        <p className="scene2-subtext">Watch the launch film.</p>
        <Link href="/mcp" className="scene2-dashboard-btn">
          DASHBOARD <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Right column — video player */}
      <div className="scene2-right">
        <div className="scene2-video-frame">
          <video
            ref={videoRef}
            className="scene2-video"
            src="/videos/memorable-latest.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <button
            type="button"
            className="scene2-unmute-btn"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? (
              <>
                <VolumeX className="h-3 w-3" />
                <span>UNMUTE</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3 w-3" />
                <span>MUTE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
