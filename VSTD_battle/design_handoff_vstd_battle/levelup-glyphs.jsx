// levelup.jsx — Level Up blessing card selection
const { useState: useStateLU, useMemo: useMemoLU } = React;

const BLESSING_POOL = [
  { id: 'arcane',   name: 'ARCANE SHARD',    desc: 'Increases projectile', desc2: 'speed by',         val: '20%', glyph: 'star8',   tint: '#9ec5ff' },
  { id: 'mana',     name: 'MANA ORB',        desc: 'Increases experience', desc2: 'gain by',          val: '15%', glyph: 'orb',     tint: '#c8a4ff' },
  { id: 'pierce',   name: 'PIERCING BOLTS',  desc: 'Projectiles pierce',   desc2: 'through',          val: '+1',  unit: 'enemy.',   glyph: 'arrows',  tint: '#d6a4ff' },
  { id: 'haste',    name: 'STARFALL HASTE',  desc: 'Reduces attack',       desc2: 'cooldown by',      val: '12%', glyph: 'hourglass', tint: '#a4ffe0' },
  { id: 'crit',     name: 'CRITICAL EYE',    desc: 'Increases critical',   desc2: 'chance by',        val: '8%',  glyph: 'eye',     tint: '#ffd17a' },
  { id: 'crystal',  name: 'CRYSTAL HEART',   desc: 'Increases max HP',     desc2: 'by',               val: '500', glyph: 'heart',   tint: '#ff9aae' },
  { id: 'echo',     name: 'ECHO BOLT',       desc: 'Adds',                 desc2: 'projectile per cast.', val: '+1', noUnit: true, glyph: 'echo', tint: '#9ec5ff' },
  { id: 'gold',     name: 'GREEDY MOON',     desc: 'Increases gold gain',  desc2: 'by',               val: '25%', glyph: 'coin',    tint: '#f5c95c' },
  { id: 'aura',     name: 'VOID AURA',       desc: 'Damages enemies',      desc2: 'within range.',    val: 'NEW', glyph: 'aura',    tint: '#c8a4ff', noUnit: true },
];

function pickThree() {
  const a = [...BLESSING_POOL];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, 3);
}

