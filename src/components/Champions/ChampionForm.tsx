import ChampionFormBasicInfo from "./ChampionFormBasicInfo";
import ChampionFormMainStats from "./ChampionFormMainStats";
import ChampionFormStatsPriority from "./ChampionFormStatsPriority";
import Tabs, { TabProps } from "components/UI/Tabs";

import Modal from "components/UI/Modal";
import { useLanguage } from "lang/LanguageContext";
import { Language } from "lang/language";
import { ChampionDraft, Errors, ChampionSetMethod } from "models";
import { createChampions, updateChampions } from "redux/championsSlice";
import { useDispatch } from "react-redux";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface ChampionFormProps {
  champion: ChampionDraft & { name?: string };
  show: boolean;
  handleClose(): void;
}

const validate = (
  state: ChampionDraft,
  setErrors: Dispatch<SetStateAction<Errors>>,
  lang: Language
): boolean => {
  const errorsList: Errors = [];

  if (state.Champion.length === 0) {
    errorsList.push({
      slot: "champion",
      text: "errorSelectChampion",
    });
  }

  if (state.Methods < 0 || state.Methods > 2) {
    errorsList.push({
      slot: "methods",
      text: lang.errorSelectMethod,
    });
  }

  if (state.Sets.length === 0 && state.Methods !== ChampionSetMethod.NoSets) {
    errorsList.push({
      slot: "sets",
      text: lang.errorSelectSets,
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
      text: lang.errorSelectStats,
    });
  }

  if (state.GauntletStats.length === 0) {
    errorsList.push({
      slot: "gauntletStats",
      text: lang.errorSelectStatsGauntlets,
    });
  }

  if (state.ChestplateStats.length === 0) {
    errorsList.push({
      slot: "chestplateStats",
      text: lang.errorSelectStatsChestplate,
    });
  }

  if (state.BootsStats.length === 0) {
    errorsList.push({
      slot: "bootsStats",
      text: lang.errorSelectStatsBoots,
    });
  }

  setErrors(errorsList);

  return errorsList.length === 0;
};

const ChampionForm = (props: ChampionFormProps): JSX.Element => {
  const { show, handleClose, champion } = props;

  const dispatch = useDispatch();

  const [state, setState] = useState(champion);
  const [errors, setErrors] = useState<Errors>([]);

  const lang = useLanguage();

  useEffect(() => {
    setState(champion);
    setErrors([]);
  }, [champion, show]);

  const save = () => {
    const ok = validate(state, setErrors, lang);

    if (ok) {
      let championSaving = state;
      if (championSaving.Methods === ChampionSetMethod.NoSets) {
        championSaving = { ...state, Sets: [] };
      }

      if (champion.order !== -1) {
        dispatch(
          updateChampions({
            id: champion.name as string,
            champion: championSaving,
          })
        );
      } else {
        dispatch(createChampions({ champion: championSaving }));
      }

      handleClose();
    }
  };

  const tabs: TabProps[] = [
    {
      id: "basic",
      title: "titleBaseInfo",
      page: (
        <ChampionFormBasicInfo
          errors={errors}
          setState={setState}
          state={state}
        />
      ),
    },
    {
      id: "stats",
      title: "titleStatsPriority",
      page: (
        <ChampionFormStatsPriority
          errors={errors}
          setState={setState}
          state={state}
        />
      ),
    },
    {
      id: "mainstats",
      title: "titleMainStats",
      page: (
        <ChampionFormMainStats
          errors={errors}
          setState={setState}
          state={state}
        />
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          champion.order !== -1
            ? `${lang.commonEditing} ${
                state.Champion
                  ? lang[`champion${state.Champion}` as keyof Language]
                  : ""
              }`
            : `${lang.commonAdding} ${
                state.Champion
                  ? lang[`champion${state.Champion}` as keyof Language]
                  : ""
              }`
        }
        content={
          <>
            {errors.length > 0 && (
              <div className="alert alert-danger" role="alert">
                {lang.errorCorrectErrorBeforeSaving}
              </div>
            )}
            <Tabs tabs={tabs} />
          </>
        }
        onClose={handleClose}
        onSave={save}
        show={show}
      />
    </>
  );
};

export default ChampionForm;
