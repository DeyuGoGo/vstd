import { PauseGlyph, Coin } from '../icons';
import { Z } from '../zIndex';

const PANEL = 'rgba(12, 6, 22, 0.78)';
const PANEL_STROKE = 'rgba(180, 140, 255, 0.35)';
const GOLD = '#f5c95c';

interface Props {
  gold: number;
  onPause: () => void;
}

export const TopBar = ({ gold, onPause }: Props) => {
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
        justifyContent: 'space-between',
        gap: 10,
        zIndex: Z.HUD,
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
