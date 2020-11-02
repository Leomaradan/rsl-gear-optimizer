import Champions from "raid-data/champions-base-info.json";

const ChampionsList: string[] = [];

if (ChampionsList.length === 0) {
  ChampionsList.push(
    ...Object.keys(Champions).map((c) =>
      c.replace(/[^a-z -]+/gi, "").replace(/[ -]+/gi, "_")
    )
  );
}

export default ChampionsList;
