import ChampionFormBasicInfo from "./ChampionConfigurationFormBasicInfo";
import ChampionFormMainStats from "./ChampionConfigurationFormMainStats";
import ChampionFormStatsPriority from "./ChampionConfigurationFormStatsPriority";

import Modal from "../UI/Modal";
import Tabs, { ITabProps } from "../UI/Tabs";
import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguage, ILanguageChampion } from "../../lang/language";
import type { IChampion, IChampionConfiguration, IErrors } from "../../models";
import {
  createChampionConfigurations,
  updateChampionConfigurations,
} from "../../redux/championConfigurationsSlice";
import type { IState } from "../../redux/reducers";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface IChampionFormProps {
  champion: IChampionConfiguration;
  show: boolean;
  handleClose(): void;
}

const validate = (
  state: IChampionConfiguration,
  setErrors: Dispatch<SetStateAction<IErrors>>,
  lang: ILanguage
): boolean => {
  const errorsList: IErrors = [];

  if (state.SourceChampion.length === 0) {
    errorsList.push({
      slot: "champion",
      text: "errorSelectChampion",
    });
  }

  if (state.Sets.length === 0 && state.Methods !== "AllSets") {
    errorsList.push({
      slot: "sets",
      text: lang.ui.validation.selectSets,
    });
  }

  const statsPrioritySum = Object.keys(state.StatsPriority).reduce(
    (acc, key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return acc + Number((state.StatsPriority as any)[key]);
    },
    0
  );

  if (statsPrioritySum === 0) {
    errorsList.push({
      slot: "statsPriority",
      text: lang.ui.validation.selectStats,
    });
  }

  if (state.GauntletStats.length === 0) {
    errorsList.push({
      slot: "gauntletStats",
      text: lang.ui.validation.selectStatsGauntlets,
    });
  }

  if (state.ChestplateStats.length === 0) {
    errorsList.push({
      slot: "chestplateStats",
      text: lang.ui.validation.selectStatsChestplate,
    });
  }

  if (state.BootsStats.length === 0) {
    errorsList.push({
      slot: "bootsStats",
      text: lang.ui.validation.selectStatsBoots,
    });
  }

  setErrors(errorsList);

  return errorsList.length === 0;
};

const ChampionForm = (props: IChampionFormProps): JSX.Element => {
  const { champion, handleClose, show } = props;

  const dispatch = useDispatch();

  const [state, setState] = useState(champion);
  const [errors, setErrors] = useState<IErrors>([]);

  const lang = useLanguage();

  useEffect(() => {
    setState(champion);
    setErrors([]);
  }, [champion, show]);

  const save = () => {
    const ok = validate(state, setErrors, lang);

    if (ok) {
      let championSaving = state;
      if (championSaving.Methods === "AllSets") {
        championSaving = { ...state, Sets: [[]] };
      }

      if (champion.order !== -1) {
        dispatch(
          updateChampionConfigurations({
            championConfiguration: championSaving,
            id: champion.Guid as string,
          })
        );
      } else {
        dispatch(
          createChampionConfigurations({
            championConfiguration: championSaving,
          })
        );
      }

      handleClose();
    }
  };

  const tabs: ITabProps[] = [
    {
      id: "basic",
      page: (
        <ChampionFormBasicInfo
          errors={errors}
          setState={setState}
          state={state}
        />
      ),
      title: lang.ui.title.baseInfo,
    },
    {
      id: "stats",
      page: (
        <ChampionFormStatsPriority
          errors={errors}
          setState={setState}
          state={state}
        />
      ),
      title: lang.ui.title.statsPriority,
    },
    {
      id: "mainstats",
      page: (
        <ChampionFormMainStats
          errors={errors}
          setState={setState}
          state={state}
        />
      ),
      title: lang.ui.title.mainStats,
    },
  ];

  const sourceChampion = useSelector((redux: IState) =>
    redux.champions.find((c) => c.Guid === state.SourceChampion)
  ) as IChampion;

  return (
    <>
      <Modal
        content={
          <>
            {errors.length > 0 && (
              <div className="alert alert-danger" role="alert">
                {lang.ui.validation.correctErrorBeforeSaving}
              </div>
            )}
            <Tabs tabs={tabs} />
          </>
        }
        onClose={handleClose}
        onSave={save}
        show={show}
        title={
          champion.order !== -1
            ? `${lang.ui.common.editing} ${
                state.SourceChampion
                  ? lang.champion[
                      sourceChampion.Name as keyof ILanguageChampion
                    ]
                  : ""
              }`
            : `${lang.ui.common.adding} ${
                state.SourceChampion
                  ? lang.champion[
                      sourceChampion.Name as keyof ILanguageChampion
                    ]
                  : ""
              }`
        }
      />
    </>
  );
};

export default ChampionForm;
