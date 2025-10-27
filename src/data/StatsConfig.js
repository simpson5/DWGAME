/**
 * 능력치 시스템 설정
 * 모든 수치는 여기서 수정 가능
 */

export const StatsConfig = {
  // 최대 레벨
  MAX_LEVEL: 100,

  // 직업별 기본 능력치
  classes: {
    beginner: {
      name: '초보자',
      baseStats: {
        str: 5,   // 근력
        dex: 5,   // 민첩
        vit: 5,   // 체력
        int: 5,   // 정신력
        spr: 5    // 영력
      }
    }
    // 추후 다른 직업 추가 가능
    // warrior: { name: '전사', baseStats: { str: 10, dex: 5, vit: 8, int: 3, spr: 4 } },
  },

  // 레벨업 시 획득하는 스탯 포인트
  statPointPerLevel: 5,

  // 기본 능력치 설명
  primaryStats: {
    str: {
      name: '근력',
      shortName: 'STR',
      description: '물리 공격력과 방어력에 영향을 줍니다',
      icon: '💪',
      color: '#ff6b6b'
    },
    dex: {
      name: '민첩',
      shortName: 'DEX',
      description: '명중률, 회피율, 치명타율에 영향을 줍니다',
      icon: '⚡',
      color: '#4ecdc4'
    },
    vit: {
      name: '체력',
      shortName: 'VIT',
      description: 'HP와 물리 방어력에 영향을 줍니다',
      icon: '❤️',
      color: '#ff8787'
    },
    int: {
      name: '정신력',
      shortName: 'INT',
      description: 'MP와 마법 공격력에 영향을 줍니다',
      icon: '🧠',
      color: '#845ef7'
    },
    spr: {
      name: '영력',
      shortName: 'SPR',
      description: 'MP 회복력과 영력 저항력에 영향을 줍니다',
      icon: '✨',
      color: '#ffd43b'
    }
  },

  // 파생 능력치 계산 공식
  // stats = { str, dex, vit, int, spr }
  derivedStats: {
    hp: {
      name: 'HP',
      description: '생명력',
      calculate: (stats, level) => {
        return Math.floor(100 + (stats.vit * 15) + (level * 10));
      },
      color: '#ff6b6b'
    },
    mp: {
      name: 'MP',
      description: '마나',
      calculate: (stats, level) => {
        return Math.floor(50 + (stats.int * 10) + (stats.spr * 5) + (level * 5));
      },
      color: '#4dabf7'
    },
    attack: {
      name: '공격력',
      description: '물리 공격력',
      calculate: (stats, level) => {
        return Math.floor(10 + (stats.str * 2.5) + (stats.dex * 0.5) + (level * 1));
      },
      color: '#ff8787'
    },
    defense: {
      name: '방어력',
      description: '물리 방어력',
      calculate: (stats, level) => {
        return Math.floor(5 + (stats.vit * 2) + (stats.str * 0.5) + (level * 0.5));
      },
      color: '#74c0fc'
    },
    accuracy: {
      name: '명중률',
      description: '공격 명중 확률',
      calculate: (stats, level) => {
        const base = 75;
        return Math.floor(base + (stats.dex * 0.8) + (level * 0.2));
      },
      color: '#ffd43b',
      suffix: '%'
    },
    evasion: {
      name: '회피율',
      description: '공격 회피 확률',
      calculate: (stats, level) => {
        const base = 5;
        return Math.floor(base + (stats.dex * 0.5) + (level * 0.1));
      },
      color: '#4ecdc4',
      suffix: '%'
    },
    critical: {
      name: '치명타율',
      description: '치명타 발생 확률',
      calculate: (stats, level) => {
        const base = 5;
        return Math.floor(base + (stats.dex * 0.3) + (stats.str * 0.1));
      },
      color: '#ff6b6b',
      suffix: '%'
    },
    spiritResist: {
      name: '영력 저항력',
      description: '영력 공격 저항',
      calculate: (stats, level) => {
        return Math.floor(0 + (stats.spr * 2) + (stats.int * 0.5) + (level * 0.3));
      },
      color: '#ffd43b'
    }
  }
};
