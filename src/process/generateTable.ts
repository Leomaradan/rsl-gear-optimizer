import {
  Artifact,
  ListOfArtifacts,
  ResultsWorkerCommands,
  Slots,
} from "models";

const generateTable = (
  artifacts: Artifact[],
  postCommand?: (command: ResultsWorkerCommands) => void
): ListOfArtifacts[] => {
  const results: ListOfArtifacts[] = [];

  let counter = 0;

  const weapons = artifacts.filter((i) => i.Slot === Slots.Weapon);
  const helmets = artifacts.filter((i) => i.Slot === Slots.Helmet);
  const shields = artifacts.filter((i) => i.Slot === Slots.Shield);
  const gauntlets = artifacts.filter((i) => i.Slot === Slots.Gauntlets);
  const chestplates = artifacts.filter((i) => i.Slot === Slots.Chestplate);
  const boots = artifacts.filter((i) => i.Slot === Slots.Boots);

  weapons.forEach((weapon) => {
    helmets.forEach((helmet) => {
      shields.forEach((shield) => {
        gauntlets.forEach((gauntlet) => {
          chestplates.forEach((chestplate) => {
            boots.forEach((boot) => {
              const sets = [
                weapon,
                helmet,
                shield,
                gauntlet,
                chestplate,
                boot,
              ] as ListOfArtifacts;
              counter += 1;

              if (postCommand && counter % 15000 === 0) {
                postCommand({
                  command: "progress",
                  current: counter,
                  task: "taskGenerateTable",
                });
              }

              results.push(sets);
            });
          });
        });
      });
    });
  });

  return results;
};

export default generateTable;
