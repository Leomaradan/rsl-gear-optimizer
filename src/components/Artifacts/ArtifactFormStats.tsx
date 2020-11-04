/* eslint-disable no-param-reassign */
import StatsSelector from "./StatsSelector";
import ArtifactDisplay from "components/UI/ArtifactDisplay";
import DisplayError from "components/UI/DisplayError";
import Wrapper from "components/UI/Wrapper";
import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import {
  Artifact,
  Errors,
  StatsBySlots,
  StatsFull,
  ExistingStats,
  Sets,
  Stat,
  Clans,
  Slots,
  WeaponSubStats,
  ShieldSubStats,
  AmuletSubStats,
  BannerSubStats,
  HelmetSubStats,
  RingSubStats,
} from "models";
import produce from "immer";

import React, { Dispatch, SetStateAction } from "react";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import styled from "styled-components";

interface ArtifactFormStatsProps {
  state: Artifact;
  setState: Dispatch<SetStateAction<Artifact>>;
  errors: Errors;
}

const Input = styled.input`
  width: 100%;
`;

const Rune = styled.img.attrs(() => ({ src: "assets/Misc/Stone.png" }))`
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

export default ({
  state,
  setState,
  errors,
}: ArtifactFormStatsProps): JSX.Element => {
  const lang = useLanguage();

  const availableStats: Stat[] = StatsBySlots[state.Slot];

  const updateNewArtifact = (
    key: keyof Artifact,
    value: string | number | StatsFull[]
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
    const newStat = e.target.value as Stat;

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

  let availableSlotSubStats = ExistingStats;

  if (state.Slot === Slots.Weapon) {
    availableSlotSubStats = WeaponSubStats;
  } else if (state.Slot === Slots.Helmet) {
    availableSlotSubStats = HelmetSubStats;
  } else if (state.Slot === Slots.Shield) {
    availableSlotSubStats = ShieldSubStats;
  } else if (state.Slot === Slots.Ring) {
    availableSlotSubStats = RingSubStats;
  } else if (state.Slot === Slots.Amulet) {
    availableSlotSubStats = AmuletSubStats;
  } else if (state.Slot === Slots.Banner) {
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
            disabled={state.MainStats === Stat.None}
            min={0}
            max={9999}
            value={state.MainStatsValue ?? 0}
            onChange={onChangeMainStatsValue}
          />
        </MediumCell>
      </div>

      {[0, 1, 2, 3].map((statIndex) => {
        const stat = state.SubStats[statIndex];

        const selectDisabled =
          state.SubStats.filter((s) => s?.Stats !== Stat.None)?.length <
          statIndex;
        const valuesDisabled =
          selectDisabled || !stat || stat?.Stats === Stat.None;

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
                max={9999}
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
                max={9999}
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
          {(state.Set !== Sets.Null || state.Clan !== Clans.Null) && (
            <ArtifactDisplay artifact={state} size={120} />
          )}
        </div>
      </div>
    </>
  );
};
