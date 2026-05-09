// game.jsx — vertical TD prototype
// Uses globals: React, ReactDOM (loaded by index.html)

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// Game viewport (logical) — character art is 1024×1536, scale to fit
const GAME_W = 402;
const GAME_H = 874;

// ─── visual tokens ───────────────────────────────────────────
const C = {
  panel: 'rgba(12, 6, 22, 0.78)',
  panelStroke: 'rgba(180, 140, 255, 0.35)',
  ink: '#f4ecff',
  inkDim: 'rgba(244,236,255,0.62)',
  red: '#e23b5a',
  redDim: 'rgba(226,59,90,0.18)',
  green: '#5cd87a',
  blue: '#3a7af0',
  gold: '#f5c95c',
  purple: '#b388ff',
  purpleDeep: '#7c4dff',
};

// ─── small utility components ────────────────────────────────
function Heart({ size = 14, color = C.green }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', filter: `drop-shadow(0 0 4px ${color}aa)` }}>
      <path d="M12 21s-7.5-4.6-9.5-9.4C1 8 3.2 4 7 4c2 0 3.6 1 5 2.6C13.4 5 15 4 17 4c3.8 0 6 4 4.5 7.6C19.5 16.4 12 21 12 21z" fill={color}/>
    </svg>
  );
}

function Skull({ size = 18, color = C.red }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      <path d="M12 2c-5 0-8 3.6-8 8 0 2.6 1.2 4.6 3 6v3h2v-2h2v2h2v-2h2v2h2v-3c1.8-1.4 3-3.4 3-6 0-4.4-3-8-8-8zm-3 9a2 2 0 110-4 2 2 0 010 4zm6 0a2 2 0 110-4 2 2 0 010 4zm-3 4l-1.2-2h2.4L12 15z" fill={color}/>
    </svg>
  );
}

function Coin({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="coinG" cx="40%" cy="35%">
          <stop offset="0" stopColor="#ffe49a"/>
          <stop offset="0.6" stopColor="#f5c95c"/>
          <stop offset="1" stopColor="#a87420"/>
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#coinG)" stroke="#5b3a0d" strokeWidth="1.2"/>
      <text x="12" y="16" textAnchor="middle" fontFamily="Sora, sans-serif" fontWeight="800" fontSize="11" fill="#7a4a10">$</text>
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18">
      <rect x="1" y="1" width="5" height="16" rx="1.5" fill="#fff"/>
      <rect x="10" y="1" width="5" height="16" rx="1.5" fill="#fff"/>
    </svg>
  );
}

