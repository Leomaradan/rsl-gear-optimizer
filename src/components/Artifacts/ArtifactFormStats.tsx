/* eslint-disable no-param-reassign */
import StatsSelector from "./StatsSelector";
import type { IArtifactFormSubProps } from "./ArtifactForm";

import DisplayError from "components/UI/DisplayError";
import Wrapper from "components/UI/Wrapper";
import { useLanguage } from "lang/LanguageContext";
import type { IArtifact, IStatsFull, IStat } from "models";
import type { ILanguageUiTitle } from "lang/language";
import {
  StatsBySlots,
  ExistingStats,
  WeaponSubStats,
  HelmetSubStats,
  ShieldSubStats,
  RingSubStats,
  AmuletSubStats,
  BannerSubStats,
} from "data";

import produce from "immer";
import { Button, Form, Row } from "react-bootstrap";
import React from "react";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import styled from "styled-components";

const Rune = styled.img.attrs(() => ({ src: "assets/Misc/Stone.png" }))`
  height: 32px;
`;

const MediumCell = styled.div.attrs(() => ({ className: "col-sm-2" }))``;
const LargeCell = styled.div.attrs(() => ({ className: "col-sm-3" }))``;

const Label = styled.label.attrs(() => ({
  className: "col-sm-2 col-form-label",
}))``;

const RuneCell = styled.div`
  display: flex;
  gap: 5px;
`;

