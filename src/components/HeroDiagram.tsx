import React, {useEffect, useMemo, useState, type ReactNode} from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
  BaseEdge,
  getBezierPath,
  getSmoothStepPath,
  type Node,
  type Edge,
  type NodeProps,
  type EdgeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// ── Provider tones ─────────────────────────────────────────────────────────
type Tone = {
  ring: string;
  bg: string;
  dot: string;
  sub: string;
};
const TONES: Record<string, Tone> = {
  claude: {ring: 'border-orange-300/40', bg: 'bg-orange-500/15', dot: '#f97316', sub: 'text-orange-200'},
  'claude code': {ring: 'border-violet-300/40', bg: 'bg-violet-500/15', dot: '#8b5cf6', sub: 'text-violet-200'},
  codex: {ring: 'border-emerald-300/40', bg: 'bg-emerald-500/15', dot: '#10b981', sub: 'text-emerald-200'},
  gemini: {ring: 'border-sky-300/40', bg: 'bg-sky-500/15', dot: '#38bdf8', sub: 'text-sky-200'},
  copilot: {ring: 'border-pink-300/40', bg: 'bg-pink-500/15', dot: '#ec4899', sub: 'text-pink-200'},
};
const toneFor = (p?: string): Tone => TONES[(p ?? '').toLowerCase()] ?? TONES.claude;

const PROVIDER_LOGOS: Record<string, string> = {
  claude: '/assets/claude-logo-dark.svg',
  'claude code': '/assets/claude-logo-dark.svg',
  codex: '/assets/chatgpt-logo-dark.svg',
  gemini: '/assets/gemini-logo.svg',
  copilot: '/assets/github-copilot-logo-dark.svg',
};
const logoFor = (p?: string): string | undefined => PROVIDER_LOGOS[(p ?? '').toLowerCase()];

// ── Node data shapes ───────────────────────────────────────────────────────
type PromptData = {
  text: string;
  flow?: 'h' | 'v';
};
type AgentData = {
  role: string;
  provider: string;
  flow?: 'h' | 'v';
  compact?: boolean;
  progress?: number;
  icon?: string;
  stackMax?: number;   // peak number of cards (1 = just the main card)
  stackDelay?: number; // ms before stack animation begins
};
type ShipData = {
  flow?: 'h' | 'v';
  label?: string;
};

// ── Custom node components ─────────────────────────────────────────────────
function PromptNode({data}: NodeProps<Node<PromptData, 'prompt'>>) {
  const horiz = data.flow === 'h';
  return (
    <>
      <Handle type="target" position={horiz ? Position.Left : Position.Top} />
      <div className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] text-slate-300 backdrop-blur shadow-[0_4px_18px_-4px_rgba(0,0,0,0.5)]">
        <span className="font-semibold text-pink-300">you</span>{' '}
        <span className="text-slate-200">"{data.text}"</span>
      </div>
      <Handle type="source" position={horiz ? Position.Right : Position.Bottom} />
    </>
  );
}

