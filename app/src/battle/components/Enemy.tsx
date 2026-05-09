import type { Enemy as EnemyT } from '../engine/types';
import { EnemyArt } from '../icons';
import { BOSS_MUL } from '../data/waves';

interface Props {
  e: EnemyT;
}

export const Enemy = ({ e }: Props) => {
  const isBrute = e.kind === 'brute';
  const baseW = isBrute ? 56 : 36;
  const baseH = isBrute ? 64 : 44;
  const w = e.isBoss ? baseW * BOSS_MUL.scale : baseW;
  const h = e.isBoss ? baseH * BOSS_MUL.scale : baseH;
  return (
    <div
      style={{
        position: 'absolute',
        left: e.x,
        top: e.y,
        transform: `translate(-50%, -50%) scale(${1 - (e.dyingT || 0)})`,
        opacity: e.dyingT ? 1 - e.dyingT : 1,
        transition: e.dyingT
          ? 'transform 0.25s ease-in, opacity 0.25s ease-in'
          : 'none',
        zIndex: Math.min(900, Math.floor(e.y)),
        pointerEvents: 'none',
        filter: e.isBoss ? 'drop-shadow(0 0 16px #b388ff)' : undefined,
      }}
    >
      <EnemyArt kind={e.kind} w={w} h={h} flash={e.hitT > 0} />
    </div>
  );
};
