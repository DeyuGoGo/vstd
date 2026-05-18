import { usePlayerStore, BATTLE_STAMINA_COST } from '../stores/usePlayerStore';
import { useToastStore } from '../stores/useToastStore';
import { useSceneStore } from '../stores/useSceneStore';
import { CHARACTERS, DEFAULT_CHARACTER_ID, type CharacterId } from '../characters/index';
import { ResourcePill } from '../components/ResourcePill';
import { MenuItem } from '../components/MenuItem';
import { SideShortcut } from '../components/SideShortcut';
import { NavItem } from '../components/NavItem';
import {
  IconMail,
  IconFriends,
  IconSettings,
  IconStarRes,
  IconCoinRes,
  IconGemRes,
  MenuIconEvent,
  MenuIconTask,
  MenuIconAchievement,
  MenuIconShop,
  MenuIconStorage,
  MenuIconMemory,
  MenuIconRanking,
  NavIconHome,
  NavIconAdventure,
  NavIconStarfield,
  NavIconGuild,
} from './icons';
import rawStyles from './Lobby.module.css';
import { cm } from '../utils/cssModule';
const styles = cm(rawStyles);

const numberFmt = new Intl.NumberFormat('en-US');

export const Lobby = () => {
  const player = usePlayerStore((s) => s.player);
  const wallet = usePlayerStore((s) => s.wallet);
  const mail = usePlayerStore((s) => s.mail);
  const adventureBadge = usePlayerStore((s) => s.notifications.adventure);
  const activeTab = usePlayerStore((s) => s.nav.activeTab);
  const lineup = usePlayerStore((s) => s.lineup);
  const selectedCharacterId = usePlayerStore((s) => s.selectedCharacterId);
  const clearMail = usePlayerStore((s) => s.clearMail);
  const setActiveTab = usePlayerStore((s) => s.setActiveTab);
  const spendStamina = usePlayerStore((s) => s.spendStamina);
  const showToast = useToastStore((s) => s.showToast);
  const setScene = useSceneStore((s) => s.setScene);

  // Lobby display character: first non-null lineup slot, fallback to selected, then default.
  const firstLineupId = lineup.find((id): id is string => id !== null) ?? null;
  const displayCharId = (firstLineupId ?? selectedCharacterId ?? DEFAULT_CHARACTER_ID) as CharacterId;
  const displayChar = CHARACTERS[displayCharId] ?? CHARACTERS[DEFAULT_CHARACTER_ID as CharacterId];

  const comingSoon = () => showToast('即將推出');
  const enterBattle = () => {
    if (lineup.every((id) => id === null)) {
      showToast('請先編隊');
      return;
    }
    if (!spendStamina(BATTLE_STAMINA_COST)) {
      showToast(`體力不足（需 ${BATTLE_STAMINA_COST}）`);
      return;
    }
    setScene('battle');
  };
  const xpPct = Math.min(100, Math.max(0, (player.xp / player.xpMax) * 100));
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div className={styles.lobby}>
      <div className={styles.lobbyScene} aria-hidden="true">
        <video
          key={displayChar.assets.lobbyVideo}
          className={styles.lobbyVideo}
          src={`${baseUrl}${displayChar.assets.lobbyVideo}`}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className={styles.cgEffects}>
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className={styles.lobbyVignette} />

      {/* Top-left: avatar + name + level + xp */}
      <div className={styles.playerBlock} onClick={comingSoon} role="button" tabIndex={0} aria-label="玩家檔案">
        <div className={styles.avatar}>
          <div
            className={styles.avatarImg}
            style={{ backgroundImage: `url(${baseUrl}${displayChar.assets.lobbyAvatar})` }}
          />
          <div className={styles.avatarFrame} />
          <div className={styles.avatarLv}>{player.level}</div>
        </div>
        <div className={styles.playerMeta}>
          <div className={styles.playerName}>{player.name}</div>
          <div className={styles.playerXpRow}>
            <div className={styles.playerLv}>Lv.{player.level}</div>
            <div className={styles.xpBar}>
              <div className={styles.xpFill} style={{ width: `${xpPct}%` }} />
            </div>
            <div className={styles.xpText}>
              {numberFmt.format(player.xp)} / {numberFmt.format(player.xpMax)}
            </div>
          </div>
        </div>
      </div>

      {/* Top-right: resources */}
      <div className={styles.resources}>
        <ResourcePill
          icon={<IconStarRes />}
          value={`${wallet.stamina}/${wallet.staminaMax}`}
          onPlusClick={comingSoon}
        />
        <ResourcePill
          icon={<IconCoinRes />}
          value={numberFmt.format(wallet.gold)}
          onPlusClick={comingSoon}
        />
        <ResourcePill
          icon={<IconGemRes />}
          value={numberFmt.format(wallet.gem)}
          onPlusClick={comingSoon}
        />
      </div>

      {/* Top-right under resources: utility icons */}
      <div className={styles.utilIcons}>
        <button className={styles.utilBtn} aria-label="信件" onClick={clearMail}>
          <IconMail size={22} />
          {mail.unreadCount > 0 && <span className={styles.utilPip} />}
        </button>
        <button className={styles.utilBtn} aria-label="好友" onClick={comingSoon}>
          <IconFriends size={22} />
        </button>
        <button className={styles.utilBtn} aria-label="設定" onClick={comingSoon}>
          <IconSettings size={22} />
        </button>
      </div>

      {/* Left main menu */}
      <nav className={styles.leftMenu}>
        <MenuItem Icon={MenuIconEvent} zh="活動" en="EVENT" onClick={comingSoon} />
        <MenuItem Icon={MenuIconTask} zh="任務" en="TASK" onClick={comingSoon} />
        <MenuItem Icon={MenuIconAchievement} zh="成就" en="ACHIEVEMENT" onClick={comingSoon} />
        <MenuItem Icon={MenuIconShop} zh="商城" en="SHOP" onClick={comingSoon} />
        <MenuItem Icon={MenuIconStorage} zh="倉庫" en="STORAGE" onClick={comingSoon} />
      </nav>

      {/* Right side shortcuts */}
      <div className={styles.sideShortcuts}>
        <SideShortcut Icon={MenuIconMemory} zh="回憶" en="MEMORY" onClick={comingSoon} />
        <SideShortcut Icon={MenuIconRanking} zh="排行" en="RANKING" onClick={comingSoon} />
      </div>

      {/* Bottom nav */}
      <nav className={styles.bottomNav}>
        <div className={styles.bottomNavLine} />
        <div className={styles.bottomNavItems}>
          <NavItem
            Icon={NavIconHome}
            zh="主城"
            en="HOME"
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavItem
            Icon={NavIconAdventure}
            zh="冒險"
            en="ADVENTURE"
            active={activeTab === 'adventure'}
            dot={adventureBadge}
            onClick={enterBattle}
          />
          <NavItem
            Icon={NavIconStarfield}
            zh="星城"
            en="STARFIELD"
            active={activeTab === 'starfield'}
            onClick={() => {
              setActiveTab('starfield');
              setScene('roster');
            }}
          />
          <NavItem
            Icon={NavIconGuild}
            zh="公會"
            en="GUILD"
            active={activeTab === 'guild'}
            onClick={comingSoon}
          />
        </div>
      </nav>
    </div>
  );
};
