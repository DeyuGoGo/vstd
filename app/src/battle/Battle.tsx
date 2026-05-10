import { useCallback, useEffect, useRef, useState } from 'react';
import { useSceneStore, SCENE_DIMS } from '../stores/useSceneStore';
import {
  createInitialState,
  initialMods,
  type Enemy,
  type Mods,
  type Outcome,
} from './engine/types';
import { pickThree } from './engine/pickThree';
import { WAVES, ENEMY_BASE, BOSS_MUL } from './data/waves';
import type { Blessing } from './data/blessings';
import { TopBar } from './components/TopBar';
import { WaveCard } from './components/WaveCard';
import { Hero } from './components/Hero';
import { Enemy as EnemyComp } from './components/Enemy';
import { Projectile as ProjectileComp } from './components/Projectile';
import { DmgPop } from './components/DmgPop';
import { BottomBar } from './components/BottomBar';
import { PauseOverlay } from './components/PauseOverlay';
import { GameOverOverlay } from './components/GameOverOverlay';
import { VictoryOverlay } from './components/VictoryOverlay';
import { LevelUpOverlay } from './components/LevelUpOverlay';
import { BossIntroOverlay } from './components/BossIntroOverlay';
import { playSfx, preloadSfx } from '../audio';
import rawStyles from './Battle.module.css';
import { cm } from '../utils/cssModule';
const styles = cm(rawStyles);

const GAME_W = SCENE_DIMS.battle.w;
const GAME_H = SCENE_DIMS.battle.h;
const HERO_X = GAME_W / 2;
const HERO_Y = GAME_H - 245;
const HP_MAX_BASE = 3200;
const ATTACK_RANGE_Y_MIN = 200;

interface LevelUpState {
  choices: Blessing[];
  level: number;
}

