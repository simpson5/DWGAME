import Phaser from 'phaser';

/**
 * 마을 씬
 * 게임의 메인 허브
 */
export default class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' });
    this.player = null;
  }

  init() {
    // 플레이어 캐릭터 로드
    this.player = this.registry.get('playerCharacter');
    const playerName = this.registry.get('playerName');

    if (!this.player) {
      console.error('플레이어 데이터가 없습니다!');
      this.scene.start('TitleScene');
      return;
    }

    this.playerName = playerName || this.player.name || '모험가';
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 배경
    this.add.rectangle(0, 0, width, height, 0x2d4a3e).setOrigin(0);

    // 페이드 인 효과
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // 타이틀
    this.add.text(width / 2, 40, '🏘️ 평화로운 마을', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffd43b'
    }).setOrigin(0.5);

    // 플레이어 정보 패널
    this.createPlayerInfoPanel(20, 80);

    // 마을 장소들
    this.createVillageLocations(width, height);

    // 하단 메뉴
    this.createBottomMenu(width, height);

    // 환영 메시지 (첫 방문시)
    if (!this.registry.get('visitedVillage')) {
      this.registry.set('visitedVillage', true);
      this.showWelcomeMessage();
    }
  }

  /**
   * 플레이어 정보 패널
   */
  createPlayerInfoPanel(x, y) {
    const panel = this.add.rectangle(x, y, 300, 100, 0x16213e, 0.9).setOrigin(0);
    panel.setStrokeStyle(2, 0x4ecdc4);

    const stats = this.player.getDerivedStats();

    this.add.text(x + 15, y + 15, `${this.playerName}`, {
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#ffd43b'
    });

    this.playerInfoText = this.add.text(x + 15, y + 45, '', {
      fontSize: '14px',
      color: '#ffffff',
      lineSpacing: 5
    });

    this.updatePlayerInfo();
  }

  /**
   * 플레이어 정보 업데이트
   */
  updatePlayerInfo() {
    const stats = this.player.getDerivedStats();
    const info = `Lv.${this.player.level} | HP: ${this.player.currentHP}/${stats.hp}\n스탯 포인트: ${this.player.availablePoints}`;
    this.playerInfoText.setText(info);
  }

  /**
   * 마을 장소들
   */
  createVillageLocations(width, height) {
    const startY = 200;
    const locations = [
      {
        icon: '⚔️',
        name: '던전 입구',
        desc: '몬스터와 전투를 벌일 수 있습니다',
        color: '#ff6b6b',
        action: () => this.enterDungeon()
      },
      {
        icon: '🏪',
        name: '상점',
        desc: '아이템을 구매하거나 판매할 수 있습니다 (준비중)',
        color: '#4ecdc4',
        action: () => this.showMessage('상점 기능은 준비중입니다')
      },
      {
        icon: '🏠',
        name: '여관',
        desc: 'HP와 MP를 완전히 회복합니다',
        color: '#845ef7',
        action: () => this.visitInn()
      },
      {
        icon: '👴',
        name: '마을 광장',
        desc: '마을 사람들과 대화할 수 있습니다 (준비중)',
        color: '#ffd43b',
        action: () => this.showMessage('마을 광장 기능은 준비중입니다')
      }
    ];

    locations.forEach((location, index) => {
      const y = startY + (index * 80);
      this.createLocationBox(width / 2, y, location);
    });
  }

  /**
   * 장소 박스 생성
   */
  createLocationBox(x, y, locationData) {
    // 박스
    const box = this.add.rectangle(x, y, 700, 60, 0x16213e, 0.9);
    box.setStrokeStyle(2, locationData.color);
    box.setInteractive({ useHandCursor: true });

    // 아이콘
    this.add.text(x - 320, y, locationData.icon, {
      fontSize: '32px'
    }).setOrigin(0, 0.5);

    // 장소 이름
    this.add.text(x - 270, y - 10, locationData.name, {
      fontSize: '20px',
      fontStyle: 'bold',
      color: locationData.color
    }).setOrigin(0, 0.5);

    // 설명
    this.add.text(x - 270, y + 12, locationData.desc, {
      fontSize: '14px',
      color: '#aaaaaa'
    }).setOrigin(0, 0.5);

    // 호버 효과
    box.on('pointerover', () => {
      box.setFillStyle(locationData.color, 0.2);
      box.setStrokeStyle(3, locationData.color);
    });

    box.on('pointerout', () => {
      box.setFillStyle(0x16213e, 0.9);
      box.setStrokeStyle(2, locationData.color);
    });

    box.on('pointerdown', locationData.action);
  }

  /**
   * 하단 메뉴
   */
  createBottomMenu(width, height) {
    const menuY = height - 60;

    const buttons = [
      { text: '[S] 스테이터스', color: '#4ecdc4', action: () => this.openStatus(), key: 'S' },
      { text: '[I] 인벤토리', color: '#845ef7', action: () => this.showMessage('인벤토리는 준비중입니다'), key: 'I' },
      { text: '[Q] 퀘스트', color: '#ffd43b', action: () => this.showMessage('퀘스트는 준비중입니다'), key: 'Q' },
      { text: '[ESC] 메뉴', color: '#aaaaaa', action: () => this.openGameMenu(), key: 'ESC' }
    ];

    buttons.forEach((btn, index) => {
      const x = 100 + (index * 180);
      const button = this.add.text(x, menuY, btn.text, {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: btn.color,
        padding: { x: 15, y: 8 }
      }).setInteractive({ useHandCursor: true });

      button.on('pointerdown', btn.action);
      button.on('pointerover', () => button.setScale(1.05));
      button.on('pointerout', () => button.setScale(1));

      // 키보드 단축키
      if (btn.key === 'ESC') {
        this.input.keyboard.on('keydown-ESC', btn.action);
      } else {
        this.input.keyboard.on(`keydown-${btn.key}`, btn.action);
      }
    });
  }

  /**
   * 던전 입구
   */
  enterDungeon() {
    // 간단한 전투 선택 UI
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);
    overlay.setInteractive();

    const panel = this.add.rectangle(width / 2, height / 2, 500, 300, 0x16213e);
    panel.setStrokeStyle(3, 0xff6b6b);

    this.add.text(width / 2, height / 2 - 100, '⚔️ 던전 선택', {
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#ff6b6b'
    }).setOrigin(0.5);

    // 몬스터 선택
    const monsters = [
      { type: 'slime', name: '슬라임 (Lv.1)', y: -30 },
      { type: 'goblin', name: '고블린 (Lv.3)', y: 20 }
    ];

    monsters.forEach(monster => {
      const btn = this.add.text(width / 2, height / 2 + monster.y, monster.name, {
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#ff6b6b',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerdown', () => {
        overlay.destroy();
        panel.destroy();
        this.startBattle(monster.type);
      });

      btn.on('pointerover', () => btn.setScale(1.1));
      btn.on('pointerout', () => btn.setScale(1));
    });

    // 취소 버튼
    const cancelBtn = this.add.text(width / 2, height / 2 + 90, '취소', {
      fontSize: '16px',
      color: '#aaaaaa',
      backgroundColor: '#333333',
      padding: { x: 20, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    cancelBtn.on('pointerdown', () => {
      overlay.destroy();
      panel.destroy();
    });

    cancelBtn.on('pointerover', () => cancelBtn.setScale(1.1));
    cancelBtn.on('pointerout', () => cancelBtn.setScale(1));
  }

  /**
   * 전투 시작
   */
  startBattle(monsterType) {
    this.scene.pause();
    this.scene.launch('BattleScene', {
      player: this.player,
      monsterType: monsterType
    });
  }

  /**
   * 여관 방문
   */
  visitInn() {
    const stats = this.player.getDerivedStats();
    this.player.currentHP = stats.hp;
    this.player.currentMP = stats.mp;
    this.player.maxHP = stats.hp;
    this.player.maxMP = stats.mp;

    this.updatePlayerInfo();
    this.showMessage('💤 푹 쉬었습니다! HP와 MP가 완전히 회복되었습니다!');
  }

  /**
   * 스테이터스 열기
   */
  openStatus() {
    this.scene.pause();
    this.scene.launch('StatusScene', { characterStats: this.player });
  }

  /**
   * 게임 메뉴
   */
  openGameMenu() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);
    overlay.setInteractive();

    const panel = this.add.rectangle(width / 2, height / 2, 400, 400, 0x16213e);
    panel.setStrokeStyle(3, 0xffd43b);

    this.add.text(width / 2, height / 2 - 150, '⚙️ 게임 메뉴', {
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#ffd43b'
    }).setOrigin(0.5);

    const menuItems = [
      { text: '계속하기', action: () => { overlay.destroy(); panel.destroy(); } },
      { text: '저장하기', action: () => this.showMessage('저장 기능은 준비중입니다') },
      { text: '불러오기', action: () => this.showMessage('불러오기 기능은 준비중입니다') },
      { text: '설정', action: () => this.showMessage('설정 기능은 준비중입니다') },
      { text: '타이틀로', action: () => this.returnToTitle() }
    ];

    menuItems.forEach((item, index) => {
      const btn = this.add.text(width / 2, height / 2 - 80 + (index * 60), item.text, {
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#333333',
        padding: { x: 40, y: 12 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerdown', item.action);
      btn.on('pointerover', () => {
        btn.setBackgroundColor('#ffd43b');
        btn.setColor('#000000');
      });
      btn.on('pointerout', () => {
        btn.setBackgroundColor('#333333');
        btn.setColor('#ffffff');
      });
    });
  }

  /**
   * 타이틀로 돌아가기
   */
  returnToTitle() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('TitleScene');
    });
  }

  /**
   * 메시지 표시
   */
  showMessage(message) {
    const width = this.cameras.main.width;

    const msgText = this.add.text(width / 2, 150, message, {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 },
      align: 'center'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: msgText,
      alpha: 0,
      y: msgText.y - 50,
      duration: 2000,
      onComplete: () => msgText.destroy()
    });
  }

  /**
   * 환영 메시지
   */
  showWelcomeMessage() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);
    overlay.setInteractive();

    const text = this.add.text(width / 2, height / 2, `${this.playerName}님, 환영합니다!\n\n모험을 시작하세요!`, {
      fontSize: '24px',
      color: '#ffd43b',
      align: 'center',
      lineSpacing: 10
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: [overlay, text],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          overlay.destroy();
          text.destroy();
        }
      });
    });
  }

  /**
   * 씬이 재개될 때
   */
  update() {
    if (this.scene.isActive() && this.playerInfoText) {
      this.updatePlayerInfo();
    }
  }
}
