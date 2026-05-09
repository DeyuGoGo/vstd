import { ACTIVE_BLESSINGS, type Blessing } from '../data/blessings';

export function pickThree(): Blessing[] {
  const a = [...ACTIVE_BLESSINGS];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, 3);
}
