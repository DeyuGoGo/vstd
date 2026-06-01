/* eslint-disable react-hooks/refs */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSceneStore, SCENE_DIMS } from '../stores/useSceneStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useToastStore } from '../stores/useToastStore';
import { CHARACTERS } from '../characters/index';
import type { CharacterBaseConfig } from '../characters/types';
import { computeEffectiveBattleStats } from '../characters/statFormulas';
import {
  createInitialState,
  initialMods,
  type Enemy,
  type Mods,
  type Outcome,
} from './engine/types';
import { WAVES, ENEMY_BASE, BOSS_MUL } from './data/waves';
import { TopBar } from './components/TopBar';
import { Hero } from './components/Hero';
import { Enemy as EnemyComp } from './components/Enemy';
import { Projectile as ProjectileComp } from './components/Projectile';
import { DmgPop } from './components/DmgPop';
import { BottomBar } from './components/BottomBar';
import { Z } from './zIndex';
import { PauseOverlay } from './components/PauseOverlay';
import { GameOverOverlay } from './components/GameOverOverlay';
import { VictoryOverlay } from './components/VictoryOverlay';
import { playSfx, preloadSfx } from '../audio';
import rawStyles from './Battle.module.css';
import { cm } from '../utils/cssModule';
const styles = cm(rawStyles);

const GAME_W = SCENE_DIMS.battle.w;
const GAME_H = SCENE_DIMS.battle.h;
const LINEUP_ANCHOR_X = GAME_W / 2;
const LINEUP_ANCHOR_Y = GAME_H - 165;
// 防線 Y：城牆 sprite 視覺帶的基準線。
const HERO_COLLISION_Y = LINEUP_ANCHOR_Y - 60;
// 怪物攻擊停止線：比牆基準上移，讓怪物身體停在牆上方、腳進牆帶被前景牆遮住，
// 形成「被城牆攔住、從牆後探出」的視覺。
const ENEMY_STOP_Y = HERO_COLLISION_Y - 30;

// 戰鬥時間倍率循環：dt 乘上此值，加速所有 dt-based 邏輯（怪物 / 彈道 / 攻速 /
// spawn / regen / attacking）。玩家用頂部按鈕切換，比例不變、整體節奏倍速。
const SPEED_CYCLE = [1, 2, 3] as const;

// Triangle formation: slot 0 front-center, slot 1 back-left, slot 2 back-right.
const SLOT_OFFSETS: readonly { x: number; y: number }[] = [
  { x: 0, y: 0 },
  { x: -52, y: 46 },
  { x: 52, y: 46 },
];

interface Combatant {
  slotIdx: number;
  charId: string;
  base: CharacterBaseConfig;
  pos: { x: number; y: number };
  hp: number;
  hpMax: number;
  mods: Mods;
  fireT: number;
  dead: boolean;
  attackTick: number;
  dmgMin: number;
  dmgMax: number;
  projSpeed: number;
  projSpeedCap: number;
  fireCdBase: number;
}

const buildCombatants = (lineup: (string | null)[]): Combatant[] => {
  const out: Combatant[] = [];
  for (let i = 0; i < lineup.length; i++) {
    const id = lineup[i];
    if (!id) continue;
    const base = CHARACTERS[id as keyof typeof CHARACTERS];
    if (!base) continue;
    const progress = usePlayerStore.getState().characters[id];
    if (!progress) continue;
    const eff = computeEffectiveBattleStats(base.baseStats, progress.stats);
    const offset = SLOT_OFFSETS[i] ?? SLOT_OFFSETS[0];
    out.push({
      slotIdx: i,
      charId: id,
      base,
      pos: { x: LINEUP_ANCHOR_X + offset.x, y: LINEUP_ANCHOR_Y + offset.y },
      hp: eff.hpMax,
      hpMax: eff.hpMax,
      mods: initialMods({
        attackRange: eff.attackRange,
        fireCdMul: eff.fireCdMul,
        critBase: eff.critBase,
        projSpeed: eff.projSpeed,
        defReduction: eff.defReduction,
        hpRegenPerSec: eff.hpRegenPerSec,
      }),
      fireT: 0,
      dead: false,
      attackTick: 0,
      dmgMin: eff.dmgMin,
      dmgMax: eff.dmgMax,
      projSpeed: eff.projSpeed,
      projSpeedCap: eff.projSpeedCap,
      fireCdBase: base.baseStats.fireCdBase,
    });
  }
  return out;
};

