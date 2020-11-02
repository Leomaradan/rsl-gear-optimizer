/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useDebounceCallback } from "@react-hook/debounce";

import React, { useEffect, useMemo, useState } from "react";

import { useDispatch } from "react-redux";
import styled from "styled-components";
import Artifact, { StatsBySlots } from "models/Artifact";
import { Rarity, Stars } from "models/Quality";
import Sets, { SortedExistingSets } from "models/Sets";
import Slots from "models/Slots";
import Stats, { ExistingStats, StatsFull } from "models/Stats";
import { createArtifacts, updateArtifacts } from "redux/artifactsSlice";
import produce from "immer";

import DropdownSelect, {
  DropdownSelectItem,
} from "components/UI/DropdownSelect";
import { useLanguage } from "lang/LanguageContext";
import { Language } from "lang/language";
import Stack from "components/UI/FlexStack";
import DisplayError from "components/UI/DisplayError";
import Error from "models/Error";

import Stone from "raid-data/images/Misc/Stone.png";
import Wrapper from "components/UI/FlexWrapper";
import ArtifactDisplay from "components/UI/ArtifactDisplay";
import Modal from "components/UI/Modal";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import ChampionsList from "models/ChampionsList";
import StatsSelector from "./StatsSelector";
import QualitySelector from "./QualitySelector";

export interface ArtifactFormProps {
  artifact: Artifact;
  show: boolean;
  handleClose(): void;
}

const Input = styled.input`
  width: 100%;
`;

const Rune = styled.img.attrs(() => ({ src: Stone }))`
  height: 32px;
`;

const MediumCell = styled.div.attrs(() => ({ className: "col-sm-2" }))``;
const LargeCell = styled.div.attrs(() => ({ className: "col-sm-3" }))``;

const Label = styled.label.attrs(() => ({
  className: "col-sm-2 col-form-label",
}))``;

const RuneCell = styled(MediumCell)`
  display: flex;
  gap: 5px;
`;

export const validateArtifact = (
  artifact: Artifact,
  setErrors: (errors: Error) => void
): boolean => {
  const errorsList: Error = [];

  if ((artifact.Level as any) === "") {
    errorsList.push({
      slot: "Level",
      text: "set a level",
    });
  }

  if (artifact.MainStats === Stats.None) {
    errorsList.push({
      slot: "MainStats",
      text: "select a main stats",
    });
  }

  if (artifact.MainStatsValue === undefined) {
    errorsList.push({
      slot: "MainStatValue",
      text: "select a main stats value",
    });
  }

  if (!artifact.Quality) {
    errorsList.push({
      slot: "Quality",
      text: "select a quality",
    });
  }

  if (!artifact.Rarity) {
    errorsList.push({
      slot: "Rarity",
      text: "select a rarity",
    });
  }

  if (!artifact.Set || (artifact.Set as any) === Sets.Null) {
    errorsList.push({
      slot: "Set",
      text: "select a set",
    });
  }

  const subStatMin = Math.max(Math.floor(artifact.Level / 4), artifact.Rarity);

  artifact.SubStats.forEach((stat, index) => {
    const statNumber = index + 1;
    if (
      (!stat || (!stat.Stats as any) === Stats.None) &&
      subStatMin >= statNumber
    ) {
      errorsList.push({
        slot: `SubStat${statNumber}`,
        text: `configure the stat ${statNumber}`,
      });
    }

    if (stat && (!stat.Stats as any) === Stats.None && !stat.Value) {
      errorsList.push({
        slot: `SubStatValue${statNumber}`,
        text: `configure the stat value ${statNumber}`,
      });
    }
  });

  setErrors(errorsList);

  return errorsList.length === 0;
};

