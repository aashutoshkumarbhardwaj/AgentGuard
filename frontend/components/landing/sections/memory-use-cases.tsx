'use client';

import { useState } from 'react';
import { ChevronRight, Copy, Terminal, Shield, Workflow } from 'lucide-react';
import Link from 'next/link';

const agentTypes = [
  {
    id: 'browser',
    title: 'Browser agents',
    description: 'Agents that navigate the web can now learn from successful runs. Memorable stores the sequence of DOM interactions, bypassing the need to constantly re-evaluate complex pages.',
    icon: <Terminal className="w-5 h-5" />
  },
  {
    id: 'coding',
    title: 'Coding agents',
    description: 'When an agent successfully sets up a dev environment or debugs a complex issue, Memorable captures the exact sequence of commands as a reusable policy.',
    icon: <Copy className="w-5 h-5" />
  },
  {
    id: 'research',
    title: 'Research agents',
    description: 'Stop paying for redundant searches. Memorable tracks the exact queries and sources that led to a successful synthesis.',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'ops',
    title: 'Ops agents',
    description: 'Infrastructure changes are high-risk. Memorable ensures agents follow safe, proven workflows every time.',
    icon: <Workflow className="w-5 h-5" />
  }
];

export function MemoryUseCases() {
  const [activeTab, setActiveTab] = useState('browser');

  return (
    <section className="landing-memory-cases-section">
      <div className="landing-memory-cases-container">
        
        {/* Left Column: Accordion */}
        <div className="landing-memory-cases-left">
          <div className="landing-memory-cases-header">
            <span className="landing-kicker">Use Cases</span>
            <h2 className="landing-section-title">
              Procedural, Graph Based<br />Memory For Agents.
            </h2>
            <div className="landing-hero-actions" style={{ marginTop: '2rem' }}>
              <Link href="/mcp" className="landing-solid-button">
                DASHBOARD <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
              <div className="landing-code-chip">
                <span className="text-white/50 mr-2">npx</span> memorable-cli@latest
                <Copy className="h-3 w-3 ml-3 text-white/40 hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>
            
            <div className="landing-hero-eyebrow" style={{ marginTop: '3rem', marginBottom: '1rem' }}>
              BACKED BY 
              <span className="landing-yc-badge">Y</span>
              COMBINATOR
            </div>
          </div>

          <div className="landing-accordion-list">
            {agentTypes.map((agent) => {
              const isActive = activeTab === agent.id;
              return (
                <div 
                  key={agent.id} 
                  className={`landing-accordion-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(agent.id)}
                >
                  <div className="landing-accordion-header">
                    {agent.icon}
                    <h3>{agent.title}</h3>
                  </div>
                  <div className="landing-accordion-content" style={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0, overflow: 'hidden' }}>
                    <p>{agent.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dashboard Mockup */}
        <div className="landing-memory-cases-right">
          <div className="landing-dashboard-mockup">
            <div className="landing-dashboard-header">
              <div className="landing-dashboard-dots">
                <span />
                <span />
                <span />
              </div>
              <div className="landing-dashboard-title">agent_execution_trace</div>
            </div>
            <div className="landing-dashboard-body">
              <div className="landing-dashboard-sidebar">
                <div className={`landing-dashboard-item ${activeTab === 'browser' ? 'active' : ''}`}>
                  <div className="color-dot browser" /> Browser Use
                </div>
                <div className={`landing-dashboard-item ${activeTab === 'coding' ? 'active' : ''}`}>
                  <div className="color-dot coding" /> Coding
                </div>
                <div className={`landing-dashboard-item ${activeTab === 'research' ? 'active' : ''}`}>
                  <div className="color-dot research" /> Research
                </div>
                <div className={`landing-dashboard-item ${activeTab === 'ops' ? 'active' : ''}`}>
                  <div className="color-dot ops" /> Ops
                </div>
              </div>
              <div className="landing-dashboard-content">
                <div className="landing-mock-code">
                  <span className="text-[#b4a6ff]">const</span> Agent = <span className="text-[#65e6bc]">new</span> <span className="text-[#f1bf4a]">MemorableAgent</span>({'{'}
                  <br />&nbsp;&nbsp;model: <span className="text-[#a5d6ff]">'gpt-4o'</span>,
                  <br />&nbsp;&nbsp;memory: <span className="text-[#a5d6ff]">'procedural-graph'</span>
                  <br />{'}'});
                  <br /><br />
                  <span className="text-[#b4a6ff]">await</span> Agent.<span className="text-[#f1bf4a]">execute</span>(<span className="text-[#a5d6ff]">'deploy infrastructure'</span>);
                </div>
                <div className="landing-mock-graph">
                  <div className="landing-mock-mesh" />
                  <div className="landing-hero-proof">
                    <span className="label">LIVE ON</span>
                    <span>GBRAIN</span>
                    <span className="highlight">GSTACK</span>
                    <span>QM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