export const Battle = () => {
  const setScene = useSceneStore((s) => s.setScene);
  const addGold = usePlayerStore((s) => s.addGold);
  const lineup = usePlayerStore((s) => s.lineup);
  const showToast = useToastStore((s) => s.showToast);

  const settledRef = useRef(false);
  const stateRef = useRef(createInitialState());
  const combatantsRef = useRef<Combatant[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const shakeAmpRef = useRef(0);

  // Initialize combatants once on mount from current lineup snapshot.
  if (combatantsRef.current.length === 0) {
    combatantsRef.current = buildCombatants(lineup);
  }

  const triggerShake = useCallback((amp: number) => {
    if (amp > shakeAmpRef.current) shakeAmpRef.current = amp;
  }, []);

  const [, forceTick] = useState(0);
  const force = useCallback(() => forceTick((v) => v + 1), []);

  const [paused, setPaused] = useState(false);
  const [gold, setGold] = useState(0);
  const [kills, setKills] = useState(0);
  const [currentWaveIdx, setCurrentWaveIdx] = useState(0);

  // Battle speed (1x/2x/3x). state drives the button label; ref is read by the
  // game loop so cycling speed doesn't restart the loop / reset its timestamp.
  const [speedScale, setSpeedScale] = useState<number>(SPEED_CYCLE[0]);
  const speedScaleRef = useRef<number>(SPEED_CYCLE[0]);
  const cycleSpeed = useCallback(() => {
    setSpeedScale((prev) => {
      const idx = SPEED_CYCLE.indexOf(prev as (typeof SPEED_CYCLE)[number]);
      const next = SPEED_CYCLE[(idx + 1) % SPEED_CYCLE.length];
      speedScaleRef.current = next;
      return next;
    });
  }, []);
  const [waveKills, setWaveKills] = useState(0);
  const [outcome, setOutcome] = useState<Outcome>('running');

  // ── Team defense pool (TD 防線) ──────────────────────
  // teamHpMax = sum of all combatants' hpMax；teamDef = avg defReduction（VIT 來源）；
  // teamRegen = sum hpRegenPerSec（VIT 來源，多人疊加）。
  // 怪物穿越攻擊線後 attacking=true，每 ENEMY_ATTACK_INTERVAL 秒攻擊一次扣 teamHp。
  // 同時 teamHp += teamRegen × dt（capped at teamHpMax，無 overheal）。
  const teamStats = (() => {
    const combatants = combatantsRef.current;
    if (combatants.length === 0) return { hpMax: 1, def: 0, regen: 0 };
    const hpMax = combatants.reduce((sum, c) => sum + c.hpMax, 0);
    const defSum = combatants.reduce((sum, c) => sum + c.mods.defReduction, 0);
    const def = defSum / combatants.length;
    const regen = combatants.reduce((sum, c) => sum + c.mods.hpRegenPerSec, 0);
    return { hpMax, def, regen };
  })();
  const [teamHp, setTeamHp] = useState(teamStats.hpMax);
  const teamHpMax = teamStats.hpMax;
  const teamDef = teamStats.def;
  const teamRegen = teamStats.regen;

  useEffect(() => {
    preloadSfx();
  }, []);

  // Last-line guard: empty lineup → toast + back to lobby. Defer via microtask
  // so we don't trigger Toast setState during Battle's mount render path.
  useEffect(() => {
    if (combatantsRef.current.length === 0) {
      queueMicrotask(() => {
        showToast('請先編隊');
        setScene('lobby');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── helpers ──────────────────────────────────────────
  const spawnEnemy = useCallback(
    (kind: 'minion' | 'brute', isBoss = false) => {
      const s = stateRef.current;
      const wave = WAVES[currentWaveIdx];
      const base = ENEMY_BASE[kind];
      let hpMax = base.hp * wave.enemyHpMul;
      let vy = base.vy * wave.enemySpeedMul;
      if (isBoss) {
        hpMax *= BOSS_MUL.hpMul;
        vy *= BOSS_MUL.speedMul;
      }
      const enemy: Enemy = {
        id: s.nextEnemyId++,
        kind,
        isBoss,
        x: 60 + Math.random() * (GAME_W - 120),
        y: -30 - Math.random() * 40,
        vy,
        hp: hpMax,
        hpMax,
        hitT: 0,
        dyingT: 0,
        attacking: false,
        attackT: 0,
      };
      if (isBoss) {
        enemy.x = GAME_W / 2;
        enemy.y = 80;
        s.bossId = enemy.id;
      }
      s.enemies.push(enemy);
    },
    [currentWaveIdx],
  );

  const fireAt = useCallback(
    (
      c: Combatant,
      target: Enemy,
      opts: { lateral?: number; straight?: boolean } = {},
    ) => {
      const s = stateRef.current;
      const originX = c.pos.x;
      const originY = c.pos.y - 30;
      const dx = target.x - originX;
      const dy = target.y - originY;
      const len = Math.hypot(dx, dy) || 1;
      const speed = c.projSpeed * c.mods.projSpeedMul;
      const isCrit = Math.random() < c.mods.critBonus;
      const nx = dx / len;
      const ny = dy / len;
      const lateral = opts.lateral ?? 0;
      const px = -ny;
      const py = nx;
      const jitter = lateral === 0 ? (Math.random() - 0.5) * 20 : 0;
      const dmgSpan = Math.max(0, c.dmgMax - c.dmgMin);
      const dmg = c.dmgMin + Math.random() * dmgSpan;
      s.projectiles.push({
        id: s.nextProjId++,
        x: originX + px * lateral + jitter,
        y: originY + py * lateral,
        vx: nx * speed,
        vy: ny * speed,
        rot: Math.atan2(dy, dx) + Math.PI / 2,
        life: 1.4,
        target: target.id,
        dmg,
        crit: isCrit,
        pierce: c.mods.projPierce,
        hits: [],
        straight: opts.straight,
      });
      c.attackTick += 1;
      playSfx('hero_shoot', 0.72);
    },
    [],
  );

  const handleKill = useCallback((e: Enemy) => {
    const isBoss = !!e.isBoss;
    // Use the first living combatant's goldGainMul as the multiplier source.
    // (All combatants currently share goldGainMul=1; future per-char mods can
    // refine this without changing the kill plumbing.)
    const goldMul =
      combatantsRef.current.find((c) => !c.dead)?.mods.goldGainMul ?? 1;

    if (isBoss) {
      setKills((k) => k + 1);
      setGold((g) => g + Math.round(200 * goldMul));
      playSfx('victory');
      setOutcome('victory');
      return;
    }

    setKills((k) => k + 1);
    const baseGold = e.kind === 'brute' ? 25 : 6;
    setGold((g) => g + Math.round(baseGold * goldMul));

    setWaveKills((wk) => {
      const next = wk + 1;
      const wave = WAVES[currentWaveIdx];
      if (wave.isBossWave) return next;
      if (wk < wave.killGoal && next >= wave.killGoal) {
        playSfx('wave_clear');
        setCurrentWaveIdx((idx) => Math.min(idx + 1, WAVES.length - 1));
        stateRef.current.spawnT = 0;
        return 0;
      }
      return next;
    });
  }, [currentWaveIdx]);

  // ── game loop ────────────────────────────────────────
  useEffect(() => {
    let raf = 0;
    const loop = (ts: number) => {
      const s = stateRef.current;
      const rawDt = Math.min(0.05, (ts - (s.lastTs || ts)) / 1000);
      const dt = rawDt * speedScaleRef.current;
      s.lastTs = ts;

      const wave = WAVES[currentWaveIdx];
      const isBossWave = !!wave.isBossWave;
      const combatants = combatantsRef.current;

      const running = !paused && outcome === 'running';

      if (running) {
        // boss spawn (once on wave 20 entry)
        if (isBossWave && !s.bossSpawned) {
          spawnEnemy('brute', true);
          playSfx('boss_spawn');
          s.bossSpawned = true;
          triggerShake(36);
        }

        // regular spawning
        s.spawnT += dt;
        const onScreen = s.enemies.length;
        const cap = isBossWave ? 6 : 30;
        if (s.spawnT > wave.spawnInterval && onScreen < cap) {
          s.spawnT = 0;
          const n =
            wave.perSpawnMin +
            Math.floor(Math.random() * (wave.perSpawnMax - wave.perSpawnMin + 1));
          for (let i = 0; i < n; i++) {
            const kind = Math.random() < wave.brutePct ? 'brute' : 'minion';
            spawnEnemy(kind, false);
          }
        }

        // per-combatant auto-attack: each living hero finds its own nearest
        // in-range enemy, ticks its own cooldown, and fires from its position.
        for (const c of combatants) {
          if (c.dead) continue;
          c.fireT += dt;
          const fireThreshold = c.fireCdBase * c.mods.fireCdMul;
          if (c.fireT < fireThreshold) continue;
          const rangeYMin = c.pos.y - c.mods.attackRange;
          let bestTgt: Enemy | null = null;
          let bestDist = Infinity;
          for (const e of s.enemies) {
            if (e.dyingT !== 0) continue;
            if (e.y < rangeYMin) continue;
            const ex = e.x - c.pos.x;
            const ey = e.y - c.pos.y;
            const d = ex * ex + ey * ey;
            if (d < bestDist) {
              bestDist = d;
              bestTgt = e;
            }
          }
          if (!bestTgt) continue;
          c.fireT = 0;
          const total = c.mods.projPerCast;
          const SPACING = 22;
          for (let i = 0; i < total; i++) {
            const offset = total === 1 ? 0 : (i - (total - 1) / 2) * SPACING;
            fireAt(c, bestTgt, { lateral: offset, straight: offset !== 0 });
          }
        }

        // move enemies — on reaching the stop line they halt and keep attacking
        // the shared team HP pool. Enemies may overlap freely; they pile up
        // against the wall (each keeps its spawn X). They stop above the wall band
        // so their feet enter it and get occluded by the front-wall layer.
        const stopY = ENEMY_STOP_Y;
        const ENEMY_ATTACK_INTERVAL = 1.0;  // seconds between attacks
        let teamDmgThisTick = 0;
        let shakeAmpThisTick = 0;
        let anyAttackingThisTick = false;

        for (const e of s.enemies) {
          if (e.dyingT > 0) {
            e.dyingT = Math.min(1, e.dyingT + dt * 4);
            continue;
          }
          if (e.hitT > 0) e.hitT -= dt;
          if (!e.attacking) {
            e.y += e.vy * dt;
            if (e.y >= stopY) {
              e.y = stopY;
              e.attacking = true;
              e.attackT = 0;  // first attack happens after the first interval
            }
          } else {
            // Attacking the line: tick attack timer.
            e.attackT += dt;
            if (e.attackT >= ENEMY_ATTACK_INTERVAL) {
              e.attackT = 0;
              const rawDmg = e.kind === 'brute' ? (e.isBoss ? 80 : 40) : 12;
              const reduced = rawDmg * (1 - teamDef);
              teamDmgThisTick += Math.max(1, Math.round(reduced));
              const amp = e.isBoss ? 14 : e.kind === 'brute' ? 8 : 4;
              if (amp > shakeAmpThisTick) shakeAmpThisTick = amp;
              anyAttackingThisTick = true;
            }
          }
        }
        // Apply damage + regen to teamHp in a single setter (one re-render per tick).
        const regenThisTick = teamRegen * dt;
        if (teamDmgThisTick > 0 || regenThisTick > 0) {
          setTeamHp((hp) => {
            const next = hp - teamDmgThisTick + regenThisTick;
            return Math.max(0, Math.min(teamHpMax, next));
          });
        }
        if (anyAttackingThisTick) {
          triggerShake(shakeAmpThisTick);
          playSfx('hero_take_dmg');
        }

        // projectiles
        const hitRadius = (e: Enemy) =>
          e.isBoss ? 56 : e.kind === 'brute' ? 38 : 26;
        const damageEnemy = (p: typeof s.projectiles[number], e: Enemy) => {
          const dmg = Math.round(p.dmg * (p.crit ? 2.2 : 1));
          e.hp -= dmg;
          e.hitT = 0.1;
          s.pops.push({
            id: s.nextPopId++,
            x: e.x,
            y: e.y - 22,
            t: 0,
            amount: dmg,
            crit: p.crit,
          });
          playSfx(p.crit ? 'hit_crit' : 'hit_normal', p.crit ? 0.95 : 0.72);
          if (p.crit) triggerShake(4);
          p.hits.push(e.id);
          if (e.hp <= 0 && e.dyingT === 0) {
            e.dyingT = 0.01;
            handleKill(e);
          }
        };

        // For homing projectiles we still apply a generic speed cap. Use the
        // highest combatant cap so any of them stays within their own bound.
        const homingSpeedCap =
          combatants.reduce((m, c) => Math.max(m, c.projSpeedCap), 0) || 460;

        for (const p of s.projectiles) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;

          if (p.straight) {
            for (const e of s.enemies) {
              if (e.dyingT !== 0) continue;
              if (p.hits.includes(e.id)) continue;
              const dxe = e.x - p.x;
              const dye = e.y - p.y;
              if (dxe * dxe + dye * dye < hitRadius(e) ** 2) {
                damageEnemy(p, e);
                if (p.pierce > 0) {
                  p.pierce -= 1;
                } else {
                  p.life = 0;
                  break;
                }
              }
            }
            continue;
          }

          const tgt = s.enemies.find((e) => e.id === p.target && e.dyingT === 0);
          if (tgt) {
            const dx = tgt.x - p.x;
            const dy = tgt.y - p.y;
            const len = Math.hypot(dx, dy) || 1;
            if (len < hitRadius(tgt)) {
              damageEnemy(p, tgt);
              if (p.pierce > 0) {
                p.pierce -= 1;
                let bestId = -1;
                let bestDist = Infinity;
                for (const e of s.enemies) {
                  if (e.dyingT !== 0) continue;
                  if (p.hits.includes(e.id)) continue;
                  const ex = e.x - p.x;
                  const ey = e.y - p.y;
                  const ed = ex * ex + ey * ey;
                  if (ed < bestDist) {
                    bestDist = ed;
                    bestId = e.id;
                  }
                }
                if (bestId !== -1) {
                  p.target = bestId;
                } else {
                  p.life = 0;
                }
              } else {
                p.life = 0;
              }
            } else {
              p.vx += ((dx / len) * 200) * dt;
              p.vy += ((dy / len) * 200) * dt;
              const sp = Math.hypot(p.vx, p.vy);
              if (sp > homingSpeedCap) {
                p.vx *= homingSpeedCap / sp;
                p.vy *= homingSpeedCap / sp;
              }
              p.rot = Math.atan2(p.vy, p.vx) + Math.PI / 2;
            }
          }
        }

        // damage popups
        for (const d of s.pops) d.t += dt * 1.4;

        // cleanup
        s.enemies = s.enemies.filter((e) => !(e.dyingT >= 1));
        s.projectiles = s.projectiles.filter(
          (p) => p.life > 0 && p.y > -50 && p.y < GAME_H + 50 && p.x > -50 && p.x < GAME_W + 50,
        );
        s.pops = s.pops.filter((d) => d.t < 1);

        // defense line collapse → gameover when team HP exhausted.
        if (teamHp <= 0 && outcome === 'running') {
          playSfx('game_over');
          setOutcome('gameover');
        }
      }

      // shake decay
      const wrap = wrapRef.current;
      if (wrap) {
        if (shakeAmpRef.current > 0.2) {
          shakeAmpRef.current *= Math.exp(-12 * dt);
          const ox = (Math.random() - 0.5) * shakeAmpRef.current;
          const oy = (Math.random() - 0.5) * shakeAmpRef.current;
          wrap.style.setProperty('--shake-x', `${ox}px`);
          wrap.style.setProperty('--shake-y', `${oy}px`);
        } else if (shakeAmpRef.current !== 0) {
          shakeAmpRef.current = 0;
          wrap.style.setProperty('--shake-x', '0px');
          wrap.style.setProperty('--shake-y', '0px');
        }
      }

      force();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, outcome, currentWaveIdx, fireAt, spawnEnemy, handleKill, force, teamHp, teamDef, teamRegen, teamHpMax, triggerShake]);

  // Settle gold to wallet exactly once when the run ends.
  useEffect(() => {
    if (settledRef.current) return;
    if (outcome === 'victory') {
      settledRef.current = true;
      addGold(gold + 500);
    } else if (outcome === 'gameover') {
      settledRef.current = true;
      addGold(Math.floor(gold * 0.5));
    }
  }, [outcome, gold, addGold]);

  // ── derived UI values ────────────────────────────────
  const s = stateRef.current;
  const wave = WAVES[currentWaveIdx];
  const isBossWave = !!wave.isBossWave;
  const expPct = isBossWave ? 100 : Math.min(100, (waveKills / wave.killGoal) * 100);

  const togglePause = () => {
    playSfx('ui_pause');
    setPaused((p) => !p);
  };
  const resumeBattle = () => {
    playSfx('ui_pause');
    setPaused(false);
  };
  const exitToLobby = () => {
    playSfx('ui_button_tap');
    setScene('lobby');
  };

  return (
    <div ref={wrapRef} className={styles.battle}>
      <img src={`${import.meta.env.BASE_URL}img/arena-bg.png`} alt="" className={styles.bg} />
      <div className={styles.vignette} />

      {/* 防線城牆（背景層）— 在所有戰場元素後面 */}
      <img
        src={`${import.meta.env.BASE_URL}img/defense-wall.png`}
        alt=""
        style={{
          position: 'absolute',
          top: HERO_COLLISION_Y - 18,
          left: 0,
          width: GAME_W,
          height: 40,
          zIndex: Z.WALL_BACK,
          pointerEvents: 'none',
          imageRendering: 'crisp-edges',
        }}
      />

      {/* 防線城牆（前景層）— 蓋住停在牆上方的怪物的腳，做出「被牆攔住」的遮擋。
          與背景層同圖同位置，只是 z 拉到怪物之上、劍士之下。 */}
      <img
        src={`${import.meta.env.BASE_URL}img/defense-wall.png`}
        alt=""
        style={{
          position: 'absolute',
          top: HERO_COLLISION_Y - 18,
          left: 0,
          width: GAME_W,
          height: 40,
          zIndex: Z.WALL_FRONT,
          pointerEvents: 'none',
          imageRendering: 'crisp-edges',
        }}
      />

      <TopBar gold={gold} onPause={togglePause} speedScale={speedScale} onCycleSpeed={cycleSpeed} />

      {/* Team defense line HP bar — TD 防線血量 */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 14,
          right: 14,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            font: '700 11px/1 Sora, sans-serif',
            color: 'rgba(255, 220, 180, 0.85)',
            letterSpacing: 1,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          防線
        </span>
        <div
          style={{
            flex: 1,
            height: 14,
            borderRadius: 7,
            background: 'rgba(12, 6, 22, 0.78)',
            border: '1px solid rgba(180, 140, 255, 0.35)',
            overflow: 'hidden',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: `${Math.max(0, (teamHp / teamHpMax) * 100)}%`,
              background: 'linear-gradient(180deg, #4ade80 0%, #16a34a 100%)',
              transition: 'width 80ms linear',
            }}
          />
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              font: '800 10px/1 Sora, sans-serif',
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.85)',
            }}
          >
            {Math.max(0, Math.round(teamHp)).toLocaleString()}/{teamHpMax.toLocaleString()}
          </span>
        </div>
      </div>


      {s.enemies.map((e) => (
        <EnemyComp key={e.id} e={e} />
      ))}

      {combatantsRef.current.map((c) => (
        <Hero
          key={c.slotIdx}
          x={c.pos.x}
          y={c.pos.y}
          hp={c.hp}
          hpMax={c.hpMax}
          attackTick={c.attackTick}
          assets={c.base.assets}
          dead={c.dead}
        />
      ))}

      {s.projectiles.map((p) => (
        <ProjectileComp key={p.id} p={p} />
      ))}

      {s.pops.map((d) => (
        <DmgPop key={d.id} d={d} />
      ))}

      <BottomBar
        wave={currentWaveIdx + 1}
        waveMax={WAVES.length}
        expPct={expPct}
      />

      {paused && outcome === 'running' && (
        <PauseOverlay onResume={resumeBattle} onExit={exitToLobby} />
      )}

      {outcome === 'gameover' && (
        <GameOverOverlay wave={currentWaveIdx + 1} kills={kills} onExit={exitToLobby} />
      )}

      {outcome === 'victory' && (
        <VictoryOverlay kills={kills} gold={gold} onExit={exitToLobby} />
      )}
    </div>
  );
};
