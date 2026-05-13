import { Z } from '../zIndex';

interface Props {
  kills: number;
  gold: number;
  onExit: () => void;
}

export const VictoryOverlay = ({ kills, gold, onExit }: Props) => (
  <div
    onClick={onExit}
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: Z.OVERLAY,
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
          font: '800 40px/1 Sora, sans-serif',
          letterSpacing: 6,
          color: '#fff',
          textShadow: '0 0 14px #ffd17a, 0 0 28px #f5c95caa, 0 0 4px #fff',
          animation: 'battle-title-pop 0.5s cubic-bezier(.2, 1.4, .4, 1)',
        }}
      >
        VICTORY
      </div>
      <div
        style={{
          marginTop: 18,
          font: '500 13px/1.6 Sora, sans-serif',
          color: '#f5c95c',
          letterSpacing: 1.4,
        }}
      >
        清完全部 20 波 · 擊殺 {kills} · 獲得 {gold.toLocaleString()} 金
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
