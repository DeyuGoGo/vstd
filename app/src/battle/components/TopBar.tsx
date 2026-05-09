import { PauseGlyph, Skull, Coin } from '../icons';

const PANEL = 'rgba(12, 6, 22, 0.78)';
const PANEL_STROKE = 'rgba(180, 140, 255, 0.35)';
const RED = '#e23b5a';
const GOLD = '#f5c95c';

interface Props {
  bossPct: number; // 0..1
  gold: number;
  onPause: () => void;
}

export const TopBar = ({ bossPct, gold, onPause }: Props) => {
  const pct = Math.max(0, Math.min(1, bossPct));
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 0,
        right: 0,
        padding: '0 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 1000,
      }}
    >
      <button
        onClick={onPause}
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: PANEL,
          border: `1px solid ${PANEL_STROKE}`,
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
        aria-label="暫停"
      >
        <PauseGlyph />
      </button>

      <div style={{ flex: 1, position: 'relative', height: 18 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            background: 'rgba(0,0,0,0.55)',
            border: `1px solid ${PANEL_STROKE}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${pct * 100}%`,
              background: 'linear-gradient(180deg, #ff5b78, #c81f3d)',
              boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.25)',
              transition: 'width 0.3s',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: '#1a0d22',
            border: `1.5px solid ${RED}`,
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 0 8px rgba(226,59,90,0.6)',
          }}
        >
          <Skull size={14} />
        </div>
      </div>

      <div
        style={{
          height: 36,
          padding: '0 12px 0 8px',
          borderRadius: 999,
          background: PANEL,
          border: `1px solid ${PANEL_STROKE}`,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        <Coin />
        <span
          style={{
            font: '700 15px/1 Sora, sans-serif',
            color: GOLD,
            letterSpacing: 0.3,
          }}
        >
          {gold.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
