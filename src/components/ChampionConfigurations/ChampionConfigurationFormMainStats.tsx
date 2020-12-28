import DisplayError from "../UI/DisplayError";

import Stack from "components/UI/Stack";
import Grid from "components/UI/Grid";
import { useLanguage } from "lang/LanguageContext";
import type { ILanguageStat } from "lang/language";
import {
  GauntletsStatsExeptFlat,
  ChestplateStatsExeptFlat,
  BootsStatsExeptFlat,
  StatsBySlots,
} from "data";
import type { IChampionConfiguration, IErrors, IStat } from "models";

import React from "react";

interface IChampionFormMainStatsProps {
  state: IChampionConfiguration;
  setState: React.Dispatch<React.SetStateAction<IChampionConfiguration>>;
  errors: IErrors;
}

const ChampionConfigurationFormMainStats = ({
  state,
  setState,
  errors,
}: IChampionFormMainStatsProps): JSX.Element => {
  const lang = useLanguage();

  const updateMainStats = (
    event: React.ChangeEvent<HTMLInputElement>,
    slot:
      | "GauntletStats"
      | "ChestplateStats"
      | "BootsStats"
      | "RingsStats"
      | "AmuletsStats"
      | "BannersStats"
  ) => {
    const stat = event?.target?.value as IStat;

    if (stat) {
      setState((current) => {
        let newStats: IStat[];
        if (current[slot]?.includes(stat)) {
          newStats = current[slot]?.filter((s) => s !== stat) ?? [];
        } else {
          newStats = [...(current[slot] ?? []), stat].sort();
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

  const updateRingsStats = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateMainStats(event, "RingsStats");
  };

  const updateAmuletsStats = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateMainStats(event, "AmuletsStats");
  };

  const updateBannersStats = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateMainStats(event, "BannersStats");
  };

  return (
    <Stack>
      <h2>{lang.slot.Gauntlets}</h2>
      <DisplayError slot="gauntletStats" errors={errors} />
      <Grid columns={4}>
        {GauntletsStatsExeptFlat.map((stat) => {
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
                {lang.stat[stat as keyof ILanguageStat]}
              </label>
            </div>
          );
        })}
      </Grid>
      <h2>{lang.slot.Chestplate}</h2>
      <DisplayError slot="chestplateStats" errors={errors} />
      <Grid columns={4}>
        {ChestplateStatsExeptFlat.map((stat) => {
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
                {lang.stat[stat as keyof ILanguageStat]}
              </label>
            </div>
          );
        })}
      </Grid>
      <h2>{lang.slot.Boots}</h2>
      <DisplayError slot="bootsStats" errors={errors} />
      <Grid columns={4}>
        {BootsStatsExeptFlat.map((stat) => {
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
                {lang.stat[stat as keyof ILanguageStat]}
              </label>
            </div>
          );
        })}
      </Grid>
      <h2>{lang.slot.Ring}</h2>
      <DisplayError slot="ringsStats" errors={errors} />
      <Grid columns={4}>
        {StatsBySlots.Ring.map((stat) => {
          return (
            <div className="form-check" key={`rings-${stat}`}>
              <input
                className="form-check-input"
                type="checkbox"
                value={stat}
                id={`checkRings-${stat}`}
                onChange={updateRingsStats}
                checked={state.RingsStats && state.RingsStats.includes(stat)}
              />
              <label
                className="form-check-label"
                htmlFor={`checkRings-${stat}`}
              >
                {lang.stat[stat as keyof ILanguageStat]}
              </label>
            </div>
          );
        })}
      </Grid>
      <h2>{lang.slot.Amulet}</h2>
      <DisplayError slot="amuletsStats" errors={errors} />
      <Grid columns={4}>
        {StatsBySlots.Amulet.map((stat) => {
          return (
            <div className="form-check" key={`amulets-${stat}`}>
              <input
                className="form-check-input"
                type="checkbox"
                value={stat}
                id={`checkAmulets-${stat}`}
                onChange={updateAmuletsStats}
                checked={
                  state.AmuletsStats && state.AmuletsStats.includes(stat)
                }
              />
              <label
                className="form-check-label"
                htmlFor={`checkAmulets-${stat}`}
              >
                {lang.stat[stat as keyof ILanguageStat]}
              </label>
            </div>
          );
        })}
      </Grid>
      <h2>{lang.slot.Banner}</h2>
      <DisplayError slot="bannersStats" errors={errors} />
      <Grid columns={4}>
        {StatsBySlots.Banner.map((stat) => {
          return (
            <div className="form-check" key={`banners-${stat}`}>
              <input
                className="form-check-input"
                type="checkbox"
                value={stat}
                id={`checkBanners-${stat}`}
                onChange={updateBannersStats}
                checked={
                  state.BannersStats && state.BannersStats.includes(stat)
                }
              />
              <label
                className="form-check-label"
                htmlFor={`checkBanners-${stat}`}
              >
                {lang.stat[stat as keyof ILanguageStat]}
              </label>
            </div>
          );
        })}
      </Grid>
    </Stack>
  );
};

export default ChampionConfigurationFormMainStats;
