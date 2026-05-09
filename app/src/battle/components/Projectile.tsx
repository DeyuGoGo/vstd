import type { Projectile as ProjectileT } from '../engine/types';
import { ProjectileSparkle } from '../icons';

interface Props {
  p: ProjectileT;
}

export const Projectile = ({ p }: Props) => (
  <div
    style={{
      position: 'absolute',
      left: p.x,
      top: p.y,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 20,
    }}
  >
    <ProjectileSparkle rot={p.rot} />
  </div>
);
