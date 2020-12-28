import ArtifactsList from "../components/Artifacts/ArtifactsList";

import type { IState } from "redux/reducers";
import Accordion, { IAccordionSection } from "components/UI/Accordion";
import { useLanguage } from "lang/LanguageContext";
import BaseWrapper from "components/UI/Wrapper";
import Stack from "components/UI/Stack";
import calculateScoreEasyMode from "process/calculateScoreEasyMode";
import type { ILanguageSlot } from "lang/language";
import { ExistingSlots } from "data";
import type { IScoredArtifact, IChampionConfiguration } from "models";

import styled from "styled-components";
import { useSelector } from "react-redux";
import React from "react";

const Wrapper = styled(BaseWrapper)`
  justify-content: space-between;
`;

const SellList = (): JSX.Element => {
  const artifacts = useSelector((state: IState) => state.artifacts);
  const results = useSelector((state: IState) => state.results);
  const selectedItems: string[] = [];

  if (results.status === "Done") {
    results.data.forEach((row) => {
      row.artifacts.forEach((artifact) => {
        selectedItems.push(artifact.Guid);
      });
    });
  }

  const lang = useLanguage();
  const sectionArtifacts: IAccordionSection[] = [];

  const weightedArtifacts1: IScoredArtifact[] = [];
  const weightedArtifacts2: IScoredArtifact[] = [];
  const weightedAccessories: IScoredArtifact[] = [];

  const filterArtifacts = artifacts.filter(
    (a) => !a.Champion && !selectedItems.includes(a.Guid)
  );

  const ChampionA = {
    StatsPriority: {
      "DEF%": 3,
      "HP%": 3,
      SPD: 2,
      ACC: 2,
    },
    GauntletStats: ["DEF%", "HP%"],
    ChestplateStats: ["DEF%", "HP%"],
    BootsStats: ["SPD"],
  } as IChampionConfiguration;

  const ChampionB = {
    StatsPriority: {
      "ATK%": 3,
      "C.DMG": 3,
      "C.RATE": 2,
      SPD: 2,
      ACC: 1,
    },
    GauntletStats: ["C.DMG", "C.RATE"],
    ChestplateStats: ["ATK"],
    BootsStats: ["SPD"],
  } as IChampionConfiguration;

  filterArtifacts.forEach((artifact) => {
    const scoreA = calculateScoreEasyMode(artifact, ChampionA);
    const scoreB = calculateScoreEasyMode(artifact, ChampionB);
    const score = Math.max(scoreA, scoreB);

    if (artifact.isAccessory) {
      weightedAccessories.push({ ...artifact, score });
    } else if (["Weapon", "Helmet", "Shield"].includes(artifact.Slot)) {
      weightedArtifacts1.push({ ...artifact, score });
    } else {
      weightedArtifacts2.push({ ...artifact, score });
    }
  });

  const countWorst1 =
    weightedArtifacts1.length !== 0
      ? Math.round(weightedArtifacts1.length / 4)
      : 0;
  const countWorst2 =
    weightedArtifacts2.length !== 0
      ? Math.round(weightedArtifacts2.length / 4)
      : 0;
  const countWorstAccessories =
    weightedAccessories.length !== 0
      ? Math.round(weightedAccessories.length / 4)
      : 0;

  const worstArtifacts1 = weightedArtifacts1
    .sort((a, b) => b.score - a.score)
    .reverse()
    .slice(0, countWorst1);
  const worstArtifacts2 = weightedArtifacts2
    .sort((a, b) => b.score - a.score)
    .reverse()
    .slice(0, countWorst2);
  const worstArtifactsAccessories = weightedAccessories
    .sort((a, b) => b.score - a.score)
    .reverse()
    .slice(0, countWorstAccessories);
  const worstList = [
    ...worstArtifacts1,
    ...worstArtifacts2,
    ...worstArtifactsAccessories,
  ];

  ExistingSlots.forEach((slot) => {
    const filter = worstList.filter((i) => i.Slot === slot);

    if (filter.length > 0) {
      sectionArtifacts.push({
        key: slot,
        title: lang.slot[slot as keyof ILanguageSlot],
        content: <ArtifactsList readOnly artifacts={filter} />,
      });
    }
  });

  return (
    <Stack>
      <Wrapper>
        <h1>{lang.ui.title.sellList}</h1>
      </Wrapper>
      <Accordion section={sectionArtifacts} />
    </Stack>
  );
};

export default SellList;
