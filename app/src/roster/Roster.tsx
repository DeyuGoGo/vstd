import { useState } from 'react';
import { usePlayerStore, LINEUP_SIZE } from '../stores/usePlayerStore';
import { useSceneStore } from '../stores/useSceneStore';
import { CHARACTERS } from '../characters/index';
import rawStyles from './Roster.module.css';
import { cm } from '../utils/cssModule';
const styles = cm(rawStyles);

export const Roster = () => {
  const characters = usePlayerStore((s) => s.characters);
  const lineup = usePlayerStore((s) => s.lineup);
  const setLineupSlot = usePlayerStore((s) => s.setLineupSlot);
  const selectCharacter = usePlayerStore((s) => s.selectCharacter);
  const setScene = useSceneStore((s) => s.setScene);

  const [pickSlot, setPickSlot] = useState<number | null>(null);

  const baseUrl = import.meta.env.BASE_URL;
  const ownedIds = Object.keys(characters);

  const openDetail = (id: string) => {
    selectCharacter(id);
    setScene('character');
  };

  const onClickSlot = (idx: number) => {
    const id = lineup[idx];
    if (id) {
      openDetail(id);
    } else {
      setPickSlot(idx);
    }
  };

  const onRemoveSlot = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setLineupSlot(idx, null);
  };

  const onPickCharacter = (id: string) => {
    if (pickSlot === null) return;
    setLineupSlot(pickSlot, id);
    setPickSlot(null);
  };

  const lineupSet = new Set(lineup.filter((id): id is string => id !== null));
  const pickCandidates = ownedIds.filter((id) => !lineupSet.has(id));

  return (
    <div className={styles.roster}>
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => setScene('lobby')}
          aria-label="返回大廳"
        >
          {'< 返回'}
        </button>
        <div className={styles.title}>
          <div className={styles.titleZh}>編隊</div>
          <div className={styles.titleEn}>STARFIELD ROSTER</div>
        </div>
        <div className={styles.topSpacer} />
      </div>

      {/* (A) 出戰隊伍 */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>出戰隊伍</div>
          <div className={styles.sectionHint}>點空格編入 / 點頭像查看</div>
        </div>
        <div className={styles.lineupRow}>
          {Array.from({ length: LINEUP_SIZE }).map((_, idx) => {
            const id = lineup[idx];
            const char = id ? CHARACTERS[id as keyof typeof CHARACTERS] : null;
            const progress = id ? characters[id] : null;

            if (char && progress) {
              return (
                <div
                  key={idx}
                  className={styles.slot}
                  onClick={() => onClickSlot(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Slot ${idx + 1}：${char.displayName}`}
                >
                  <span className={styles.slotIndex}>SLOT {idx + 1}</span>
                  <button
                    type="button"
                    className={styles.slotRemove}
                    onClick={(e) => onRemoveSlot(e, idx)}
                    aria-label={`移除 Slot ${idx + 1}`}
                  >
                    ×
                  </button>
                  <div
                    className={styles.slotPortrait}
                    style={{ backgroundImage: `url(${baseUrl}${char.assets.lobbyAvatar})` }}
                  />
                  <div className={styles.slotName}>{char.displayName}</div>
                  <div className={styles.slotLevel}>Lv.{progress.level}</div>
                </div>
              );
            }
            return (
              <div
                key={idx}
                className={`${styles.slot} ${styles.slotEmpty}`}
                onClick={() => onClickSlot(idx)}
                role="button"
                tabIndex={0}
                aria-label={`Slot ${idx + 1}：空`}
              >
                <span className={styles.slotIndex}>SLOT {idx + 1}</span>
                <div className={styles.slotEmptyIcon}>+</div>
                <div className={styles.slotEmptyLabel}>編入</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* (B) 擁有的角色 */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>擁有角色</div>
          <div className={styles.sectionHint}>{ownedIds.length} 名</div>
        </div>
        <div className={styles.cardList}>
          {ownedIds.map((id) => {
            const char = CHARACTERS[id as keyof typeof CHARACTERS];
            const progress = characters[id];
            if (!char || !progress) return null;
            const isActive = lineupSet.has(id);
            return (
              <div
                key={id}
                className={styles.card}
                onClick={() => openDetail(id)}
                role="button"
                tabIndex={0}
                aria-label={`${char.displayName} Lv.${progress.level}`}
              >
                {isActive && <span className={styles.cardActiveBadge}>上陣中</span>}
                {progress.unspentPoints > 0 && (
                  <span className={styles.cardUnspentDot}>未分配</span>
                )}
                <div
                  className={styles.cardPortrait}
                  style={{ backgroundImage: `url(${baseUrl}${char.assets.lobbyAvatar})` }}
                />
                <div className={styles.cardName}>{char.displayName}</div>
                <div className={styles.cardLevel}>Lv.{progress.level}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* (C) 選角 modal */}
      {pickSlot !== null && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setPickSlot(null)}
          role="presentation"
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="選擇要編入的角色"
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>選擇角色 → Slot {pickSlot + 1}</div>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setPickSlot(null)}
                aria-label="關閉"
              >
                ×
              </button>
            </div>
            {pickCandidates.length === 0 ? (
              <div className={styles.modalEmpty}>所有角色都已上陣</div>
            ) : (
              <div className={styles.modalList}>
                {pickCandidates.map((id) => {
                  const char = CHARACTERS[id as keyof typeof CHARACTERS];
                  const progress = characters[id];
                  if (!char || !progress) return null;
                  return (
                    <div
                      key={id}
                      className={styles.card}
                      onClick={() => onPickCharacter(id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`編入 ${char.displayName}`}
                    >
                      <div
                        className={styles.cardPortrait}
                        style={{ backgroundImage: `url(${baseUrl}${char.assets.lobbyAvatar})` }}
                      />
                      <div className={styles.cardName}>{char.displayName}</div>
                      <div className={styles.cardLevel}>Lv.{progress.level}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
