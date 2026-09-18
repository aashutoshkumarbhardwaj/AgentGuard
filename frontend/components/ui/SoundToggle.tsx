"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { sound } from "@/utils/sound";

export default function SoundToggle() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    sound.enabled = !muted;
  }, [muted]);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    sound.enabled = !next;
    if (!next) {
      sound.playSuccess();
    }
  };

  return (
    <button
      onClick={toggle}
      title={muted ? "Unmute Cyber SFX" : "Mute Cyber SFX"}
      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 font-mono text-xs text-slate-300 transition-all hover:border-emerald-500/50 hover:bg-emerald-950/20 hover:text-emerald-300"
    >
      {muted ? (
        <>
          <VolumeX className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden xl:inline text-[10px] text-slate-500">SFX OFF</span>
        </>
      ) : (
        <>
          <Volume2 className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span className="hidden xl:inline text-[10px] text-emerald-400 font-semibold">CYBER SFX</span>
        </>
      )}
    </button>
  );
}
