import Phaser from 'phaser';
import CharacterStats from '../systems/CharacterStats.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 캐릭터 스탯 초기화 (테스트용 레벨 10, 스탯 포인트 45개)
    this.characterStats = new CharacterStats('beginner', 10);

    // 환영 메시지
    this.add.text(width / 2, height / 2 - 120, 'DWGAME', {
      font: 'bold 48px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 50, '턴제 RPG 게임', {
      font: '24px Arial',
      fill: '#00ff00'
    }).setOrigin(0.5);

    // 스테이터스 창 열기 버튼
    const statusBtn = this.add.text(width / 2 - 100, height / 2 + 20, '[S] 스테이터스', {
      font: '18px Arial',
      fill: '#4ecdc4',
      backgroundColor: '#1a1a2e',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    statusBtn.on('pointerdown', () => this.openStatusScene());
    statusBtn.on('pointerover', () => statusBtn.setScale(1.05));
    statusBtn.on('pointerout', () => statusBtn.setScale(1));

    // 전투 시작 버튼
    const battleBtn = this.add.text(width / 2 + 100, height / 2 + 20, '[B] 전투', {
      font: '18px Arial',
      fill: '#ff6b6b',
      backgroundColor: '#1a1a2e',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    battleBtn.on('pointerdown', () => this.startBattle());
    battleBtn.on('pointerover', () => battleBtn.setScale(1.05));
    battleBtn.on('pointerout', () => battleBtn.setScale(1));

    // 스탯 자동 분배 버튼 (테스트용)
    const autoStatBtn = this.add.text(width / 2, height / 2 + 70, '[Q] 스탯 자동분배 (근력)', {
      font: '14px Arial',
      fill: '#ffd43b',
      backgroundColor: '#1a1a2e',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    autoStatBtn.on('pointerdown', () => this.autoAllocateStats('str'));
    autoStatBtn.on('pointerover', () => autoStatBtn.setScale(1.05));
    autoStatBtn.on('pointerout', () => autoStatBtn.setScale(1));

    // 플레이어 정보 표시
    this.playerInfoText = this.add.text(width / 2, height / 2 + 110, '', {
      font: '16px Arial',
      fill: '#ffd43b',
      align: 'center'
    }).setOrigin(0.5);

    this.updatePlayerInfo();

    // 키보드 단축키
    this.input.keyboard.on('keydown-S', () => this.openStatusScene());
    this.input.keyboard.on('keydown-B', () => this.startBattle());
    this.input.keyboard.on('keydown-Q', () => this.autoAllocateStats('str'));

    // 간단한 애니메이션 효과
    const circle = this.add.circle(width / 2, height / 2 + 140, 20, 0x00ff00);
    this.tweens.add({
      targets: circle,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  openStatusScene() {
    this.scene.pause();
    this.scene.launch('StatusScene', { characterStats: this.characterStats });
  }

  startBattle() {
    this.scene.pause();
    this.scene.launch('BattleScene', {
      player: this.characterStats,
      monsterType: 'slime'
    });
  }

  autoAllocateStats(statName) {
    // 사용 가능한 모든 스탯 포인트를 특정 능력치에 할당
    const points = this.characterStats.availablePoints;
    if (points > 0) {
      this.characterStats.addStat(statName, points);
      this.updatePlayerInfo();

      // 피드백 텍스트
      const feedbackText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 150,
        `근력 +${points}!`, {
        fontSize: '20px',
        color: '#ff6b6b',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      // 페이드 아웃
      this.tweens.add({
        targets: feedbackText,
        alpha: 0,
        y: feedbackText.y - 30,
        duration: 1000,
        onComplete: () => feedbackText.destroy()
      });
    }
  }

  updatePlayerInfo() {
    const stats = this.characterStats.getDerivedStats();
    const info = `Lv.${this.characterStats.level} (스탯P: ${this.characterStats.availablePoints}) | HP: ${this.characterStats.currentHP}/${this.characterStats.maxHP} | 공격력: ${stats.attack}`;
    this.playerInfoText.setText(info);
  }

  update() {
    // 씬이 재개될 때 플레이어 정보 업데이트
    if (this.scene.isActive() && this.playerInfoText) {
      this.updatePlayerInfo();
    }
  }
}