const ArtifactForm = (props: ArtifactFormProps): JSX.Element => {
  const { show, handleClose, artifact } = props;

  const dispatch = useDispatch();

  const [state, setState] = useState<Readonly<Artifact>>(artifact);
  const [errors, setErrors] = useState<Error>([]);

  const lang = useLanguage();

  useEffect(() => {
    setState(artifact);
    setErrors([]);
  }, [artifact, show]);

  const save = () => {
    const ok = validateArtifact(state, setErrors);

    if (ok) {
      if (state.Guid !== undefined) {
        dispatch(
          updateArtifacts({
            id: state.Guid as string,
            artifact: state as Artifact,
          })
        );
      } else {
        dispatch(createArtifacts(state));
      }

      handleClose();
    }
  };

  const listSets: DropdownSelectItem[] = useMemo(
    () =>
      SortedExistingSets.map((s) => ({
        text: lang[`set${s}` as keyof Language],
        value: s,
      })),
    [lang]
  );

  const availableStats: Stats[] = StatsBySlots[state.Slot];

  const updateNewArtifact = (key: keyof Artifact, value: any) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const onChangeSlot = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSlot = e.target.value as Slots;
    const newArtifact: Partial<Artifact> = { Slot: newSlot };
    newArtifact.MainStatsValue = undefined;

    const newStats = StatsBySlots[newSlot];
    newArtifact.MainStats = Stats.None;

    if (newStats.length === 1) {
      [newArtifact.MainStats] = newStats;
    }
    setState((current) => ({ ...current, ...(newArtifact as Artifact) }));
  };
  const onChangeRarity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNewArtifact("Rarity", parseInt(e.target.value, 10));
  };
  const onChangeQuality = useDebounceCallback((num: Stars) => {
    updateNewArtifact("Quality", num);
  });

  const onChangeLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target?.value as string, 10);
    if (Number.isNaN(newValue)) {
      updateNewArtifact("Level", 0);
    } else {
      updateNewArtifact("Level", newValue);
    }
  };

  const onChangeMainStats = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNewArtifact("MainStats", e.target.value);
    updateNewArtifact("MainStatsValue", 0);
  };

  const onChangeMainStatsValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNewArtifact("MainStatsValue", parseInt(e.target.value, 10));
  };

  const onChangeSets = (value: DropdownSelectItem) => {
    updateNewArtifact("Set", value.value);
  };

  const onChangeSubStats = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const newStat = e.target.value as Stats;

    const substats = produce(state.SubStats as StatsFull[], (draftState) => {
      if (!draftState[index]) {
        draftState[index] = {} as StatsFull;
      }
      draftState[index].Stats = newStat;
      draftState[index].Value = 0;
      draftState[index].Roll = 0;
      draftState[index].Rune = 0;
    });

    updateNewArtifact("SubStats", substats);
  };

  const onChangeSubStatsValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const substats = produce(state.SubStats as StatsFull[], (draftState) => {
      draftState[index].Value = parseInt(e.target.value, 10);
    });

    updateNewArtifact("SubStats", substats);
  };

  const onChangeSubStatsRolls = (Roll: number, index: number) => {
    const substats = produce(state.SubStats as StatsFull[], (draftState) => {
      draftState[index].Roll = Roll;
    });
    updateNewArtifact("SubStats", substats);
  };

  const onChangeSubStatsRune = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const substats = produce(state.SubStats as StatsFull[], (draftState) => {
      draftState[index].Rune = parseInt(e.target.value, 10);
    });
    updateNewArtifact("SubStats", substats);
  };

  const onChangeChampion = (champion: DropdownSelectItem) => {
    updateNewArtifact("Champion", champion.value);
  };

  const availableSubStats1 = ExistingStats.filter((i) => i !== state.MainStats);
  const availableSubStats2 = availableSubStats1.filter(
    (i) => i !== state.SubStats[0]?.Stats
  );
  const availableSubStats3 = availableSubStats2.filter(
    (i) => i !== state.SubStats[1]?.Stats
  );
  const availableSubStats4 = availableSubStats3.filter(
    (i) => i !== state.SubStats[2]?.Stats
  );

  const availableSubStats = [
    availableSubStats1,
    availableSubStats2,
    availableSubStats3,
    availableSubStats4,
  ];

  const numberRolls = state.SubStats.filter((s) => s).reduce(
    (sum, stat) => sum + (stat?.Roll ?? 0),
    0
  );

  const selectList = useMemo(
    () =>
      ChampionsList.map((c) => ({
        value: c,
        text: lang[`champion${c}` as keyof Language],
      })),
    [lang]
  );

  const level = Number.isNaN(state.Level) ? 0 : state.Level;

  const content = (
    <Stack>
      <div className="form-group row">
        <Label htmlFor="selectSlot">{lang.titleSlot}</Label>
        <LargeCell>
          <select
            id="selectSlot"
            className="custom-select custom-select-sm"
            onChange={onChangeSlot}
            value={state.Slot}
          >
            {[
              Slots.Weapon,
              Slots.Helmet,
              Slots.Shield,
              Slots.Gauntlets,
              Slots.Chestplate,
              Slots.Boots,
            ].map((slot) => (
              <option key={slot} value={slot}>
                {lang[`slot${slot}` as keyof Language]}
              </option>
            ))}
          </select>
        </LargeCell>
        <Label>{lang.titleChampion} (optional)</Label>
        <LargeCell>
          <DropdownSelect
            items={selectList}
            value={state.Champion ?? ""}
            onChange={onChangeChampion}
          />
        </LargeCell>
      </div>

      <div className="form-group row">
        <Label htmlFor="selectRarity">{lang.titleRarity}</Label>
        <LargeCell>
          <DisplayError slot="Rarity" errors={errors} />
          <select
            id="selectRarity"
            className="custom-select custom-select-sm"
            onChange={onChangeRarity}
            value={state.Rarity}
          >
            <option value={Rarity.Common}>{lang.rarityCommon}</option>
            <option value={Rarity.Uncommon}>{lang.rarityUncommon}</option>
            <option value={Rarity.Rare}>{lang.rarityRare}</option>
            <option value={Rarity.Epic}>{lang.rarityEpic}</option>
            <option value={Rarity.Legendary}>{lang.rarityLegendary}</option>
          </select>
        </LargeCell>
        <Label htmlFor="selectQuality">{lang.titleQuality}</Label>
        <LargeCell>
          <DisplayError slot="Quality" errors={errors} />
          <QualitySelector
            onChange={onChangeQuality}
            currentQuality={state.Quality}
          />
        </LargeCell>
      </div>

      <div className="form-group row">
        <Label htmlFor="selectSet">{lang.titleSet}</Label>
        <LargeCell>
          <DisplayError slot="Set" errors={errors} />
          <DropdownSelect
            id="selectSet"
            items={listSets}
            onChange={onChangeSets}
            value={state.Set}
          />
        </LargeCell>
        <Label htmlFor="selectLevel">{lang.titleLevel}</Label>
        <LargeCell>
          <DisplayError slot="Level" errors={errors} />
          <Input
            className="form-control form-control-sm"
            id="selectLevel"
            type="number"
            min={0}
            max={16}
            value={level}
            onChange={onChangeLevel}
          />
        </LargeCell>
      </div>
      <div className="form-group row">
        <Label />
        <LargeCell>
          <strong>{lang.titleStat}</strong>
        </LargeCell>
        <MediumCell>
          <strong>{lang.titleStatValue}</strong>
        </MediumCell>
        <MediumCell>
          <strong>{lang.titleRolls}</strong>
        </MediumCell>
        <MediumCell>
          <strong>{lang.titleRunes}</strong>
        </MediumCell>
      </div>
      <div className="form-group row">
        <Label htmlFor="selectMainStat">{lang.titleMainStats}</Label>
        <LargeCell>
          <DisplayError slot="MainStats" errors={errors} />
          <StatsSelector
            availableStats={availableStats}
            currentStats={state.MainStats}
            onChange={onChangeMainStats}
          />
        </LargeCell>
        <MediumCell>
          <DisplayError slot="MainStatValue" errors={errors} />
          <Input
            className="form-control form-control-sm"
            type="number"
            disabled={state.MainStats === Stats.None}
            min={0}
            value={state.MainStatsValue ?? 0}
            onChange={onChangeMainStatsValue}
          />
        </MediumCell>
      </div>

      {[0, 1, 2, 3].map((statIndex) => {
        const stat = state.SubStats[statIndex];

        const selectDisabled =
          state.SubStats.filter((s) => s?.Stats !== Stats.None)?.length <
          statIndex;
        const valuesDisabled =
          selectDisabled || !stat || stat?.Stats === Stats.None;

        return (
          <div key={`sub-${statIndex}`} className="form-group row">
            <Label>
              {lang[`titleStats${statIndex + 1}` as keyof Language]}
            </Label>
            <LargeCell>
              <DisplayError slot={`SubStat${statIndex + 1}`} errors={errors} />
              <StatsSelector
                availableStats={availableSubStats[statIndex]}
                disabled={selectDisabled}
                currentStats={stat?.Stats}
                onChange={(e) => {
                  onChangeSubStats(e, statIndex);
                }}
              />
            </LargeCell>
            <MediumCell>
              <DisplayError
                slot={`SubStatValue${statIndex + 1}`}
                errors={errors}
              />
              <Input
                className="form-control form-control-sm"
                type="number"
                disabled={valuesDisabled}
                min={0}
                value={stat?.Value ?? 0}
                onChange={(e) => {
                  onChangeSubStatsValue(e, statIndex);
                }}
              />
            </MediumCell>
            <MediumCell>
              <Wrapper>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={stat?.Roll === 0 || valuesDisabled}
                  onClick={() => {
                    onChangeSubStatsRolls((stat?.Roll ?? 0) - 1, statIndex);
                  }}
                >
                  <DashCircle />
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={
                    stat?.Roll === 4 || numberRolls === 4 || valuesDisabled
                  }
                  onClick={() => {
                    onChangeSubStatsRolls((stat?.Roll ?? 0) + 1, statIndex);
                  }}
                >
                  <PlusCircle />
                </button>
                {stat?.Roll}
              </Wrapper>
            </MediumCell>
            <RuneCell>
              <Rune />
              <Input
                className="form-control form-control-sm"
                type="number"
                disabled={valuesDisabled}
                min={0}
                value={stat?.Rune ?? 0}
                onChange={(e) => {
                  onChangeSubStatsRune(e, statIndex);
                }}
              />
            </RuneCell>
          </div>
        );
      })}
      <div className="row justify-content-center">
        <div className="col-sm-1">
          {artifact.Set !== Sets.Null && (
            <ArtifactDisplay artifact={state} size={120} />
          )}
        </div>
      </div>
    </Stack>
  );

  return (
    <>
      <Modal
        title={lang.titleArtifacts}
        content={content}
        onClose={handleClose}
        onSave={save}
        show={show}
      />
    </>
  );
};

export default ArtifactForm;
