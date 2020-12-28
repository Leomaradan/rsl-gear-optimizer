import type { IChampionStatsPriority, IStat } from "models";

const getStatPriority = (
  priority: IChampionStatsPriority,
  baseStat: IStat
): number => {
  let multiplier = 1;
  let stat = baseStat;

  if (stat === "HP") {
    multiplier = 0.2;
    stat = "HP%";
  }

  if (stat === "ATK") {
    multiplier = 0.2;
    stat = "ATK%";
  }

  if (stat === "DEF") {
    multiplier = 0.2;
    stat = "DEF%";
  }

  if (priority[stat as keyof IChampionStatsPriority] && stat !== "") {
    const statPrio = priority[stat as keyof IChampionStatsPriority];
    return multiplier * (statPrio ?? 0);
  }

  return 0;
};

export default getStatPriority;
