// levelup-overlay.jsx — Level Up modal with 3 blessing cards
const { useState: useStateLO } = React;

function BlessingCard({ b, onPick, delay }) {
  const [hover, setHover] = useStateLO(false);
  return (
    <button onClick={() => onPick(b)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
      width: 108, padding: '18px 10px 16px',
      borderRadius: 14, border: 'none',
      background: 'linear-gradient(180deg, rgba(38,22,72,0.92), rgba(14,6,28,0.95))',
      position: 'relative', cursor: 'pointer',
      transform: `translateY(${hover ? -6 : 0}px) scale(${hover ? 1.03 : 1})`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: hover
        ? `0 0 24px ${b.tint}88, 0 12px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)`
        : '0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      animation: `cardIn 0.35s ${delay}s both cubic-bezier(.2,1.2,.4,1)`,
      fontFamily: 'inherit',
    }}>
      {/* gold corner accents */}
      {[
        {top: 4, left: 4},   {top: 4, right: 4},
        {bottom: 4, left: 4},{bottom: 4, right: 4},
      ].map((p, i) => (
        <div key={i} style={{
          position: 'absolute', width: 10, height: 10,
          borderTop: i < 2 ? '1.5px solid #d4af6a' : 'none',
          borderBottom: i >= 2 ? '1.5px solid #d4af6a' : 'none',
          borderLeft: (i === 0 || i === 2) ? '1.5px solid #d4af6a' : 'none',
          borderRight: (i === 1 || i === 3) ? '1.5px solid #d4af6a' : 'none',
          ...p,
        }}/>
      ))}
      {/* gem on top edge */}
      <div style={{
        position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
        width: 12, height: 12, background: b.tint,
        boxShadow: `0 0 10px ${b.tint}`,
        border: '1px solid #d4af6a',
      }}/>

      {/* title */}
      <div style={{
        font: '700 11px/1.1 Sora, sans-serif', color: '#fff',
        textAlign: 'center', letterSpacing: 1.2, minHeight: 24,
        textShadow: `0 0 8px ${b.tint}66`,
      }}>{b.name}</div>

      {/* glyph */}
      <div style={{
        height: 90, display: 'grid', placeItems: 'center', margin: '6px 0 4px',
      }}>
        <BlessingGlyph kind={b.glyph} tint={b.tint}/>
      </div>

      {/* description */}
      <div style={{
        font: '500 10px/1.35 Sora, sans-serif', color: '#e6dcf2',
        textAlign: 'center', minHeight: 44, padding: '0 4px',
      }}>
        {b.desc} {b.desc2}{' '}
        <span style={{ color: '#7df09a', fontWeight: 800 }}>{b.val}</span>
        {!b.noUnit && b.unit && <> {b.unit}</>}
        {!b.noUnit && !b.unit && '.'}
      </div>
    </button>
  );
}

function LevelUpOverlay({ choices, onPick, onReroll, rerolls, level }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(5,2,12,0.55)',
      backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.25s ease-out',
    }}>
      {/* Title */}
      <div style={{
        font: '800 36px/1 Sora, sans-serif', color: '#fff',
        letterSpacing: 4, textAlign: 'center',
        textShadow: '0 0 14px #ffd17a, 0 0 28px #f5c95caa, 0 0 4px #fff',
        animation: 'titlePop 0.5s cubic-bezier(.2,1.4,.4,1)',
      }}>LEVEL UP!</div>
      <div style={{
        marginTop: 8, font: '500 14px/1 Sora, sans-serif',
        color: '#f5c95c', letterSpacing: 2, opacity: 0.9,
      }}>Select a blessing</div>

      {/* cards */}
      <div style={{
        display: 'flex', gap: 10, marginTop: 26,
      }}>
        {choices.map((b, i) => (
          <BlessingCard key={b.id + i} b={b} onPick={onPick} delay={0.1 + i * 0.08}/>
        ))}
      </div>

      {/* reroll */}
      <button onClick={onReroll} disabled={rerolls <= 0} style={{
        marginTop: 22,
        padding: '7px 16px 7px 12px', borderRadius: 999,
        background: 'linear-gradient(180deg, rgba(38,22,72,0.85), rgba(14,6,28,0.9))',
        border: '1px solid rgba(212,175,106,0.55)',
        display: 'flex', alignItems: 'center', gap: 8,
        cursor: rerolls > 0 ? 'pointer' : 'default',
        opacity: rerolls > 0 ? 1 : 0.45,
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        font: 'inherit',
      }}>
        {/* dice */}
        <svg width="20" height="20" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="3" fill="#7a5a2a" stroke="#d4af6a" strokeWidth="1.4"/>
          <circle cx="8" cy="8" r="1.5" fill="#fff"/>
          <circle cx="16" cy="8" r="1.5" fill="#fff"/>
          <circle cx="12" cy="12" r="1.5" fill="#fff"/>
          <circle cx="8" cy="16" r="1.5" fill="#fff"/>
          <circle cx="16" cy="16" r="1.5" fill="#fff"/>
        </svg>
        <span style={{ font: '700 13px/1 Sora, sans-serif', color: '#f4ecff', letterSpacing: 0.6 }}>
          Reroll ({rerolls})
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="#f5c95c" stroke="#7a4a10" strokeWidth="1.2"/>
          <text x="12" y="16" textAnchor="middle" fontFamily="Sora" fontWeight="800" fontSize="11" fill="#7a4a10">$</text>
        </svg>
      </button>

      {/* level badge */}
      <div style={{
        position: 'absolute', top: 110, left: '50%', transform: 'translateX(-50%)',
        font: '700 11px/1 Sora, sans-serif', color: '#d4af6a',
        letterSpacing: 2, opacity: 0.85,
      }}>LV.{level - 1} → LV.{level}</div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes titlePop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes cardIn {
          0% { transform: translateY(40px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

window.LevelUpOverlay = LevelUpOverlay;
