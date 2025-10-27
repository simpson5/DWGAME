import Phaser from 'phaser';

/**
 * 타이틀 화면 씬
 * 게임 시작 화면
 */
export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 배경
    this.add.rectangle(0, 0, width, height, 0x0a0e27).setOrigin(0);

    // 타이틀 로고
    this.add.text(width / 2, height / 2 - 120, 'DWGAME', {
      fontSize: '64px',
      fontStyle: 'bold',
      color: '#ffd43b',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 50, 'Phaser3 턴제 RPG', {
      fontSize: '24px',
      color: '#4ecdc4'
    }).setOrigin(0.5);

    // 버전 정보
    this.add.text(width / 2, height / 2, 'v1.0.0', {
      fontSize: '14px',
      color: '#666666'
    }).setOrigin(0.5);

    // 메뉴 버튼들
    this.createMenuButtons(width, height);

    // 깜빡이는 "Press Any Key" 텍스트
    const pressKeyText = this.add.text(width / 2, height - 50, 'Press Any Key to Start', {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: pressKeyText,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // 키보드 입력 대기
    this.input.keyboard.once('keydown', () => {
      this.startNewGame();
    });
  }

  /**
   * 메뉴 버튼 생성
   */
  createMenuButtons(width, height) {
    const buttonY = height / 2 + 80;

    // 새 게임 버튼
    const newGameBtn = this.createButton(width / 2, buttonY, '새 게임', '#4ecdc4');
    newGameBtn.on('pointerdown', () => this.startNewGame());

    // 계속하기 버튼 (추후 저장 시스템 구현 시)
    const continueBtn = this.createButton(width / 2, buttonY + 60, '계속하기', '#666666');
    continueBtn.on('pointerdown', () => {
      this.showMessage('저장된 데이터가 없습니다');
    });
    continueBtn.setAlpha(0.5); // 비활성화 표시

    // 설정 버튼
    const settingsBtn = this.createButton(width / 2, buttonY + 120, '설정', '#845ef7');
    settingsBtn.on('pointerdown', () => {
      this.showMessage('설정 기능은 추후 구현 예정입니다');
    });
  }

  /**
   * 버튼 생성 헬퍼
   */
  createButton(x, y, text, color) {
    const btn = this.add.text(x, y, text, {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: color,
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => {
      btn.setScale(1.1);
      btn.setBackgroundColor('#ffffff');
      btn.setColor(color);
    });

    btn.on('pointerout', () => {
      btn.setScale(1);
      btn.setBackgroundColor(color);
      btn.setColor('#ffffff');
    });

    return btn;
  }

  /**
   * 새 게임 시작
   */
  startNewGame() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('CharacterCreationScene');
    });
  }

  /**
   * 메시지 표시
   */
  showMessage(message) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const msgText = this.add.text(width / 2, height / 2 + 200, message, {
      fontSize: '16px',
      color: '#ff6b6b',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    this.tweens.add({
      targets: msgText,
      alpha: 0,
      y: msgText.y - 30,
      duration: 2000,
      onComplete: () => msgText.destroy()
    });
  }
}
