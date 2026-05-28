import type { CharacterBaseConfig } from './types';
import { starina } from './starina';
import { swordsman } from './swordsman';

export const CHARACTERS = { starina, swordsman } satisfies Record<string, CharacterBaseConfig>;
export const DEFAULT_CHARACTER_ID = 'starina';
export type CharacterId = keyof typeof CHARACTERS;