export const Battle = () => {
  const setScene = useSceneStore((s) => s.setScene);
  const stateRef = useRef(createInitialState());
  const modsRef = useRef<Mods>(initialMods());
  const wrapRef = useRef<HTMLDivElement>(null);
  const shakeAmpRef = useRef(0);
  const bossIntroAtRef = useRef(0);

  const triggerShake = useCallback((amp: number) => {
    if (amp > shakeAmpRef.current) shakeAmpRef.current = amp;
  }, []);

  const [, forceTick] = useState(0);
  const force = useCallback(() => forceTick((v) => v + 1), []);

  const [paused, setPaused] = useState(false);
  const [hp, setHp] = useState(HP_MAX_BASE);
  const [gold, setGold] = useState(0);
  const [kills, setKills] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelUp, setLevelUp] = useState<LevelUpState | null>(null);
  const [rerolls, setRerolls] = useState(2);
  const [currentWaveIdx, setCurrentWaveIdx] = useState(0);
  const [waveKills, setWaveKills] = useState(0);
  const [outcome, setOutcome] = useState<Outcome>('running');

  // Mirror level into a ref so handleKill (called from rAF loop) reads fresh value
  const levelRef = useRef(level);
  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  useEffect(() => {
    preloadSfx();
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
      };
      if (isBoss) {
        // center boss horizontally and just above visible area
        enemy.x = GAME_W / 2;
        enemy.y = 80;
        s.bossId = enemy.id;
      }
      s.enemies.push(enemy);
    },
    [currentWaveIdx],
  );

  const fireAt = useCallback(
    (target: Enemy, opts: { speed?: number; dmg?: number } = {}) => {
      const mods = modsRef.current;
      const s = stateRef.current;
      const dx = target.x - HERO_X;
      const dy = target.y - (HERO_Y - 30);
      const len = Math.hypot(dx, dy) || 1;
      const speed = (opts.speed ?? 380) * mods.projSpeedMul;
      const isCrit = Math.random() < 0.18 + mods.critBonus;
      s.projectiles.push({
        id: s.nextProjId++,
        x: HERO_X + (Math.random() - 0.5) * 20,
        y: HERO_Y - 30,
        vx: (dx / len) * speed,
        vy: (dy / len) * speed,
        rot: Math.atan2(dy, dx) + Math.PI / 2,
        life: 1.4,
        target: target.id,
        dmg: opts.dmg ?? 60 + Math.random() * 40,
        crit: isCrit,
        pierce: mods.projPierce,
        hits: [],
      });
      playSfx('hero_shoot', 0.72);
    },
    [],
  );

  // ── game loop ────────────────────────────────────────
  useEffect(() => {
    let raf = 0;
    const loop = (ts: number) => {
      const s = stateRef.current;
      const mods = modsRef.current;
      const dt = Math.min(0.05, (ts - (s.lastTs || ts)) / 1000);
      s.lastTs = ts;

      const wave = WAVES[currentWaveIdx];
      const isBossWave = !!wave.isBossWave;

      const running = !paused && !levelUp && outcome === 'running';

      if (running) {
        // boss spawn (once on wave 20 entry)
        if (isBossWave && !s.bossSpawned) {
          spawnEnemy('brute', true);
          playSfx('boss_spawn');
          s.bossSpawned = true;
          bossIntroAtRef.current = ts;
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

        // auto-attack — only target enemies that have descended into attack range
        s.fireT += dt;
        const fireThreshold = 0.42 * mods.fireCdMul;
        if (s.fireT > fireThreshold) {
          const sorted = s.enemies
            .filter((e) => e.dyingT === 0 && e.y > ATTACK_RANGE_Y_MIN)
            .sort((a, b) => a.y - b.y);
          if (sorted.length) {
            s.fireT = 0;
            const targetCount = Math.min(mods.projPerCast, Math.max(1, sorted.length));
            // pick the deepest (largest y) targets first
            const pick = sorted.slice(-targetCount);
            for (let i = 0; i < mods.projPerCast; i++) {
              const tgt = pick[i % pick.length];
              if (tgt) fireAt(tgt);
            }
          }
        }

        // move enemies
        for (const e of s.enemies) {
          if (e.dyingT > 0) {
            e.dyingT = Math.min(1, e.dyingT + dt * 4);
            continue;
          }
          e.y += e.vy * dt;
          if (e.hitT > 0) e.hitT -= dt;
          if (e.y > HERO_Y - 60) {
            const dmg = e.kind === 'brute' ? (e.isBoss ? 80 : 40) : 12;
            setHp((h) => Math.max(0, h - dmg));
            triggerShake(e.isBoss ? 22 : e.kind === 'brute' ? 14 : 8);
            playSfx('hero_take_dmg');
            e.dyingT = 0.01;
          }
        }

        // projectiles
        for (const p of s.projectiles) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          const tgt = s.enemies.find((e) => e.id === p.target && e.dyingT === 0);
          if (tgt) {
            const dx = tgt.x - p.x;
            const dy = tgt.y - p.y;
            const len = Math.hypot(dx, dy) || 1;
            if (len < 18) {
              const dmg = Math.round(p.dmg * (p.crit ? 2.2 : 1));
              tgt.hp -= dmg;
              tgt.hitT = 0.1;
              s.pops.push({
                id: s.nextPopId++,
                x: tgt.x,
                y: tgt.y - 22,
                t: 0,
                amount: dmg,
                crit: p.crit,
              });
              playSfx(p.crit ? 'hit_crit' : 'hit_normal', p.crit ? 0.95 : 0.72);
              if (p.crit) triggerShake(4);
              p.hits.push(tgt.id);
              if (tgt.hp <= 0 && tgt.dyingT === 0) {
                tgt.dyingT = 0.01;
                handleKill(tgt);
              }
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
              const max = 460 * mods.projSpeedMul;
              if (sp > max) {
                p.vx *= max / sp;
                p.vy *= max / sp;
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
      }

      // shake decay (runs regardless of pause so existing shake settles)
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
  }, [paused, levelUp, outcome, currentWaveIdx, fireAt, spawnEnemy, force]);

  // GameOver guard — react to hp drop
  useEffect(() => {
    if (hp <= 0 && outcome === 'running') {
      playSfx('game_over');
      setOutcome('gameover');
    }
  }, [hp, outcome]);

  const handleKill = (e: Enemy) => {
    const mods = modsRef.current;
    const isBoss = !!e.isBoss;

    // Boss kill → victory
    if (isBoss) {
      setKills((k) => k + 1);
      setGold((g) => g + Math.round(200 * mods.goldGainMul));
      playSfx('victory');
      setOutcome('victory');
      return;
    }

    setKills((k) => k + 1);
    const baseGold = e.kind === 'brute' ? 25 : 6;
    setGold((g) => g + Math.round(baseGold * mods.goldGainMul));

    // wave progress — clearing the wave's effective kill goal opens the level-up modal.
    // Wave does NOT advance here; it advances when the player picks a blessing.
    setWaveKills((wk) => {
      const next = wk + 1;
      const wave = WAVES[currentWaveIdx];
      if (wave.isBossWave) return next;
      if (wk < wave.killGoal && next >= wave.killGoal) {
        setLevelUp((cur) => {
          if (cur) return cur;
          playSfx('wave_clear');
          window.setTimeout(() => playSfx('level_up'), 120);
          return { choices: pickThree(), level: levelRef.current + 1 };
        });
      }
      return next;
    });
  };

  // ── blessing apply ───────────────────────────────────
  const applyBlessing = (b: Blessing) => {
    playSfx('ui_card_pick');
    const mods = modsRef.current;
    b.apply(mods, {
      healHp: (n) => {
        setHp((h) => Math.min(h + n, HP_MAX_BASE + mods.hpMaxBonus));
      },
    });
    setLevel((l) => l + 1);
    setCurrentWaveIdx((idx) => Math.min(idx + 1, WAVES.length - 1));
    setWaveKills(0);
    stateRef.current.spawnT = 0;
    setLevelUp(null);
  };

  const onReroll = () => {
    if (rerolls <= 0) return;
    playSfx('ui_reroll');
    setRerolls((r) => r - 1);
    setLevelUp((lu) => (lu ? { ...lu, choices: pickThree() } : null));
  };

  // ── derived UI values ────────────────────────────────
  const s = stateRef.current;
  const wave = WAVES[currentWaveIdx];
  const isBossWave = !!wave.isBossWave;
  const boss = isBossWave && s.bossId != null
    ? s.enemies.find((e) => e.id === s.bossId)
    : undefined;

  const bossIntroActive =
    bossIntroAtRef.current > 0 && performance.now() - bossIntroAtRef.current < 1400;

  // bossPct: in non-boss waves shows wave clear progress (depleting),
  // in boss wave shows actual boss HP.
  let bossPct: number;
  if (isBossWave && boss) {
    bossPct = Math.max(0, boss.hp / boss.hpMax);
  } else if (isBossWave) {
    bossPct = 0; // boss dead
  } else {
    bossPct = Math.max(0, 1 - waveKills / wave.killGoal);
  }

  // Bottom bar progress: wave kills as percentage; boss wave shows full bar.
  const expPct = isBossWave ? 100 : Math.min(100, (waveKills / wave.killGoal) * 100);
  const hpMax = HP_MAX_BASE + modsRef.current.hpMaxBonus;
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

      <TopBar bossPct={bossPct} gold={gold} onPause={togglePause} />
      <WaveCard wave={currentWaveIdx + 1} waveMax={WAVES.length} kills={kills} />

      {s.enemies.map((e) => (
        <EnemyComp key={e.id} e={e} />
      ))}

      <Hero x={HERO_X} y={HERO_Y} hp={hp} hpMax={hpMax} />

      {s.projectiles.map((p) => (
        <ProjectileComp key={p.id} p={p} />
      ))}

      {s.pops.map((d) => (
        <DmgPop key={d.id} d={d} />
      ))}

      <BottomBar
        level={level}
        expPct={expPct}
      />

      {bossIntroActive && <BossIntroOverlay />}

      {paused && outcome === 'running' && !levelUp && (
        <PauseOverlay onResume={resumeBattle} />
      )}

      {levelUp && outcome === 'running' && (
        <LevelUpOverlay
          choices={levelUp.choices}
          level={levelUp.level}
          rerolls={rerolls}
          onPick={applyBlessing}
          onReroll={onReroll}
        />
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