// ─── HUD: TOP BAR ────────────────────────────────────────────
function TopBar({ bossHp, bossMax, gold, onPause }) {
  const pct = Math.max(0, Math.min(1, bossHp / bossMax));
  return (
    <div style={{
      position: 'absolute', top: 12, left: 0, right: 0, padding: '0 14px',
      display: 'flex', alignItems: 'center', gap: 10, zIndex: 30,
    }}>
      {/* pause */}
      <button onClick={onPause} style={{
        width: 42, height: 42, borderRadius: 12,
        background: C.panel, border: `1px solid ${C.panelStroke}`,
        display: 'grid', placeItems: 'center', cursor: 'pointer',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      }}>
        <PauseGlyph/>
      </button>

      {/* boss hp bar */}
      <div style={{ flex: 1, position: 'relative', height: 18 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 999,
          background: 'rgba(0,0,0,0.55)',
          border: `1px solid ${C.panelStroke}`,
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${pct * 100}%`,
            background: `linear-gradient(180deg, #ff5b78, #c81f3d)`,
            boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.25)',
            transition: 'width 0.3s',
          }}/>
        </div>
        {/* skull centered icon */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          width: 26, height: 26, borderRadius: '50%',
          background: '#1a0d22', border: `1.5px solid ${C.red}`,
          display: 'grid', placeItems: 'center',
          boxShadow: '0 0 8px rgba(226,59,90,0.6)',
        }}>
          <Skull size={14}/>
        </div>
      </div>

      {/* gold */}
      <div style={{
        height: 36, padding: '0 12px 0 8px', borderRadius: 999,
        background: C.panel, border: `1px solid ${C.panelStroke}`,
        display: 'flex', alignItems: 'center', gap: 6,
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      }}>
        <Coin/>
        <span style={{ font: '700 15px/1 Sora, sans-serif', color: C.gold, letterSpacing: 0.3 }}>
          {gold.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// ─── HUD: WAVE CARD ─────────────────────────────────────────
function WaveCard({ wave, waveMax, kills }) {
  return (
    <div style={{
      position: 'absolute', top: 64, left: 14, zIndex: 30,
      padding: '8px 14px 9px', borderRadius: 12,
      background: C.panel, border: `1px solid ${C.panelStroke}`,
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      minWidth: 96,
    }}>
      <div style={{ font: '700 11px/1 Sora, sans-serif', color: C.ink, letterSpacing: 1.4 }}>
        WAVE <span style={{ color: C.purple }}>{String(wave).padStart(2,'0')}</span>
        <span style={{ opacity: 0.5 }}>/{waveMax}</span>
      </div>
      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
        <Skull size={14} color={C.purple}/>
        <span style={{ font: '700 14px/1 Sora, sans-serif', color: C.ink }}>{kills}</span>
      </div>
    </div>
  );
}

// ─── HERO with HP bar ───────────────────────────────────────
function Hero({ x, y, hp, hpMax }) {
  const pct = Math.max(0, hp / hpMax);
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: 'translate(-50%, -50%)', zIndex: 12,
      pointerEvents: 'none',
    }}>
      {/* HP bar */}
      <div style={{
        position: 'absolute', left: '50%', top: -84, transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <Heart size={12}/>
        <div style={{
          width: 96, height: 12, borderRadius: 6,
          background: 'rgba(0,0,0,0.6)', border: `1px solid ${C.panelStroke}`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            width: `${pct * 100}%`,
            background: `linear-gradient(180deg, #7df09a, #2fb255)`,
            transition: 'width 0.2s',
            boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}/>
          <span style={{
            position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            font: '800 10px/1 Sora, sans-serif', color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}>{hp.toLocaleString()}</span>
        </div>
      </div>

      {/* glow under hero */}
      <div style={{
        position: 'absolute', left: '50%', top: 30, transform: 'translateX(-50%)',
        width: 130, height: 30, borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(179,136,255,0.55), transparent)',
        filter: 'blur(2px)',
      }}/>

      <img src="assets/hero.png" alt="hero" style={{
        width: 150, height: 'auto', display: 'block',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))',
      }}/>
    </div>
  );
}

// ─── ENEMY sprite (CSS-drawn, layered with reference style) ─
function Enemy({ e }) {
  const isBrute = e.kind === 'brute';
  const w = isBrute ? 56 : 36;
  const h = isBrute ? 64 : 44;
  return (
    <div style={{
      position: 'absolute', left: e.x, top: e.y,
      transform: `translate(-50%, -50%) scale(${1 - (e.dyingT||0)})`,
      opacity: e.dyingT ? 1 - e.dyingT : 1,
      transition: e.dyingT ? 'transform 0.25s ease-in, opacity 0.25s ease-in' : 'none',
      zIndex: Math.floor(e.y),
      pointerEvents: 'none',
    }}>
      <EnemyArt kind={e.kind} w={w} h={h} flash={e.hitT > 0}/>
    </div>
  );
}

