import type { Enemy as EnemyT } from '../engine/types';
import { BOSS_MUL } from '../data/waves';
import rawStyles from '../Battle.module.css';
import { cm } from '../../utils/cssModule';
const styles = cm(rawStyles);

interface Props {
  e: EnemyT;
}

const SRC: Record<string, string> = {
  minion: 'img/enemy_minion.png',
  brute: 'img/enemy_brute.png',
  boss: 'img/boss.png',
};

export const Enemy = ({ e }: Props) => {
  const isBrute = e.kind === 'brute';
  const baseW = isBrute ? 56 : 36;
  const baseH = isBrute ? 64 : 44;
  const w = e.isBoss ? baseW * BOSS_MUL.scale : baseW;
  const h = e.isBoss ? baseH * BOSS_MUL.scale : baseH;
  const src = e.isBoss ? SRC.boss : SRC[e.kind];
  const flash = e.hitT > 0;
  return (
    <div
      className={e.isBoss ? styles.bossAura : undefined}
      style={{
        position: 'absolute',
        left: e.x,
        top: e.y,
        width: w,
        height: h,
        transform: `translate(-50%, -50%) scale(${1 - (e.dyingT || 0)})`,
        opacity: e.dyingT ? 1 - e.dyingT : 1,
        transition: e.dyingT
          ? 'transform 0.25s ease-in, opacity 0.25s ease-in'
          : 'none',
        zIndex: Math.min(900, Math.floor(e.y)),
        pointerEvents: 'none',
        // Non-boss gets a static drop-shadow; boss gets pulsing animation via class.
        filter: e.isBoss
          ? undefined
          : 'drop-shadow(0 4px 4px rgba(0,0,0,0.55))',
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}${src}`}
        alt=""
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'contain',
          filter: flash ? 'brightness(2.2) saturate(0.6)' : undefined,
          transition: 'filter 0.08s',
        }}
      />
    </div>
  );
};
