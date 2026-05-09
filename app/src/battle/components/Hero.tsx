import { Heart } from '../icons';

const PANEL_STROKE = 'rgba(180, 140, 255, 0.35)';

interface Props {
  x: number;
  y: number;
  hp: number;
  hpMax: number;
}

export const Hero = ({ x, y, hp, hpMax }: Props) => {
  const pct = Math.max(0, hp / hpMax);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        zIndex: 12,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: -84,
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
            {hp.toLocaleString()}
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 30,
          transform: 'translateX(-50%)',
          width: 130,
          height: 30,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(179,136,255,0.55), transparent)',
          filter: 'blur(2px)',
        }}
      />

      <img
        src="/assets/hero.png"
        alt="hero"
        style={{
          width: 150,
          height: 'auto',
          display: 'block',
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))',
        }}
      />
    </div>
  );
};
