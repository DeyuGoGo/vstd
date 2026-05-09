import type { Skill } from '../engine/types';
import type { SkillDef } from '../data/skills';

const PANEL_STROKE = 'rgba(180, 140, 255, 0.35)';
const INK = '#f4ecff';

interface Props {
  skill: Skill;
  def: SkillDef;
  active: boolean;
  onClick: () => void;
}

export const SkillIcon = ({ skill, def, active, onClick }: Props) => {
  const cd = skill.cd > 0;
  return (
    <button
      onClick={onClick}
      disabled={cd}
      style={{
        width: 64,
        height: 64,
        borderRadius: 14,
        padding: 0,
        background: def.bg,
        border: `1.5px solid ${active ? '#fff' : PANEL_STROKE}`,
        cursor: cd ? 'default' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transform: active ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 0.12s, border-color 0.1s',
        boxShadow: active
          ? '0 0 18px rgba(179,136,255,0.85), 0 4px 10px rgba(0,0,0,0.5)'
          : '0 4px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}
      aria-label={def.name}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {def.icon}
      </div>

      {cd && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'grid',
            placeItems: 'center',
            font: '800 22px/1 Sora, sans-serif',
            color: '#fff',
            textShadow: '0 1px 3px rgba(0,0,0,0.9)',
          }}
        >
          {Math.ceil(skill.cd)}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -12,
          transform: 'translateX(-50%)',
          background: '#0a0612',
          border: `1px solid ${PANEL_STROKE}`,
          borderRadius: 6,
          padding: '2px 8px',
          font: '700 10px/1 Sora, sans-serif',
          color: INK,
          letterSpacing: 0.5,
        }}
      >
        Lv.{skill.lv}
      </div>
    </button>
  );
};
