import { create } from 'zustand';

export type Scene = 'lobby' | 'battle' | 'roster' | 'character';

export interface SceneDims {
  w: number;
  h: number;
}

export const SCENE_DIMS: Record<Scene, SceneDims> = {
  lobby: { w: 640, h: 960 },
  battle: { w: 640, h: 960 },
  roster: { w: 640, h: 960 },
  character: { w: 640, h: 960 },
};

interface SceneState {
  scene: Scene;
  setScene: (s: Scene) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  scene: 'lobby',
  setScene: (scene) => set({ scene }),
}));
