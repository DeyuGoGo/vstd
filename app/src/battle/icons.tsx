import type { CSSProperties } from 'react';

const C_GREEN = '#5cd87a';
const C_RED = '#e23b5a';

interface IconProps {
  size?: number;
  color?: string;
  style?: CSSProperties;
}

export const Heart = ({ size = 14, color = C_GREEN }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ display: 'block', filter: `drop-shadow(0 0 4px ${color}aa)` }}
  >
    <path
      d="M12 21s-7.5-4.6-9.5-9.4C1 8 3.2 4 7 4c2 0 3.6 1 5 2.6C13.4 5 15 4 17 4c3.8 0 6 4 4.5 7.6C19.5 16.4 12 21 12 21z"
      fill={color}
    />
  </svg>
);

export const Skull = ({ size = 18, color = C_RED }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path
      d="M12 2c-5 0-8 3.6-8 8 0 2.6 1.2 4.6 3 6v3h2v-2h2v2h2v-2h2v2h2v-3c1.8-1.4 3-3.4 3-6 0-4.4-3-8-8-8zm-3 9a2 2 0 110-4 2 2 0 010 4zm6 0a2 2 0 110-4 2 2 0 010 4zm-3 4l-1.2-2h2.4L12 15z"
      fill={color}
    />
  </svg>
);

export const Coin = ({ size = 22 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <defs>
      <radialGradient id="coinG-battle" cx="40%" cy="35%">
        <stop offset="0" stopColor="#ffe49a" />
        <stop offset="0.6" stopColor="#f5c95c" />
        <stop offset="1" stopColor="#a87420" />
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#coinG-battle)" stroke="#5b3a0d" strokeWidth="1.2" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontFamily="Sora, sans-serif"
      fontWeight="800"
      fontSize="11"
      fill="#7a4a10"
    >
      $
    </text>
  </svg>
);

export const PauseGlyph = () => (
  <svg width="16" height="18" viewBox="0 0 16 18">
    <rect x="1" y="1" width="5" height="16" rx="1.5" fill="#fff" />
    <rect x="10" y="1" width="5" height="16" rx="1.5" fill="#fff" />
  </svg>
);

interface EnemyArtProps {
  kind: 'minion' | 'brute';
  w: number;
  h: number;
  flash: boolean;
}

export const EnemyArt = ({ kind, w, h, flash }: EnemyArtProps) => {
  const eyeColor = '#d6a8ff';
  const armor = '#1c1326';
  const armorEdge = '#2c1f3d';
  const trim = '#3a2554';
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 60 70"
      style={{
        filter: flash
          ? 'brightness(2.2) saturate(0.6)'
          : 'drop-shadow(0 4px 4px rgba(0,0,0,0.55))',
        transition: 'filter 0.08s',
      }}
    >
      <ellipse cx="30" cy="66" rx="15" ry="3" fill="rgba(0,0,0,0.5)" />
      {kind === 'brute' && (
        <>
          <path d="M14 18 Q8 6 16 4 Q18 12 22 18 Z" fill="#0c0814" />
          <path d="M46 18 Q52 6 44 4 Q42 12 38 18 Z" fill="#0c0814" />
          <ellipse cx="30" cy="22" rx="14" ry="13" fill={armor} />
          <ellipse cx="30" cy="22" rx="14" ry="13" fill="none" stroke={armorEdge} strokeWidth="1.2" />
          <circle cx="24" cy="22" r="2.4" fill={eyeColor} />
          <circle cx="36" cy="22" r="2.4" fill={eyeColor} />
          <circle cx="24" cy="22" r="1.1" fill="#fff" />
          <circle cx="36" cy="22" r="1.1" fill="#fff" />
          <path
            d="M14 38 Q30 32 46 38 L48 60 Q30 64 12 60 Z"
            fill={armor}
            stroke={armorEdge}
            strokeWidth="1"
          />
          <path
            d="M22 40 L30 36 L38 40 L36 50 L24 50 Z"
            fill={trim}
            opacity="0.7"
          />
          <path d="M12 36 L8 30 L16 32 Z" fill="#0c0814" />
          <path d="M48 36 L52 30 L44 32 Z" fill="#0c0814" />
        </>
      )}
      {kind === 'minion' && (
        <>
          <path
            d="M16 18 Q30 4 44 18 L44 32 L16 32 Z"
            fill={armor}
            stroke={armorEdge}
            strokeWidth="1"
          />
          <path d="M20 22 Q30 18 40 22 L40 32 L20 32 Z" fill="#0a0612" />
          <ellipse cx="25" cy="26" rx="2" ry="1.6" fill={eyeColor} />
          <ellipse cx="35" cy="26" rx="2" ry="1.6" fill={eyeColor} />
          <path
            d="M18 32 L42 32 L46 60 Q30 64 14 60 Z"
            fill={armor}
            stroke={armorEdge}
            strokeWidth="1"
          />
          <path d="M28 36 L32 36 L34 56 L26 56 Z" fill={trim} opacity="0.7" />
          <rect x="44" y="44" width="2" height="14" fill="#3a2554" transform="rotate(20 45 51)" />
        </>
      )}
    </svg>
  );
};

export const ProjectileSparkle = ({ rot }: { rot: number }) => (
  <svg
    width="32"
    height="32"
    viewBox="-16 -16 32 32"
    style={{
      transform: `rotate(${rot}rad)`,
      filter: 'drop-shadow(0 0 8px #c8a4ff) drop-shadow(0 0 16px #b388ff)',
    }}
  >
    <path d="M0 -12 L2 -2 L12 0 L2 2 L0 12 L-2 2 L-12 0 L-2 -2 Z" fill="#fff" />
    <path
      d="M0 -8 L1.4 -1.4 L8 0 L1.4 1.4 L0 8 L-1.4 1.4 L-8 0 L-1.4 -1.4 Z"
      fill="#e8d4ff"
    />
  </svg>
);

export const DiceIcon = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="#7a5a2a" stroke="#d4af6a" strokeWidth="1.4" />
    <circle cx="8" cy="8" r="1.5" fill="#fff" />
    <circle cx="16" cy="8" r="1.5" fill="#fff" />
    <circle cx="12" cy="12" r="1.5" fill="#fff" />
    <circle cx="8" cy="16" r="1.5" fill="#fff" />
    <circle cx="16" cy="16" r="1.5" fill="#fff" />
  </svg>
);

export const SmallCoin = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" fill="#f5c95c" stroke="#7a4a10" strokeWidth="1.2" />
    <text x="12" y="16" textAnchor="middle" fontFamily="Sora" fontWeight="800" fontSize="11" fill="#7a4a10">
      $
    </text>
  </svg>
);
