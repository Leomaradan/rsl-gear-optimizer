import calculateBonus from "./calculateBonus";

import type {
  IArtifact,
  IChampion,
  IGameProgression,
  IGreatHallBonusAffinity,
  IStat,
} from "../models";

const calculateGreatHallStatsPercent = (
  hall: IGreatHallBonusAffinity,
  stat: keyof IGreatHallBonusAffinity,
  championBaseValue = 0
) => {
  let bonusScale;

  const bonusRank = hall[stat];
  switch (stat) {
    case "ATK%":
    case "DEF%":
    case "HP%":
      bonusScale = [0, 2, 3, 4, 6, 8, 10, 12, 14, 17, 20];
      break;
    case "C.DMG":
      bonusScale = [0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 25];
      break;
    default:
      bonusScale = [0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80];
  }

  const bonusStat = bonusScale[bonusRank];

  if (!championBaseValue) {
    return bonusStat;
  }

  return Math.round((bonusStat / 100) * championBaseValue);
};

const calculateStatsPercent = (
  artifacts: IArtifact[],
  statFlat: IStat,
  statPercent?: IStat,
  championBaseValue = 0
): number => {
  return artifacts.reduce((acc, artifact) => {
    let sum = acc;

    if (artifact.MainStats === statFlat) {
      sum += artifact.MainStatsValue ?? 0;
    }

    if (statPercent && artifact.MainStats === statPercent) {
      sum += Math.round(
        ((artifact.MainStatsValue ?? 0) / 100) * championBaseValue
      );
    }

    artifact.SubStats.forEach((subStat) => {
      if (subStat) {
        if (subStat?.Stats === statFlat) {
          sum += subStat.Value + subStat.Rune;
        }

        if (statPercent && subStat?.Stats === statPercent) {
          sum += Math.round(
            ((subStat.Value + subStat.Rune) / 100) * championBaseValue
          );
        }
      }
    });

    return sum;
  }, 0);
};

const calculateSetBonus = (
  champion: IChampion,
  artifacts: IArtifact[],
  multiplier: number
) => {
  const { sets } = calculateBonus(artifacts);
  let hp = 0;
  let attack = 0;
  let defense = 0;
  let speed = 0;
  let criticalRate = 0;
  let criticalDamage = 0;
  let resistance = 0;
  let accuracy = 0;

  sets.forEach((set) => {
    switch (set) {
      case "Cruel":
      case "DivineOffense":
      case "Offense":
        attack += 0.15 * (champion.BaseAttack * multiplier);
        break;
      case "DivineLife":
      case "Immortal":
      case "Life":
        hp += 0.15 * (champion.BaseHP * multiplier);
        break;

      case "Defense":
        defense += 0.15 * (champion.BaseDefense * multiplier);
        break;
      case "DivineSpeed":
      case "Speed":
        speed += 0.12 * (champion.BaseSpeed * multiplier);
        break;

      case "CriticalRate":
      case "DivineCriticalRate":
        criticalRate += 12 * multiplier;
        break;

      case "Accuracy":
        accuracy += 40 * multiplier;
        break;
      case "CriticalDamage":
        criticalDamage += 20 * multiplier;
        break;
      case "Deflection":
        hp += 0.2 * (champion.BaseHP * multiplier);
        defense += 0.2 * (champion.BaseDefense * multiplier);

        break;
      case "Perception":
        accuracy += 40 * multiplier;
        speed += 0.05 * (champion.BaseSpeed * multiplier);
        break;
      case "Resilience":
        hp += 0.1 * (champion.BaseHP * multiplier);
        defense += 0.1 * champion.BaseDefense * multiplier;
        break;
      case "Resistance":
        resistance += 40 * multiplier;
        break;
      case "SwiftParry":
        speed += 0.18 * (champion.BaseSpeed * multiplier);
        criticalDamage += 30 * multiplier;
        break;
      default:
    }
  });

  return {
    accuracy,
    attack,
    criticalDamage,
    criticalRate,
    defense,
    hp,
    resistance,
    speed,
  };
};

const calculateChampionStats = (
  champion: IChampion,
  artifacts: IArtifact[],
  gameProgression: IGameProgression
): Record<
  string,
  {
    base: number;
    artifacts: number;
    hall?: number;
    arena?: number;
    mastery?: number;
    total: number;
  }
