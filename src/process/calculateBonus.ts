import { AdvancedSets } from "data";
import type { IArtifact, ISets } from "models";

const calculateBonus = (
  artifacts: IArtifact[]
): { sets: ISets[]; complete: boolean } => {
  const sets = artifacts.map((i) => i.Set).filter((s) => s !== "");
  const activated: ISets[] = [];
  let pieces = 0;

  const uniqueSets = Array.from(new Set<ISets>(sets));

  uniqueSets.forEach((uniqueSet) => {
    const nbSets = sets.filter((s) => s === uniqueSet).length;

    if (AdvancedSets.includes(uniqueSet)) {
      if (nbSets >= 4) {
        activated.push(uniqueSet);
        pieces += 4;
      }
    } else if (nbSets >= 6) {
      activated.push(uniqueSet);
      activated.push(uniqueSet);
      activated.push(uniqueSet);
      pieces += 6;
    } else if (nbSets >= 4) {
      activated.push(uniqueSet);
      activated.push(uniqueSet);
      pieces += 4;
    } else if (nbSets >= 2) {
      activated.push(uniqueSet);
      pieces += 2;
    }
  });

  return { sets: activated, complete: pieces === 6 };
};

export default calculateBonus;
