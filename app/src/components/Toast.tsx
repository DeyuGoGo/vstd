import { useEffect, useState } from 'react';
import { useToastStore } from '../stores/useToastStore';
import styles from './Toast.module.css';

export const Toast = () => {
  const message = useToastStore((s) => s.message);
  const id = useToastStore((s) => s.id);
  const dismiss = useToastStore((s) => s.dismiss);
  const [visible, setVisible] = useState(false);
  const [renderedMessage, setRenderedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setRenderedMessage(message);
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => dismiss(), 200);
    }, 2000);
    return () => clearTimeout(timer);
  }, [id, message, dismiss]);

  if (!renderedMessage) return null;
  return (
    <div className={`${styles.toast} ${visible ? styles.visible : ''}`}>
      {renderedMessage}
    </div>
  );
};
