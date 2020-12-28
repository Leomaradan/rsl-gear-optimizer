import QualitySelector from "./QualitySelector";
import type { IArtifactFormSubProps } from "./ArtifactForm";

import DisplayError from "components/UI/DisplayError";
import DropdownSelect, {
  IDropdownSelectItem,
} from "components/UI/DropdownSelect";
import type {
  ILanguageChampion,
  ILanguageClan,
  ILanguageSet,
  ILanguageSlot,
} from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import type { IArtifact, ISlots, IStars } from "models";
import type { IState } from "redux/reducers";
import {
  StatsBySlots,
  SortedExistingSets,
  SortedExistingClans,
  ExistingSlotsAccessories,
  ExistingSlotsArtifacts,
} from "data";
import Wrapper from "components/UI/Wrapper";

import { useDebounceCallback } from "@react-hook/debounce";
import React, { useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Button, Form, Row } from "react-bootstrap";

const ChampionWrapper = styled(Wrapper)`
  & > div {
    flex: 1;
  }

  & > button {
    height: 31px;
  }
`;

const LargeCell = styled.div.attrs(() => ({ className: "col-sm-3" }))``;

const Label = styled.label.attrs(() => ({
  className: "col-sm-2 col-form-label",
}))``;

const ArtifactFormBase = ({
  state,
  setState,
  errors,
  lockedFields,
}: IArtifactFormSubProps): JSX.Element => {
  const lang = useLanguage();

  const champions = useSelector((redux: IState) => redux.champions);

  const updateNewArtifact = (key: keyof IArtifact, value: string | number) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const onChangeSlot = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSlot = e.target.value as ISlots;
    const newArtifact: Partial<IArtifact> = { Slot: newSlot };
    newArtifact.MainStatsValue = undefined;

    const newStats = StatsBySlots[newSlot];
    newArtifact.MainStats = "";
    newArtifact.SubStats = [];

    if (newStats.length === 1) {
      [newArtifact.MainStats] = newStats;
    }

    setState((current) => ({ ...current, ...(newArtifact as IArtifact) }));
  };

  const onChangeRarity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNewArtifact("Rarity", parseInt(e.target.value, 10));
  };
  const onChangeQuality = useDebounceCallback((num: IStars) => {
    updateNewArtifact("Quality", num);
  });

  const onChangeSets = (value: IDropdownSelectItem) => {
    updateNewArtifact("Set", value.value);
  };

  const onChangeClan = (value: IDropdownSelectItem) => {
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

  const onChangeChampion = (champion: IDropdownSelectItem) => {
    updateNewArtifact("Champion", champion ? champion.value : "");
  };

  const selectList = useMemo(
    () =>
      champions.map((c) => ({
        value: c.Guid,
        text: lang.champion[c.Name as keyof ILanguageChampion],
      })),
    [lang, champions]
  );

  const listSets: IDropdownSelectItem[] = useMemo(
    () =>
      SortedExistingSets.map((s) => ({
        text: lang.set[s as keyof ILanguageSet],
        value: s,
      })),
    [lang]
  );

  const listClans: IDropdownSelectItem[] = useMemo(
    () =>
      SortedExistingClans.map((s) => ({
        text: lang.clan[s as keyof ILanguageClan],
        value: s,
      })),
    [lang]
  );

  const level = Number.isNaN(state.Level) ? 0 : state.Level;

  const AvailableSlots = state.isAccessory
    ? ExistingSlotsAccessories
    : ExistingSlotsArtifacts;

  let clearDownshift = () => {};
  const getClearDownshift = (clear: () => void) => {
    clearDownshift = clear;
  };

  const onEmptyChampion = () => {
    clearDownshift();
  };

  return (
    <>
      <Form.Group as={Row}>
        <Label>{lang.ui.title.slot}</Label>
        <LargeCell>
          <Form.Control
            as="select"
            size="sm"
            custom
            onChange={onChangeSlot}
            disabled={lockedFields.includes("Slot")}
            required
            value={state.Slot}
          >
            {AvailableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {lang.slot[slot as keyof ILanguageSlot]}
              </option>
            ))}
          </Form.Control>
          <DisplayError slot="Slot" errors={errors} />
        </LargeCell>
        <Label>
          {lang.ui.title.champion} ({lang.ui.common.optional})
        </Label>
        <LargeCell>
          <ChampionWrapper>
            <DropdownSelect
              items={selectList}
              value={state.Champion ?? ""}
              getClear={getClearDownshift}
              onChange={onChangeChampion}
              disabled={lockedFields.includes("Champion")}
            />
            <Button
              size="sm"
              onClick={onEmptyChampion}
              disabled={lockedFields.includes("Champion")}
              // eslint-disable-next-line react/jsx-no-literals
            >
              X
            </Button>
          </ChampionWrapper>
          <DisplayError slot="Champion" errors={errors} />
        </LargeCell>
      </Form.Group>

      <Form.Group as={Row}>
        <Label>{lang.ui.title.rarity}</Label>
        <LargeCell>
          <Form.Control
            as="select"
            size="sm"
            custom
            required
            onChange={onChangeRarity}
            disabled={lockedFields.includes("Rarity")}
            value={state.Rarity}
          >
            <option value="Common">{lang.rarity.Common}</option>
            <option value="Uncommon">{lang.rarity.Uncommon}</option>
            <option value="Rare">{lang.rarity.Rare}</option>
            <option value="Epic">{lang.rarity.Epic}</option>
            <option value="Legendary">{lang.rarity.Legendary}</option>
          </Form.Control>
          <DisplayError slot="Rarity" errors={errors} />
        </LargeCell>
        <Label>{lang.ui.title.quality}</Label>
        <LargeCell>
          <QualitySelector
            onChange={onChangeQuality}
            currentQuality={state.Quality}
            disabled={lockedFields.includes("Quality")}
          />
          <DisplayError slot="Quality" errors={errors} />
        </LargeCell>
      </Form.Group>

      <Form.Group as={Row}>
        {state.isAccessory ? (
          <>
            <Label>{lang.ui.title.clan}</Label>
            <LargeCell>
              <DropdownSelect
                id="selectClan"
                items={listClans}
                onChange={onChangeClan}
                value={state.Clan}
                required
                disabled={lockedFields.includes("Clan")}
              />
              <DisplayError slot="Clan" errors={errors} />
            </LargeCell>
          </>
        ) : (
          <>
            <Label>{lang.ui.title.set}</Label>
            <LargeCell>
              <DropdownSelect
                id="selectSet"
                items={listSets}
                onChange={onChangeSets}
                value={state.Set}
                required
                disabled={lockedFields.includes("Set")}
              />
              <DisplayError slot="Set" errors={errors} />
            </LargeCell>
          </>
        )}

        <Label>{lang.ui.title.level}</Label>
        <LargeCell>
          <Form.Control
            type="number"
            size="sm"
            min={0}
            max={16}
            value={level}
            required
            onChange={onChangeLevel}
            disabled={lockedFields.includes("Level")}
          />
          <DisplayError slot="Level" errors={errors} />
        </LargeCell>
      </Form.Group>
    </>
  );
};

export default ArtifactFormBase;
