/**
 * 몬스터 설정
 * CharacterStats 시스템을 동일하게 사용
 */

export const MonsterConfig = {
  slime: {
    name: '슬라임',
    description: '가장 약한 몬스터',
    color: '#4ecdc4',

    // 캐릭터 스탯 시스템과 동일한 구조
    level: 1,
    baseStats: {
      str: 3,
      dex: 2,
      vit: 4,
      int: 1,
      spr: 2
    },

    // 경험치 보상
    expReward: 10,

    // AI 패턴
    aiPattern: 'basic', // basic: 기본 공격만

    // 드롭 아이템 (추후 구현)
    drops: []
  },

  goblin: {
    name: '고블린',
    description: '약간 강한 몬스터',
    color: '#ff6b6b',

    level: 3,
    baseStats: {
      str: 6,
      dex: 5,
      vit: 6,
      int: 2,
      spr: 3
    },

    expReward: 30,
    aiPattern: 'basic',
    drops: []
  }

  // 추후 추가할 몬스터들
  // orc: { name: '오크', level: 5, ... },
};

/**
 * 레벨별 경험치 테이블
 */
export const ExpTable = {
  // 레벨업에 필요한 경험치 계산 공식
  getRequiredExp: (level) => {
    return Math.floor(100 * Math.pow(1.2, level - 1));
  },

  // 현재 경험치로 레벨 계산
  calculateLevel: (totalExp) => {
    let level = 1;
    let requiredExp = 0;

    while (totalExp >= requiredExp) {
      level++;
      requiredExp += ExpTable.getRequiredExp(level);
    }

    return level - 1;
  }
};
