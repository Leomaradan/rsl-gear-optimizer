import Artifact, { ListOfArtifacts } from "models/Artifact";
import Slots from "models/Slots";
import { ResultsWorkerCommands } from "models/Worker";

const generateTable = (
  artifacts: Artifact[],
  postCommand?: (command: ResultsWorkerCommands) => void
): ListOfArtifacts[] => {
  const results = [];

  let counter = 0;

  const weapons = artifacts.filter((i) => i.Slot === Slots.Weapon);
  const helmets = artifacts.filter((i) => i.Slot === Slots.Helmet);
  const shields = artifacts.filter((i) => i.Slot === Slots.Shield);
  const gauntlets = artifacts.filter((i) => i.Slot === Slots.Gauntlets);
  const chestplates = artifacts.filter((i) => i.Slot === Slots.Chestplate);
  const boots = artifacts.filter((i) => i.Slot === Slots.Boots);

  // tslint:disable: prefer-for-of
  for (let choice1 = 0; choice1 < weapons.length; choice1 += 1) {
    const set1 = weapons[choice1];

    for (let choice2 = 0; choice2 < helmets.length; choice2 += 1) {
      const set2 = helmets[choice2];

      for (let choice3 = 0; choice3 < shields.length; choice3 += 1) {
        const set3 = shields[choice3];

        for (let choice4 = 0; choice4 < gauntlets.length; choice4 += 1) {
          const set4 = gauntlets[choice4];

          for (let choice5 = 0; choice5 < chestplates.length; choice5 += 1) {
            const set5 = chestplates[choice5];

            for (let choice6 = 0; choice6 < boots.length; choice6 += 1) {
              const set6 = boots[choice6];

              const sets = [set1, set2, set3, set4, set5, set6];
              counter += 1;

              if (postCommand && counter % 15000 === 0) {
                postCommand({
                  command: "progress",
                  current: counter,
                  task: "taskGenerateTable",
                });
              }

              results.push(sets);
            }
          }
        }
      }
    }
  }

  return results as ListOfArtifacts[];
};

export default generateTable;
