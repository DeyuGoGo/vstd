import { useState } from 'react';
import type { Blessing } from '../data/blessings';
import { BlessingGlyph } from '../glyphs';

interface Props {
  b: Blessing;
  onPick: (b: Blessing) => void;
  delay: number;
}

export const BlessingCard = ({ b, onPick, delay }: Props) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => onPick(b)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 108,
        padding: '18px 10px 16px',
        borderRadius: 14,
        border: 'none',
        background: 'linear-gradient(180deg, rgba(38,22,72,0.92), rgba(14,6,28,0.95))',
        position: 'relative',
        cursor: 'pointer',
        transform: `translateY(${hover ? -6 : 0}px) scale(${hover ? 1.03 : 1})`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: hover
          ? `0 0 24px ${b.tint}88, 0 12px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)`
          : '0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        animation: `battle-card-in 0.35s ${delay}s both cubic-bezier(.2,1.2,.4,1)`,
        fontFamily: 'inherit',
      }}
    >
      {[
        { top: 4, left: 4 },
        { top: 4, right: 4 },
        { bottom: 4, left: 4 },
        { bottom: 4, right: 4 },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 10,
            height: 10,
            borderTop: i < 2 ? '1.5px solid #d4af6a' : 'none',
            borderBottom: i >= 2 ? '1.5px solid #d4af6a' : 'none',
            borderLeft: i === 0 || i === 2 ? '1.5px solid #d4af6a' : 'none',
            borderRight: i === 1 || i === 3 ? '1.5px solid #d4af6a' : 'none',
            ...p,
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          top: -7,
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: 12,
          height: 12,
          background: b.tint,
          boxShadow: `0 0 10px ${b.tint}`,
          border: '1px solid #d4af6a',
        }}
      />

      <div
        style={{
          font: '700 11px/1.1 Sora, sans-serif',
          color: '#fff',
          textAlign: 'center',
          letterSpacing: 1.2,
          minHeight: 24,
          textShadow: `0 0 8px ${b.tint}66`,
        }}
      >
        {b.name}
      </div>

      <div
        style={{
          height: 90,
          display: 'grid',
          placeItems: 'center',
          margin: '6px 0 4px',
        }}
      >
        <BlessingGlyph kind={b.glyph} tint={b.tint} />
      </div>

      <div
        style={{
          font: '500 11px/1.4 "Noto Sans TC", "PingFang TC", Sora, sans-serif',
          color: '#e6dcf2',
          textAlign: 'center',
          minHeight: 44,
          padding: '0 4px',
        }}
      >
        {b.desc}
        <span style={{ color: '#7df09a', fontWeight: 800 }}>{b.val}</span>
        {b.desc2}
      </div>
    </button>
  );
};