export default ({
  state,
  setState,
  errors,
  lockedFields,
}: IArtifactFormSubProps): JSX.Element => {
  const lang = useLanguage();

  const availableStats: IStat[] = StatsBySlots[state.Slot];

  const updateNewArtifact = (
    key: keyof IArtifact,
    value: string | number | IStatsFull[]
  ) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const onChangeMainStats = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNewArtifact("MainStats", e.target.value);
    updateNewArtifact("MainStatsValue", 0);
  };

  const onChangeMainStatsValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNewArtifact("MainStatsValue", parseInt(e.target.value, 10));
  };

  const onChangeSubStats = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const newStat = e.target.value as IStat;

    const substats = produce(state.SubStats as IStatsFull[], (draftState) => {
      if (!draftState[index]) {
        draftState[index] = {} as IStatsFull;
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
    const substats = produce(state.SubStats as IStatsFull[], (draftState) => {
      draftState[index].Value = parseInt(e.target.value, 10);
    });

    updateNewArtifact("SubStats", substats);
  };

  const onChangeSubStatsRolls = (Roll: number, index: number) => {
    const substats = produce(state.SubStats as IStatsFull[], (draftState) => {
      draftState[index].Roll = Roll;
    });
    updateNewArtifact("SubStats", substats);
  };

  const onChangeSubStatsRune = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const substats = produce(state.SubStats as IStatsFull[], (draftState) => {
      draftState[index].Rune = parseInt(e.target.value, 10);
    });
    updateNewArtifact("SubStats", substats);
  };

  let availableSlotSubStats = ExistingStats;

  if (state.Slot === "Weapon") {
    availableSlotSubStats = WeaponSubStats;
  } else if (state.Slot === "Helmet") {
    availableSlotSubStats = HelmetSubStats;
  } else if (state.Slot === "Shield") {
    availableSlotSubStats = ShieldSubStats;
  } else if (state.Slot === "Ring") {
    availableSlotSubStats = RingSubStats;
  } else if (state.Slot === "Amulet") {
    availableSlotSubStats = AmuletSubStats;
  } else if (state.Slot === "Banner") {
    availableSlotSubStats = BannerSubStats;
  }

  const availableSubStats1 = availableSlotSubStats.filter(
    (i) => i !== state.MainStats
  );
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

  return (
    <>
      <Form.Group as={Row}>
        <Label>{lang.ui.title.mainStats}</Label>
        <LargeCell>
          <StatsSelector
            availableStats={availableStats}
            currentStats={state.MainStats}
            onChange={onChangeMainStats}
            disabled={lockedFields.includes("MainStats")}
          />
          <DisplayError slot="MainStats" errors={errors} />
        </LargeCell>

        <Label>{lang.ui.title.mainStatsValue}</Label>
        <LargeCell>
          <Form.Control
            size="sm"
            type="number"
            disabled={
              state.MainStats === "" || lockedFields.includes("MainStatValue")
            }
            min={0}
            max={9999}
            value={state.MainStatsValue ?? 0}
            onChange={onChangeMainStatsValue}
          />
          <DisplayError slot="MainStatValue" errors={errors} />
        </LargeCell>
      </Form.Group>
      <Form.Row>
        <Label />
        <LargeCell>
          <strong>{lang.ui.title.stat}</strong>
        </LargeCell>
        <MediumCell>
          <strong>{lang.ui.title.statValue}</strong>
        </MediumCell>
        <MediumCell>
          <strong>{lang.ui.title.rolls}</strong>
        </MediumCell>
        <MediumCell>
          <strong>{lang.ui.title.runes}</strong>
        </MediumCell>
      </Form.Row>
      {[0, 1, 2, 3].map((statIndex) => {
        const stat = state.SubStats[statIndex];

        const selectDisabled =
          state.SubStats.filter((s) => s?.Stats !== "")?.length < statIndex;
        const valuesDisabled = selectDisabled || !stat || stat?.Stats === "";

        return (
          <Form.Row key={`sub-${statIndex}`}>
            <Label>
              {lang.ui.title[`stats${statIndex + 1}` as keyof ILanguageUiTitle]}
            </Label>

            <LargeCell>
              <StatsSelector
                availableStats={availableSubStats[statIndex]}
                disabled={
                  selectDisabled ||
                  lockedFields.includes(`SubStats${statIndex + 1}`)
                }
                currentStats={stat?.Stats}
                onChange={(e) => {
                  onChangeSubStats(e, statIndex);
                }}
              />
              <DisplayError slot={`SubStat${statIndex + 1}`} errors={errors} />
            </LargeCell>
            <MediumCell>
              <Form.Control
                type="number"
                size="sm"
                disabled={
                  valuesDisabled ||
                  lockedFields.includes(`SubStatsValue${statIndex + 1}`)
                }
                min={0}
                max={9999}
                value={stat?.Value ?? 0}
                onChange={(e) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChangeSubStatsValue(e as any, statIndex);
                }}
              />
              <DisplayError
                slot={`SubStatValue${statIndex + 1}`}
                errors={errors}
              />
            </MediumCell>
            <MediumCell>
              <Wrapper>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={
                    stat?.Roll === 0 ||
                    valuesDisabled ||
                    lockedFields.includes(`SubStatsRolls${statIndex + 1}`)
                  }
                  onClick={() => {
                    onChangeSubStatsRolls((stat?.Roll ?? 0) - 1, statIndex);
                  }}
                >
                  <DashCircle />
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={
                    stat?.Roll === 4 ||
                    numberRolls === 4 ||
                    valuesDisabled ||
                    lockedFields.includes(`SubStatsRolls${statIndex + 1}`)
                  }
                  onClick={() => {
                    onChangeSubStatsRolls((stat?.Roll ?? 0) + 1, statIndex);
                  }}
                >
                  <PlusCircle />
                </Button>
                {stat?.Roll}
              </Wrapper>
            </MediumCell>
            <RuneCell>
              <RuneCell>
                <Rune />
                <Form.Control
                  type="number"
                  size="sm"
                  disabled={
                    valuesDisabled ||
                    lockedFields.includes(`SubStatsRune${statIndex + 1}`)
                  }
                  min={0}
                  max={9999}
                  value={stat?.Rune ?? 0}
                  onChange={(e) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChangeSubStatsRune(e as any, statIndex);
                  }}
                />
              </RuneCell>
            </RuneCell>
          </Form.Row>
        );
      })}
    </>
  );
};
