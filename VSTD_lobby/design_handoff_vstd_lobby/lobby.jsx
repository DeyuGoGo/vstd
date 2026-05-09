// Game lobby UI overlay — VSTD 大廳
// Variant prop: 'classic' (matches reference) | 'refined' (subtle ornamentation)

const GOLD = '#d4b07a';
const GOLD_DIM = '#a8865a';
const GOLD_BRIGHT = '#f0d49a';
const INK = 'rgba(8, 6, 14, 0.55)';

// ── Thin-line gold icons (simple geometric only) ────────────────────────────
const Icon = ({ children, size = 20, stroke = GOLD, sw = 1.2, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
       style={style}>{children}</svg>
);

const IconMail = (p) => <Icon {...p}><rect x="3" y="6" width="18" height="13" rx="0.5"/><path d="M3 7l9 7 9-7"/></Icon>;
const IconFriends = (p) => <Icon {...p}><circle cx="9" cy="9" r="3.2"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="8" r="2.6"/><path d="M15 13.6c2.6 0.2 5 2.1 5 5"/></Icon>;
const IconSettings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2.1 2.1M17.4 17.4l2.1 2.1M4.5 19.5l2.1-2.1M17.4 6.6l2.1-2.1"/></Icon>;
const IconPlus = (p) => <Icon {...p} sw={1.4}><path d="M12 6v12M6 12h12"/></Icon>;

// Resource icons (top bar)
const IconStarRes = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="starG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e9a8ff"/><stop offset="1" stopColor="#7a3fb5"/>
      </linearGradient>
    </defs>
    <path d="M12 2.5l2.6 5.7 6.2 0.7-4.6 4.3 1.3 6.2L12 16.4 6.5 19.4l1.3-6.2L3.2 8.9l6.2-0.7z"
          fill="url(#starG)" stroke={GOLD_BRIGHT} strokeWidth="0.8"/>
  </svg>
);
const IconCoinRes = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <radialGradient id="coinG" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#ffe7a6"/><stop offset="1" stopColor="#a8723b"/>
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="9" fill="url(#coinG)" stroke={GOLD_BRIGHT} strokeWidth="0.8"/>
    <circle cx="12" cy="12" r="6" fill="none" stroke="#7a4a1f" strokeWidth="0.6"/>
    <path d="M9 9.5h5a1.8 1.8 0 010 3.5h-5M9 9.5v5h5" stroke="#5a3414" strokeWidth="1" fill="none" strokeLinecap="round"/>
  </svg>
);
const IconGemRes = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="gemG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c79bff"/><stop offset="1" stopColor="#5a25a0"/>
      </linearGradient>
    </defs>
    <path d="M5 9l3-4h8l3 4-7 11z" fill="url(#gemG)" stroke={GOLD_BRIGHT} strokeWidth="0.8" strokeLinejoin="round"/>
    <path d="M5 9h14M9 5l3 4 3-4M12 9v11" stroke="#3a1a78" strokeWidth="0.6" opacity="0.7"/>
  </svg>
);

// Menu / nav icons — simple ornamental glyphs, thin gold lines
const MenuIconEvent = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round">
    <path d="M16 4l1.6 3.4L21 5.5l-1.5 3.6 3.5 1.6-3.5 1.6L21 16l-3.4-1.9L16 17.5l-1.6-3.4L11 16l1.5-3.7L9 10.7l3.5-1.6L11 5.5l3.4 1.9z"/>
    <path d="M10 20l6 8 6-8M13 20h6"/>
  </svg>
);
const MenuIconTask = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round">
    <path d="M8 6h12l4 4v16H8z"/>
    <path d="M20 6v4h4M11 14h10M11 18h10M11 22h6"/>
  </svg>
);
const MenuIconAchievement = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 6h12v6a6 6 0 01-12 0z"/>
    <path d="M10 8H6v2a4 4 0 004 4M22 8h4v2a4 4 0 01-4 4"/>
    <path d="M14 18l-1 6 3-2 3 2-1-6"/>
  </svg>
);
const MenuIconShop = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 12l2-6h16l2 6"/>
    <path d="M6 12v14h20V12"/>
    <path d="M6 12h20M12 12v4a4 4 0 01-4 0M16 12v4a4 4 0 01-4 0M20 12v4a4 4 0 01-4 0M24 12v4a4 4 0 01-4 0"/>
    <path d="M14 26v-6h4v6"/>
  </svg>
);
const MenuIconStorage = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="10" width="20" height="14" rx="1"/>
    <path d="M6 16h20M14 10v6h4v-6M9 8h14l-1 2H10z"/>
  </svg>
);
const MenuIconMemory = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 6h12a4 4 0 014 4v18H11a4 4 0 01-4-4z"/>
    <path d="M7 24a4 4 0 014-4h12M14 12h6M14 16h6"/>
  </svg>
);
const MenuIconRanking = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 6h12v6a6 6 0 01-12 0z"/>
    <path d="M10 8H6v2a4 4 0 004 4M22 8h4v2a4 4 0 01-4 4"/>
    <path d="M16 18v4M12 26h8M14 22h4l1 4h-6z"/>
  </svg>
);

