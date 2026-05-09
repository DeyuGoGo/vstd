import type { ComponentType } from 'react';
import styles from '../lobby/Lobby.module.css';

interface Props {
  Icon: ComponentType;
  zh: string;
  en: string;
  onClick?: () => void;
}

export const SideShortcut = ({ Icon, zh, en, onClick }: Props) => (
  <div
    className={styles.sideShortcut}
    onClick={onClick}
    role="button"
    tabIndex={0}
    aria-label={zh}
  >
    <div className={styles.sideIcon}>
      <Icon />
    </div>
    <div className={styles.sideZh}>{zh}</div>
    <div className={styles.sideEn}>{en}</div>
  </div>
);
