export const BossIntroOverlay = () => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 220,
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.85), rgba(255,180,220,0.65) 30%, rgba(120,40,90,0.4) 60%, transparent 90%)',
        pointerEvents: 'none',
        animation: 'battle-boss-flash 0.45s ease-out forwards',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 221,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        animation: 'battle-boss-text-out 1.2s ease-out forwards',
      }}
    >
      <div
        style={{
          font: '900 84px/1 Sora, sans-serif',
          letterSpacing: 14,
          color: '#fff',
          textShadow:
            '0 0 18px #ff5a8a, 0 0 36px #ff3060, 0 0 60px #b8002a, 0 4px 0 #2a0010',
          animation: 'battle-boss-text-pop 0.6s cubic-bezier(.18,1.5,.32,1) forwards',
          transform: 'scale(0.4)',
          opacity: 0,
        }}
      >
        BOSS
      </div>
    </div>
  </>
);