// Bottom nav icons
const NavIconHome = ({ active }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={active ? GOLD_BRIGHT : GOLD} strokeWidth={active ? 1.2 : 1} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 26V14l5-3v15M11 11l5-4 5 4M21 11v15M16 26v-7h0M26 14l-5-3v15M6 26h20"/>
    <path d="M9 17h2M21 17h2"/>
  </svg>
);
const NavIconAdventure = ({ active }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={active ? GOLD_BRIGHT : GOLD} strokeWidth={active ? 1.2 : 1} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 24l5-12 5 6 5-9 5 15z"/>
    <path d="M6 24h20M19 9l3 3"/>
  </svg>
);
const NavIconStarfield = ({ active }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={active ? GOLD_BRIGHT : GOLD} strokeWidth={active ? 1.2 : 1} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4l2 5 5 1-3.5 3.5 1 5L16 16l-4.5 2.5 1-5L9 10l5-1z"/>
    <path d="M8 24h16M10 24v-3M22 24v-3M16 24v-3"/>
  </svg>
);
const NavIconGuild = ({ active }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={active ? GOLD_BRIGHT : GOLD} strokeWidth={active ? 1.2 : 1} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 5l2 2 4-3 4 3 2-2v6l2 2-2 2v10H10V15l-2-2 2-2z"/>
    <path d="M14 26v-6h4v6"/>
  </svg>
);

// ── Subcomponents ───────────────────────────────────────────────────────────
const ResourcePill = ({ icon, value, refined }) => (
  <div className={`res-pill ${refined ? 'refined' : ''}`}>
    <div className="res-icon">{icon}</div>
    <div className="res-val">{value}</div>
    <div className="res-plus"><IconPlus size={14} stroke={GOLD_BRIGHT}/></div>
  </div>
);

const MenuItem = ({ Icon, zh, en }) => (
  <div className="menu-item">
    <div className="menu-icon"><Icon/></div>
    <div className="menu-labels">
      <div className="zh">{zh}</div>
      <div className="en">{en}</div>
    </div>
  </div>
);

const SideShortcut = ({ Icon, zh, en }) => (
  <div className="side-shortcut">
    <div className="side-icon"><Icon/></div>
    <div className="side-zh">{zh}</div>
    <div className="side-en">{en}</div>
  </div>
);

const NavItem = ({ Icon, zh, en, active, dot }) => (
  <div className={`nav-item ${active ? 'active' : ''}`}>
    {dot && <span className="nav-dot"/>}
    <div className="nav-icon"><Icon active={active}/></div>
    <div className="nav-zh">{zh}</div>
    <div className="nav-en">{en}</div>
  </div>
);

// ── Main lobby component ────────────────────────────────────────────────────
const Lobby = ({ variant = 'classic', width = 640, height = 960 }) => {
  const refined = variant === 'refined';
  return (
    <div className={`lobby ${variant}`} style={{ width, height }}>
      <div className="lobby-bg" style={{ backgroundImage: `url(assets/bg-clean.png)` }}/>
      <div className="lobby-vignette"/>

      {/* Top-left: avatar + name + level + xp */}
      <div className="player-block">
        <div className="avatar">
          <div className="avatar-img"/>
          <div className="avatar-frame"/>
          <div className="avatar-lv">48</div>
        </div>
        <div className="player-meta">
          <div className="player-name">星奈的指揮官</div>
          <div className="player-xp-row">
            <div className="player-lv">Lv.48</div>
            <div className="xp-bar">
              <div className="xp-fill" style={{ width: '78.9%' }}/>
            </div>
            <div className="xp-text">5680 / 7200</div>
          </div>
        </div>
      </div>

      {/* Top-right: resources */}
      <div className="resources">
        <ResourcePill icon={<IconStarRes/>} value="24/120" refined={refined}/>
        <ResourcePill icon={<IconCoinRes/>} value="328,450" refined={refined}/>
        <ResourcePill icon={<IconGemRes/>} value="8,860" refined={refined}/>
      </div>

      {/* Top-right under resources: utility icons */}
      <div className="util-icons">
        <button className="util-btn" aria-label="信件"><IconMail size={22}/><span className="util-pip"/></button>
        <button className="util-btn" aria-label="好友"><IconFriends size={22}/></button>
        <button className="util-btn" aria-label="設定"><IconSettings size={22}/></button>
      </div>

      {/* Left main menu */}
      <nav className="left-menu">
        <MenuItem Icon={MenuIconEvent}       zh="活動" en="EVENT"/>
        <MenuItem Icon={MenuIconTask}        zh="任務" en="TASK"/>
        <MenuItem Icon={MenuIconAchievement} zh="成就" en="ACHIEVEMENT"/>
        <MenuItem Icon={MenuIconShop}        zh="商城" en="SHOP"/>
        <MenuItem Icon={MenuIconStorage}     zh="倉庫" en="STORAGE"/>
      </nav>

      {/* Right side shortcuts */}
      <div className="side-shortcuts">
        <SideShortcut Icon={MenuIconMemory}  zh="回憶" en="MEMORY"/>
        <SideShortcut Icon={MenuIconRanking} zh="排行" en="RANKING"/>
      </div>

      {/* Bottom nav */}
      <nav className="bottom-nav">
        <div className="bottom-nav-line"/>
        <div className="bottom-nav-items">
          <NavItem Icon={NavIconHome}      zh="主城"    en="HOME"      active/>
          <NavItem Icon={NavIconAdventure} zh="冒險"    en="ADVENTURE" dot/>
          <NavItem Icon={NavIconStarfield} zh="星城"    en="STARFIELD"/>
          <NavItem Icon={NavIconGuild}     zh="公會"    en="GUILD"/>
        </div>
      </nav>
    </div>
  );
};

window.Lobby = Lobby;
