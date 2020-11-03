export enum Stat {
  None = "",
  HP = "HP",
  HpPercent = "HP%",
  Attack = "ATK",
  AttackPercent = "ATK%",
  Defense = "DEF",
  DefensePercent = "DEF%",
  Speed = "SPD",
  CriticalRate = "C.RATE",
  CriticalDamage = "C.DMG",
  Resistance = "RESI",
  Accuracy = "ACC",
}

export const ExistingStats = [
  Stat.HP,
  Stat.HpPercent,
  Stat.Attack,
  Stat.AttackPercent,
  Stat.Defense,
  Stat.DefensePercent,
  Stat.Speed,
  Stat.CriticalRate,
  Stat.CriticalDamage,
  Stat.Resistance,
  Stat.Accuracy,
];

export interface StatsFull {
  Stats: Stat;
  Value: number;
  Rune: number;
  Roll: number;
}
