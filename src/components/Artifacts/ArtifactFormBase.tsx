import QualitySelector from "./QualitySelector";
import DisplayError from "components/UI/DisplayError";
import DropdownSelect, {
  DropdownSelectItem,
} from "components/UI/DropdownSelect";
import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import {
  Artifact,
  Errors,
  Slots,
  StatsBySlots,
  Stars,
  ChampionsList,
  SortedExistingSets,
  Rarity,
  Stat,
  ExistingSlotsAccessories,
  ExistingSlotsArtifacts,
  SortedExistingClans,
} from "models";
import { useDebounceCallback } from "@react-hook/debounce";

import React, { Dispatch, SetStateAction, useMemo } from "react";
import styled from "styled-components";

interface ArtifactFormBaseProps {
  state: Artifact;
  setState: Dispatch<SetStateAction<Artifact>>;
  errors: Errors;
}

const Input = styled.input`
  width: 100%;
`;

const LargeCell = styled.div.attrs(() => ({ className: "col-sm-3" }))``;

const Label = styled.label.attrs(() => ({
  className: "col-sm-2 col-form-label",
}))``;

export default ({
  state,
  setState,
  errors,
}: ArtifactFormBaseProps): JSX.Element => {
  const lang = useLanguage();

  const updateNewArtifact = (key: keyof Artifact, value: string | number) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const onChangeSlot = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSlot = e.target.value as Slots;
    const newArtifact: Partial<Artifact> = { Slot: newSlot };
    newArtifact.MainStatsValue = undefined;

    const newStats = StatsBySlots[newSlot];
    newArtifact.MainStats = Stat.None;
    newArtifact.SubStats = [];

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

  const onChangeSets = (value: DropdownSelectItem) => {
    updateNewArtifact("Set", value.value);
  };

  const onChangeClan = (value: DropdownSelectItem) => {
    updateNewArtifact("Clan", value.value);
  };

  const onChangeLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target?.value as string, 10);
    if (Number.isNaN(newValue)) {
      updateNewArtifact("Level", 0);
    } else {
      updateNewArtifact("Level", newValue);
    }
  };

  const onChangeChampion = (champion: DropdownSelectItem) => {
    updateNewArtifact("Champion", champion.value);
  };

  const selectList = useMemo(
    () =>
      ChampionsList.map((c) => ({
        value: c,
        text: lang[`champion${c}` as keyof Language],
      })),
    [lang]
  );

  const listSets: DropdownSelectItem[] = useMemo(
    () =>
      SortedExistingSets.map((s) => ({
        text: lang[`set${s}` as keyof Language],
        value: s,
      })),
    [lang]
  );

  const listClans: DropdownSelectItem[] = useMemo(
    () =>
      SortedExistingClans.map((s) => ({
        text: lang[`clan${s}` as keyof Language],
        value: s,
      })),
    [lang]
  );

  const level = Number.isNaN(state.Level) ? 0 : state.Level;

  const AvailableSlots = state.isAccessory
    ? ExistingSlotsAccessories
    : ExistingSlotsArtifacts;

  return (
    <>
      <div className="form-group row">
        <Label htmlFor="selectSlot">{lang.titleSlot}</Label>
        <LargeCell>
          <select
            id="selectSlot"
            className="custom-select custom-select-sm"
            onChange={onChangeSlot}
            value={state.Slot}
          >
            {AvailableSlots.map((slot) => (
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
        {state.isAccessory ? (
          <>
            <Label htmlFor="selectClan">{lang.titleClan}</Label>
            <LargeCell>
              <DisplayError slot="Clan" errors={errors} />
              <DropdownSelect
                id="selectClan"
                items={listClans}
                onChange={onChangeClan}
                value={state.Clan}
              />
            </LargeCell>
          </>
        ) : (
          <>
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
          </>
        )}
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
    </>
  );
};
