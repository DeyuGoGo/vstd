import { useEffect } from 'react';
import { Lobby } from './lobby/Lobby';
import { Battle } from './battle/Battle';
import { Roster } from './roster/Roster';
import { CharacterDetail } from './character/CharacterDetail';
import { Toast } from './components/Toast';
import { useSceneStore, SCENE_DIMS } from './stores/useSceneStore';
import './styles/stage.css';

export const App = () => {
  const scene = useSceneStore((s) => s.scene);

  useEffect(() => {
    const dims = SCENE_DIMS[scene];
    document.documentElement.style.setProperty('--canvas-w', `${dims.w}px`);
    document.documentElement.style.setProperty('--canvas-h', `${dims.h}px`);
    const updateScale = () => {
      const scale = Math.min(
        window.innerWidth / dims.w,
        window.innerHeight / dims.h,
      );
      document.documentElement.style.setProperty('--scale', String(scale));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, [scene]);

  return (
    <div className="stage-outer">
      <div className="stage-inner">
        {scene === 'lobby' && <Lobby />}
        {scene === 'battle' && <Battle />}
        {scene === 'roster' && <Roster />}
        {scene === 'character' && <CharacterDetail />}
        <Toast />
      </div>
    </div>
  );
};

export default App;
