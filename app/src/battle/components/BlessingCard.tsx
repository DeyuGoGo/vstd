import { useState } from 'react';
import type { Blessing } from '../data/blessings';
import { BlessingGlyph } from '../glyphs';
import { playSfx } from '../../audio';

interface Props {
  b: Blessing;
  onPick: (b: Blessing) => void;
  delay: number;
}

export const BlessingCard = ({ b, onPick, delay }: Props) => {
  const [hover, setHover] = useState(false);
  const artSrc = b.art ? `${import.meta.env.BASE_URL}${b.art}` : undefined;

  const previewHover = () => {
    setHover(true);
    playSfx('ui_card_hover', 0.42);
  };

  return (
    <button
      onClick={() => onPick(b)}
      onMouseEnter={previewHover}
      onMouseLeave={() => setHover(false)}
      onFocus={previewHover}
      onTouchStart={previewHover}
      onTouchEnd={() => setHover(false)}
      style={{
        width: 480,
        height: 132,
        padding: '14px 18px 14px 14px',
        borderRadius: 18,
        border: 'none',
        background: 'linear-gradient(180deg, rgba(38,22,72,0.92), rgba(14,6,28,0.95))',
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        textAlign: 'left',
        transform: `translateY(${hover ? -3 : 0}px) scale(${hover ? 1.015 : 1})`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: hover
          ? `0 0 28px ${b.tint}88, 0 14px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)`
          : '0 8px 22px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        animation: `battle-card-in 0.35s ${delay}s both cubic-bezier(.2,1.2,.4,1)`,
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -8,
          left: 28,
          transform: 'rotate(45deg)',
          width: 14,
          height: 14,
          background: b.tint,
          boxShadow: `0 0 12px ${b.tint}`,
          border: '1px solid #d4af6a',
        }}
      />

      <div
        style={{
          width: 104,
          height: 104,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {artSrc ? (
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 18,
              overflow: 'hidden',
              position: 'relative',
              border: `1px solid ${b.tint}88`,
              background: '#10091d',
              boxShadow: `0 0 18px ${b.tint}55, inset 0 0 14px rgba(255,255,255,0.06)`,
            }}
          >
            <img
              src={artSrc}
              alt=""
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover',
                transform: `scale(${hover ? 1.05 : 1})`,
                filter: hover ? 'brightness(1.12) saturate(1.1)' : 'brightness(0.98) saturate(1.03)',
                transition: 'transform 0.2s ease, filter 0.2s ease',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.12), transparent 45%, rgba(0,0,0,0.2))',
                pointerEvents: 'none',
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 18,
              border: `1px solid ${b.tint}88`,
              background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.06), #10091d 70%)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <BlessingGlyph kind={b.glyph} tint={b.tint} />
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 8,
          minWidth: 0,
        }}
      >
        <div
          style={{
            font: '800 22px/1.1 Sora, "Noto Sans TC", sans-serif',
            color: '#fff',
            letterSpacing: 1.2,
            textShadow: `0 0 10px ${b.tint}66`,
          }}
        >
          {b.name}
        </div>

        <div
          style={{
            font: '500 15px/1.35 "Noto Sans TC", "PingFang TC", Sora, sans-serif',
            color: '#e6dcf2',
          }}
        >
          {b.desc}
          <span
            style={{
              color: '#7df09a',
              fontWeight: 800,
              fontSize: 18,
              padding: '0 2px',
              textShadow: '0 0 8px #7df09a55',
            }}
          >
            {b.val}
          </span>
          {b.desc2}
        </div>
      </div>
    </button>
  );
};
