import { Skull } from '../icons';

const PANEL = 'rgba(12, 6, 22, 0.78)';
const PANEL_STROKE = 'rgba(180, 140, 255, 0.35)';
const INK = '#f4ecff';
const PURPLE = '#b388ff';

interface Props {
  wave: number;
  waveMax: number;
  kills: number;
}

export const WaveCard = ({ wave, waveMax, kills }: Props) => (
  <div
    style={{
      position: 'absolute',
      top: 64,
      left: 14,
      zIndex: 1000,
      padding: '8px 14px 9px',
      borderRadius: 12,
      background: PANEL,
      border: `1px solid ${PANEL_STROKE}`,
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      minWidth: 96,
    }}
  >
    <div style={{ font: '700 11px/1 Sora, sans-serif', color: INK, letterSpacing: 1.4 }}>
      WAVE <span style={{ color: PURPLE }}>{String(wave).padStart(2, '0')}</span>
      <span style={{ opacity: 0.5 }}>/{waveMax}</span>
    </div>
    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
      <Skull size={14} color={PURPLE} />
      <span style={{ font: '700 14px/1 Sora, sans-serif', color: INK }}>{kills}</span>
    </div>
  </div>
);
