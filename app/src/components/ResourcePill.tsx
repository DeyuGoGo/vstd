import type { ReactNode } from 'react';
import styles from '../lobby/Lobby.module.css';
import { IconPlus } from '../lobby/icons';

interface Props {
  icon: ReactNode;
  value: string;
  onPlusClick?: () => void;
}

export const ResourcePill = ({ icon, value, onPlusClick }: Props) => (
  <div className={styles.resPill}>
    <div className={styles.resIcon}>{icon}</div>
    <div className={styles.resVal}>{value}</div>
    <div
      className={styles.resPlus}
      onClick={onPlusClick}
      role="button"
      aria-label="加值"
    >
      <IconPlus size={14} stroke="#f0d49a" />
    </div>
  </div>
);
