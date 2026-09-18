"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Crosshair, Radio, Zap, Activity } from "lucide-react";
import { sound } from "@/utils/sound";
import BorderBeam from "@/components/ui/BorderBeam";

interface ThreatBlip {
  id: string;
  angle: number;
  distance: number;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  status: "INTERCEPTED" | "NEUTRALIZED" | "CONTAINED";
  timestamp: string;
}

const INITIAL_BLIPS: ThreatBlip[] = [
  { id: "THR-902", angle: 45, distance: 70, type: "Indirect Prompt Injection", severity: "CRITICAL", status: "INTERCEPTED", timestamp: "0.2s ago" },
  { id: "THR-841", angle: 160, distance: 45, type: "Data Exfiltration via S3", severity: "CRITICAL", status: "NEUTRALIZED", timestamp: "1.1s ago" },
  { id: "THR-719", angle: 280, distance: 85, type: "Privilege Escalation / sudo", severity: "HIGH", status: "CONTAINED", timestamp: "2.4s ago" },
  { id: "THR-604", angle: 210, distance: 60, type: "Infinite Tool Recursion", severity: "MEDIUM", status: "INTERCEPTED", timestamp: "3.8s ago" },
];

export default function ThreatRadar() {
  const [blips, setBlips] = useState<ThreatBlip[]>(INITIAL_BLIPS);
  const [selectedBlip, setSelectedBlip] = useState<ThreatBlip>(INITIAL_BLIPS[0]);
  const [interceptCount, setInterceptCount] = useState(24918);
  const [isScanning, setIsScanning] = useState(true);

  // Auto-increment live counter periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setInterceptCount((prev) => prev + Math.floor(Math.random() * 2) + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const triggerPing = () => {
    sound.playClick();
    sound.playIntercept();
    const newAngle = Math.floor(Math.random() * 360);
    const newDistance = Math.floor(Math.random() * 50) + 35;
    const threats = [
      { type: "Malicious RAG Payload Injection", severity: "CRITICAL" as const },
      { type: "Unauthorized Stripe Charge ($9,200)", severity: "CRITICAL" as const },
      { type: "SSRF Internal Port 169.254.169.254", severity: "HIGH" as const },
      { type: "Mass Email Spam Dispersal", severity: "HIGH" as const },
    ];
    const picked = threats[Math.floor(Math.random() * threats.length)];
    const newBlip: ThreatBlip = {
      id: `THR-${Math.floor(Math.random() * 899) + 100}`,
      angle: newAngle,
      distance: newDistance,
      type: picked.type,
      severity: picked.severity,
      status: "INTERCEPTED",
      timestamp: "Just now",
    };
    setBlips((prev) => [newBlip, ...prev.slice(0, 4)]);
    setSelectedBlip(newBlip);
    setInterceptCount((prev) => prev + 1);
  };

  return (
    <div className="relative w-full rounded-2xl border border-slate-800 bg-[#080C16] p-6 shadow-2xl overflow-hidden">
      {/* 21st.dev Laser Border Beam */}
      <BorderBeam size={300} duration={12} colorFrom="#10B981" colorTo="#3B82F6" borderWidth={2} />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 glow-emerald">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                HOLOGRAPHIC THREAT RADAR
              </h3>
              <span className="rounded-full bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] text-emerald-400 font-semibold">
                360° SWEEP ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Deterministic runtime tool interceptor scanning incoming autonomous agent payloads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="hidden sm:block text-right">
            <div className="text-slate-500 text-[10px]">TOTAL THREATS NEUTRALIZED</div>
            <div className="text-emerald-400 font-bold text-sm tracking-wider">
              {interceptCount.toLocaleString()}
            </div>
          </div>
          <button
            onClick={triggerPing}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-2 font-mono text-xs font-bold text-slate-950 shadow-md transition-all hover:brightness-110 active:scale-95"
          >
            <Crosshair className="h-3.5 w-3.5" />
            Scan New Attack
          </button>
        </div>
      </div>

      {/* Grid: Radar Canvas + Live Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Radar Visual Display */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-2 border-emerald-500/20 bg-gradient-to-b from-[#051118]/80 to-[#02070D] flex items-center justify-center shadow-inner overflow-hidden">
            
            {/* Range Rings */}
            <div className="absolute w-[80%] h-[80%] rounded-full border border-emerald-500/15"></div>
            <div className="absolute w-[60%] h-[60%] rounded-full border border-emerald-500/15"></div>
            <div className="absolute w-[40%] h-[40%] rounded-full border border-emerald-500/20"></div>
            <div className="absolute w-[20%] h-[20%] rounded-full border border-emerald-500/25"></div>

            {/* Crosshairs & Azimuth grid */}
            <div className="absolute w-full h-[1px] bg-emerald-500/20"></div>
            <div className="absolute h-full w-[1px] bg-emerald-500/20"></div>
            <div className="absolute w-full h-full rotate-45 border-dashed border-slate-800/40 pointer-events-none"></div>

            {/* Azimuth Degree Labels */}
            <span className="absolute top-2 font-mono text-[9px] text-emerald-500/60 font-bold">000° N</span>
            <span className="absolute bottom-2 font-mono text-[9px] text-emerald-500/60 font-bold">180° S</span>
            <span className="absolute left-2 font-mono text-[9px] text-emerald-500/60 font-bold">270° W</span>
            <span className="absolute right-2 font-mono text-[9px] text-emerald-500/60 font-bold">090° E</span>

            {/* Rotating Radar Sweep Line */}
            {isScanning && (
              <div
                className="absolute inset-0 rounded-full pointer-events-none origin-center"
                style={{
                  background: "conic-gradient(from 0deg, rgba(16, 185, 129, 0.35) 0deg, rgba(16, 185, 129, 0) 60deg)",
                  animation: "radarSweep 4s linear infinite",
                }}
              />
            )}

            {/* Radar Center Defense Node */}
            <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400 bg-emerald-950 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)]">
              <Zap className="h-3.5 w-3.5 animate-pulse" />
            </div>

            {/* Intercepted Target Blips */}
            {blips.map((blip) => {
              const rad = (blip.angle * Math.PI) / 180;
              const x = Math.cos(rad) * (blip.distance * 1.2);
              const y = Math.sin(rad) * (blip.distance * 1.2);
              const isSelected = selectedBlip?.id === blip.id;

              return (
                <button
                  key={blip.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedBlip(blip);
                  }}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  className={`absolute z-20 group transition-transform hover:scale-125 cursor-pointer focus:outline-none`}
                  title={`${blip.type} (${blip.status})`}
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`absolute inline-flex h-4 w-4 rounded-full opacity-75 animate-ping ${
                        blip.severity === "CRITICAL" ? "bg-red-400" : "bg-amber-400"
                      }`}
                    ></span>
                    <span
                      className={`relative inline-flex h-3 w-3 rounded-full border-2 border-[#06080D] ${
                        blip.severity === "CRITICAL" ? "bg-red-500" : "bg-amber-500"
                      } ${isSelected ? "ring-2 ring-white scale-125" : ""}`}
                    ></span>
                    {/* Tooltip on hover */}
                    <span className="hidden group-hover:block absolute left-4 -top-2 whitespace-nowrap rounded bg-slate-900 border border-slate-700 px-2 py-0.5 font-mono text-[10px] text-white shadow-xl z-30">
                      {blip.id}: {blip.type}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-4 font-mono text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              CRITICAL INTERCEPT
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              CONTAINED RISK
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              AGENTGUARD SHIELD
            </span>
          </div>
        </div>

        {/* Selected Threat Diagnostic Details */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#060911] p-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  THREAT DIAGNOSTIC: {selectedBlip.id}
                </span>
              </div>
              <span className="rounded bg-red-950/80 border border-red-500/40 px-2 py-0.5 text-[10px] font-bold text-red-300">
                {selectedBlip.status}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Attack Classification:</span>
                <span className="text-slate-200 font-semibold">{selectedBlip.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Risk Severity:</span>
                <span className={selectedBlip.severity === "CRITICAL" ? "text-red-400 font-bold" : "text-amber-400 font-bold"}>
                  {selectedBlip.severity} (CVSS 9.8)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Interceptor Decision:</span>
                <span className="text-emerald-400 font-bold">Deterministic Block (0ms LLM Drift)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Policy Reference:</span>
                <span className="text-cyan-300">Cedar Policy #POL-EXFIL-04</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Audit Ledger Hash:</span>
                <span className="text-slate-400 text-[10px]">sha256:7f9a2b8...c41e</span>
              </div>
            </div>

            {/* Real-time telemetry log strip */}
            <div className="mt-4 rounded-lg bg-black/60 p-3 border border-slate-800/80 text-[11px] text-emerald-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Activity className="h-3 w-3 text-emerald-400" />
                <span>Runtime Intercept Log:</span>
              </div>
              <p className="text-slate-300">
                &gt; Agent invoked unauthorized tool. Parameter payload matched forbidden destructive regex pattern.
              </p>
              <p className="text-emerald-400 font-bold">
                &gt; ACTION HALTED BEFORE OS DISPATCH. Tool sandbox exited with error code E_FORBIDDEN_ACTION.
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="rounded-lg border border-slate-800 bg-[#060911] p-3">
              <div className="text-slate-500 text-[10px]">EVALUATION LATENCY</div>
              <div className="text-white font-bold text-sm mt-0.5">1.42 ms</div>
              <div className="text-[10px] text-emerald-400">Sub-millisecond gate</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#060911] p-3">
              <div className="text-slate-500 text-[10px]">HALLUCINATION DRIFT</div>
              <div className="text-white font-bold text-sm mt-0.5">0.00%</div>
              <div className="text-[10px] text-emerald-400">Pure deterministic logic</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
