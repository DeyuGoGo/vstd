import type { CharacterBaseConfig } from './types';
import { starina } from './starina';

export const CHARACTERS = { starina } satisfies Record<string, CharacterBaseConfig>;
export const DEFAULT_CHARACTER_ID = 'starina';
export type CharacterId = keyof typeof CHARACTERS;
