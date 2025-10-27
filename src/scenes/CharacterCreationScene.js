import Phaser from 'phaser';
import CharacterStats from '../systems/CharacterStats.js';
import { StatsConfig } from '../data/StatsConfig.js';

/**
 * 캐릭터 생성 씬
 * 이름 입력 및 직업 선택
 */
export default class CharacterCreationScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterCreationScene' });
    this.characterName = '';
    this.selectedClass = 'beginner';
    this.currentStep = 'name'; // 'name' or 'class'
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 배경
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);

    // 타이틀
    this.add.text(width / 2, 50, '캐릭터 생성', {
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#ffd43b'
    }).setOrigin(0.5);

    // 단계 표시
    this.stepText = this.add.text(width / 2, 100, '', {
      fontSize: '18px',
      color: '#4ecdc4'
    }).setOrigin(0.5);

    // 컨테이너 영역
    this.containerY = 150;
    this.container = this.add.container(0, 0);

    // 페이드 인 효과
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // 이름 입력 단계 시작
    this.showNameInput();
  }

  /**
   * 이름 입력 단계
   */
  showNameInput() {
    this.currentStep = 'name';
    this.stepText.setText('1/2 단계: 캐릭터 이름 입력');
    this.container.removeAll(true);

    const width = this.cameras.main.width;

    // 안내 텍스트
    this.container.add(this.add.text(width / 2, this.containerY + 50, '캐릭터 이름을 입력하세요', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5));

    // 이름 표시 박스
    const nameBox = this.add.rectangle(width / 2, this.containerY + 120, 400, 60, 0x16213e);
    nameBox.setStrokeStyle(2, 0x4ecdc4);
    this.container.add(nameBox);

    this.nameDisplayText = this.add.text(width / 2, this.containerY + 120, this.characterName || '|', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.container.add(this.nameDisplayText);

    // 깜빡이는 커서 효과
    this.tweens.add({
      targets: this.nameDisplayText,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // 안내 메시지
    this.container.add(this.add.text(width / 2, this.containerY + 180, '키보드로 이름을 입력하고 Enter를 누르세요', {
      fontSize: '14px',
      color: '#aaaaaa'
    }).setOrigin(0.5));

    // 예시 이름 버튼들
    const exampleNames = ['전사', '마법사', '궁수', '도적'];
    const buttonY = this.containerY + 230;

    this.container.add(this.add.text(width / 2, buttonY, '빠른 선택:', {
      fontSize: '14px',
      color: '#666666'
    }).setOrigin(0.5));

    exampleNames.forEach((name, index) => {
      const btn = this.createSmallButton(
        width / 2 - 150 + (index * 100),
        buttonY + 40,
        name,
        '#845ef7'
      );
      btn.on('pointerdown', () => {
        this.characterName = name;
        this.updateNameDisplay();
      });
      this.container.add(btn);
    });

    // 키보드 입력 처리
    this.input.keyboard.on('keydown', this.handleNameInput, this);
  }

  /**
   * 이름 입력 처리
   */
  handleNameInput(event) {
    if (this.currentStep !== 'name') return;

    if (event.key === 'Enter') {
      if (this.characterName.length > 0) {
        this.input.keyboard.off('keydown', this.handleNameInput, this);
        this.showClassSelection();
      }
    } else if (event.key === 'Backspace') {
      this.characterName = this.characterName.slice(0, -1);
      this.updateNameDisplay();
    } else if (event.key.length === 1 && this.characterName.length < 10) {
      // 한글, 영어, 숫자만 허용
      if (/^[가-힣a-zA-Z0-9]$/.test(event.key)) {
        this.characterName += event.key;
        this.updateNameDisplay();
      }
    }
  }

  /**
   * 이름 표시 업데이트
   */
  updateNameDisplay() {
    if (this.nameDisplayText) {
      this.nameDisplayText.setText(this.characterName || '|');
    }
  }

  /**
   * 직업 선택 단계
   */
  showClassSelection() {
    this.currentStep = 'class';
    this.stepText.setText('2/2 단계: 직업 선택');
    this.container.removeAll(true);

    const width = this.cameras.main.width;

    // 안내 텍스트
    this.container.add(this.add.text(width / 2, this.containerY + 30, '직업을 선택하세요', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5));

    // 직업 정보 박스
    const classY = this.containerY + 100;

    // 초보자 직업 (현재는 하나만)
    this.createClassOption(width / 2, classY, 'beginner');

    // 추후 추가될 직업들 (비활성화)
    const futureClasses = [
      { key: 'warrior', name: '전사', desc: '추후 업데이트' },
      { key: 'mage', name: '마법사', desc: '추후 업데이트' },
      { key: 'archer', name: '궁수', desc: '추후 업데이트' }
    ];

    futureClasses.forEach((classInfo, index) => {
      this.createLockedClassOption(
        width / 4 + (index * width / 4),
        classY + 180,
        classInfo.name,
        classInfo.desc
      );
    });

    // 완료 버튼
    const completeBtn = this.createButton(width / 2, this.containerY + 400, '캐릭터 생성 완료', '#4ecdc4');
    completeBtn.on('pointerdown', () => this.completeCharacterCreation());
    this.container.add(completeBtn);
  }

  /**
   * 직업 옵션 생성
   */
  createClassOption(x, y, classKey) {
    const classData = StatsConfig.classes[classKey];

    // 박스
    const box = this.add.rectangle(x, y, 500, 140, 0x16213e);
    box.setStrokeStyle(3, 0x4ecdc4);
    box.setInteractive({ useHandCursor: true });

    box.on('pointerover', () => {
      box.setStrokeStyle(3, 0xffd43b);
    });

    box.on('pointerout', () => {
      box.setStrokeStyle(3, 0x4ecdc4);
    });

    box.on('pointerdown', () => {
      this.selectedClass = classKey;
    });

    this.container.add(box);

    // 직업 이름
    this.container.add(this.add.text(x, y - 40, classData.name, {
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#ffd43b'
    }).setOrigin(0.5));

    // 기본 스탯 표시
    const statsText = `STR: ${classData.baseStats.str}  DEX: ${classData.baseStats.dex}  VIT: ${classData.baseStats.vit}\nINT: ${classData.baseStats.int}  SPR: ${classData.baseStats.spr}`;

    this.container.add(this.add.text(x, y + 10, statsText, {
      fontSize: '16px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5));

    // 설명
    this.container.add(this.add.text(x, y + 50, '모든 능력치가 균형잡힌 초보자용 직업', {
      fontSize: '14px',
      color: '#aaaaaa',
      align: 'center'
    }).setOrigin(0.5));
  }

  /**
   * 잠긴 직업 옵션 생성
   */
  createLockedClassOption(x, y, name, desc) {
    const box = this.add.rectangle(x, y, 150, 80, 0x0f0f0f);
    box.setStrokeStyle(2, 0x333333);
    box.setAlpha(0.5);
    this.container.add(box);

    this.container.add(this.add.text(x, y - 15, name, {
      fontSize: '18px',
      color: '#666666'
    }).setOrigin(0.5));

    this.container.add(this.add.text(x, y + 10, '🔒', {
      fontSize: '20px'
    }).setOrigin(0.5));

    this.container.add(this.add.text(x, y + 30, desc, {
      fontSize: '12px',
      color: '#666666'
    }).setOrigin(0.5));
  }

  /**
   * 버튼 생성 헬퍼
   */
  createButton(x, y, text, color) {
    const btn = this.add.text(x, y, text, {
      fontSize: '22px',
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
   * 작은 버튼 생성 헬퍼
   */
  createSmallButton(x, y, text, color) {
    const btn = this.add.text(x, y, text, {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: color,
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setScale(1.1));
    btn.on('pointerout', () => btn.setScale(1));

    return btn;
  }

  /**
   * 캐릭터 생성 완료
   */
  completeCharacterCreation() {
    // 캐릭터 스탯 생성
    const character = new CharacterStats(this.selectedClass, 1);
    character.name = this.characterName;

    // 게임 데이터에 저장 (전역 객체 사용)
    this.registry.set('playerCharacter', character);
    this.registry.set('playerName', this.characterName);

    // 페이드 아웃 후 마을로 이동
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('VillageScene');
    });
  }
}
