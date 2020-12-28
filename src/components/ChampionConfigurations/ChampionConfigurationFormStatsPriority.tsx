import DisplayError from "../UI/DisplayError";

import Stack from "components/UI/Stack";
import { useLanguage } from "lang/LanguageContext";
import type {
  IChampionConfiguration,
  IChampionStatsPriority,
  IErrors,
} from "models";
import type { ILanguageStat } from "lang/language";
import { ExistingStatsExeptFlat } from "data";

import React from "react";

interface IChampionFormStatsPriorityProps {
  state: IChampionConfiguration;
  setState: React.Dispatch<React.SetStateAction<IChampionConfiguration>>;
  errors: IErrors;
}

const ChampionConfigurationFormStatsPriority = ({
  state,
  setState,
  errors,
}: IChampionFormStatsPriorityProps): JSX.Element => {
  const updateStatsPriority = (event: React.ChangeEvent<HTMLInputElement>) => {
    const stat = event?.target?.id;
    const value = event?.target?.value;
    if (stat && value !== undefined) {
      setState((current) => ({
        ...current,
        StatsPriority: {
          ...current.StatsPriority,
          [stat]: parseInt(value, 10),
        },
      }));
    }
  };
  const lang = useLanguage();

  return (
    <Stack>
      <DisplayError slot="statsPriority" errors={errors} />
      {ExistingStatsExeptFlat.map((stat) => {
        if (stat !== "") {
          return (
            <div className="row" key={`stats-${stat}`}>
              <label htmlFor={stat} className="col-sm-2 col-form-label">
                {lang.stat[stat as keyof ILanguageStat]}
              </label>
              <div className="col-sm-10">
                {state.StatsPriority[stat as keyof IChampionStatsPriority] ?? 0}
                <input
                  type="range"
                  min="0"
                  max="3"
                  className="custom-range"
                  value={
                    state.StatsPriority[stat as keyof IChampionStatsPriority] ??
                    0
                  }
                  onChange={updateStatsPriority}
                  id={stat}
                />
              </div>
            </div>
          );
        }

        return null;
      })}
    </Stack>
  );
};

export default ChampionConfigurationFormStatsPriority;
