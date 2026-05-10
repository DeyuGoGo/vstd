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

interface NavIconProps {
  active?: boolean;
}

interface ResIconProps {
  size?: number;
}

const iconUrl = (name: string) => `${import.meta.env.BASE_URL}img/icons/lobby/${name}.png`;

const PngIcon = ({
  name,
  size,
  active,
  style,
}: {
  name: string;
  size: number;
  active?: boolean;
  style?: CSSProperties;
}) => (
  <img
    src={iconUrl(name)}
    alt=""
    draggable={false}
    style={{
      width: size,
      height: size,
      display: 'block',
      objectFit: 'contain',
      pointerEvents: 'none',
      filter: active
        ? 'drop-shadow(0 0 6px rgba(240,212,154,0.62)) drop-shadow(0 1px 2px rgba(0,0,0,0.75))'
        : 'drop-shadow(0 1px 2px rgba(0,0,0,0.72))',
      ...style,
    }}
  />
);

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
  <PngIcon name="mail" size={p.size ?? 26} style={p.style} />
);

export const IconFriends = (p: IconProps) => (
  <PngIcon name="friends" size={p.size ?? 26} style={p.style} />
);

export const IconSettings = (p: IconProps) => (
  <PngIcon name="settings" size={p.size ?? 26} style={p.style} />
);

export const IconPlus = (p: IconProps) => (
  <Icon {...p} sw={p.sw ?? 1.4}>
    <path d="M12 6v12M6 12h12" />
  </Icon>
);

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

export const MenuIconEvent = () => <PngIcon name="event" size={36} />;
export const MenuIconTask = () => <PngIcon name="task" size={36} />;
export const MenuIconAchievement = () => <PngIcon name="achievement" size={36} />;
export const MenuIconShop = () => <PngIcon name="shop" size={36} />;
export const MenuIconStorage = () => <PngIcon name="storage" size={36} />;
export const MenuIconMemory = () => <PngIcon name="memory" size={34} />;
export const MenuIconRanking = () => <PngIcon name="ranking" size={34} />;

export const NavIconHome = ({ active }: NavIconProps) => (
  <PngIcon name="home" size={42} active={active} />
);

export const NavIconAdventure = ({ active }: NavIconProps) => (
  <PngIcon name="adventure" size={42} active={active} />
);

export const NavIconStarfield = ({ active }: NavIconProps) => (
  <PngIcon name="starfield" size={42} active={active} />
);

export const NavIconGuild = ({ active }: NavIconProps) => (
  <PngIcon name="guild" size={42} active={active} />
);
