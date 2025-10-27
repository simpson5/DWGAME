import { StatsConfig } from '../data/StatsConfig.js';
import { ExpTable } from '../data/MonsterConfig.js';

/**
 * 캐릭터 능력치 관리 클래스
 */
export default class CharacterStats {
  constructor(className = 'beginner', level = 1) {
    this.className = className;
    this.level = level;

    // 기본 능력치 초기화
    const classData = StatsConfig.classes[className];
    this.baseStats = { ...classData.baseStats };

    // 추가 스탯 (스탯 포인트로 증가한 값)
    this.bonusStats = {
      str: 0,
      dex: 0,
      vit: 0,
      int: 0,
      spr: 0
    };

    // 경험치 시스템
    this.currentExp = 0;
    this.requiredExp = ExpTable.getRequiredExp(this.level);

    // 사용 가능한 스탯 포인트
    this.availablePoints = this.calculateAvailablePoints();

    // 전투용 현재 HP/MP
    const derivedStats = this.getDerivedStats();
    this.currentHP = derivedStats.hp;
    this.currentMP = derivedStats.mp;
    this.maxHP = derivedStats.hp;
    this.maxMP = derivedStats.mp;
    this.name = '플레이어'; // 기본 이름
  }

  /**
   * 현재 레벨에서 사용 가능한 총 스탯 포인트 계산
   */
  calculateAvailablePoints() {
    const totalPoints = (this.level - 1) * StatsConfig.statPointPerLevel;
    const usedPoints = Object.values(this.bonusStats).reduce((sum, val) => sum + val, 0);
    return totalPoints - usedPoints;
  }

  /**
   * 최종 능력치 반환 (기본 + 보너스)
   */
  getFinalStats() {
    return {
      str: this.baseStats.str + this.bonusStats.str,
      dex: this.baseStats.dex + this.bonusStats.dex,
      vit: this.baseStats.vit + this.bonusStats.vit,
      int: this.baseStats.int + this.bonusStats.int,
      spr: this.baseStats.spr + this.bonusStats.spr
    };
  }

  /**
   * 스탯 포인트 할당
   */
  addStat(statName, amount = 1) {
    if (this.availablePoints >= amount && amount > 0) {
      this.bonusStats[statName] += amount;
      this.availablePoints -= amount;
      return true;
    }
    return false;
  }

  /**
   * 스탯 포인트 감소 (재분배)
   */
  removeStat(statName, amount = 1) {
    if (this.bonusStats[statName] >= amount && amount > 0) {
      this.bonusStats[statName] -= amount;
      this.availablePoints += amount;
      return true;
    }
    return false;
  }

  /**
   * 파생 능력치 계산
   */
  getDerivedStats() {
    const stats = this.getFinalStats();
    const derived = {};

    for (const [key, config] of Object.entries(StatsConfig.derivedStats)) {
      derived[key] = config.calculate(stats, this.level);
    }

    return derived;
  }

  /**
   * 모든 능력치 정보 반환
   */
  getAllStats() {
    return {
      level: this.level,
      className: this.className,
      availablePoints: this.availablePoints,
      primaryStats: this.getFinalStats(),
      derivedStats: this.getDerivedStats()
    };
  }

  /**
   * 경험치 획득
   */
  gainExp(amount) {
    this.currentExp += amount;
    const leveledUp = [];

    // 레벨업 체크
    while (this.currentExp >= this.requiredExp && this.level < StatsConfig.MAX_LEVEL) {
      this.currentExp -= this.requiredExp;
      this.level++;
      this.requiredExp = ExpTable.getRequiredExp(this.level);
      this.availablePoints = this.calculateAvailablePoints();

      // HP/MP 최대치 갱신 및 회복
      const derivedStats = this.getDerivedStats();
      this.maxHP = derivedStats.hp;
      this.maxMP = derivedStats.mp;
      this.currentHP = this.maxHP;
      this.currentMP = this.maxMP;

      leveledUp.push(this.level);
    }

    return {
      expGained: amount,
      leveledUp: leveledUp,
      currentLevel: this.level
    };
  }

  /**
   * 레벨업 (수동)
   */
  levelUp() {
    if (this.level < StatsConfig.MAX_LEVEL) {
      this.level++;
      this.requiredExp = ExpTable.getRequiredExp(this.level);
      this.availablePoints = this.calculateAvailablePoints();

      // HP/MP 최대치 갱신
      const derivedStats = this.getDerivedStats();
      this.maxHP = derivedStats.hp;
      this.maxMP = derivedStats.mp;

      return true;
    }
    return false;
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
   * MP 회복
   */
  restoreMP(amount) {
    const restored = Math.min(amount, this.maxMP - this.currentMP);
    this.currentMP = Math.min(this.maxMP, this.currentMP + amount);
    return restored;
  }

  /**
   * 죽었는지 확인
   */
  isDead() {
    return this.currentHP <= 0;
  }

  /**
   * 공격 실행
   */
  attack(target) {
    const attackerStats = this.getDerivedStats();
    const defenderStats = target.stats ? target.stats.getDerivedStats() : target.getDerivedStats();

    // 명중 판정
    const hitChance = attackerStats.accuracy - defenderStats.evasion;
    const hitRoll = Math.random() * 100;

    if (hitRoll > hitChance) {
      return {
        type: 'miss',
        attacker: this.name,
        target: target.name
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
      target: target.name,
      damage: damage,
      isDead: result.isDead
    };
  }

  /**
   * 스탯 초기화
   */
  resetStats() {
    this.bonusStats = {
      str: 0,
      dex: 0,
      vit: 0,
      int: 0,
      spr: 0
    };
    this.availablePoints = this.calculateAvailablePoints();
  }

  /**
   * 저장용 데이터 생성
   */
  toJSON() {
    return {
      className: this.className,
      level: this.level,
      bonusStats: { ...this.bonusStats }
    };
  }

  /**
   * 저장된 데이터에서 복원
   */
  static fromJSON(data) {
    const stats = new CharacterStats(data.className, data.level);
    stats.bonusStats = { ...data.bonusStats };
    stats.availablePoints = stats.calculateAvailablePoints();
    return stats;
  }
}
