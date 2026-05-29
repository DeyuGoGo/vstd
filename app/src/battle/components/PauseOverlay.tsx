import { Z } from '../zIndex';

const PANEL = 'rgba(12, 6, 22, 0.78)';
const PANEL_STROKE = 'rgba(180, 140, 255, 0.35)';
const GOLD = '#f5c95c';

interface Props {
  onResume: () => void;
  onExit: () => void;
}

export const PauseOverlay = ({ onResume, onExit }: Props) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: Z.OVERLAY,
      background: 'rgba(5,2,12,0.78)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'grid',
      placeItems: 'center',
    }}
  >
    <div style={{ textAlign: 'center', color: '#fff' }}>
      <div style={{ font: '800 28px/1 Sora, sans-serif', letterSpacing: 4 }}>PAUSED</div>
      <div
        style={{
          marginTop: 10,
          font: '500 12px/1 Sora, sans-serif',
          color: 'rgba(244,236,255,0.62)',
          letterSpacing: 2,
        }}
      >
        BATTLE PAUSED
      </div>

      <div
        style={{
          marginTop: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <button
          onClick={onResume}
          style={{
            minWidth: 200,
            padding: '12px 28px',
            borderRadius: 999,
            background: GOLD,
            border: 'none',
            color: '#1a0e2f',
            font: '700 14px/1 Sora, sans-serif',
            letterSpacing: 2,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(245,201,92,0.35)',
          }}
        >
          繼續戰鬥
        </button>
        <button
          onClick={onExit}
          style={{
            minWidth: 200,
            padding: '12px 28px',
            borderRadius: 999,
            background: PANEL,
            border: `1px solid ${PANEL_STROKE}`,
            color: 'rgba(244,236,255,0.85)',
            font: '600 13px/1 Sora, sans-serif',
            letterSpacing: 2,
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          離開戰鬥
        </button>
        <div
          style={{
            marginTop: 4,
            font: '500 11px/1.4 Sora, sans-serif',
            color: 'rgba(244,236,255,0.45)',
            letterSpacing: 1,
            maxWidth: 240,
          }}
        >
          放棄戰鬥不結算獎勵
        </div>
      </div>
    </div>
  </div>
);
