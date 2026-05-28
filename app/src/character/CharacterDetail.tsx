import { usePlayerStore, LINEUP_SIZE } from '../stores/usePlayerStore';
import { useSceneStore } from '../stores/useSceneStore';
import { CHARACTERS } from '../characters/index';
import type { StatKey } from '../characters/types';
import { computeEffectiveBattleStats, xpMax, LEVEL_CAP } from '../characters/statFormulas';
import rawStyles from './CharacterDetail.module.css';
import { cm } from '../utils/cssModule';
const styles = cm(rawStyles);

const numberFmt = new Intl.NumberFormat('en-US');

interface StatMeta {
  key: StatKey;
  zh: string;
  en: string;
}

const STAT_LIST: readonly StatMeta[] = [
  { key: 'str', zh: '力量', en: 'STR' },
  { key: 'agi', zh: '敏捷', en: 'AGI' },
  { key: 'vit', zh: '體力', en: 'VIT' },
  { key: 'dex', zh: '技巧', en: 'DEX' },
  { key: 'luk', zh: '幸運', en: 'LUK' },
  { key: 'int', zh: '智力', en: 'INT' },
] as const;

export const CharacterDetail = () => {
  const selectedId = usePlayerStore((s) => s.selectedCharacterId);
  const characters = usePlayerStore((s) => s.characters);
  const lineup = usePlayerStore((s) => s.lineup);
  const expItem = usePlayerStore((s) => s.wallet.expItem);
  const allocateStat = usePlayerStore((s) => s.allocateStat);
  const consumeExpItem = usePlayerStore((s) => s.useExpItem);
  const setLineupSlot = usePlayerStore((s) => s.setLineupSlot);
  const setScene = useSceneStore((s) => s.setScene);

  const baseUrl = import.meta.env.BASE_URL;
  const charBase = CHARACTERS[selectedId as keyof typeof CHARACTERS];
  const progress = characters[selectedId];

  // Defensive fallback — shouldn't normally happen since store seeds starina.
  if (!charBase || !progress) {
    return (
      <div className={styles.detail}>
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => setScene('roster')}
            aria-label="返回編隊"
          >
            {'< 返回'}
          </button>
          <div className={styles.topTitle}>
            <div className={styles.topTitleZh}>角色資料</div>
            <div className={styles.topTitleEn}>CHARACTER</div>
          </div>
          <div className={styles.topSpacer} />
        </div>
        <section className={styles.section}>
          <div className={styles.sectionTitle}>找不到角色資料</div>
        </section>
      </div>
    );
  }

  const eff = computeEffectiveBattleStats(charBase.baseStats, progress.stats);
  const atSlot = lineup.findIndex((id) => id === selectedId);
  const isActive = atSlot >= 0;
  const xpCap = progress.level >= LEVEL_CAP ? xpMax(LEVEL_CAP) : xpMax(progress.level);
  const xpPct = progress.level >= LEVEL_CAP ? 100 : Math.min(100, (progress.xp / xpCap) * 100);

  const fmtAspd = (aspd: number) => `ASPD ${aspd}`;
  const fmtCritPct = (crit: number) => `${(crit * 100).toFixed(1)}%`;

  const onUse = (n: number) => {
    if (expItem <= 0) return;
    consumeExpItem(selectedId, n);
  };

  const onLeave = () => {
    if (atSlot >= 0) setLineupSlot(atSlot, null);
  };

  return (
    <div className={styles.detail}>
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => setScene('roster')}
          aria-label="返回編隊"
        >
          {'< 返回'}
        </button>
        <div className={styles.topTitle}>
          <div className={styles.topTitleZh}>角色資料</div>
          <div className={styles.topTitleEn}>CHARACTER</div>
        </div>
        <div className={styles.topSpacer} />
      </div>

      {/* Header */}
      <section className={styles.headerCard}>
        <div
          className={styles.headerPortrait}
          style={{ backgroundImage: `url(${baseUrl}${charBase.assets.lobbyAvatar})` }}
        />
        <div className={styles.headerInfo}>
          <div className={styles.headerNameRow}>
            <div className={styles.headerName}>{charBase.displayName}</div>
            <div className={styles.headerLevel}>Lv.{progress.level}</div>
          </div>
          <div className={styles.xpRow}>
            <div className={styles.xpBar}>
              <div className={styles.xpFill} style={{ width: `${xpPct}%` }} />
            </div>
            <div className={styles.xpText}>
              {numberFmt.format(progress.xp)} / {numberFmt.format(xpCap)}
            </div>
          </div>
          <div className={styles.statusRow}>
            {isActive ? (
              <span className={styles.statusActive}>上陣中 · Slot {atSlot + 1}</span>
            ) : (
              <span className={styles.statusIdle}>待機</span>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>素質</div>
          <div
            className={`${styles.sectionAside} ${
              progress.unspentPoints > 0 ? styles.sectionAsideStrong : ''
            }`}
          >
            剩餘點數：{progress.unspentPoints}
          </div>
        </div>
        <div className={styles.statsGrid}>
          {STAT_LIST.map((s) => {
            const value = progress.stats[s.key];
            const canAdd = progress.unspentPoints > 0;
            return (
              <div key={s.key} className={styles.statRow}>
                <div className={styles.statLabel}>
                  <span className={styles.statLabelZh}>{s.zh}</span>
                  <span className={styles.statLabelEn}>{s.en}</span>
                </div>
                <div className={styles.statValue}>{value}</div>
                <button
                  type="button"
                  className={styles.statPlus}
                  onClick={() => allocateStat(selectedId, s.key)}
                  disabled={!canAdd}
                  aria-label={`加 1 點 ${s.zh}`}
                >
                  +
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Derived battle preview */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>戰鬥能力預覽</div>
          <div className={styles.sectionAside}>即時更新</div>
        </div>
        <div className={styles.derivedGrid}>
          <div className={styles.derivedRow}>
            <span className={styles.derivedLabel}>HP 上限</span>
            <span className={styles.derivedValue}>{numberFmt.format(eff.hpMax)}</span>
          </div>
          <div className={styles.derivedRow}>
            <span className={styles.derivedLabel}>攻速</span>
            <span className={styles.derivedValue}>{fmtAspd(eff.aspd)}</span>
          </div>
          <div className={styles.derivedRow}>
            <span className={styles.derivedLabel}>暴擊率</span>
            <span className={styles.derivedValue}>{fmtCritPct(eff.critBase)}</span>
          </div>
          <div className={styles.derivedRow}>
            <span className={styles.derivedLabel}>物攻</span>
            <span className={styles.derivedValue}>ATK {eff.pAtk}</span>
          </div>
          <div className={styles.derivedRow}>
            <span className={styles.derivedLabel}>法攻</span>
            <span className={styles.derivedValue}>MATK {eff.mAtk}</span>
          </div>
          <div className={styles.derivedRow}>
            <span className={styles.derivedLabel}>傷害區間</span>
            <span className={styles.derivedValue}>
              {eff.dmgMin}-{eff.dmgMax}
            </span>
          </div>
        </div>
      </section>

      {/* Exp item */}
      <section className={styles.section}>
        <div className={styles.expHeader}>
          <span className={styles.expLabel}>經驗道具</span>
          <span className={styles.expCount}>× {numberFmt.format(expItem)}</span>
        </div>
        <div className={styles.expBtnRow}>
          <button
            type="button"
            className={styles.expBtn}
            onClick={() => onUse(1)}
            disabled={expItem < 1 || progress.level >= LEVEL_CAP}
          >
            使用 1 顆
          </button>
          <button
            type="button"
            className={styles.expBtn}
            onClick={() => onUse(10)}
            disabled={expItem < 1 || progress.level >= LEVEL_CAP}
          >
            使用 10 顆
          </button>
          <button
            type="button"
            className={styles.expBtn}
            onClick={() => onUse(expItem)}
            disabled={expItem < 1 || progress.level >= LEVEL_CAP}
          >
            全部使用
          </button>
        </div>
      </section>

      {/* Lineup ops */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>編隊操作</div>
          {isActive && <div className={styles.sectionAside}>目前 Slot {atSlot + 1}</div>}
        </div>
        <div className={styles.lineupOps}>
          <div className={styles.lineupSlotsRow}>
            {Array.from({ length: LINEUP_SIZE }).map((_, idx) => {
              const occupantId = lineup[idx];
              const isSelfHere = occupantId === selectedId;
              const occupant = occupantId
                ? CHARACTERS[occupantId as keyof typeof CHARACTERS]
                : null;
              const meta = isSelfHere
                ? '已在此'
                : occupant
                ? `替換 ${occupant.displayName}`
                : '空位';
              return (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.lineupSlotBtn} ${
                    isSelfHere ? styles.lineupSlotActive : ''
                  }`}
                  onClick={() => setLineupSlot(idx, selectedId)}
                  disabled={isSelfHere}
                  aria-label={`編入 Slot ${idx + 1}`}
                >
                  Slot {idx + 1}
                  <span className={styles.lineupSlotMeta}>{meta}</span>
                </button>
              );
            })}
          </div>
          {isActive && (
            <button
              type="button"
              className={styles.leaveBtn}
              onClick={onLeave}
              aria-label="離隊"
            >
              離隊
            </button>
          )}
        </div>
      </section>

      <div className={styles.bottomSpacer} />
    </div>
  );
};
