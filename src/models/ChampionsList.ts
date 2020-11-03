import Champions from "raid-data/champions-base-info.json";

// eslint-disable-next-line import/prefer-default-export
export const ChampionsList: string[] = [];

if (ChampionsList.length === 0) {
  ChampionsList.push(
    ...Object.keys(Champions).map((c) =>
      c.replace(/[^a-z -]+/gi, "").replace(/[ -]+/gi, "_")
    )
  );
}
