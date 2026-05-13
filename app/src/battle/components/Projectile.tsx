import type { Projectile as ProjectileT } from '../engine/types';
import { ProjectileSparkle } from '../icons';
import { Z } from '../zIndex';

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
      zIndex: Z.PROJECTILE,
    }}
  >
    <ProjectileSparkle rot={p.rot} />
  </div>
);
