// eslint-disable-next-line import/no-named-as-default
import produce from "immer";
import React, { useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { useSelector } from "react-redux";

import { AdvancedSets, ExistingSets, SortedExistingSets } from "../../data";
import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageChampion, ILanguageSet } from "../../lang/language";
import type {
  IAccessoriesSlots,
  IChampionConfiguration,
  IChampionSetMethod,
  IErrors,
  ISets,
} from "../../models";
import type { IState } from "../../redux/reducers";
import type { IDropdownSelectItem } from "../UI/DropdownSelect";

const DisplayError = React.lazy(() => import("../UI/DisplayError"));
const DropdownSelect = React.lazy(() => import("../UI/DropdownSelect"));
const Grid = React.lazy(() => import("../UI/Grid"));
const RadioButtons = React.lazy(() => import("../UI/RadioButtons"));
const SetDisplay = React.lazy(() => import("../UI/SetDisplay"));
const Stack = React.lazy(() => import("../UI/Stack"));
const Toggle = React.lazy(() => import("../UI/Toggle"));

interface IChampionFormBasicInfoProps {
  errors: IErrors;
  setState: React.Dispatch<React.SetStateAction<IChampionConfiguration>>;
  state: IChampionConfiguration;
}

const ChampionConfigurationFormBasicInfo = ({
  errors,
  setState,
  state,
}: IChampionFormBasicInfoProps): JSX.Element => {
  const lang = useLanguage();

  const champions = useSelector((redux: IState) => redux.champions.data);

  const updateChampion = (champion: IDropdownSelectItem) => {
    setState((current) => ({
      ...current,
      SourceChampion: parseInt(champion.value, 10),
    }));
  };

  const setSelectorCount = (sets: ISets[]) =>
    sets
      ? sets.reduce((acc, set) => {
          if (AdvancedSets.includes(set)) {
            return acc + 4;
          }
          return acc + 2;
        }, 0)
      : 0;

  const [currentSetsCount, updateCurrentSetCount] = useState(
    setSelectorCount(state.Sets[state.Sets.length - 1])
  );

  let clearDownshift: () => void;
  const getClearDownshift = (clear: () => void) => {
    clearDownshift = clear;
  };

  const AllSets: IDropdownSelectItem[] = useMemo(
    () =>
      ExistingSets.map((s) => ({
        text: lang.set[s as keyof ILanguageSet],
        value: s,
      })),
    [lang]
  );
  const Only2pSets: IDropdownSelectItem[] = useMemo(
    () => AllSets.filter((s) => !AdvancedSets.includes(s.text as ISets)),
    [AllSets]
  );

  useEffect(() => {
    const count = setSelectorCount(state.Sets[state.Sets.length - 1]);
    if (count === 6) {
      setState((current) => ({ ...current, Sets: [...current.Sets, []] }));
    } else {
      updateCurrentSetCount(count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(state.Sets), setState]);

  const selectList = useMemo(
    () =>
      champions.map((c) => ({
        text: lang.champion[c.Name as keyof ILanguageChampion] ?? c.Name,
        value: String(c.Id),
      })),
    [lang, champions]
  );

  const updateSetsAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const setKey = event?.target?.value;

    if (setKey as ISets) {
      setState((current) => {
        let newSets: ISets[][];
        if (current.Sets[0].includes(setKey as ISets)) {
          newSets = [current.Sets[0].filter((s) => s !== setKey)];
        } else {
          newSets = [[...current.Sets[0], setKey].sort() as ISets[]];
        }

        return { ...current, Sets: newSets };
      });
    }
  };

  const updateSetsAdd = (value: null | IDropdownSelectItem) => {
    clearDownshift();

    setState((current) => {
      if (value?.value) {
        const newSets: ISets[][] = produce(
          current.Sets as ISets[][],
          (draftState) => {
            const lastIndex = Math.max(current.Sets.length - 1, 0);

            draftState[lastIndex].push(value.value as ISets);
          }
        );

        return { ...current, Sets: newSets };
      }
      return current;
    });
  };

  const updateSetsRemoveRow = (row: number) => {
    setState((current) => {
      let newSets: ISets[][] = [...current.Sets].filter(
        (_, index) => index !== row
      );

      if (newSets.length === 0) {
        newSets = [[]];
      }
      return { ...current, Sets: newSets };
    });
  };

  const updateSetsRemoveSet = (row: number, set: number) => {
    setState((current) => {
      const newSets: ISets[][] = current.Sets.map((sets, index) => {
        if (index !== row) {
          return sets;
        }

        return sets.filter((_, indexSet) => indexSet !== set);
      }).filter((sets) => sets.length !== 0);

      return { ...current, Sets: [...newSets, []] };
    });
  };

  const updateMethod = (methods: IChampionSetMethod) => {
    setState((current) => {
      const oldMethodSelection =
        current.Methods === "ListSets" || current.Methods === "ListSetsNoBonus";
      const newMethodSelection =
        methods === "ListSets" || methods === "ListSetsNoBonus";

      if (oldMethodSelection !== newMethodSelection) {
        return { ...current, Methods: methods, Sets: [[]] };
      }

      return { ...current, Methods: methods };
    });
  };

  const updateAccessories = (accessories: IAccessoriesSlots | "") => {
    setState((current) => ({ ...current, Accessories: accessories }));
  };

  const toggleActivateChampion = () => {
    setState((current) => ({ ...current, Activated: !current.Activated }));
  };

  const toggleLockChampion = () => {
    setState((current) => ({ ...current, Locked: !current.Locked }));
  };

  return (
    <Stack>
      <DisplayError errors={errors} slot="champion" />
      <div className="form-group row">
        <label className="col-sm-2 col-form-label" htmlFor="inputName">
          {lang.ui.title.champion}
        </label>
        <div className="col-sm-10">
          <DropdownSelect
            items={selectList}
            onChange={updateChampion}
            value={state.SourceChampion}
          />
        </div>
      </div>
      <fieldset className="form-group">
        <div className="row">
          <legend className="col-form-label col-sm-2 pt-0">
            {lang.ui.title.isActivated}
          </legend>
          <div className="col-sm-10">
            <Toggle
              currentState={state.Activated}
              name="toggleActivateChampion"
              onToggle={toggleActivateChampion}
            />
          </div>
        </div>
      </fieldset>
      <fieldset className="form-group">
        <div className="row">
          <legend className="col-form-label col-sm-2 pt-0">
            {lang.ui.title.isLocked}
          </legend>
          <div className="col-sm-10">
            <Toggle
              currentState={state.Locked}
              name="toggleLockedChampion"
              onToggle={toggleLockChampion}
            />
          </div>
        </div>
      </fieldset>
      <DisplayError errors={errors} slot="accessories" />
      <fieldset className="form-group">
        <div className="row">
          <legend className="col-form-label col-sm-2 pt-0">
            {lang.ui.title.availableAccessories}
          </legend>
          <div className="col-sm-10">
            <RadioButtons
              inline
              name="accessoriesRadio"
              onChange={updateAccessories}
              options={[
                {
                  text: lang.ui.common.no,
                  value: "",
                },
                {
                  text: lang.slot.Ring,
                  value: "Ring",
                },
                {
                  text: lang.slot.Amulet,
                  value: "Amulet",
                },
                {
                  text: lang.slot.Banner,
                  value: "Banner",
                },
              ]}
              selectedOption={state.Accessories ?? ""}
            />
          </div>
        </div>
      </fieldset>
      <DisplayError errors={errors} slot="methods" />
      <fieldset className="form-group">
        <div className="row">
          <legend className="col-form-label col-sm-2 pt-0">
            {lang.ui.title.method}
          </legend>
          <div className="col-sm-10">
            <RadioButtons
              inline
              name="methodRadio"
              onChange={updateMethod}
              options={[
                {
                  text: "specific",
                  value: "SpecificSets",
                },
                {
                  text: lang.ui.option.methodRequiredSet,
                  value: "ListSets",
                },
                {
                  text: lang.ui.option.methodOptionalSets,
                  value: "ListSetsNoBonus",
                },
                {
                  text: lang.ui.option.methodNoSets,
                  value: "AllSets",
                },
              ]}
              selectedOption={state.Methods}
            />
          </div>
        </div>
      </fieldset>
      <DisplayError errors={errors} slot="sets" />
      <Grid columns={4}>
        {state.Methods === "SpecificSets" && (
          <Stack>
            {state.Sets.map((sets, indexRow) => {
              const lastLine = indexRow === state.Sets.length - 1;

              if (lastLine) {
                return (
                  <ButtonGroup size="sm">
                    {sets.map((set, index) => {
                      return (
                        <Button
                          key={`${set}-${index}`}
                          onClick={() => {
                            updateSetsRemoveSet(indexRow, index);
                          }}
                          style={{ width: "50px", height: "40px" }}
                          variant="secondary"
                        >
                          <SetDisplay set={set} size={15} />
                          <Trash />
                        </Button>
                      );
                    })}
                  </ButtonGroup>
                );
              }

              return (
                <ButtonGroup key={`group-${indexRow}`} size="sm">
                  {sets.map((set) => {
                    return (
                      <Button
                        disabled
                        key={`${set}-empty`}
                        style={{ width: "50px", height: "40px" }}
                        variant="secondary"
                      >
                        <SetDisplay set={set} size={15} />
                      </Button>
                    );
                  })}
                  {sets.length !== 0 && (
                    <Button
                      onClick={() => {
                        updateSetsRemoveRow(indexRow);
                      }}
                      style={{ width: "50px", height: "40px" }}
                      variant="secondary"
                    >
                      <Trash />
                    </Button>
                  )}
                </ButtonGroup>
              );
            })}
            <DropdownSelect
              getClear={getClearDownshift}
              id="selectSet"
              items={currentSetsCount === 4 ? Only2pSets : AllSets}
              onChange={updateSetsAdd}
            />
          </Stack>
        )}
        {(state.Methods === "ListSets" ||
          state.Methods === "ListSetsNoBonus") &&
          SortedExistingSets.map((set) => {
            const label = (
              <>
                {lang.set[set as keyof ILanguageSet]}{" "}
                <SetDisplay set={set} size={10} />
              </>
            );

            return (
              <div
                className="form-check custom-control custom-checkbox custom-control-inline"
                key={`sets-${set}`}
              >
                <input
                  checked={state.Sets[0].includes(set)}
                  className="custom-control-input"
                  id={`sets-${set}`}
                  onChange={updateSetsAll}
                  type="checkbox"
                  value={set}
                />
                <label className="custom-control-label" htmlFor={`sets-${set}`}>
                  {label}
                </label>
              </div>
            );
          })}
      </Grid>
    </Stack>
  );
};

export default ChampionConfigurationFormBasicInfo;
