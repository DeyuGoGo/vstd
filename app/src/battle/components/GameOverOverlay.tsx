interface Props {
  wave: number;
  kills: number;
  onExit: () => void;
}

export const GameOverOverlay = ({ wave, kills, onExit }: Props) => (
  <div
    onClick={onExit}
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 200,
      background: 'rgba(5,2,12,0.85)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
      animation: 'battle-fade-in 0.3s ease-out',
    }}
  >
    <div style={{ textAlign: 'center', color: '#fff' }}>
      <div
        style={{
          font: '800 36px/1 Sora, sans-serif',
          letterSpacing: 4,
          color: '#ff5b78',
          textShadow: '0 0 14px #e23b5a, 0 0 28px #c81f3daa',
        }}
      >
        GAME OVER
      </div>
      <div
        style={{
          marginTop: 18,
          font: '500 13px/1.6 Sora, sans-serif',
          color: 'rgba(244,236,255,0.7)',
          letterSpacing: 1.4,
        }}
      >
        撐到 WAVE {String(wave).padStart(2, '0')} · 擊殺 {kills}
      </div>
      <div
        style={{
          marginTop: 24,
          font: '500 11px/1 Sora, sans-serif',
          color: 'rgba(244,236,255,0.5)',
          letterSpacing: 2,
        }}
      >
        TAP TO RETURN
      </div>
    </div>
  </div>
);
