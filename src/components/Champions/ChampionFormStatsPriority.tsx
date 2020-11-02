import React from "react";

import Stats, { ExistingStats } from "models/Stats";
import Stack from "components/UI/FlexStack";
import Error from "models/Error";
import { ChampionDraft } from "models/Champion";

import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import DisplayError from "../UI/DisplayError";

export interface ChampionFormStatsPriorityProps {
  state: ChampionDraft;
  setState: React.Dispatch<React.SetStateAction<ChampionDraft>>;
  errors: Error;
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
        statsPriority: {
          ...current.statsPriority,
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
        if (stat !== Stats.None) {
          return (
            <div className="row" key={`stats-${stat}`}>
              <label htmlFor={stat} className="col-sm-2 col-form-label">
                {lang[`stat${stat}` as keyof Language]}
              </label>
              <div className="col-sm-10">
                {state.statsPriority[stat] ?? 0}
                <input
                  type="range"
                  min="0"
                  max="3"
                  className="custom-range"
                  value={state.statsPriority[stat] ?? 0}
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