function AgentNode({data}: NodeProps<Node<AgentData, 'agent'>>) {
  const tone = toneFor(data.provider);
  const horiz = data.flow === 'h';
  const compact = !!data.compact;
  const logo = logoFor(data.provider);
  const iconSize = compact ? 14 : 18;

  // Stack animation: oscillate count between 1 and stackMax over time.
  const stackMax = Math.max(1, data.stackMax ?? 1);
  const stackDelay = data.stackDelay ?? 0;
  const stepMs = 1500;
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (stackMax <= 1) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      interval = setInterval(() => setTick((t) => t + 1), stepMs);
    }, stackDelay);
    return () => {
      clearTimeout(timeoutId);
      if (interval) clearInterval(interval);
    };
  }, [stackMax, stackDelay]);
  const cycleLen = Math.max(2, (stackMax - 1) * 2);
  const phase = tick % cycleLen;
  const count = phase < stackMax ? 1 + phase : 1 + (cycleLen - phase);
  const maxGhosts = stackMax - 1;
  const ghostsVisible = count - 1;

  return (
    <>
      <Handle type="target" position={horiz ? Position.Left : Position.Top} />

      {/* Ghost stack — rendered behind the main card (deeper ghosts first in DOM) */}
      {Array.from({length: maxGhosts}, (_, idx) => maxGhosts - 1 - idx).map((i) => {
        const visible = i < ghostsVisible;
        const offset = (i + 1) * 5;
        return (
          <div
            key={`ghost-${i}`}
            className={['rounded-lg border backdrop-blur', tone.ring].join(' ')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: compact ? 96 : 112,
              height: compact ? 28 : 36,
              background: 'rgba(13, 19, 48, 0.7)',
              transform: `translate(${offset}px, ${offset}px)`,
              opacity: visible ? Math.max(0.18, 0.5 - i * 0.1) : 0,
              transition: 'opacity 400ms ease, transform 400ms ease',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      <div
        className={[
          'relative flex items-center gap-2 rounded-lg border bg-[#0d1330]/85 backdrop-blur shadow-lg shadow-black/40',
          tone.ring,
          compact ? 'px-2 py-1' : 'px-2.5 py-1.5',
        ].join(' ')}
        style={{width: compact ? 96 : 112}}
      >
        <span
          className={[
            'flex shrink-0 items-center justify-center rounded font-bold',
            tone.bg,
            compact ? 'h-5 w-5 text-[9px]' : 'h-6 w-6 text-[10px]',
            tone.sub,
          ].join(' ')}
        >
          {logo ? (
            <img src={logo} alt="" className="object-contain" style={{width: iconSize, height: iconSize}} />
          ) : (
            data.icon ?? data.role?.[0] ?? '·'
          )}
        </span>
        <div className={['min-w-0 leading-tight', compact ? 'text-[9px]' : 'text-[10px]'].join(' ')}>
          <div className="truncate font-semibold text-white">{data.role}</div>
          <div className={['truncate opacity-80', tone.sub].join(' ')}>{data.provider}</div>
        </div>
      </div>
      {data.progress != null && (
        <div className="absolute -bottom-1 left-2 right-2 h-0.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="progress-pulse h-full rounded-full"
            style={{
              width: '100%',
              background: tone.dot,
              animationDelay: `${-(data.progress ?? 0) * 6}s`,
            }}
          />
        </div>
      )}
      <Handle type="source" position={horiz ? Position.Right : Position.Bottom} />
    </>
  );
}

// ── Custom edge with traveling dot ─────────────────────────────────────────
type AnimatedDotEdgeData = {
  pathType?: 'bezier' | 'smoothstep';
  dotColor?: string;
  dotDuration?: string;
};

function AnimatedDotEdge(props: EdgeProps<Edge<AnimatedDotEdgeData, 'animated-dot'>>) {
  const {id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, data} = props;
  const pathArgs = {sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition};
  const [edgePath] =
    data?.pathType === 'smoothstep' ? getSmoothStepPath(pathArgs) : getBezierPath(pathArgs);
  const pathId = `dot-mpath-${id}`;
  const dotColor = data?.dotColor ?? '#ffffff';
  const dotDuration = data?.dotDuration ?? '3s';
  return (
    <>
      <BaseEdge id={pathId} path={edgePath} style={style} />
      <circle r="2.5" fill={dotColor} style={{filter: `drop-shadow(0 0 4px ${dotColor})`}}>
        <animateMotion dur={dotDuration} repeatCount="indefinite" rotate="0">
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>
    </>
  );
}

function ShipNode({data}: NodeProps<Node<ShipData, 'ship'>>) {
  const horiz = data.flow === 'h';
  return (
    <>
      <Handle type="target" position={horiz ? Position.Left : Position.Top} />
      <div className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 shadow-lg shadow-emerald-500/10">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-2.5 w-2.5">
          <path
            fillRule="evenodd"
            d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4L8.5 12 15.3 5.3a1 1 0 0 1 1.4 0z"
            clipRule="evenodd"
          />
        </svg>
        {data.label ?? '✓'}
      </div>
    </>
  );
}

// ── Graph data ─────────────────────────────────────────────────────────────
// Single crew · orchestrator-workers pattern. viewport locked at zoom=1, x=0, y=0.
const initialNodes: Node[] = [
  {id: 'prompt',   type: 'prompt', position: {x: 110, y: 0},   data: {text: 'build the login page'}},
  {id: 'planner',  type: 'agent',  position: {x: 130, y: 60},  data: {role: 'Planner',  provider: 'Claude Code', progress: 1.0}},
  {id: 'dev-a',    type: 'agent',  position: {x: 22,  y: 160}, data: {role: 'Dev A',    provider: 'Codex',       progress: 0.82, stackMax: 4, stackDelay: 0}},
  {id: 'dev-b',    type: 'agent',  position: {x: 240, y: 160}, data: {role: 'Dev B',    provider: 'Gemini',      progress: 0.61, stackMax: 4, stackDelay: 750}},
  {id: 'reviewer', type: 'agent',  position: {x: 130, y: 260}, data: {role: 'Reviewer', provider: 'Copilot',     progress: 0.34}},
  {id: 'ship',     type: 'ship',   position: {x: 162, y: 330}, data: {label: 'Shipped'}},
];

const stroke = (rgb: string, a: number) => `rgba(${rgb}, ${a})`;
const VIOLET = '139, 92, 246';
const EMERALD = '16, 185, 129';
const SKY = '56, 189, 248';
const GREEN = '34, 197, 94';

const initialEdges: Edge[] = [
  {id: 'e-prompt',      source: 'prompt',   target: 'planner',  animated: true, type: 'animated-dot',
    style: {stroke: stroke(VIOLET, 0.65)},  data: {pathType: 'bezier',     dotColor: '#8b5cf6', dotDuration: '4.2s'}},
  {id: 'e-plan-a',      source: 'planner',  target: 'dev-a',    animated: true, type: 'animated-dot',
    style: {stroke: stroke(EMERALD, 0.6)},  data: {pathType: 'smoothstep', dotColor: '#10b981', dotDuration: '4.8s'}},
  {id: 'e-plan-b',      source: 'planner',  target: 'dev-b',    animated: true, type: 'animated-dot',
    style: {stroke: stroke(SKY, 0.6)},      data: {pathType: 'smoothstep', dotColor: '#38bdf8', dotDuration: '5.4s'}},
  {id: 'e-a-review',    source: 'dev-a',    target: 'reviewer', animated: true, type: 'animated-dot',
    style: {stroke: stroke(EMERALD, 0.55)}, data: {pathType: 'smoothstep', dotColor: '#10b981', dotDuration: '4.5s'}},
  {id: 'e-b-review',    source: 'dev-b',    target: 'reviewer', animated: true, type: 'animated-dot',
    style: {stroke: stroke(SKY, 0.55)},     data: {pathType: 'smoothstep', dotColor: '#38bdf8', dotDuration: '5.1s'}},
  {id: 'e-review-ship', source: 'reviewer', target: 'ship',     animated: true, type: 'animated-dot',
    style: {stroke: stroke(GREEN, 0.7)},    data: {pathType: 'bezier',     dotColor: '#22c55e', dotDuration: '3.8s'}},
];

// ── HeroAnimation: just the diagram, centered in the card ──────────────────
function HeroAnimation(): ReactNode {
  const nodeTypes = useMemo(
    () => ({
      agent: AgentNode,
      prompt: PromptNode,
      ship: ShipNode,
    }),
    [],
  );
  const edgeTypes = useMemo(
    () => ({
      'animated-dot': AnimatedDotEdge,
    }),
    [],
  );

  return (
    <div
      className="card relative overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
      style={{aspectRatio: '5 / 6', minHeight: 540}}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      <div className="absolute inset-5">
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          panOnDrag={false}
          panOnScroll={false}
          preventScrolling={false}
          proOptions={{hideAttribution: true}}
          fitView
          fitViewOptions={{padding: 0.02, minZoom: 1.2, maxZoom: 1.2}}
          minZoom={1.2}
          maxZoom={1.2}
          style={{background: 'transparent'}}
        />
      </div>
    </div>
  );
}

export default function HeroDiagram(): ReactNode {
  return (
    <ReactFlowProvider>
      <HeroAnimation />
    </ReactFlowProvider>
  );
}
