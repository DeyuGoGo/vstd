import type { CSSProperties, ReactNode } from 'react';

const GOLD = '#d4b07a';
const GOLD_BRIGHT = '#f0d49a';

interface IconProps {
  size?: number;
  stroke?: string;
  sw?: number;
  style?: CSSProperties;
  children?: ReactNode;
}

const Icon = ({ children, size = 20, stroke = GOLD, sw = 1.2, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {children}
  </svg>
);

export const IconMail = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="6" width="18" height="13" rx="0.5" />
    <path d="M3 7l9 7 9-7" />
  </Icon>
);

export const IconFriends = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9" cy="9" r="3.2" />
    <path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
    <circle cx="17" cy="8" r="2.6" />
    <path d="M15 13.6c2.6 0.2 5 2.1 5 5" />
  </Icon>
);

export const IconSettings = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2.1 2.1M17.4 17.4l2.1 2.1M4.5 19.5l2.1-2.1M17.4 6.6l2.1-2.1" />
  </Icon>
);

export const IconPlus = (p: IconProps) => (
  <Icon {...p} sw={p.sw ?? 1.4}>
    <path d="M12 6v12M6 12h12" />
  </Icon>
);

// Resource icons (top bar) — gradients use unique IDs
interface ResIconProps {
  size?: number;
}

export const IconStarRes = ({ size = 18 }: ResIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="starG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e9a8ff" />
        <stop offset="1" stopColor="#7a3fb5" />
      </linearGradient>
    </defs>
    <path
      d="M12 2.5l2.6 5.7 6.2 0.7-4.6 4.3 1.3 6.2L12 16.4 6.5 19.4l1.3-6.2L3.2 8.9l6.2-0.7z"
      fill="url(#starG)"
      stroke={GOLD_BRIGHT}
      strokeWidth="0.8"
    />
  </svg>
);

export const IconCoinRes = ({ size = 18 }: ResIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <radialGradient id="coinG" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#ffe7a6" />
        <stop offset="1" stopColor="#a8723b" />
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="9" fill="url(#coinG)" stroke={GOLD_BRIGHT} strokeWidth="0.8" />
    <circle cx="12" cy="12" r="6" fill="none" stroke="#7a4a1f" strokeWidth="0.6" />
    <path
      d="M9 9.5h5a1.8 1.8 0 010 3.5h-5M9 9.5v5h5"
      stroke="#5a3414"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export const IconGemRes = ({ size = 18 }: ResIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="gemG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c79bff" />
        <stop offset="1" stopColor="#5a25a0" />
      </linearGradient>
    </defs>
    <path
      d="M5 9l3-4h8l3 4-7 11z"
      fill="url(#gemG)"
      stroke={GOLD_BRIGHT}
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
    <path d="M5 9h14M9 5l3 4 3-4M12 9v11" stroke="#3a1a78" strokeWidth="0.6" opacity="0.7" />
  </svg>
);

// Menu / nav icons — simple ornamental glyphs, thin gold lines
export const MenuIconEvent = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round">
    <path d="M16 4l1.6 3.4L21 5.5l-1.5 3.6 3.5 1.6-3.5 1.6L21 16l-3.4-1.9L16 17.5l-1.6-3.4L11 16l1.5-3.7L9 10.7l3.5-1.6L11 5.5l3.4 1.9z" />
    <path d="M10 20l6 8 6-8M13 20h6" />
  </svg>
);

export const MenuIconTask = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round">
    <path d="M8 6h12l4 4v16H8z" />
    <path d="M20 6v4h4M11 14h10M11 18h10M11 22h6" />
  </svg>
);

export const MenuIconAchievement = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 6h12v6a6 6 0 01-12 0z" />
    <path d="M10 8H6v2a4 4 0 004 4M22 8h4v2a4 4 0 01-4 4" />
    <path d="M14 18l-1 6 3-2 3 2-1-6" />
  </svg>
);

export const MenuIconShop = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 12l2-6h16l2 6" />
    <path d="M6 12v14h20V12" />
    <path d="M6 12h20M12 12v4a4 4 0 01-4 0M16 12v4a4 4 0 01-4 0M20 12v4a4 4 0 01-4 0M24 12v4a4 4 0 01-4 0" />
    <path d="M14 26v-6h4v6" />
  </svg>
);

export const MenuIconStorage = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="10" width="20" height="14" rx="1" />
    <path d="M6 16h20M14 10v6h4v-6M9 8h14l-1 2H10z" />
  </svg>
);

export const MenuIconMemory = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 6h12a4 4 0 014 4v18H11a4 4 0 01-4-4z" />
    <path d="M7 24a4 4 0 014-4h12M14 12h6M14 16h6" />
  </svg>
);

export const MenuIconRanking = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 6h12v6a6 6 0 01-12 0z" />
    <path d="M10 8H6v2a4 4 0 004 4M22 8h4v2a4 4 0 01-4 4" />
    <path d="M16 18v4M12 26h8M14 22h4l1 4h-6z" />
  </svg>
);

// Bottom nav icons
interface NavIconProps {
  active?: boolean;
}

export const NavIconHome = ({ active }: NavIconProps) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    stroke={active ? GOLD_BRIGHT : GOLD}
    strokeWidth={active ? 1.2 : 1}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 26V14l5-3v15M11 11l5-4 5 4M21 11v15M16 26v-7h0M26 14l-5-3v15M6 26h20" />
    <path d="M9 17h2M21 17h2" />
  </svg>
);

export const NavIconAdventure = ({ active }: NavIconProps) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    stroke={active ? GOLD_BRIGHT : GOLD}
    strokeWidth={active ? 1.2 : 1}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 24l5-12 5 6 5-9 5 15z" />
    <path d="M6 24h20M19 9l3 3" />
  </svg>
);

export const NavIconStarfield = ({ active }: NavIconProps) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    stroke={active ? GOLD_BRIGHT : GOLD}
    strokeWidth={active ? 1.2 : 1}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 4l2 5 5 1-3.5 3.5 1 5L16 16l-4.5 2.5 1-5L9 10l5-1z" />
    <path d="M8 24h16M10 24v-3M22 24v-3M16 24v-3" />
  </svg>
);

export const NavIconGuild = ({ active }: NavIconProps) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    stroke={active ? GOLD_BRIGHT : GOLD}
    strokeWidth={active ? 1.2 : 1}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 5l2 2 4-3 4 3 2-2v6l2 2-2 2v10H10V15l-2-2 2-2z" />
    <path d="M14 26v-6h4v6" />
  </svg>
);
