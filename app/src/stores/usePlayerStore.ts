import { create } from 'zustand';
import type { Player, Wallet, Mail, Notifications, NavTab } from '../types/game';

interface PlayerState {
  player: Player;
  wallet: Wallet;
  mail: Mail;
  notifications: Notifications;
  nav: { activeTab: NavTab };

  clearMail: () => void;
  setActiveTab: (tab: NavTab) => void;
  clearAdventureBadge: () => void;
  addGold: (amount: number) => void;
  addGem: (amount: number) => void;
  addStamina: (amount: number) => void;
  spendStamina: (amount: number) => boolean;
}

export const BATTLE_STAMINA_COST = 30;

export const usePlayerStore = create<PlayerState>((set, get) => ({
  player: { name: '星奈的指揮官', level: 1, xp: 0, xpMax: 100 },
  wallet: { stamina: 120, staminaMax: 120, gold: 1_000_000, gem: 10_000 },
  mail: { unreadCount: 1 },
  notifications: { adventure: true },
  nav: { activeTab: 'home' },

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
}));
