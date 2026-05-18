export type NavTab = 'home' | 'adventure' | 'starfield' | 'guild';

export interface Player {
  name: string;
  level: number;
  xp: number;
  xpMax: number;
}

export interface Wallet {
  stamina: number;
  staminaMax: number;
  gold: number;
  gem: number;
  expItem: number;
}

export interface Mail {
  unreadCount: number;
}

export interface Notifications {
  adventure: boolean;
}
