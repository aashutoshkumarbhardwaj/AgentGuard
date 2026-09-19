'use client';

import { motion } from 'framer-motion';
import { agents } from '@/lib/mock-data';

export function AgentNetwork() {
  return (
    <div className="relative w-full">
      <svg viewBox="0 0 600 340" className="w-full h-full">
        <defs>
          {/* Gradient for AgentGuard center */}
          <radialGradient id="ag-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
          {/* Gradient for connection lines */}
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="tool-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(var(--info))" stopOpacity="0.35" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient glow behind AgentGuard */}
        <circle cx="300" cy="170" r="80" fill="url(#ag-glow)" />

        {/* Connection lines from agents to AgentGuard */}
        {agents.map((agent, i) => {
          const agentY = 60 + i * 105;
          return (
            <g key={agent.id}>
              <line
                x1={135}
                y1={agentY}
                x2={275}
                y2={170}
                stroke="url(#line-grad)"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                className="animate-dash-flow"
                opacity="0.6"
              />
              {/* Animated particle traveling along the line */}
              <motion.circle
                r="3"
                fill="hsl(var(--success))"
                filter="url(#glow)"
                initial={{ cx: 135, cy: agentY, opacity: 0 }}
                animate={{
                  cx: [135, 275],
                  cy: [agentY, 170],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: 'easeInOut',
                }}
              />
            </g>
          );
        })}

        {/* Connection lines from AgentGuard to tools */}
        {['calendar', 'email', 'file'].map((tool, i) => {
          const toolX = 380 + i * 80;
          return (
            <g key={tool}>
              <line
                x1={325}
                y1={170}
                x2={toolX}
                y2={170}
                stroke="url(#tool-line-grad)"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                className="animate-dash-flow"
                opacity="0.5"
              />
              <motion.circle
                r="2.5"
                fill="hsl(var(--info))"
                filter="url(#glow)"
                initial={{ cx: 325, cy: 170, opacity: 0 }}
                animate={{
                  cx: [325, toolX],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: 0.4 + i * 0.5,
                  ease: 'easeInOut',
                }}
              />
            </g>
          );
        })}

        {/* Agent nodes */}
        {agents.map((agent, i) => {
          const agentY = 60 + i * 105;
          const statusColor =
            agent.status === 'ACTIVE' ? 'hsl(var(--success))' : 'hsl(var(--muted-foreground))';
          return (
            <g key={agent.id}>
              {/* Node background with subtle gradient */}
              <rect
                x={35}
                y={agentY - 20}
                width={135}
                height={40}
                rx={10}
                fill="hsl(var(--card) / 0.8)"
                stroke="hsl(var(--border) / 0.6)"
                strokeWidth="1"
              />
              <rect
                x={35}
                y={agentY - 20}
                width={135}
                height={40}
                rx={10}
                fill="hsl(var(--foreground) / 0.02)"
              />
              {/* Status indicator */}
              <circle cx={52} cy={agentY} r="4" fill={statusColor}>
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </circle>
              <text
                x={65}
                y={agentY + 4}
                fill="hsl(var(--foreground) / 0.85)"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="500"
              >
                {agent.id.length > 13 ? agent.id.slice(0, 12) + '…' : agent.id}
              </text>
            </g>
          );
        })}

        {/* AgentGuard center node */}
        <g>
          {/* Pulsing outer ring */}
          <motion.circle
            cx={300}
            cy={170}
            r="34"
            fill="none"
            stroke="hsl(var(--primary) / 0.2)"
            strokeWidth="1"
            animate={{ r: [34, 40, 34], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Main ring */}
          <circle
            cx={300}
            cy={170}
            r="28"
            fill="hsl(var(--card) / 0.9)"
            stroke="hsl(var(--primary) / 0.4)"
            strokeWidth="1.5"
          />
          {/* Inner detail ring */}
          <circle
            cx={300}
            cy={170}
            r="22"
            fill="none"
            stroke="hsl(var(--primary) / 0.15)"
            strokeWidth="1"
          />
          <text
            x={300}
            y={165}
            fill="hsl(var(--primary))"
            fontSize="8.5"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="monospace"
            letterSpacing="0.5"
          >
            AGENT
          </text>
          <text
            x={300}
            y={178}
            fill="hsl(var(--primary))"
            fontSize="8.5"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="monospace"
            letterSpacing="0.5"
          >
            GUARD
          </text>
        </g>

        {/* Tool nodes */}
        {['calendar', 'email', 'file'].map((tool, i) => {
          const toolX = 380 + i * 80;
          return (
            <g key={tool}>
              <rect
                x={toolX - 32}
                y={155}
                width={64}
                height={32}
                rx={8}
                fill="hsl(var(--card) / 0.8)"
                stroke="hsl(var(--info) / 0.25)"
                strokeWidth="1"
              />
              <rect
                x={toolX - 32}
                y={155}
                width={64}
                height={32}
                rx={8}
                fill="hsl(var(--info) / 0.03)"
              />
              <text
                x={toolX}
                y={173}
                fill="hsl(var(--info) / 0.9)"
                fontSize="10"
                textAnchor="middle"
                fontFamily="monospace"
                fontWeight="500"
              >
                {tool}
              </text>
              <text
                x={toolX}
                y={183}
                fill="hsl(var(--success) / 0.6)"
                fontSize="7.5"
                textAnchor="middle"
                fontFamily="monospace"
              >
                ✓ protected
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
