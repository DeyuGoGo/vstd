import type { Pop } from '../engine/types';

interface Props {
  d: Pop;
}

export const DmgPop = ({ d }: Props) => (
  <div
    style={{
      position: 'absolute',
      left: d.x,
      top: d.y,
      transform: `translate(-50%, ${-d.t * 30 - 20}px)`,
      opacity: 1 - d.t,
      pointerEvents: 'none',
      zIndex: 40,
      font: `800 ${d.crit ? 18 : 14}px/1 Sora, sans-serif`,
      color: d.crit ? '#ffe06b' : '#fff',
      textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 6px rgba(179,136,255,0.6)',
    }}
  >
    {d.crit && typeof d.amount === 'number' ? `${d.amount}!` : d.amount}
  </div>
);