function BlessingGlyph({ kind, tint }) {
  const glow = `drop-shadow(0 0 10px ${tint}cc) drop-shadow(0 0 24px ${tint}99)`;
  if (kind === 'star8') return (
    <svg width="92" height="92" viewBox="-50 -50 100 100" style={{ filter: glow }}>
      <g>
        <path d="M0 -42 L6 -6 L42 0 L6 6 L0 42 L-6 6 L-42 0 L-6 -6 Z" fill="#fff"/>
        <path d="M-30 -30 L-3 -3 M30 -30 L3 -3 M-30 30 L-3 3 M30 30 L3 3" stroke={tint} strokeWidth="3" strokeLinecap="round"/>
        <path d="M0 -28 L4 -4 L28 0 L4 4 L0 28 L-4 4 L-28 0 L-4 -4 Z" fill={tint}/>
        <circle r="6" fill="#fff"/>
      </g>
    </svg>
  );
  if (kind === 'orb') return (
    <svg width="100" height="100" viewBox="-50 -50 100 100" style={{ filter: glow }}>
      <circle r="38" fill="none" stroke={tint} strokeWidth="3" opacity="0.85"/>
      <circle r="32" fill="none" stroke={tint} strokeWidth="1.5" opacity="0.45"/>
      <circle r="38" fill={`${tint}22`}/>
      <path d="M0 -22 L4 -4 L22 0 L4 4 L0 22 L-4 4 L-22 0 L-4 -4 Z" fill="#fff"/>
      <path d="M0 -14 L2 -2 L14 0 L2 2 L0 14 L-2 2 L-14 0 L-2 -2 Z" fill={tint}/>
      {[0, 60, 120, 180, 240, 300].map(a => {
        const r = 30, x = Math.cos(a * Math.PI/180) * r, y = Math.sin(a * Math.PI/180) * r;
        return <circle key={a} cx={x} cy={y} r="1.6" fill="#fff" opacity="0.9"/>;
      })}
    </svg>
  );
  if (kind === 'arrows') return (
    <svg width="100" height="100" viewBox="-50 -50 100 100" style={{ filter: glow }}>
      {[-22, 0, 22].map((dx, i) => {
        const ofs = i === 1 ? -6 : 4;
        return (
          <g key={i} transform={`translate(${dx} ${ofs})`}>
            <path d="M0 -32 L-3 -22 L0 -16 L3 -22 Z M0 -16 L0 26" stroke={tint} strokeWidth="3" strokeLinecap="round" fill={tint}/>
            <path d="M0 26 L-5 18 M0 26 L5 18" stroke={tint} strokeWidth="3" strokeLinecap="round"/>
            <path d="M0 -28 L-2 -22 L2 -22 Z" fill="#fff"/>
          </g>
        );
      })}
    </svg>
  );
  if (kind === 'hourglass') return (
    <svg width="90" height="100" viewBox="-45 -50 90 100" style={{ filter: glow }}>
      <path d="M-22 -34 H22 L-22 34 H22 Z" fill="none" stroke={tint} strokeWidth="3"/>
      <path d="M-22 -34 H22 L0 0 Z" fill={`${tint}55`}/>
      <path d="M-22 34 H22 L0 0 Z" fill={`${tint}88`}/>
      <circle r="2" cy="6" fill="#fff"/>
    </svg>
  );
  if (kind === 'eye') return (
    <svg width="100" height="80" viewBox="-50 -40 100 80" style={{ filter: glow }}>
      <path d="M-42 0 Q0 -32 42 0 Q0 32 -42 0 Z" fill="none" stroke={tint} strokeWidth="3"/>
      <circle r="14" fill={`${tint}55`}/>
      <circle r="10" fill="#0a0612"/>
      <circle r="4" fill={tint}/>
      <circle r="2" cx="-2" cy="-2" fill="#fff"/>
    </svg>
  );
  if (kind === 'heart') return (
    <svg width="96" height="92" viewBox="-50 -48 100 96" style={{ filter: glow }}>
      <path d="M0 32 C-44 4 -36 -36 -14 -36 C-4 -36 0 -28 0 -22 C0 -28 4 -36 14 -36 C36 -36 44 4 0 32 Z"
            fill={`${tint}aa`} stroke={tint} strokeWidth="2.5"/>
      <path d="M-10 -20 Q-4 -28 0 -20" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
  if (kind === 'echo') return (
    <svg width="100" height="80" viewBox="-50 -40 100 80" style={{ filter: glow }}>
      {[0.4, 0.7, 1].map((s, i) => (
        <path key={i} transform={`scale(${s})`} d="M0 -22 L4 -4 L22 0 L4 4 L0 22 L-4 4 L-22 0 L-4 -4 Z"
              fill={i === 2 ? '#fff' : tint} opacity={i === 2 ? 1 : 0.4 + 0.3*i}/>
      ))}
      <path d="M-32 -8 L-22 -2 M-32 8 L-22 2 M32 -8 L22 -2 M32 8 L22 2" stroke={tint} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  if (kind === 'coin') return (
    <svg width="92" height="92" viewBox="-46 -46 92 92" style={{ filter: glow }}>
      <circle r="36" fill={`${tint}22`} stroke={tint} strokeWidth="3"/>
      <text textAnchor="middle" y="14" fontFamily="Sora" fontSize="44" fontWeight="800" fill={tint}>$</text>
      <circle r="2" cx="-26" cy="-22" fill="#fff"/>
    </svg>
  );
  if (kind === 'aura') return (
    <svg width="100" height="100" viewBox="-50 -50 100 100" style={{ filter: glow }}>
      <circle r="42" fill="none" stroke={tint} strokeWidth="2" strokeDasharray="3 4" opacity="0.7"/>
      <circle r="32" fill="none" stroke={tint} strokeWidth="2" opacity="0.5"/>
      <circle r="20" fill={`${tint}55`} stroke={tint} strokeWidth="2"/>
      <path d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z" fill="#fff"/>
    </svg>
  );
  return null;
}

window.BLESSING_POOL = BLESSING_POOL;
window.pickThree = pickThree;
window.BlessingGlyph = BlessingGlyph;
