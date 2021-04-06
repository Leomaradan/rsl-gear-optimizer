import type { IArtifactFormSubProps } from "./ArtifactForm";
import QualitySelector from "./QualitySelector";

import DisplayError from "../UI/DisplayError";
import DropdownSelect, { IDropdownSelectItem } from "../UI/DropdownSelect";
import Wrapper from "../UI/Wrapper";
import {
  ExistingSlotsAccessories,
  ExistingSlotsArtifacts,
  SortedExistingClans,
  SortedExistingSets,
  StatsBySlots,
} from "../../data";
import { useLanguage } from "../../lang/LanguageContext";
import type {
  ILanguageChampion,
  ILanguageClan,
  ILanguageSet,
  ILanguageSlot,
} from "../../lang/language";
import type { IArtifact, ISlots, IStars } from "../../models";
import type { IState } from "../../redux/reducers";

import { useDebounceCallback } from "@react-hook/debounce";
import React, { useMemo } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import styled from "styled-components";

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
  errors,
  lockedFields,
  setState,
  state,
}: IArtifactFormSubProps): JSX.Element => {
  const lang = useLanguage();

  const champions = useSelector((redux: IState) => redux.champions);

  const updateNewArtifact = (key: keyof IArtifact, value: number | string) => {
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
        text: lang.champion[c.Name as keyof ILanguageChampion],
        value: c.Guid,
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
            custom
            disabled={lockedFields.includes("Slot")}
            onChange={onChangeSlot}
            required
            size="sm"
            value={state.Slot}
          >
            {AvailableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {lang.slot[slot as keyof ILanguageSlot]}
              </option>
            ))}
          </Form.Control>
          <DisplayError errors={errors} slot="Slot" />
        </LargeCell>
        <Label>
          {lang.ui.title.champion} ({lang.ui.common.optional})
        </Label>
        <LargeCell>
          <ChampionWrapper>
            <DropdownSelect
              disabled={lockedFields.includes("Champion")}
              getClear={getClearDownshift}
              items={selectList}
              onChange={onChangeChampion}
              value={state.Champion ?? ""}
            />
            <Button
              disabled={lockedFields.includes("Champion")}
              onClick={onEmptyChampion}
              size="sm"
              // eslint-disable-next-line react/jsx-no-literals
            >
              X
            </Button>
          </ChampionWrapper>
          <DisplayError errors={errors} slot="Champion" />
        </LargeCell>
      </Form.Group>

      <Form.Group as={Row}>
        <Label>{lang.ui.title.rarity}</Label>
        <LargeCell>
          <Form.Control
            as="select"
            custom
            disabled={lockedFields.includes("Rarity")}
            onChange={onChangeRarity}
            required
            size="sm"
            value={state.Rarity}
          >
            <option value="Common">{lang.rarity.Common}</option>
            <option value="Uncommon">{lang.rarity.Uncommon}</option>
            <option value="Rare">{lang.rarity.Rare}</option>
            <option value="Epic">{lang.rarity.Epic}</option>
            <option value="Legendary">{lang.rarity.Legendary}</option>
          </Form.Control>
          <DisplayError errors={errors} slot="Rarity" />
        </LargeCell>
        <Label>{lang.ui.title.quality}</Label>
        <LargeCell>
          <QualitySelector
            currentQuality={state.Quality}
            disabled={lockedFields.includes("Quality")}
            onChange={onChangeQuality}
          />
          <DisplayError errors={errors} slot="Quality" />
        </LargeCell>
      </Form.Group>

      <Form.Group as={Row}>
        {state.isAccessory ? (
          <>
            <Label>{lang.ui.title.clan}</Label>
            <LargeCell>
              <DropdownSelect
                disabled={lockedFields.includes("Clan")}
                id="selectClan"
                items={listClans}
                onChange={onChangeClan}
                required
                value={state.Clan}
              />
              <DisplayError errors={errors} slot="Clan" />
            </LargeCell>
          </>
        ) : (
          <>
            <Label>{lang.ui.title.set}</Label>
            <LargeCell>
              <DropdownSelect
                disabled={lockedFields.includes("Set")}
                id="selectSet"
                items={listSets}
                onChange={onChangeSets}
                required
                value={state.Set}
              />
              <DisplayError errors={errors} slot="Set" />
            </LargeCell>
          </>
        )}

        <Label>{lang.ui.title.level}</Label>
        <LargeCell>
          <Form.Control
            disabled={lockedFields.includes("Level")}
            max={16}
            min={0}
            onChange={onChangeLevel}
            required
            size="sm"
            type="number"
            value={level}
          />
          <DisplayError errors={errors} slot="Level" />
        </LargeCell>
      </Form.Group>
    </>
  );
};

export default ArtifactFormBase;
