import { AdvancedSets, ListOfArtifacts, Sets } from "models";

const calculateBonus = (
  artifacts: ListOfArtifacts
): { sets: Sets[]; complete: boolean } => {
  const sets = artifacts.map((i) => i.Set).filter((s) => s !== "");
  const activated: Sets[] = [];
  let pieces = 0;

  const uniqueSets = Array.from(new Set<Sets>(sets));

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
