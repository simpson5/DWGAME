import Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import TitleScene from './scenes/TitleScene';
import CharacterCreationScene from './scenes/CharacterCreationScene';
import VillageScene from './scenes/VillageScene';
import StatusScene from './scenes/StatusScene';
import BattleScene from './scenes/BattleScene';
// import GameScene from './scenes/GameScene'; // 기존 테스트 씬 (사용 안함)

export const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#282c34',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [PreloadScene, TitleScene, CharacterCreationScene, VillageScene, StatusScene, BattleScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};
