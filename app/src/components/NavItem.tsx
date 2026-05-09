import type { ComponentType } from 'react';
import styles from '../lobby/Lobby.module.css';

interface NavIconProps {
  active?: boolean;
}

interface Props {
  Icon: ComponentType<NavIconProps>;
  zh: string;
  en: string;
  active?: boolean;
  dot?: boolean;
  onClick?: () => void;
}

export const NavItem = ({ Icon, zh, en, active, dot, onClick }: Props) => {
  const className = active ? `${styles.navItem} ${styles.active}` : styles.navItem;
  return (
    <div className={className} onClick={onClick} role="button" tabIndex={0} aria-label={zh}>
      {dot && <span className={styles.navDot} />}
      <div className={styles.navIcon}>
        <Icon active={active} />
      </div>
      <div className={styles.navZh}>{zh}</div>
      <div className={styles.navEn}>{en}</div>
    </div>
  );
};
