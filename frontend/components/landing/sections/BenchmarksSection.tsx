'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import {
  ArrowRight,
  ChevronRight,
  Copy,
  Github,
  Menu,
  Shield,
  Sparkles,
  Terminal,
  X,
  Zap,
} from 'lucide-react';

export function BenchmarksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const handleMove = (event: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect || !meshRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Calculate relative mouse position (-0.5 to 0.5)
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

        // Pan the background mesh slightly based on mouse position
        gsap.to(meshRef.current, {
          x: -x * 40,
          y: -y * 40,
          duration: 1,
          ease: 'power3.out',
        });
      };

      const handleLeave = () => {
        gsap.to(meshRef.current, {
          x: 0,
          y: 0,
          duration: 1.5,
          ease: 'power3.out'
        });
      };

      const container = containerRef.current;
      if (container) {
        container.addEventListener('mousemove', handleMove);
        container.addEventListener('mouseleave', handleLeave);
      }

      return () => {
        if (container) {
          container.removeEventListener('mousemove', handleMove);
          container.removeEventListener('mouseleave', handleLeave);
        }
      };
    }, containerRef);
    return () => context.revert();
  }, []);

  return (
    <section className="landing-benchmarks-section">
      <h2 className="landing-benchmarks-title">Benchmarks</h2>

      <div className="landing-benchmarks-container" ref={containerRef}>
        {/* Reusing the gradient mesh and noise from PreFooterTalk */}
        <div className="landing-benchmarks-mesh-wrapper" ref={meshRef}>
          <div className="landing-talk-mesh" style={{ opacity: 0.8 }} />
        </div>
        <div className="landing-talk-noise" />

        <div className="landing-benchmarks-cards">
          {/* Card 1 */}
          <div className="landing-benchmark-card">
            <div className="landing-benchmark-header">
              <div className="landing-benchmark-title-group">
                <h4>GBrain, Claude Code</h4>
                <p>TURNS PER TASK, 3-BUG CODING FIXTURE</p>
                <div className="landing-benchmark-dots">
                  <span className="active" />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="landing-benchmark-stat">-19%</div>
            </div>

            <div className="landing-benchmark-bars">
              <div className="landing-benchmark-bar-row">
                <div className="landing-benchmark-bar-labels">
                  <span className="label">Without memory</span>
                  <span className="value">16</span>
                </div>
                <div className="landing-benchmark-bar-track">
                  <div className="landing-benchmark-bar-fill" style={{ width: '100%' }}>
                    <div className="landing-benchmark-bar-cursor" style={{ right: '0' }} />
                  </div>
                </div>
              </div>

              <div className="landing-benchmark-bar-row">
                <div className="landing-benchmark-bar-labels">
                  <span className="label highlight">With Memorable</span>
                  <span className="value highlight">13</span>
                </div>
                <div className="landing-benchmark-bar-track">
                  <div className="landing-benchmark-bar-fill highlight" style={{ width: '81.25%' }}>
                    <div className="landing-benchmark-bar-cursor" style={{ right: '0' }} />
                  </div>
                  <div className="landing-benchmark-bar-fill striped" style={{ left: '81.25%', width: '18.75%', backgroundPosition: 'right' }} />
                </div>
              </div>
            </div>

            <p className="landing-benchmark-footer-text">454 runs, every one passed.</p>
          </div>

          {/* Card 2 */}
          <div className="landing-benchmark-card">
            <div className="landing-benchmark-header">
              <div className="landing-benchmark-title-group">
                <h4>Quartermaster, Codex</h4>
                <p>TOOL CALLS PER TASK, SAME FIXTURE</p>
                <div className="landing-benchmark-dots">
                  <span className="active" />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="landing-benchmark-stat">-40%</div>
            </div>

            <div className="landing-benchmark-bars">
              <div className="landing-benchmark-bar-row">
                <div className="landing-benchmark-bar-labels">
                  <span className="label">Without memory</span>
                  <span className="value">5</span>
                </div>
                <div className="landing-benchmark-bar-track">
                  <div className="landing-benchmark-bar-fill" style={{ width: '100%' }}>
                    <div className="landing-benchmark-bar-cursor" style={{ right: '0' }} />
                  </div>
                </div>
              </div>

              <div className="landing-benchmark-bar-row">
                <div className="landing-benchmark-bar-labels">
                  <span className="label highlight">With Memorable</span>
                  <span className="value highlight">3</span>
                </div>
                <div className="landing-benchmark-bar-track">
                  <div className="landing-benchmark-bar-fill highlight" style={{ width: '60%' }}>
                    <div className="landing-benchmark-bar-cursor" style={{ right: '0' }} />
                  </div>
                  <div className="landing-benchmark-bar-fill striped" style={{ left: '60%', width: '40%' }} />
                </div>
              </div>
            </div>

            <p className="landing-benchmark-footer-text">Three replications, same result each time.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
