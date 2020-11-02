enum Stats {
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
  Stats.HP,
  Stats.HpPercent,
  Stats.Attack,
  Stats.AttackPercent,
  Stats.Defense,
  Stats.DefensePercent,
  Stats.Speed,
  Stats.CriticalRate,
  Stats.CriticalDamage,
  Stats.Resistance,
  Stats.Accuracy,
];

export interface StatsFull {
  Stats: Stats;
  Value: number;
  Rune: number;
  Roll: number;
}

export default Stats;
