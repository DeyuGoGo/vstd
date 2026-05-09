const PANEL_STROKE = 'rgba(180, 140, 255, 0.35)';
const GOLD = '#f5c95c';

interface Props {
  level: number;
  expPct: number;
}

export const BottomBar = ({ level, expPct }: Props) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      padding: '0 0 16px',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        margin: '0 14px 12px',
        height: 36,
        position: 'relative',
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #2a1840, #0a0612)',
          border: `2px solid ${GOLD}`,
          display: 'grid',
          placeItems: 'center',
          flex: '0 0 auto',
          boxShadow: '0 0 12px rgba(245,201,92,0.35), inset 0 0 8px rgba(0,0,0,0.6)',
          marginRight: -8,
          zIndex: 2,
          position: 'relative',
          gridTemplateRows: 'auto auto',
        }}
      >
        <span
          style={{
            font: '600 8px/1 Sora, sans-serif',
            color: GOLD,
            letterSpacing: 0.5,
            marginTop: 6,
          }}
        >
          Lv.
        </span>
        <span
          style={{
            font: '800 18px/1 Sora, sans-serif',
            color: '#fff',
            marginBottom: 6,
          }}
        >
          {level}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          height: 22,
          position: 'relative',
          clipPath:
            'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)',
          background: 'rgba(0,0,0,0.6)',
          border: `1px solid ${PANEL_STROKE}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 1,
            width: `calc(${expPct}% - 2px)`,
            background: 'linear-gradient(180deg, #7aa6ff, #2a55c8)',
            boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
            transition: 'width 0.3s',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            font: '700 11px/1 Sora, sans-serif',
            color: '#fff',
            letterSpacing: 1.5,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          進度 {Math.floor(expPct)}%
        </div>
      </div>
    </div>
  </div>
);
