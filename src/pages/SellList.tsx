import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import ArtifactsList from "../components/Artifacts/ArtifactsList";
import Accordion, { IAccordionSection } from "../components/UI/Accordion";
import Stack from "../components/UI/Stack";
import BaseWrapper from "../components/UI/Wrapper";
import { ExistingSlots } from "../data";
import { useLanguage } from "../lang/LanguageContext";
import type { ILanguageSlot } from "../lang/language";
import type { IScoredArtifact, IChampionConfiguration, ISets } from "../models";
import calculateScoreEasyMode from "../process/calculateScoreEasyMode";
import type { IState } from "../redux/reducers";

const Wrapper = styled(BaseWrapper)`
  justify-content: space-between;
`;

const setsNeutral: ISets[] = [
  "Speed",
  "Accuracy",
  "Daze",
  "Cursed",
  "Immunity",
  "Relentless",
  "Stun",
  "Toxic",
  "Stalwart",
  "Reflex",
  "DivineSpeed",
];

const setsDef: ISets[] = [
  "Life",
  "Defense",
  "Resistance",
  "Lifesteal",
  "Fury",
  "Frost",
  "Frenzy",
  "Regeneration",
  "Shield",
  "Taunting",
  "Retaliation",
  "Avenging",
  "Curing",
  "Immortal",
  "DivineLife",
  "Deflection",
];

const setsAtk: ISets[] = [
  "Offense",
  "CriticalRate",
  "CriticalDamage",
  "Savage",
  "Destroy",
  "Cruel",
  "DivineOffense",
  "DivineCriticalRate",
  "SwiftParry",
];

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

  const ChampionDef = {
    StatsPriority: {
      "DEF%": 3,
      "HP%": 3,
      SPD: 3,
      ACC: 2,
      RESI: 2,
    },
    GauntletStats: ["DEF%", "HP%"],
    ChestplateStats: ["DEF%", "HP%"],
    BootsStats: ["SPD"],
  } as IChampionConfiguration;

  const ChampionAtk = {
    StatsPriority: {
      "ATK%": 3,
      "C.DMG": 3,
      "C.RATE": 3,
      SPD: 3,
      ACC: 2,
      RESI: 2,
    },
    GauntletStats: ["C.DMG", "C.RATE"],
    ChestplateStats: ["ATK%"],
    BootsStats: ["SPD"],
  } as IChampionConfiguration;

  filterArtifacts.forEach((artifact) => {
    const isDefSet = [...setsNeutral, ...setsDef].includes(artifact.Set);
    const isAtkSet = [...setsNeutral, ...setsAtk].includes(artifact.Set);

    const scoreDef =
      calculateScoreEasyMode(artifact, ChampionDef) + (isDefSet ? 3 : 0);
    const scoreAtk =
      calculateScoreEasyMode(artifact, ChampionAtk) + (isAtkSet ? 3 : 0);
    let score = Math.max(scoreDef, scoreAtk);

    if (artifact.isAccessory) {
      weightedAccessories.push({ ...artifact, score });
    } else if (["Weapon", "Helmet", "Shield"].includes(artifact.Slot)) {
      weightedArtifacts1.push({ ...artifact, score });
    } else {
      if (!["ATK", "DEF", "HP"].includes(artifact.MainStats)) {
        score += 3;
      }
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
