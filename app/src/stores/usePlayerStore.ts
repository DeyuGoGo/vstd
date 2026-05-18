import { create } from 'zustand';
import type { Player, Wallet, Mail, Notifications, NavTab } from '../types/game';
import type { StatKey, CharacterProgress } from '../characters/types';
import { CHARACTERS, DEFAULT_CHARACTER_ID } from '../characters/index';
import {
  XP_PER_EXP_ITEM,
  STAT_POINTS_PER_LEVEL,
  LEVEL_CAP,
  xpMax,
} from '../characters/statFormulas';

interface PlayerState {
  player: Player;
  wallet: Wallet;
  mail: Mail;
  notifications: Notifications;
  nav: { activeTab: NavTab };
  selectedCharacterId: string;
  characters: Record<string, CharacterProgress>;
  lineup: (string | null)[];

  clearMail: () => void;
  setActiveTab: (tab: NavTab) => void;
  clearAdventureBadge: () => void;
  addGold: (amount: number) => void;
  addGem: (amount: number) => void;
  addStamina: (amount: number) => void;
  spendStamina: (amount: number) => boolean;
  selectCharacter: (id: string) => void;
  setLineupSlot: (slotIdx: number, charId: string | null) => void;
  useExpItem: (charId: string, count: number) => void;
  allocateStat: (charId: string, stat: StatKey) => boolean;
  awardBattleRewards: (won: boolean) => void;
}

export const LINEUP_SIZE = 3;

export const BATTLE_STAMINA_COST = 30;

export const usePlayerStore = create<PlayerState>((set, get) => ({
  player: { name: '星奈的指揮官', level: 1, xp: 0, xpMax: 100 },
  wallet: { stamina: 120, staminaMax: 120, gold: 1_000_000, gem: 10_000, expItem: 0 },
  mail: { unreadCount: 1 },
  notifications: { adventure: true },
  nav: { activeTab: 'home' },
  selectedCharacterId: DEFAULT_CHARACTER_ID,
  characters: {
    starina: {
      level: 1,
      xp: 0,
      unspentPoints: 0,
      stats: { ...CHARACTERS.starina.startingStats },
    },
  },
  lineup: Array.from({ length: LINEUP_SIZE }, () => null) as (string | null)[],

  clearMail: () => set((s) => ({ mail: { ...s.mail, unreadCount: 0 } })),
  setActiveTab: (tab) => set({ nav: { activeTab: tab } }),
  clearAdventureBadge: () =>
    set((s) => ({ notifications: { ...s.notifications, adventure: false } })),
  addGold: (amount) =>
    set((s) => ({ wallet: { ...s.wallet, gold: Math.max(0, s.wallet.gold + amount) } })),
  addGem: (amount) =>
    set((s) => ({ wallet: { ...s.wallet, gem: Math.max(0, s.wallet.gem + amount) } })),
  addStamina: (amount) =>
    set((s) => ({
      wallet: {
        ...s.wallet,
        stamina: Math.max(0, Math.min(s.wallet.staminaMax, s.wallet.stamina + amount)),
      },
    })),
  spendStamina: (amount) => {
    const { wallet } = get();
    if (wallet.stamina < amount) return false;
    set((s) => ({ wallet: { ...s.wallet, stamina: s.wallet.stamina - amount } }));
    return true;
  },

  selectCharacter: (id) => set({ selectedCharacterId: id }),

  setLineupSlot: (slotIdx, charId) => {
    if (slotIdx < 0 || slotIdx >= LINEUP_SIZE) return;
    set((s) => {
      const next = [...s.lineup];
      // Enforce uniqueness: if charId is already in another slot, clear it there first.
      if (charId !== null) {
        for (let i = 0; i < next.length; i++) {
          if (i !== slotIdx && next[i] === charId) next[i] = null;
        }
      }
      next[slotIdx] = charId;
      return { lineup: next };
    });
  },

  useExpItem: (charId, count) => {
    const state = get();
    const progress = state.characters[charId];
    if (!progress) return;
    const usable = Math.min(count, state.wallet.expItem);
    if (usable <= 0) return;

    let level = progress.level;
    let xp = progress.xp + usable * XP_PER_EXP_ITEM;
    let unspentPoints = progress.unspentPoints;

    while (level < LEVEL_CAP && xp >= xpMax(level)) {
      xp -= xpMax(level);
      level += 1;
      unspentPoints += STAT_POINTS_PER_LEVEL;
    }
    if (level >= LEVEL_CAP) {
      xp = 0;
    }

    set((s) => ({
      wallet: { ...s.wallet, expItem: s.wallet.expItem - usable },
      characters: {
        ...s.characters,
        [charId]: { ...progress, level, xp, unspentPoints },
      },
    }));
  },

  allocateStat: (charId, stat) => {
    const progress = get().characters[charId];
    if (!progress || progress.unspentPoints <= 0) return false;
    set((s) => ({
      characters: {
        ...s.characters,
        [charId]: {
          ...progress,
          stats: { ...progress.stats, [stat]: progress.stats[stat] + 1 },
          unspentPoints: progress.unspentPoints - 1,
        },
      },
    }));
    return true;
  },

  awardBattleRewards: (won) =>
    set((s) => ({
      wallet: { ...s.wallet, expItem: s.wallet.expItem + (won ? 10 : 3) },
    })),
}));
