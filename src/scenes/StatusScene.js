import Phaser from 'phaser';
import CharacterStats from '../systems/CharacterStats.js';
import { StatsConfig } from '../data/StatsConfig.js';

/**
 * 스테이터스 UI 씬
 */
export default class StatusScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StatusScene' });
    this.characterStats = null;
    this.uiElements = {};
  }

  init(data) {
    // 캐릭터 스탯 초기화 (데이터가 없으면 새로 생성)
    if (data && data.characterStats) {
      this.characterStats = data.characterStats;
    } else {
      this.characterStats = new CharacterStats('beginner', 10); // 테스트용 레벨 10
    }
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 배경
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);

    // UI 컨테이너
    this.createHeader(width);
    this.createPrimaryStatsPanel(50, 100);
    this.createDerivedStatsPanel(450, 100);
    this.createControlButtons(width, height);

    // 초기 업데이트
    this.updateAllStats();
  }

  /**
   * 헤더 생성 (레벨, 직업, 스탯 포인트)
   */
  createHeader(width) {
    const allStats = this.characterStats.getAllStats();
    const classData = StatsConfig.classes[allStats.className];

    // 타이틀
    this.add.text(width / 2, 30, '캐릭터 정보', {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 레벨 & 직업
    this.uiElements.levelText = this.add.text(50, 60, `Lv.${allStats.level} ${classData.name}`, {
      fontSize: '24px',
      color: '#ffd43b'
    });

    // 스탯 포인트
    this.uiElements.pointsText = this.add.text(width - 50, 60, `스탯 포인트: ${allStats.availablePoints}`, {
      fontSize: '20px',
      color: '#4ecdc4'
    }).setOrigin(1, 0);
  }

  /**
   * 기본 능력치 패널
   */
  createPrimaryStatsPanel(x, y) {
    // 패널 배경
    const panel = this.add.rectangle(x, y, 350, 400, 0x16213e, 0.8).setOrigin(0);

    // 패널 타이틀
    this.add.text(x + 175, y + 20, '기본 능력치', {
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.uiElements.primaryStats = {};
    let yOffset = y + 60;

    // 각 능력치 행 생성
    for (const [key, config] of Object.entries(StatsConfig.primaryStats)) {
      this.createStatRow(x + 20, yOffset, key, config);
      yOffset += 60;
    }
  }

  /**
   * 능력치 행 생성 (아이콘, 이름, 값, +/- 버튼)
   */
  createStatRow(x, y, statKey, config) {
    const stats = this.characterStats.getFinalStats();
    const bonusStats = this.characterStats.bonusStats;

    // 아이콘
    this.add.text(x, y, config.icon, { fontSize: '24px' });

    // 능력치 이름
    this.add.text(x + 40, y, config.name, {
      fontSize: '18px',
      color: config.color
    });

    // 능력치 값
    const valueText = `${stats[statKey]}`;
    const bonusText = bonusStats[statKey] > 0 ? ` (+${bonusStats[statKey]})` : '';

    this.uiElements.primaryStats[statKey] = this.add.text(x + 140, y, valueText + bonusText, {
      fontSize: '18px',
      color: '#ffffff'
    });

    // - 버튼
    const minusBtn = this.add.text(x + 220, y - 5, '[-]', {
      fontSize: '20px',
      color: '#ff6b6b'
    }).setInteractive({ useHandCursor: true });

    minusBtn.on('pointerdown', () => {
      if (this.characterStats.removeStat(statKey)) {
        this.updateAllStats();
      }
    });

    minusBtn.on('pointerover', () => minusBtn.setColor('#ff4757'));
    minusBtn.on('pointerout', () => minusBtn.setColor('#ff6b6b'));

    // + 버튼
    const plusBtn = this.add.text(x + 270, y - 5, '[+]', {
      fontSize: '20px',
      color: '#4ecdc4'
    }).setInteractive({ useHandCursor: true });

    plusBtn.on('pointerdown', () => {
      if (this.characterStats.addStat(statKey)) {
        this.updateAllStats();
      }
    });

    plusBtn.on('pointerover', () => plusBtn.setColor('#1dd1a1'));
    plusBtn.on('pointerout', () => plusBtn.setColor('#4ecdc4'));

    // 설명 (호버시 표시)
    const hoverZone = this.add.rectangle(x, y, 200, 30, 0x000000, 0).setOrigin(0, 0.5);
    hoverZone.setInteractive();

    const tooltip = this.add.text(x, y + 25, config.description, {
      fontSize: '12px',
      color: '#aaaaaa',
      wordWrap: { width: 300 }
    }).setVisible(false);

    hoverZone.on('pointerover', () => tooltip.setVisible(true));
    hoverZone.on('pointerout', () => tooltip.setVisible(false));
  }

  /**
   * 파생 능력치 패널
   */
  createDerivedStatsPanel(x, y) {
    // 패널 배경
    this.add.rectangle(x, y, 300, 400, 0x16213e, 0.8).setOrigin(0);

    // 패널 타이틀
    this.add.text(x + 150, y + 20, '전투 능력치', {
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.uiElements.derivedStats = {};
    let yOffset = y + 60;

    // 각 파생 능력치 표시
    for (const [key, config] of Object.entries(StatsConfig.derivedStats)) {
      this.createDerivedStatRow(x + 20, yOffset, key, config);
      yOffset += 40;
    }
  }

  /**
   * 파생 능력치 행 생성
   */
  createDerivedStatRow(x, y, statKey, config) {
    const derivedStats = this.characterStats.getDerivedStats();

    // 능력치 이름
    this.add.text(x, y, config.name, {
      fontSize: '16px',
      color: config.color
    });

    // 능력치 값
    const value = derivedStats[statKey];
    const suffix = config.suffix || '';

    this.uiElements.derivedStats[statKey] = this.add.text(x + 180, y, `${value}${suffix}`, {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(1, 0);

    // 설명 툴팁
    const hoverZone = this.add.rectangle(x, y, 250, 25, 0x000000, 0).setOrigin(0, 0.5);
    hoverZone.setInteractive();

    const tooltip = this.add.text(x, y + 20, config.description, {
      fontSize: '12px',
      color: '#aaaaaa'
    }).setVisible(false);

    hoverZone.on('pointerover', () => tooltip.setVisible(true));
    hoverZone.on('pointerout', () => tooltip.setVisible(false));
  }

  /**
   * 하단 컨트롤 버튼
   */
  createControlButtons(width, height) {
    const buttonY = height - 60;

    // 스탯 초기화 버튼
    const resetBtn = this.createButton(width / 2 - 120, buttonY, '스탯 초기화', '#ff6b6b');
    resetBtn.on('pointerdown', () => {
      this.characterStats.resetStats();
      this.updateAllStats();
    });

    // 레벨업 버튼 (테스트용)
    const levelUpBtn = this.createButton(width / 2 + 120, buttonY, '레벨업 (테스트)', '#4ecdc4');
    levelUpBtn.on('pointerdown', () => {
      if (this.characterStats.levelUp()) {
        this.updateAllStats();
      }
    });

    // 닫기 버튼
    const closeBtn = this.createButton(width - 100, 30, '닫기', '#aaaaaa');
    closeBtn.on('pointerdown', () => {
      this.scene.stop();
      this.scene.resume('GameScene');
    });
  }

  /**
   * 버튼 생성 헬퍼
   */
  createButton(x, y, text, color) {
    const btn = this.add.text(x, y, text, {
      fontSize: '18px',
      color: color,
      backgroundColor: '#0f0f0f',
      padding: { x: 15, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setScale(1.05));
    btn.on('pointerout', () => btn.setScale(1));

    return btn;
  }

  /**
   * 모든 능력치 UI 업데이트
   */
  updateAllStats() {
    const allStats = this.characterStats.getAllStats();

    // 헤더 업데이트
    const classData = StatsConfig.classes[allStats.className];
    this.uiElements.levelText.setText(`Lv.${allStats.level} ${classData.name}`);
    this.uiElements.pointsText.setText(`스탯 포인트: ${allStats.availablePoints}`);

    // 기본 능력치 업데이트
    for (const [key, textObj] of Object.entries(this.uiElements.primaryStats)) {
      const value = allStats.primaryStats[key];
      const bonus = this.characterStats.bonusStats[key];
      const bonusText = bonus > 0 ? ` (+${bonus})` : '';
      textObj.setText(`${value}${bonusText}`);
    }

    // 파생 능력치 업데이트
    for (const [key, textObj] of Object.entries(this.uiElements.derivedStats)) {
      const config = StatsConfig.derivedStats[key];
      const value = allStats.derivedStats[key];
      const suffix = config.suffix || '';
      textObj.setText(`${value}${suffix}`);
    }
  }
}