function EnemyArt({ kind, w, h, flash }) {
  // stylized chibi-armor enemy, viewed from front
  // brute = larger, horned; minion = smaller, hooded
  const eyeColor = '#d6a8ff';
  const armor = '#1c1326';
  const armorEdge = '#2c1f3d';
  const trim = '#3a2554';
  return (
    <svg width={w} height={h} viewBox="0 0 60 70" style={{
      filter: flash ? 'brightness(2.2) saturate(0.6)' : 'drop-shadow(0 4px 4px rgba(0,0,0,0.55))',
      transition: 'filter 0.08s',
    }}>
      {/* shadow */}
      <ellipse cx="30" cy="66" rx="15" ry="3" fill="rgba(0,0,0,0.5)"/>
      {kind === 'brute' && (
        <>
          {/* horns */}
          <path d="M14 18 Q8 6 16 4 Q18 12 22 18 Z" fill="#0c0814"/>
          <path d="M46 18 Q52 6 44 4 Q42 12 38 18 Z" fill="#0c0814"/>
          {/* head */}
          <ellipse cx="30" cy="22" rx="14" ry="13" fill={armor}/>
          <ellipse cx="30" cy="22" rx="14" ry="13" fill="none" stroke={armorEdge} strokeWidth="1.2"/>
          {/* eyes */}
          <circle cx="24" cy="22" r="2.4" fill={eyeColor}/>
          <circle cx="36" cy="22" r="2.4" fill={eyeColor}/>
          <circle cx="24" cy="22" r="1.1" fill="#fff"/>
          <circle cx="36" cy="22" r="1.1" fill="#fff"/>
          {/* body */}
          <path d="M14 38 Q30 32 46 38 L48 60 Q30 64 12 60 Z" fill={armor} stroke={armorEdge} strokeWidth="1"/>
          <path d="M22 40 L30 36 L38 40 L36 50 L24 50 Z" fill={trim} opacity="0.7"/>
          {/* shoulder spikes */}
          <path d="M12 36 L8 30 L16 32 Z" fill="#0c0814"/>
          <path d="M48 36 L52 30 L44 32 Z" fill="#0c0814"/>
        </>
      )}
      {kind === 'minion' && (
        <>
          {/* hood */}
          <path d="M16 18 Q30 4 44 18 L44 32 L16 32 Z" fill={armor} stroke={armorEdge} strokeWidth="1"/>
          {/* shadow face */}
          <path d="M20 22 Q30 18 40 22 L40 32 L20 32 Z" fill="#0a0612"/>
          {/* eyes */}
          <ellipse cx="25" cy="26" rx="2" ry="1.6" fill={eyeColor}/>
          <ellipse cx="35" cy="26" rx="2" ry="1.6" fill={eyeColor}/>
          {/* body */}
          <path d="M18 32 L42 32 L46 60 Q30 64 14 60 Z" fill={armor} stroke={armorEdge} strokeWidth="1"/>
          <path d="M28 36 L32 36 L34 56 L26 56 Z" fill={trim} opacity="0.7"/>
          {/* dagger hint */}
          <rect x="44" y="44" width="2" height="14" fill="#3a2554" transform="rotate(20 45 51)"/>
        </>
      )}
    </svg>
  );
}

// ─── PROJECTILE ─────────────────────────────────────────────
function Projectile({ p }) {
  return (
    <div style={{
      position: 'absolute', left: p.x, top: p.y,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none', zIndex: 20,
    }}>
      <svg width="32" height="32" viewBox="-16 -16 32 32" style={{
        transform: `rotate(${p.rot}rad)`,
        filter: 'drop-shadow(0 0 8px #c8a4ff) drop-shadow(0 0 16px #b388ff)',
      }}>
        {/* 4-point sparkle */}
        <path d="M0 -12 L2 -2 L12 0 L2 2 L0 12 L-2 2 L-12 0 L-2 -2 Z"
              fill="#fff"/>
        <path d="M0 -8 L1.4 -1.4 L8 0 L1.4 1.4 L0 8 L-1.4 1.4 L-8 0 L-1.4 -1.4 Z"
              fill="#e8d4ff"/>
      </svg>
    </div>
  );
}

