
export const glyphs = Array.from(
  '01{}[]<>/\#@$%&*+=~:;ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

export const pipeline = [
  { number: '01', title: 'Observe', copy: 'See every agent action before it reaches your tools.', tone: 'cyan' },
  { number: '02', title: 'Understand', copy: 'Trace intent, context, and risk across the whole run.', tone: 'violet' },
  { number: '03', title: 'Control', copy: 'Allow, approve, or block with policies that stay in your hands.', tone: 'amber' },
];

export const steps = [
  { number: '01', label: 'Connect', title: 'Connect your agents', copy: 'Drop AgentGuard between your agents and the tools they use. No model changes required.' },
  { number: '02', label: 'Observe', title: 'Watch the system learn', copy: 'Every call becomes a trace. See behavior, relationships, and risk assemble in real time.' },
  { number: '03', label: 'Protect', title: 'Ship with confidence', copy: 'Turn insight into policy. Keep the useful actions moving and stop the dangerous ones.' },
];
