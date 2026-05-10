const SFX_FILES = {
  hero_shoot: 'sfx_hero_shoot.ogg',
  hit_normal: 'sfx_hit_normal.ogg',
  hit_crit: 'sfx_hit_crit.ogg',
  hero_take_dmg: 'sfx_hero_take_dmg.ogg',
  level_up: 'sfx_level_up.ogg',
  wave_clear: 'sfx_wave_clear.ogg',
  boss_spawn: 'sfx_boss_spawn.ogg',
  game_over: 'sfx_game_over.ogg',
  victory: 'sfx_victory.ogg',
  ui_card_hover: 'sfx_ui_card_hover.ogg',
  ui_card_pick: 'sfx_ui_card_pick.ogg',
  ui_reroll: 'sfx_ui_reroll.ogg',
  ui_button_tap: 'sfx_ui_button_tap.ogg',
  ui_pause: 'sfx_ui_pause.ogg',
} as const;

export type SfxId = keyof typeof SFX_FILES;

const DEFAULT_POOL_SIZE = 4;
const MIN_GAP_MS: Partial<Record<SfxId, number>> = {
  hero_shoot: 55,
  hit_normal: 35,
  hit_crit: 55,
  hero_take_dmg: 110,
  ui_card_hover: 45,
  ui_button_tap: 35,
  ui_pause: 90,
};

const pools = new Map<SfxId, HTMLAudioElement[]>();
const lastPlayed = new Map<SfxId, number>();
let masterVolume = 0.75;

const sfxUrl = (id: SfxId) => `${import.meta.env.BASE_URL}audio/sfx/${SFX_FILES[id]}`;

const createAudio = (id: SfxId) => {
  const audio = new Audio(sfxUrl(id));
  audio.preload = 'auto';
  audio.volume = masterVolume;
  return audio;
};

const getPool = (id: SfxId) => {
  let pool = pools.get(id);
  if (!pool) {
    pool = Array.from({ length: DEFAULT_POOL_SIZE }, () => createAudio(id));
    pools.set(id, pool);
  }
  return pool;
};

export const preloadSfx = (ids: readonly SfxId[] = Object.keys(SFX_FILES) as SfxId[]) => {
  ids.forEach((id) => {
    getPool(id).forEach((audio) => audio.load());
  });
};

export const setSfxVolume = (volume: number) => {
  masterVolume = Math.max(0, Math.min(1, volume));
  pools.forEach((pool) => {
    pool.forEach((audio) => {
      audio.volume = masterVolume;
    });
  });
};

export const getSfxVolume = () => masterVolume;

export const playSfx = (id: SfxId, volume = 1) => {
  if (typeof document !== 'undefined' && document.hidden) return;

  const now = performance.now();
  const minGap = MIN_GAP_MS[id] ?? 0;
  const last = lastPlayed.get(id) ?? -Infinity;
  if (now - last < minGap) return;
  lastPlayed.set(id, now);

  const pool = getPool(id);
  const audio = pool.find((item) => item.paused || item.ended) ?? pool[0];
  audio.pause();
  audio.currentTime = 0;
  audio.volume = Math.max(0, Math.min(1, masterVolume * volume));
  void audio.play().catch(() => {
    // Browsers may block autoplay until the first user gesture; later calls will work.
  });
};