// ─── damage number popup ────────────────────────────────────
function DmgPop({ d }) {
  return (
    <div style={{
      position: 'absolute', left: d.x, top: d.y,
      transform: `translate(-50%, ${-d.t * 30 - 20}px)`,
      opacity: 1 - d.t,
      pointerEvents: 'none', zIndex: 40,
      font: `800 ${d.crit ? 18 : 14}px/1 Sora, sans-serif`,
      color: d.crit ? '#ffe06b' : '#fff',
      textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 6px rgba(179,136,255,0.6)',
    }}>
      {d.crit ? `${d.amount}!` : d.amount}
    </div>
  );
}

// ─── BOTTOM BAR (XP + skills) ───────────────────────────────
function BottomBar({ level, expPct, skills, onCast, casting }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 30,
      padding: '0 0 16px',
    }}>
      {/* level + EXP banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        margin: '0 14px 12px', height: 36,
        position: 'relative',
      }}>
        {/* level badge */}
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #2a1840, #0a0612)',
          border: `2px solid ${C.gold}`,
          display: 'grid', placeItems: 'center', flex: '0 0 auto',
          boxShadow: '0 0 12px rgba(245,201,92,0.35), inset 0 0 8px rgba(0,0,0,0.6)',
          marginRight: -8, zIndex: 2, position: 'relative',
          gridTemplateRows: 'auto auto',
        }}>
          <span style={{ font: '600 8px/1 Sora, sans-serif', color: C.gold, letterSpacing: 0.5, marginTop: 6 }}>Lv.</span>
          <span style={{ font: '800 18px/1 Sora, sans-serif', color: '#fff', marginBottom: 6 }}>{level}</span>
        </div>
        {/* exp bar */}
        <div style={{
          flex: 1, height: 22, position: 'relative',
          // chevron right end
          clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)',
          background: 'rgba(0,0,0,0.6)',
          border: `1px solid ${C.panelStroke}`,
        }}>
          <div style={{
            position: 'absolute', inset: 1, width: `calc(${expPct}% - 2px)`,
            background: `linear-gradient(180deg, #7aa6ff, #2a55c8)`,
            boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
            transition: 'width 0.3s',
          }}/>
          <div style={{
            position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            font: '700 11px/1 Sora, sans-serif', color: '#fff', letterSpacing: 1.5,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}>EXP {expPct}%</div>
        </div>
      </div>

      {/* skill row */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 18,
        padding: '0 14px',
      }}>
        {skills.map((s, i) => (
          <SkillIcon key={s.id} skill={s}
                     onClick={() => onCast(i)}
                     active={casting === i}/>
        ))}
      </div>
    </div>
  );
}

function SkillIcon({ skill, onClick, active }) {
  const cd = skill.cd > 0;
  return (
    <button onClick={onClick} disabled={cd} style={{
      width: 64, height: 64, borderRadius: 14, padding: 0,
      background: skill.bg,
      border: `1.5px solid ${active ? '#fff' : C.panelStroke}`,
      cursor: cd ? 'default' : 'pointer',
      position: 'relative', overflow: 'hidden',
      transform: active ? 'scale(1.08)' : 'scale(1)',
      transition: 'transform 0.12s, border-color 0.1s',
      boxShadow: active
        ? '0 0 18px rgba(179,136,255,0.85), 0 4px 10px rgba(0,0,0,0.5)'
        : '0 4px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
    }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        {skill.icon}
      </div>

      {/* cooldown sweep */}
      {cd && (
        <>
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)',
            display: 'grid', placeItems: 'center',
            font: '800 22px/1 Sora, sans-serif', color: '#fff',
            textShadow: '0 1px 3px rgba(0,0,0,0.9)',
          }}>{Math.ceil(skill.cd)}</div>
        </>
      )}

      {/* lv label tab */}
      <div style={{
        position: 'absolute', left: '50%', bottom: -12, transform: 'translateX(-50%)',
        background: '#0a0612', border: `1px solid ${C.panelStroke}`,
        borderRadius: 6, padding: '2px 8px',
        font: '700 10px/1 Sora, sans-serif', color: C.ink, letterSpacing: 0.5,
      }}>Lv.{skill.lv}</div>
    </button>
  );
}

