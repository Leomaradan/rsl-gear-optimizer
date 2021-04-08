import ButtonSwitcher from "components/UI/ButtonSwitcher";
import WrapperRow from "components/UI/WrapperRow";
import type React from "react";
import { Col, Form } from "react-bootstrap";

import { ExistingStatsExeptFlat } from "../../data";
import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageStat } from "../../lang/language";
import type {
  IChampionConfiguration,
  IChampionStatsPriority,
  IErrors,
  IStat,
} from "../../models";
import DisplayError from "../UI/DisplayError";
import Stack from "../UI/Stack";

interface IChampionFormStatsPriorityProps {
  errors: IErrors;
  setState: React.Dispatch<React.SetStateAction<IChampionConfiguration>>;
  state: IChampionConfiguration;
}

const ChampionConfigurationFormStatsPriority = ({
  errors,
  setState,
  state,
}: IChampionFormStatsPriorityProps): JSX.Element => {
  const updateStatsPriority = (stat: IStat) => (value: number) => {
    if (stat && value !== undefined) {
      setState((current) => ({
        ...current,
        StatsPriority: {
          ...current.StatsPriority,
          [stat]: value,
        },
      }));
    }
  };

  const updateStatsMaxPriority = (stat: IStat) => (
    value: number | undefined
  ) => {
    if (stat) {
      setState((current) => ({
        ...current,
        StatsPriority: {
          ...current.StatsPriority,
          [`${stat}_Max`]: value,
        },
      }));
    }
  };

  const lang = useLanguage();

  return (
    <Stack>
      <DisplayError errors={errors} slot="statsPriority" />
      {ExistingStatsExeptFlat.map((stat) => {
        if (stat !== "") {
          const value =
            state.StatsPriority[stat as keyof IChampionStatsPriority] ?? 0;

          const statMax =
            state.StatsPriority[`${stat}_Max` as keyof IChampionStatsPriority];

          const updateStatPriority = updateStatsPriority(stat);
          const updateStatMaxPriority = updateStatsMaxPriority(stat);

          const toggleStatMaxPriority = () => {
            if (statMax !== undefined) {
              updateStatMaxPriority(undefined);
            } else {
              updateStatMaxPriority(0);
            }
          };

          const onChangeStatMaxPriority = (
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            const valueStr = e.target.value ?? "0";

            updateStatMaxPriority(parseInt(valueStr, 10));
          };

          const hasMax = statMax !== undefined;
          return (
            <div className="row" key={`stats-${stat}`}>
              <label className="col-sm-2 col-form-label" htmlFor={stat}>
                {lang.stat[stat as keyof ILanguageStat]}
              </label>
              <div className="col-sm-10">
                <WrapperRow>
                  <ButtonSwitcher
                    onChange={updateStatPriority}
                    name={stat}
                    options={["No priority", "Low", "Middle", "High"]}
                    selectedOption={value}
                  />
                  <Form.Switch
                    type="switch"
                    id={`switch-max-${stat}`}
                    label="Max ?"
                    checked={hasMax}
                    disabled={value === 0}
                    onClick={toggleStatMaxPriority}
                  />
                  {hasMax && (
                    <Col xs={3}>
                      <Form.Control
                        type="number"
                        placeholder="Max"
                        onChange={onChangeStatMaxPriority}
                      />
                    </Col>
                  )}
                </WrapperRow>
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
