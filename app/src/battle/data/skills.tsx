import type { ReactNode } from 'react';
import type { Skill } from '../engine/types';

export interface SkillDef extends Omit<Skill, 'cd'> {
  icon: ReactNode;
}

export const SKILL_DEFS: SkillDef[] = [
  {
    id: 'starlight',
    name: '星辰爆擊',
    lv: 3,
    cdMax: 4,
    bg: 'radial-gradient(circle at 50% 45%, #1d2a6c, #060216)',
    icon: (
      <svg width="40" height="40" viewBox="-20 -20 40 40">
        <path
          d="M0 -16 L3 -3 L16 0 L3 3 L0 16 L-3 3 L-16 0 L-3 -3 Z"
          fill="#9ec5ff"
          filter="drop-shadow(0 0 6px #6da6ff)"
        />
        <path
          d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    id: 'orbit',
    name: '星軌迴旋',
    lv: 2,
    cdMax: 6,
    bg: 'radial-gradient(circle at 50% 45%, #3a1a5e, #0a0414)',
    icon: (
      <svg width="40" height="40" viewBox="-20 -20 40 40">
        <circle r="14" fill="none" stroke="#c8a4ff" strokeWidth="1.4" opacity="0.85" />
        <circle r="9" fill="none" stroke="#9d6fff" strokeWidth="1" opacity="0.55" />
        <path
          d="M0 -8 L1.6 -1.6 L8 0 L1.6 1.6 L0 8 L-1.6 1.6 L-8 0 L-1.6 -1.6 Z"
          fill="#fff"
        />
        <circle cx="14" cy="0" r="2.5" fill="#fff" />
        <circle cx="-10" cy="-9" r="1.6" fill="#c8a4ff" />
      </svg>
    ),
  },
  {
    id: 'rain',
    name: '流星箭雨',
    lv: 4,
    cdMax: 8,
    bg: 'radial-gradient(circle at 50% 45%, #4a1a40, #100410)',
    icon: (
      <svg width="40" height="48" viewBox="-20 -24 40 48">
        {[-10, 0, 10].map((dx, i) => (
          <g key={i} transform={`translate(${dx} ${i === 1 ? -2 : 2})`}>
            <path
              d="M0 -16 L0 12"
              stroke="#c8a4ff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M0 12 L-3 7 M0 12 L3 7"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M-2 -14 L0 -18 L2 -14 Z" fill="#fff" />
          </g>
        ))}
      </svg>
    ),
  },
];
