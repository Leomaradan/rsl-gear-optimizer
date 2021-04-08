import DisplayError from "../UI/DisplayError";
import Grid from "../UI/Grid";
import Stack from "../UI/Stack";
import {
  BootsStatsExeptFlat,
  ChestplateStatsExeptFlat,
  GauntletsStatsExeptFlat,
  StatsBySlots,
} from "../../data";
import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageStat } from "../../lang/language";
import type { IChampionConfiguration, IErrors, IStat } from "../../models";

import type React from "react";

interface IChampionFormMainStatsProps {
  errors: IErrors;
  setState: React.Dispatch<React.SetStateAction<IChampionConfiguration>>;
  state: IChampionConfiguration;
}

const ChampionConfigurationFormMainStats = ({
  errors,
  setState,
  state,
}: IChampionFormMainStatsProps): JSX.Element => {
  const lang = useLanguage();

  const updateMainStats = (
    event: React.ChangeEvent<HTMLInputElement>,
    slot:
      | "AmuletsStats"
      | "BannersStats"
      | "BootsStats"
      | "ChestplateStats"
      | "GauntletStats"
      | "RingsStats"
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
      <DisplayError errors={errors} slot="gauntletStats" />
      <Grid columns={4}>
        {GauntletsStatsExeptFlat.map((stat) => {
          return (
            <div className="form-check" key={`gauntlet-${stat}`}>
              <input
                checked={state.GauntletStats.includes(stat)}
                className="form-check-input"
                id={`checkGauntlets-${stat}`}
                onChange={updateGauntletStats}
                type="checkbox"
                value={stat}
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
      <DisplayError errors={errors} slot="chestplateStats" />
      <Grid columns={4}>
        {ChestplateStatsExeptFlat.map((stat) => {
          return (
            <div className="form-check" key={`chestplate-${stat}`}>
              <input
                checked={state.ChestplateStats.includes(stat)}
                className="form-check-input"
                id={`checkChestplate-${stat}`}
                onChange={updateChestplateStats}
                type="checkbox"
                value={stat}
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
      <DisplayError errors={errors} slot="bootsStats" />
      <Grid columns={4}>
        {BootsStatsExeptFlat.map((stat) => {
          return (
            <div className="form-check" key={`boots-${stat}`}>
              <input
                checked={state.BootsStats.includes(stat)}
                className="form-check-input"
                id={`checkBoots-${stat}`}
                onChange={updateBootsStats}
                type="checkbox"
                value={stat}
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
      <DisplayError errors={errors} slot="ringsStats" />
      <Grid columns={4}>
        {StatsBySlots.Ring.map((stat) => {
          return (
            <div className="form-check" key={`rings-${stat}`}>
              <input
                checked={state.RingsStats && state.RingsStats.includes(stat)}
                className="form-check-input"
                id={`checkRings-${stat}`}
                onChange={updateRingsStats}
                type="checkbox"
                value={stat}
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
      <DisplayError errors={errors} slot="amuletsStats" />
      <Grid columns={4}>
        {StatsBySlots.Amulet.map((stat) => {
          return (
            <div className="form-check" key={`amulets-${stat}`}>
              <input
                checked={
                  state.AmuletsStats && state.AmuletsStats.includes(stat)
                }
                className="form-check-input"
                id={`checkAmulets-${stat}`}
                onChange={updateAmuletsStats}
                type="checkbox"
                value={stat}
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
      <DisplayError errors={errors} slot="bannersStats" />
      <Grid columns={4}>
        {StatsBySlots.Banner.map((stat) => {
          return (
            <div className="form-check" key={`banners-${stat}`}>
              <input
                checked={
                  state.BannersStats && state.BannersStats.includes(stat)
                }
                className="form-check-input"
                id={`checkBanners-${stat}`}
                onChange={updateBannersStats}
                type="checkbox"
                value={stat}
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
