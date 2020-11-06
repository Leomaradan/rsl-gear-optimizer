import DisplayError from "../UI/DisplayError";
import Stack from "components/UI/Stack";

import Grid from "components/UI/Grid";

import { useLanguage } from "lang/LanguageContext";
import { Language } from "lang/language";
import { ChampionDraft, Errors, Stat, StatsBySlots } from "models";
import React from "react";

interface ChampionFormMainStatsProps {
  state: ChampionDraft;
  setState: React.Dispatch<React.SetStateAction<ChampionDraft>>;
  errors: Errors;
}

export default ({
  state,
  setState,
  errors,
}: ChampionFormMainStatsProps): JSX.Element => {
  const lang = useLanguage();

  const updateMainStats = (
    event: React.ChangeEvent<HTMLInputElement>,
    slot: "GauntletStats" | "ChestplateStats" | "BootsStats"
  ) => {
    const stat = event?.target?.value as Stat;

    if (stat) {
      setState((current) => {
        let newStats: Stat[];
        if (current[slot].includes(stat)) {
          newStats = current[slot].filter((s) => s !== stat);
        } else {
          newStats = [...current[slot], stat].sort();
        }

        return { ...current, [slot]: newStats };
      });
    }
  };

  const updateGauntletStats = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateMainStats(event, "GauntletStats");
  };

  const updateChestplateStats = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateMainStats(event, "ChestplateStats");
  };

  const updateBootsStats = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateMainStats(event, "BootsStats");
  };

  return (
    <Stack>
      <h2>{lang.slotGauntlets}</h2>
      <DisplayError slot="gauntletStats" errors={errors} />
      <Grid columns={4}>
        {StatsBySlots.Gauntlets.map((stat) => {
          return (
            <div className="form-check" key={`gauntlet-${stat}`}>
              <input
                className="form-check-input"
                type="checkbox"
                value={stat}
                id={`checkGauntlets-${stat}`}
                onChange={updateGauntletStats}
                checked={state.GauntletStats.includes(stat)}
              />
              <label
                className="form-check-label"
                htmlFor={`checkGauntlets-${stat}`}
              >
                {lang[`stat${stat}` as keyof Language]}
              </label>
            </div>
          );
        })}
      </Grid>
      <h2>{lang.slotChestplate}</h2>
      <DisplayError slot="chestplateStats" errors={errors} />
      <Grid columns={4}>
        {StatsBySlots.Chestplate.map((stat) => {
          return (
            <div className="form-check" key={`chestplate-${stat}`}>
              <input
                className="form-check-input"
                type="checkbox"
                value={stat}
                id={`checkChestplate-${stat}`}
                onChange={updateChestplateStats}
                checked={state.ChestplateStats.includes(stat)}
              />
              <label
                className="form-check-label"
                htmlFor={`checkChestplate-${stat}`}
              >
                {lang[`stat${stat}` as keyof Language]}
              </label>
            </div>
          );
        })}
      </Grid>
      <h2>{lang.slotBoots}</h2>
      <DisplayError slot="bootsStats" errors={errors} />
      <Grid columns={4}>
        {StatsBySlots.Boots.map((stat) => {
          return (
            <div className="form-check" key={`boots-${stat}`}>
              <input
                className="form-check-input"
                type="checkbox"
                value={stat}
                id={`checkBoots-${stat}`}
                onChange={updateBootsStats}
                checked={state.BootsStats.includes(stat)}
              />
              <label
                className="form-check-label"
                htmlFor={`checkBoots-${stat}`}
              >
                {lang[`stat${stat}` as keyof Language]}
              </label>
            </div>
          );
        })}
      </Grid>
    </Stack>
  );
};
