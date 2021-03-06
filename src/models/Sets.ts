export enum Sets {
  Null = "",
  Life = "Life",
  Offense = "Offense",
  Defense = "Defense",
  Speed = "Speed",
  CriticalRate = "CriticalRate",
  CriticalDamage = "CriticalDamage",
  Accuracy = "Accuracy",
  Resistance = "Resistance",
  Lifesteal = "Lifesteal",
  Fury = "Fury",
  Daze = "Daze",
  Cursed = "Cursed",
  Frost = "Frost",
  Frenzy = "Frenzy",
  Regeneration = "Regeneration",
  Immunity = "Immunity",
  Shield = "Shield",
  Relentless = "Relentless",
  Savage = "Savage",
  Destroy = "Destroy",
  Stun = "Stun",
  Toxic = "Toxic",
  Taunting = "Taunting",
  Retaliation = "Retaliation",
  Avenging = "Avenging",
  Stalwart = "Stalwart",
  Reflex = "Reflex",
  Curing = "Curing",
  Cruel = "Cruel",
  Immortal = "Immortal",
  DivineOffense = "DivineOffense",
  DivineCriticalRate = "DivineCriticalRate",
  DivineLife = "DivineLife",
  DivineSpeed = "DivineSpeed",
  SwiftParry = "SwiftParry",
  Deflection = "Deflection",
  Resilience = "Resilience",
  Perception = "Perception",
}
export const ExistingSets: Sets[] = [
  Sets.Life,
  Sets.Offense,
  Sets.Defense,
  Sets.Speed,
  Sets.CriticalRate,
  Sets.CriticalDamage,
  Sets.Accuracy,
  Sets.Resistance,
  Sets.Lifesteal,
  Sets.Fury,
  Sets.Daze,
  Sets.Cursed,
  Sets.Frost,
  Sets.Frenzy,
  Sets.Regeneration,
  Sets.Immunity,
  Sets.Shield,
  Sets.Relentless,
  Sets.Savage,
  Sets.Destroy,
  Sets.Stun,
  Sets.Toxic,
  Sets.Taunting,
  Sets.Retaliation,
  Sets.Avenging,
  Sets.Stalwart,
  Sets.Reflex,
  Sets.Curing,
  Sets.Cruel,
  Sets.Immortal,
  Sets.DivineOffense,
  Sets.DivineCriticalRate,
  Sets.DivineLife,
  Sets.DivineSpeed,
  Sets.SwiftParry,
  Sets.Deflection,
  Sets.Resilience,
  Sets.Perception,
];

export const SortedExistingSets: Sets[] = [...ExistingSets].sort();

export const AdvancedSets = [
  Sets.Lifesteal,
  Sets.Destroy,
  Sets.Retaliation,
  Sets.Fury,
  Sets.Curing,
  Sets.Reflex,
  Sets.Cursed,
  Sets.Toxic,
  Sets.Frost,
  Sets.Daze,
  Sets.Immunity,
  Sets.Avenging,
  Sets.Shield,
  Sets.Stalwart,
  Sets.Frenzy,
  Sets.Regeneration,
  Sets.Stun,
  Sets.Relentless,
  Sets.Savage,
  Sets.Taunting,
  Sets.SwiftParry,
  Sets.Deflection,
];

export const SetsIconName: { [key: string]: string } = {
  [Sets.Life]: "Life",
  [Sets.Offense]: "Offense",
  [Sets.Defense]: "Defense",
  [Sets.Speed]: "Speed",
  [Sets.CriticalRate]: "Critical_Rate",
  [Sets.CriticalDamage]: "Berserker",
  [Sets.Accuracy]: "Accuracy",
  [Sets.Resistance]: "Resistance",
  [Sets.Lifesteal]: "Lifesteal",
  [Sets.Fury]: "Fury",
  [Sets.Daze]: "Daze",
  [Sets.Cursed]: "Cursed",
  [Sets.Frost]: "Frost",
  [Sets.Frenzy]: "Frenzy",
  [Sets.Regeneration]: "Healing",
  [Sets.Immunity]: "Immunity",
  [Sets.Shield]: "Shield",
  [Sets.Relentless]: "Relentless",
  [Sets.Savage]: "Savage",
  [Sets.Destroy]: "Destroy",
  [Sets.Stun]: "Stun",
  [Sets.Toxic]: "Toxic",
  [Sets.Taunting]: "Taunting",
  [Sets.Retaliation]: "Retaliation",
  [Sets.Avenging]: "Avenging",
  [Sets.Stalwart]: "Stalwart",
  [Sets.Reflex]: "Reflex",
  [Sets.Curing]: "Curing",
  [Sets.Cruel]: "Warrior",
  [Sets.Immortal]: "Immortal",
  [Sets.DivineOffense]: "ShieldAndAttackPower",
  [Sets.DivineCriticalRate]: "ShieldAndCriticalChance",
  [Sets.DivineLife]: "ShieldAndHp",
  [Sets.DivineSpeed]: "ShieldAndSpeed",
  [Sets.SwiftParry]: "UnkillableAndSpdAndCrDmg",
  [Sets.Deflection]: "BlockReflectDebuffAndHpAndDef",
  [Sets.Resilience]: "Resilience",
  [Sets.Perception]: "Perception",
};
