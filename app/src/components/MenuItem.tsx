import type { ComponentType } from 'react';
import rawStyles from '../lobby/Lobby.module.css';
import { cm } from '../utils/cssModule';
const styles = cm(rawStyles);

interface Props {
  Icon: ComponentType;
  zh: string;
  en: string;
  onClick?: () => void;
}

export const MenuItem = ({ Icon, zh, en, onClick }: Props) => (
  <div
    className={styles.menuItem}
    onClick={onClick}
    role="button"
    tabIndex={0}
    aria-label={zh}
  >
    <div className={styles.menuIcon}>
      <Icon />
    </div>
    <div className={styles.menuLabels}>
      <div className={styles.menuZh}>{zh}</div>
      <div className={styles.menuEn}>{en}</div>
    </div>
  </div>
);