> => {
  const hall = gameProgression.greatHallBonus[champion.Affinity];

  let arenaBonus = 0;

  switch (gameProgression.arenaRank) {
    case "B1":
      arenaBonus = 1;
      break;
    case "B2":
      arenaBonus = 2;
      break;
    case "B3":
      arenaBonus = 3;
      break;
    case "B4":
      arenaBonus = 4;
      break;
    case "G1":
      arenaBonus = 14;
      break;
    case "G2":
      arenaBonus = 16;
      break;
    case "G3":
      arenaBonus = 18;
      break;
    case "G4":
      arenaBonus = 20;
      break;
    case "P":
      arenaBonus = 25;
      break;
    case "S1":
      arenaBonus = 6;
      break;
    case "S2":
      arenaBonus = 8;
      break;
    case "S3":
      arenaBonus = 10;
      break;
    case "S4":
      arenaBonus = 12;
      break;
    default:
  }

  const artifactHP = calculateStatsPercent(
    artifacts,
    "HP",
    "HP%",
    champion.BaseHP
  );

  const artifactAttack = calculateStatsPercent(
    artifacts,
    "ATK",
    "ATK%",
    champion.BaseAttack
  );

  const artifactDefense = calculateStatsPercent(
    artifacts,
    "DEF",
    "DEF%",
    champion.BaseDefense
  );

  const artifactSpeed = calculateStatsPercent(artifacts, "SPD");
  const artifactCriticalRate = calculateStatsPercent(artifacts, "C.RATE");
  const artifactCriticalDamage = calculateStatsPercent(artifacts, "C.DMG");
  const artifactResistance = calculateStatsPercent(artifacts, "RESI");
  const artifactAccuracy = calculateStatsPercent(artifacts, "ACC");

  const hallHP = calculateGreatHallStatsPercent(hall, "HP%", champion.BaseHP);
  const hallAttack = calculateGreatHallStatsPercent(
    hall,
    "ATK%",
    champion.BaseAttack
  );
  const hallDefense = calculateGreatHallStatsPercent(
    hall,
    "DEF%",
    champion.BaseDefense
  );
  const hallCriticalDamage = calculateGreatHallStatsPercent(hall, "C.DMG");
  const hallResistance = calculateGreatHallStatsPercent(hall, "RESI");
  const hallAccuracy = calculateGreatHallStatsPercent(hall, "ACC");

  const arenaHP = Math.round(champion.BaseHP * (arenaBonus / 100));
  const arenaAttack = Math.round(champion.BaseAttack * (arenaBonus / 100));
  const arenaDefense = Math.round(champion.BaseDefense * (arenaBonus / 100));

  let masteryHP = 0;
  let masteryAttack = 0;
  let masteryDefense = 0;
  let masteryCRate = 0;
  let masteryCDamage = 0;
  let masteryResistance = 0;
  let masteryAccuracy = 0;

  let bonusMultiplier = 1;

  champion.Masteries.forEach((mastery) => {
    switch (mastery) {
      case "BladeDisciple":
        masteryAttack += 75;
        break;
      case "DeadlyPrecision":
        masteryCRate += 5;
        break;
      case "Defiant":
        masteryResistance += 10;
        break;
      case "EagleEye":
        masteryAccuracy += 50;
        break;
      case "ElixirOfLife":
        masteryHP += 3000;
        break;
      case "FlawlessExecution":
        masteryCDamage += 20;
        break;
      case "IronSkin":
        masteryDefense += 200;
        break;
      case "KeenStrike":
        masteryCDamage += 10;
        break;
      case "LoreOfSteel":
        bonusMultiplier = 1.15;
        break;
      case "PinpointAccuracy":
        masteryAccuracy += 10;
        break;
      case "Steadfast":
        masteryHP += 810;
        break;
      case "ToughSkin":
        masteryDefense += 75;
        break;
      case "Unshakeable":
        masteryResistance += 50;
        break;
      default:
        break;
    }
  });

  const setBonus = calculateSetBonus(champion, artifacts, bonusMultiplier);

  const totalHp =
    champion.BaseHP + artifactHP + setBonus.hp + hallHP + arenaHP + masteryHP;
  const totalAttack =
    champion.BaseAttack +
    artifactAttack +
    setBonus.attack +
    hallAttack +
    arenaAttack +
    masteryAttack;
  const totalDefense =
    champion.BaseDefense +
    artifactDefense +
    setBonus.defense +
    hallDefense +
    arenaDefense +
    masteryDefense;
  const totalSpeed = champion.BaseSpeed + artifactSpeed + setBonus.speed;
  const totalCRate =
    champion.BaseCriticalRate +
    artifactCriticalRate +
    setBonus.criticalRate +
    masteryCRate;
  const totalCDamage =
    champion.BaseCriticalDamage +
    artifactCriticalDamage +
    setBonus.criticalDamage +
    hallCriticalDamage +
    masteryCDamage;
  const totalResi =
    champion.BaseResistance +
    artifactResistance +
    setBonus.resistance +
    hallResistance +
    masteryResistance;
  const totalAccuracy =
    champion.BaseAccuracy +
    artifactAccuracy +
    setBonus.accuracy +
    hallAccuracy +
    masteryAccuracy;

  return {
    ACC: {
      artifacts: artifactAccuracy + setBonus.accuracy,
      base: champion.BaseAccuracy,
      hall: hallAccuracy,
      mastery: masteryAccuracy,
      total: totalAccuracy,
    },
    ATK: {
      arena: arenaAttack,
      artifacts: artifactAttack + setBonus.attack,
      base: champion.BaseAttack,
      hall: hallAttack,
      mastery: masteryAttack,
      total: totalAttack,
    },
    "C.DMG": {
      artifacts: artifactCriticalDamage + setBonus.criticalDamage,
      base: champion.BaseCriticalDamage,
      hall: hallCriticalDamage,
      mastery: masteryCDamage,
      total: totalCDamage,
    },
    "C.RATE": {
      artifacts: artifactCriticalRate + setBonus.criticalRate,
      base: champion.BaseCriticalRate,
      mastery: masteryCRate,
      total: totalCRate,
    },
    DEF: {
      arena: arenaDefense,
      artifacts: artifactDefense + setBonus.defense,
      base: champion.BaseDefense,
      hall: hallDefense,
      mastery: masteryDefense,
      total: totalDefense,
    },
    HP: {
      arena: arenaHP,
      artifacts: artifactHP + setBonus.hp,
      base: champion.BaseHP,
      hall: hallHP,
      mastery: masteryHP,
      total: totalHp,
    },
    RESI: {
      artifacts: artifactResistance + setBonus.resistance,
      base: champion.BaseResistance,
      hall: hallResistance,
      mastery: masteryResistance,
      total: totalResi,
    },
    SPD: {
      artifacts: artifactSpeed + setBonus.speed,
      base: champion.BaseSpeed,
      total: totalSpeed,
    },
  };
};

export default calculateChampionStats;