import type { Blessing } from '../data/blessings';
import { BlessingCard } from './BlessingCard';
import { DiceIcon, SmallCoin } from '../icons';

interface Props {
  choices: Blessing[];
  level: number;
  rerolls: number;
  onPick: (b: Blessing) => void;
  onReroll: () => void;
}

export const LevelUpOverlay = ({ choices, level, rerolls, onPick, onReroll }: Props) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 200,
      background: 'rgba(5,2,12,0.55)',
      backdropFilter: 'blur(3px)',
      WebkitBackdropFilter: 'blur(3px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'battle-fade-in 0.25s ease-out',
    }}
  >
    <div
      style={{
        font: '800 36px/1 Sora, sans-serif',
        color: '#fff',
        letterSpacing: 4,
        textAlign: 'center',
        textShadow: '0 0 14px #ffd17a, 0 0 28px #f5c95caa, 0 0 4px #fff',
        animation: 'battle-title-pop 0.5s cubic-bezier(.2,1.4,.4,1)',
      }}
    >
      LEVEL UP!
    </div>
    <div
      style={{
        marginTop: 8,
        font: '500 14px/1 Sora, sans-serif',
        color: '#f5c95c',
        letterSpacing: 2,
        opacity: 0.9,
      }}
    >
      Select a blessing
    </div>

    <div style={{ display: 'flex', gap: 10, marginTop: 26 }}>
      {choices.map((b, i) => (
        <BlessingCard key={`${b.id}-${i}`} b={b} onPick={onPick} delay={0.1 + i * 0.08} />
      ))}
    </div>

    <button
      onClick={onReroll}
      disabled={rerolls <= 0}
      style={{
        marginTop: 22,
        padding: '7px 16px 7px 12px',
        borderRadius: 999,
        background: 'linear-gradient(180deg, rgba(38,22,72,0.85), rgba(14,6,28,0.9))',
        border: '1px solid rgba(212,175,106,0.55)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: rerolls > 0 ? 'pointer' : 'default',
        opacity: rerolls > 0 ? 1 : 0.45,
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        font: 'inherit',
        color: '#f4ecff',
      }}
    >
      <DiceIcon />
      <span style={{ font: '700 13px/1 Sora, sans-serif', color: '#f4ecff', letterSpacing: 0.6 }}>
        Reroll ({rerolls})
      </span>
      <SmallCoin />
    </button>

    <div
      style={{
        position: 'absolute',
        top: 110,
        left: '50%',
        transform: 'translateX(-50%)',
        font: '700 11px/1 Sora, sans-serif',
        color: '#d4af6a',
        letterSpacing: 2,
        opacity: 0.85,
      }}
    >
      LV.{level - 1} → LV.{level}
    </div>
  </div>
);
