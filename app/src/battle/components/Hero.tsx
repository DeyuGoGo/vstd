import { useEffect, useState } from 'react';
import { Heart } from '../icons';
import { Z } from '../zIndex';
import type { CharacterAssets } from '../../characters/types';

const PANEL_STROKE = 'rgba(180, 140, 255, 0.35)';

interface Props {
  x: number;
  y: number;
  hp: number;
  hpMax: number;
  attackTick: number;
  assets: CharacterAssets;
  dead?: boolean;
}

export const Hero = ({ x, y, hp, hpMax, attackTick, assets, dead }: Props) => {
  const [pose, setPose] = useState<'idle' | 'attack'>('idle');
  const pct = Math.max(0, hp / hpMax);

  useEffect(() => {
    if (attackTick === 0) return;
    if (dead) return;
    setPose('attack');
    const timer = window.setTimeout(() => setPose('idle'), 180);
    return () => window.clearTimeout(timer);
  }, [attackTick, dead]);

  const isAttack = pose === 'attack' && !dead;
  const layout = isAttack ? assets.layout.attack : assets.layout.idle;
  const baseSrc = `${import.meta.env.BASE_URL}${
    isAttack ? assets.battleBaseAttack : assets.battleBaseIdle
  }`;
  const weaponSrc = `${import.meta.env.BASE_URL}${assets.battleWeapon}`;
  const headgearSrc = `${import.meta.env.BASE_URL}${assets.battleHeadgear}`;
  const handSrc = `${import.meta.env.BASE_URL}${assets.battleHandCover}`;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        zIndex: Z.HERO,
        pointerEvents: 'none',
        width: 120,
        height: 135,
        opacity: dead ? 0.35 : 1,
        filter: dead ? 'grayscale(1)' : undefined,
        transition: 'opacity 200ms ease-out, filter 200ms ease-out',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: -28,
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Heart size={12} />
        <div
          style={{
            width: 96,
            height: 12,
            borderRadius: 6,
            background: 'rgba(0,0,0,0.6)',
            border: `1px solid ${PANEL_STROKE}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: `${pct * 100}%`,
              background: 'linear-gradient(180deg, #7df09a, #2fb255)',
              transition: 'width 0.2s',
              boxShadow:
                'inset 0 -2px 0 rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          />
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              font: '800 10px/1 Sora, sans-serif',
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            {Math.max(0, Math.round(hp)).toLocaleString()}
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 101,
          transform: 'translateX(-50%)',
          width: 58,
          height: 12,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(179,136,255,0.55), transparent)',
          filter: 'blur(2px)',
        }}
      />

      <img
        src={baseSrc}
        alt=""
        style={{
          position: 'absolute',
          left: layout.base[0],
          top: layout.base[1],
          width: 61,
          height: 'auto',
          display: 'block',
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))',
          zIndex: 2,
          transition: 'left 80ms ease-out, top 80ms ease-out',
        }}
      />

      <img
        src={weaponSrc}
        alt=""
        style={{
          position: 'absolute',
          left: layout.weapon[0],
          top: layout.weapon[1],
          width: layout.weapon[2],
          height: 'auto',
          display: 'block',
          filter: 'drop-shadow(0 0 8px rgba(179, 136, 255, 0.7))',
          zIndex: 1,
          transition: 'left 80ms ease-out, top 80ms ease-out, width 80ms ease-out',
        }}
      />

      <img
        src={headgearSrc}
        alt=""
        style={{
          position: 'absolute',
          left: layout.headgear[0],
          top: layout.headgear[1],
          width: 34,
          height: 'auto',
          display: 'block',
          filter: 'drop-shadow(0 0 5px rgba(179, 136, 255, 0.4))',
          zIndex: 4,
          transition: 'left 80ms ease-out, top 80ms ease-out',
        }}
      />

      <img
        src={handSrc}
        alt=""
        style={{
          position: 'absolute',
          left: layout.hand[0],
          top: layout.hand[1],
          width: 19,
          height: 'auto',
          display: 'block',
          zIndex: 5,
          transition: 'left 80ms ease-out, top 80ms ease-out',
        }}
      />
    </div>
  );
};
