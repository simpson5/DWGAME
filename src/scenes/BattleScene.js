import Phaser from 'phaser';
import Monster from '../systems/Monster.js';

/**
 * 턴제 전투 씬
 */
export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
    this.player = null;
    this.monster = null;
    this.battleLog = [];
    this.isPlayerTurn = true;
    this.battleEnded = false;
  }

  init(data) {
    this.player = data.player;
    this.monsterType = data.monsterType || 'slime';

    // 몬스터 생성
    this.monster = new Monster(this.monsterType);

    // 전투 상태 초기화
    this.battleLog = [];
    this.isPlayerTurn = true;
    this.battleEnded = false;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 배경
    this.add.rectangle(0, 0, width, height, 0x2d132c).setOrigin(0);

    // UI 생성
    this.createBattleField(width, height);
    this.createPlayerInfo(50, 50);
    this.createMonsterInfo(width - 250, 50);
    this.createBattleLog(50, height - 200);
    this.createActionButtons(width / 2, height - 80);

    // 전투 시작 메시지
    this.addBattleLog(`${this.monster.name}이(가) 나타났다!`);
  }

  /**
   * 전투 필드 생성
   */
  createBattleField(width, height) {
    // 플레이어 영역
    this.playerSprite = this.add.text(width / 4, height / 2 - 50, '플레이어1', {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#4ecdc4'
    }).setOrigin(0.5);

    // 몬스터 영역
    this.monsterSprite = this.add.text(width * 3 / 4, height / 2 - 50, this.monster.name, {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ff6b6b'
    }).setOrigin(0.5);
  }

  /**
   * 플레이어 정보 패널
   */
  createPlayerInfo(x, y) {
    const panel = this.add.rectangle(x, y, 220, 120, 0x16213e, 0.9).setOrigin(0);

    this.add.text(x + 10, y + 10, '플레이어', {
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#4ecdc4'
    });

    this.playerLevelText = this.add.text(x + 10, y + 35, `Lv.${this.player.level}`, {
      fontSize: '14px',
      color: '#ffd43b'
    });

    this.playerHPBar = this.createHPBar(x + 10, y + 60, 200, this.player.currentHP, this.player.maxHP);
    this.playerMPBar = this.createMPBar(x + 10, y + 85, 200, this.player.currentMP, this.player.maxMP);
  }

  /**
   * 몬스터 정보 패널
   */
  createMonsterInfo(x, y) {
    const panel = this.add.rectangle(x, y, 220, 120, 0x16213e, 0.9).setOrigin(0);

    this.add.text(x + 10, y + 10, this.monster.name, {
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ff6b6b'
    });

    this.monsterLevelText = this.add.text(x + 10, y + 35, `Lv.${this.monster.stats.level}`, {
      fontSize: '14px',
      color: '#ffd43b'
    });

    this.monsterHPBar = this.createHPBar(x + 10, y + 60, 200, this.monster.currentHP, this.monster.maxHP);
    this.monsterMPBar = this.createMPBar(x + 10, y + 85, 200, this.monster.currentMP, this.monster.maxMP);
  }

  /**
   * HP 바 생성
   */
  createHPBar(x, y, width, current, max) {
    const barHeight = 16;

    const bg = this.add.rectangle(x, y, width, barHeight, 0x333333).setOrigin(0);

    const fill = this.add.rectangle(x, y, width * (current / max), barHeight, 0xff6b6b).setOrigin(0);

    const text = this.add.text(x + width / 2, y + barHeight / 2, `${current} / ${max}`, {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);

    return { bg, fill, text, current, max };
  }

  /**
   * MP 바 생성
   */
  createMPBar(x, y, width, current, max) {
    const barHeight = 16;

    const bg = this.add.rectangle(x, y, width, barHeight, 0x333333).setOrigin(0);

    const fill = this.add.rectangle(x, y, width * (current / max), barHeight, 0x4dabf7).setOrigin(0);

    const text = this.add.text(x + width / 2, y + barHeight / 2, `${current} / ${max}`, {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);

    return { bg, fill, text, current, max };
  }

  /**
   * 전투 로그 패널
   */
  createBattleLog(x, y) {
    const panel = this.add.rectangle(x, y, 700, 100, 0x16213e, 0.9).setOrigin(0);

    this.battleLogTexts = [];
    for (let i = 0; i < 4; i++) {
      const logText = this.add.text(x + 10, y + 10 + i * 20, '', {
        fontSize: '14px',
        color: '#cccccc'
      });
      this.battleLogTexts.push(logText);
    }
  }

  /**
   * 액션 버튼
   */
  createActionButtons(x, y) {
    this.actionButtons = [];

    const attackBtn = this.createButton(x - 160, y, '공격', '#ff6b6b');
    attackBtn.on('pointerdown', () => this.playerAction('attack'));
    this.actionButtons.push(attackBtn);

    const defendBtn = this.createButton(x - 40, y, '방어', '#4ecdc4');
    defendBtn.on('pointerdown', () => this.playerAction('defend'));
    this.actionButtons.push(defendBtn);

    const skillBtn = this.createButton(x + 80, y, '스킬', '#845ef7');
    skillBtn.on('pointerdown', () => this.playerAction('skill'));
    this.actionButtons.push(skillBtn);

    const runBtn = this.createButton(x + 200, y, '도망', '#aaaaaa');
    runBtn.on('pointerdown', () => this.playerAction('run'));
    this.actionButtons.push(runBtn);
  }

  /**
   * 버튼 생성
   */
  createButton(x, y, text, color) {
    const btn = this.add.text(x, y, text, {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: color,
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setScale(1.05));
    btn.on('pointerout', () => btn.setScale(1));

    return btn;
  }

  /**
   * 플레이어 행동
   */
  playerAction(action) {
    if (!this.isPlayerTurn || this.battleEnded) return;

    this.disableButtons();

    switch (action) {
      case 'attack':
        this.executePlayerAttack();
        break;
      case 'defend':
        this.addBattleLog('방어 태세를 취했다! (미구현)');
        this.endPlayerTurn();
        break;
      case 'skill':
        this.addBattleLog('스킬을 사용했다! (미구현)');
        this.endPlayerTurn();
        break;
      case 'run':
        this.attemptRun();
        break;
    }
  }

  /**
   * 플레이어 공격 실행
   */
  executePlayerAttack() {
    const result = this.player.attack(this.monster);
    // 애니메이션 제거, 즉시 결과 처리
    this.processAttackResult(result, true);
  }

  /**
   * 공격 결과 처리
   */
  processAttackResult(result, isPlayer) {
    if (result.type === 'miss') {
      this.addBattleLog(`${result.attacker}의 공격이 빗나갔다!`);
    } else if (result.type === 'critical') {
      this.addBattleLog(`${result.attacker}의 치명타! ${result.target}에게 ${result.damage} 데미지!`, '#ff6b6b');
    } else {
      this.addBattleLog(`${result.attacker}의 공격! ${result.target}에게 ${result.damage} 데미지!`);
    }

    this.updateUI();

    if (result.isDead) {
      this.time.delayedCall(300, () => {
        if (isPlayer) {
          this.battleVictory();
        } else {
          this.battleDefeat();
        }
      });
    } else {
      // 턴 종료 처리
      this.time.delayedCall(300, () => {
        if (isPlayer) {
          this.endPlayerTurn();
        } else {
          this.endMonsterTurn();
        }
      });
    }
  }

  /**
   * 플레이어 턴 종료
   */
  endPlayerTurn() {
    this.isPlayerTurn = false;

    this.time.delayedCall(500, () => {
      this.monsterTurn();
    });
  }

  /**
   * 몬스터 턴
   */
  monsterTurn() {
    const action = this.monster.decideAction(this.player);

    if (action.type === 'attack') {
      // 애니메이션 제거, 즉시 공격 실행
      const result = this.monster.attack(this.player);
      this.processAttackResult(result, false);
    }
  }

  /**
   * 몬스터 턴 종료
   */
  endMonsterTurn() {
    this.isPlayerTurn = true;
    this.enableButtons();
  }

  /**
   * 버튼 비활성화
   */
  disableButtons() {
    this.actionButtons.forEach(btn => {
      btn.disableInteractive();
      btn.setAlpha(0.5);
    });
  }

  /**
   * 버튼 활성화
   */
  enableButtons() {
    this.actionButtons.forEach(btn => {
      btn.setInteractive();
      btn.setAlpha(1);
    });
  }

  /**
   * 도망 시도
   */
  attemptRun() {
    const runChance = 50 + (this.player.getDerivedStats().dex - this.monster.stats.getDerivedStats().dex);
    const roll = Math.random() * 100;

    if (roll < runChance) {
      this.addBattleLog('도망쳤다!', '#4ecdc4');
      this.time.delayedCall(1000, () => {
        this.endBattle(false);
      });
    } else {
      this.addBattleLog('도망치지 못했다!', '#ff6b6b');
      this.endPlayerTurn();
    }
  }

  /**
   * 전투 승리
   */
  battleVictory() {
    this.battleEnded = true;
    this.addBattleLog(`${this.monster.name}을(를) 물리쳤다!`, '#ffd43b');

    // 경험치 획득
    const expResult = this.player.gainExp(this.monster.expReward);
    this.addBattleLog(`경험치 ${expResult.expGained}을(를) 획득했다!`, '#4ecdc4');

    if (expResult.leveledUp.length > 0) {
      expResult.leveledUp.forEach(level => {
        this.addBattleLog(`레벨 업! Lv.${level}이(가) 되었다!`, '#ff6b6b');
      });
    }

    // 몬스터 텍스트 숨기기
    this.monsterSprite.setVisible(false);

    this.time.delayedCall(2000, () => {
      this.endBattle(true);
    });
  }

  /**
   * 전투 패배
   */
  battleDefeat() {
    this.battleEnded = true;
    this.addBattleLog('전투에서 패배했다...', '#ff6b6b');

    // 플레이어 텍스트 숨기기
    this.playerSprite.setVisible(false);

    this.time.delayedCall(2000, () => {
      // HP 회복 후 복귀
      this.player.currentHP = this.player.maxHP;
      this.endBattle(false);
    });
  }

  /**
   * 전투 종료
   */
  endBattle(victory) {
    this.scene.stop();
    this.scene.resume('GameScene');
  }

  /**
   * 전투 로그 추가
   */
  addBattleLog(message, color = '#ffffff') {
    this.battleLog.push({ text: message, color: color });

    if (this.battleLog.length > 4) {
      this.battleLog.shift();
    }

    this.updateBattleLog();
  }

  /**
   * 전투 로그 업데이트
   */
  updateBattleLog() {
    this.battleLogTexts.forEach((textObj, index) => {
      if (this.battleLog[index]) {
        textObj.setText(this.battleLog[index].text);
        textObj.setColor(this.battleLog[index].color);
      } else {
        textObj.setText('');
      }
    });
  }

  /**
   * UI 업데이트
   */
  updateUI() {
    // 플레이어 HP/MP 업데이트
    this.updateBar(this.playerHPBar, this.player.currentHP, this.player.maxHP);
    this.updateBar(this.playerMPBar, this.player.currentMP, this.player.maxMP);

    // 몬스터 HP/MP 업데이트
    this.updateBar(this.monsterHPBar, this.monster.currentHP, this.monster.maxHP);
    this.updateBar(this.monsterMPBar, this.monster.currentMP, this.monster.maxMP);
  }

  /**
   * 바 업데이트
   */
  updateBar(bar, current, max) {
    const ratio = current / max;
    bar.fill.displayWidth = bar.bg.width * ratio;
    bar.text.setText(`${current} / ${max}`);
    bar.current = current;
    bar.max = max;
  }
}
