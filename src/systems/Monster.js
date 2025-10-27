import CharacterStats from './CharacterStats.js';
import { MonsterConfig } from '../data/MonsterConfig.js';

/**
 * 몬스터 클래스
 * CharacterStats를 상속받아 동일한 능력치 시스템 사용
 */
export default class Monster {
  constructor(monsterType) {
    const config = MonsterConfig[monsterType];
    if (!config) {
      throw new Error(`Unknown monster type: ${monsterType}`);
    }

    this.monsterType = monsterType;
    this.name = config.name;
    this.description = config.description;
    this.color = config.color;
    this.expReward = config.expReward;
    this.aiPattern = config.aiPattern;

    // CharacterStats 시스템 사용
    // 임시로 'monster' 클래스 생성
    this.stats = this.createMonsterStats(config);

    // 현재 HP/MP
    const derivedStats = this.stats.getDerivedStats();
    this.currentHP = derivedStats.hp;
    this.currentMP = derivedStats.mp;
    this.maxHP = derivedStats.hp;
    this.maxMP = derivedStats.mp;
  }

  /**
   * 몬스터용 CharacterStats 생성
   */
  createMonsterStats(config) {
    // 임시로 CharacterStats 인스턴스 생성
    const stats = new CharacterStats('beginner', config.level);

    // 기본 스탯을 몬스터 스탯으로 교체
    stats.baseStats = { ...config.baseStats };
    stats.bonusStats = { str: 0, dex: 0, vit: 0, int: 0, spr: 0 };

    return stats;
  }

  /**
   * 데미지 받기
   */
  takeDamage(damage) {
    this.currentHP = Math.max(0, this.currentHP - damage);
    return {
      damage: damage,
      isDead: this.currentHP <= 0
    };
  }

  /**
   * HP 회복
   */
  heal(amount) {
    const healed = Math.min(amount, this.maxHP - this.currentHP);
    this.currentHP = Math.min(this.maxHP, this.currentHP + amount);
    return healed;
  }

  /**
   * 죽었는지 확인
   */
  isDead() {
    return this.currentHP <= 0;
  }

  /**
   * AI 행동 결정 (기본: 공격만)
   */
  decideAction(player) {
    if (this.aiPattern === 'basic') {
      return { type: 'attack', target: player };
    }
    // 추후 다양한 AI 패턴 추가 가능
    return { type: 'attack', target: player };
  }

  /**
   * 공격 실행
   */
  attack(target) {
    const attackerStats = this.stats.getDerivedStats();

    // 대상이 Monster인지 CharacterStats인지 구분
    const defenderStats = target.stats
      ? target.stats.getDerivedStats()  // Monster
      : target.getDerivedStats();        // CharacterStats (Player)

    // 명중 판정
    const hitChance = attackerStats.accuracy - defenderStats.evasion;
    const hitRoll = Math.random() * 100;

    if (hitRoll > hitChance) {
      return {
        type: 'miss',
        attacker: this.name,
        target: target.name || '플레이어'
      };
    }

    // 치명타 판정
    const critRoll = Math.random() * 100;
    const isCritical = critRoll < attackerStats.critical;

    // 데미지 계산
    let damage = attackerStats.attack - defenderStats.defense;
    damage = Math.max(1, damage); // 최소 1 데미지

    if (isCritical) {
      damage = Math.floor(damage * 1.5);
    }

    // 데미지 적용
    const result = target.takeDamage(damage);

    return {
      type: isCritical ? 'critical' : 'hit',
      attacker: this.name,
      target: target.name || '플레이어',
      damage: damage,
      isDead: result.isDead
    };
  }

  /**
   * 몬스터 정보 반환
   */
  getInfo() {
    const derivedStats = this.stats.getDerivedStats();
    return {
      name: this.name,
      level: this.stats.level,
      currentHP: this.currentHP,
      maxHP: this.maxHP,
      currentMP: this.currentMP,
      maxMP: this.maxMP,
      sprite: this.sprite,
      color: this.color,
      stats: derivedStats
    };
  }
}