// ─── pause overlay ──────────────────────────────────────────
function PauseOverlay({ onResume }) {
  return (
    <div onClick={onResume} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(5,2,12,0.78)', backdropFilter: 'blur(6px)',
      display: 'grid', placeItems: 'center',
      cursor: 'pointer',
    }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{ font: '800 28px/1 Sora, sans-serif', letterSpacing: 4 }}>PAUSED</div>
        <div style={{ marginTop: 10, font: '500 12px/1 Sora, sans-serif', color: C.inkDim, letterSpacing: 2 }}>TAP TO RESUME</div>
      </div>
    </div>
  );
}

// ─── SKILL definitions ──────────────────────────────────────
const SKILL_DEFS = [
  {
    id: 'starlight', name: 'Starlight Burst', lv: 3, cdMax: 4,
    bg: 'radial-gradient(circle at 50% 45%, #1d2a6c, #060216)',
    icon: (
      <svg width="40" height="40" viewBox="-20 -20 40 40">
        <path d="M0 -16 L3 -3 L16 0 L3 3 L0 16 L-3 3 L-16 0 L-3 -3 Z" fill="#9ec5ff"
              filter="drop-shadow(0 0 6px #6da6ff)"/>
        <path d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: 'orbit', name: 'Astral Orbit', lv: 2, cdMax: 6,
    bg: 'radial-gradient(circle at 50% 45%, #3a1a5e, #0a0414)',
    icon: (
      <svg width="40" height="40" viewBox="-20 -20 40 40">
        <circle r="14" fill="none" stroke="#c8a4ff" strokeWidth="1.4" opacity="0.85"/>
        <circle r="9" fill="none" stroke="#9d6fff" strokeWidth="1" opacity="0.55"/>
        <path d="M0 -8 L1.6 -1.6 L8 0 L1.6 1.6 L0 8 L-1.6 1.6 L-8 0 L-1.6 -1.6 Z" fill="#fff"/>
        <circle cx="14" cy="0" r="2.5" fill="#fff"/>
        <circle cx="-10" cy="-9" r="1.6" fill="#c8a4ff"/>
      </svg>
    ),
  },
  {
    id: 'rain', name: 'Arrow Rain', lv: 4, cdMax: 8,
    bg: 'radial-gradient(circle at 50% 45%, #4a1a40, #100410)',
    icon: (
      <svg width="40" height="48" viewBox="-20 -24 40 48">
        {[-10, 0, 10].map((dx, i) => (
          <g key={i} transform={`translate(${dx} ${i === 1 ? -2 : 2})`}>
            <path d="M0 -16 L0 12" stroke="#c8a4ff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M0 12 L-3 7 M0 12 L3 7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M-2 -14 L0 -18 L2 -14 Z" fill="#fff"/>
          </g>
        ))}
      </svg>
    ),
  },
];

// ─── MAIN GAME ──────────────────────────────────────────────
function VStarTD() {
  // mutable game state stored in refs (rAF loop), mirrored to react state for HUD
  const stateRef = useRef({
    enemies: [],
    projectiles: [],
    pops: [],
    nextEnemyId: 1,
    nextProjId: 1,
    nextPopId: 1,
    spawnT: 0,
    fireT: 0,
    waveT: 0,
    skills: SKILL_DEFS.map(s => ({ ...s, cd: 0 })),
    lastTs: 0,
  });

  const [, force] = useState(0);
  const tick = useCallback(() => force(v => v + 1), []);

  const [paused, setPaused] = useState(false);
  const [hp, setHp] = useState(3200);
  const HP_MAX = 3200;
  const [bossHp, setBossHp] = useState(0.92);
  const [gold, setGold] = useState(1250);
  const [wave, setWave] = useState(12);
  const [kills, setKills] = useState(256);
  const [level, setLevel] = useState(15);
  const [exp, setExp] = useState(65);
  const [casting, setCasting] = useState(null);
  const [levelUp, setLevelUp] = useState(null); // { choices, level }
  const [rerolls, setRerolls] = useState(2);
  const [pickedLog, setPickedLog] = useState([]);

  const heroX = GAME_W / 2;
  const heroY = GAME_H - 245;

  // spawn one enemy
  const spawn = useCallback((kind) => {
    const s = stateRef.current;
    const isBrute = kind === 'brute';
    s.enemies.push({
      id: s.nextEnemyId++,
      kind,
      x: 60 + Math.random() * (GAME_W - 120),
      y: -30 - Math.random() * 40,
      vy: isBrute ? 8 : 14,
      hp: isBrute ? 600 : 180,
      hpMax: isBrute ? 600 : 180,
      hitT: 0,
      dyingT: 0,
    });
  }, []);

  // initial enemy formation (matches reference)
  useEffect(() => {
    const s = stateRef.current;
    // back rows of minions
    for (let r = 0; r < 4; r++) {
      const cols = r === 1 ? 6 : 5;
      for (let c = 0; c < cols; c++) {
        s.enemies.push({
          id: s.nextEnemyId++,
          kind: 'minion',
          x: (GAME_W / (cols + 1)) * (c + 1) + (r % 2 ? 14 : 0),
          y: 90 + r * 56,
          vy: 8 + Math.random() * 2,
          hp: 180, hpMax: 180,
          hitT: 0, dyingT: 0,
        });
      }
    }
    // two brutes
    s.enemies.push({
      id: s.nextEnemyId++, kind: 'brute',
      x: GAME_W * 0.32, y: 152,
      vy: 5, hp: 600, hpMax: 600, hitT: 0, dyingT: 0,
    });
    s.enemies.push({
      id: s.nextEnemyId++, kind: 'brute',
      x: GAME_W * 0.7, y: 168,
      vy: 5, hp: 600, hpMax: 600, hitT: 0, dyingT: 0,
    });
    tick();
  }, []);

  // fire a projectile at a target
  const fireAt = useCallback((target, opts = {}) => {
    const s = stateRef.current;
    const dx = target.x - heroX;
    const dy = target.y - (heroY - 30);
    const len = Math.hypot(dx, dy) || 1;
    const speed = opts.speed || 380;
    s.projectiles.push({
      id: s.nextProjId++,
      x: heroX + (Math.random() - 0.5) * 20,
      y: heroY - 30,
      vx: (dx / len) * speed,
      vy: (dy / len) * speed,
      rot: Math.atan2(dy, dx) + Math.PI / 2,
      life: 1.4,
      target: target.id,
      dmg: opts.dmg || (60 + Math.random() * 40),
      crit: Math.random() < 0.18,
    });
  }, [heroX, heroY]);

  // game loop
  useEffect(() => {
    let raf;
    const loop = (ts) => {
      const s = stateRef.current;
      const dt = Math.min(0.05, (ts - (s.lastTs || ts)) / 1000);
      s.lastTs = ts;

      if (!paused && !levelUp) {
        // skill cooldowns
        s.skills.forEach(sk => { if (sk.cd > 0) sk.cd = Math.max(0, sk.cd - dt); });

        // spawn pulse
        s.spawnT += dt;
        if (s.spawnT > 1.6 && s.enemies.length < 30) {
          s.spawnT = 0;
          const n = 2 + Math.floor(Math.random() * 2);
          for (let i = 0; i < n; i++) spawn(Math.random() < 0.18 ? 'brute' : 'minion');
        }

        // auto-attack
        s.fireT += dt;
        if (s.fireT > 0.42 && s.enemies.length) {
          s.fireT = 0;
          // pick 1-2 nearest enemies
          const sorted = [...s.enemies].sort((a, b) => a.y + 1000 - (b.y + 1000));
          const targets = sorted.slice(-Math.min(2, sorted.length));
          targets.forEach(t => fireAt(t));
        }

        // move enemies
        s.enemies.forEach(e => {
          if (e.dyingT > 0) { e.dyingT = Math.min(1, e.dyingT + dt * 4); return; }
          e.y += e.vy * dt;
          if (e.hitT > 0) e.hitT -= dt;
          // reach hero -> damage
          if (e.y > heroY - 60) {
            setHp(h => Math.max(0, h - (e.kind === 'brute' ? 40 : 12)));
            e.dyingT = 0.01;
          }
        });

        // move projectiles, hit detection
        s.projectiles.forEach(p => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          // home toward target slightly
          const tgt = s.enemies.find(e => e.id === p.target && e.dyingT === 0);
          if (tgt) {
            const dx = tgt.x - p.x;
            const dy = tgt.y - p.y;
            const len = Math.hypot(dx, dy) || 1;
            if (len < 18) {
              // hit!
              const dmg = Math.round(p.dmg * (p.crit ? 2.2 : 1));
              tgt.hp -= dmg;
              tgt.hitT = 0.1;
              s.pops.push({ id: s.nextPopId++, x: tgt.x, y: tgt.y - 22, t: 0, amount: dmg, crit: p.crit });
              p.life = 0;
              if (tgt.hp <= 0 && tgt.dyingT === 0) {
                tgt.dyingT = 0.01;
                setKills(k => k + 1);
                setGold(g => g + (tgt.kind === 'brute' ? 25 : 6));
                setExp(e => {
                  const ne = e + (tgt.kind === 'brute' ? 8 : 2);
                  if (ne >= 100) {
                    setLevel(l => {
                      const nl = l + 1;
                      setLevelUp({ choices: pickThree(), level: nl });
                      return nl;
                    });
                    return ne - 100;
                  }
                  return ne;
                });
                setBossHp(b => Math.max(0.05, b - 0.008));
              }
            } else {
              // gentle homing
              p.vx += (dx / len) * 200 * dt;
              p.vy += (dy / len) * 200 * dt;
              const sp = Math.hypot(p.vx, p.vy);
              const max = 460;
              if (sp > max) { p.vx *= max/sp; p.vy *= max/sp; }
              p.rot = Math.atan2(p.vy, p.vx) + Math.PI / 2;
            }
          }
        });

        // damage popups
        s.pops.forEach(d => { d.t += dt * 1.4; });

        // cleanup
        s.enemies = s.enemies.filter(e => !(e.dyingT >= 1));
        s.projectiles = s.projectiles.filter(p => p.life > 0 && p.y > -50 && p.y < GAME_H + 50 && p.x > -50 && p.x < GAME_W + 50);
        s.pops = s.pops.filter(d => d.t < 1);
      }

      tick();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused, levelUp, fireAt, spawn]);

  // wave advances when many killed
  useEffect(() => {
    if (kills >= 256 + 30) {
      setWave(w => Math.min(20, w + 1));
      setKills(256);
    }
  }, [kills]);

  // skill cast
  const castSkill = useCallback((idx) => {
    const s = stateRef.current;
    const sk = s.skills[idx];
    if (sk.cd > 0) return;
    sk.cd = sk.cdMax;
    setCasting(idx);
    setTimeout(() => setCasting(null), 350);

    if (sk.id === 'starlight') {
      // 8 sparkles in arc
      const targets = s.enemies.filter(e => e.dyingT === 0).slice(0, 6);
      targets.forEach((t, i) => {
        setTimeout(() => fireAt(t, { dmg: 180 + Math.random() * 60, speed: 460 }), i * 60);
      });
    } else if (sk.id === 'orbit') {
      // burst all enemies on screen with orbiting damage
      const targets = s.enemies.filter(e => e.dyingT === 0);
      targets.forEach((t, i) => {
        setTimeout(() => {
          const dmg = Math.round(120 + Math.random() * 50);
          t.hp -= dmg;
          t.hitT = 0.1;
          s.pops.push({ id: s.nextPopId++, x: t.x, y: t.y - 22, t: 0, amount: dmg, crit: false });
          if (t.hp <= 0 && t.dyingT === 0) {
            t.dyingT = 0.01;
            setKills(k => k + 1);
            setGold(g => g + 8);
          }
        }, i * 35);
      });
    } else if (sk.id === 'rain') {
      // arrow rain: 14 random spots
      for (let i = 0; i < 16; i++) {
        const x = 40 + Math.random() * (GAME_W - 80);
        const y = 80 + Math.random() * 380;
        setTimeout(() => {
          s.pops.push({ id: s.nextPopId++, x, y: y - 12, t: 0, amount: '✦', crit: true });
          // damage nearest enemy in radius 56
          s.enemies.forEach(e => {
            if (e.dyingT === 0 && Math.hypot(e.x - x, e.y - y) < 60) {
              const dmg = Math.round(80 + Math.random() * 50);
              e.hp -= dmg;
              e.hitT = 0.1;
              s.pops.push({ id: s.nextPopId++, x: e.x, y: e.y - 22, t: 0, amount: dmg, crit: false });
              if (e.hp <= 0 && e.dyingT === 0) {
                e.dyingT = 0.01;
                setKills(k => k + 1);
                setGold(g => g + 5);
              }
            }
          });
        }, i * 70);
      }
    }
  }, [fireAt]);

  const s = stateRef.current;

  return (
    <div style={{
      width: GAME_W, height: GAME_H,
      position: 'relative', overflow: 'hidden',
      background: '#0a0612',
      fontFamily: 'Sora, system-ui, sans-serif',
    }}>
      {/* arena background */}
      <img src="assets/arena-bg.png" alt="" style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%', objectFit: 'cover',
        zIndex: 0, userSelect: 'none', pointerEvents: 'none',
      }}/>

      {/* dark vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }}/>

      {/* HUD */}
      <TopBar bossHp={bossHp} bossMax={1} gold={gold} onPause={() => setPaused(p => !p)}/>
      <WaveCard wave={wave} waveMax={20} kills={kills}/>

      {/* enemies */}
      {s.enemies.map(e => <Enemy key={e.id} e={e}/>)}

      {/* hero */}
      <Hero x={heroX} y={heroY} hp={hp} hpMax={HP_MAX}/>

      {/* projectiles */}
      {s.projectiles.map(p => <Projectile key={p.id} p={p}/>)}

      {/* damage popups */}
      {s.pops.map(d => <DmgPop key={d.id} d={d}/>)}

      {/* bottom bar */}
      <BottomBar level={level} expPct={exp} skills={s.skills}
                 onCast={castSkill} casting={casting}/>

      {/* pause */}
      {paused && <PauseOverlay onResume={() => setPaused(false)}/>}

      {/* level up */}
      {levelUp && (
        <LevelUpOverlay
          choices={levelUp.choices}
          level={levelUp.level}
          rerolls={rerolls}
          onPick={(b) => { setPickedLog(p => [...p, b.id]); setLevelUp(null); }}
          onReroll={() => {
            if (rerolls <= 0) return;
            setRerolls(r => r - 1);
            setLevelUp(lu => ({ ...lu, choices: pickThree() }));
          }}
        />
      )}
    </div>
  );
}

// ─── Wrap inside a phone frame on a stage ───────────────────
function App() {
  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: 'radial-gradient(ellipse at top, #1a0a2a 0%, #07030f 70%)',
      display: 'grid', placeItems: 'center',
      padding: '24px 12px', boxSizing: 'border-box',
      fontFamily: 'Sora, system-ui, sans-serif',
    }}>
      <IOSDevice width={GAME_W} height={GAME_H + 60} dark={true}>
        <div style={{ width: GAME_W, height: GAME_H, position: 'relative', marginTop: 60 }}>
          <VStarTD/>
        </div>
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
