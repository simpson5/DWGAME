import Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import GameScene from './scenes/GameScene';
import StatusScene from './scenes/StatusScene';
import BattleScene from './scenes/BattleScene';

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
  scene: [PreloadScene, GameScene, StatusScene, BattleScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};
