import { Z } from '../zIndex';

interface Props {
  onResume: () => void;
}

export const PauseOverlay = ({ onResume }: Props) => (
  <div
    onClick={onResume}
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: Z.OVERLAY,
      background: 'rgba(5,2,12,0.78)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
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
        TAP TO RESUME
      </div>
    </div>
  </div>
);
