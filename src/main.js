import Phaser from 'phaser';
import { config } from './config';

// Phaser 게임 인스턴스 생성
const game = new Phaser.Game(config);

// 전역 객체에 게임 인스턴스 저장 (디버깅용)
window.game = game;

console.log('DWGAME Phaser3 게임이 시작되었습니다!');
