import DisplayError from "../UI/DisplayError";
import Stack from "components/UI/Stack";

import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import { ChampionDraft, Errors, ExistingStats, Stat } from "models";
import React from "react";

interface ChampionFormStatsPriorityProps {
  state: ChampionDraft;
  setState: React.Dispatch<React.SetStateAction<ChampionDraft>>;
  errors: Errors;
}

export default ({
  state,
  setState,
  errors,
}: ChampionFormStatsPriorityProps): JSX.Element => {
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
      {ExistingStats.map((stat) => {
        if (stat !== Stat.None) {
          return (
            <div className="row" key={`stats-${stat}`}>
              <label htmlFor={stat} className="col-sm-2 col-form-label">
                {lang[`stat${stat}` as keyof Language]}
              </label>
              <div className="col-sm-10">
                {state.StatsPriority[stat] ?? 0}
                <input
                  type="range"
                  min="0"
                  max="3"
                  className="custom-range"
                  value={state.StatsPriority[stat] ?? 0}
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
