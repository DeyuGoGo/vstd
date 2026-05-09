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
}

export const usePlayerStore = create<PlayerState>((set) => ({
  player: { name: '星奈的指揮官', level: 48, xp: 5680, xpMax: 7200 },
  wallet: { stamina: 24, staminaMax: 120, gold: 328450, gem: 8860 },
  mail: { unreadCount: 1 },
  notifications: { adventure: true },
  nav: { activeTab: 'home' },

  clearMail: () => set((s) => ({ mail: { ...s.mail, unreadCount: 0 } })),
  setActiveTab: (tab) => set({ nav: { activeTab: tab } }),
  clearAdventureBadge: () =>
    set((s) => ({ notifications: { ...s.notifications, adventure: false } })),
}));
