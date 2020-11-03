import ArtifactEditTable from "./ArtifactEditTable";
import { Artifact, Rarity, Stat, StatsFull } from "models";

import Wrapper from "components/UI/Wrapper";

import { useLanguage } from "lang/LanguageContext";
import { Language } from "lang/language";

import StarDisplay from "components/UI/StarDisplay";
import ChampionPortrait from "components/UI/ChampionPortrait";
import styled from "styled-components";
import React from "react";

interface ArtifactsListRowProps {
  artifact: Artifact;
}

const Cell = styled.td``;

const CellPortrait = styled.td`
  height: 97px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Yellow = styled.span`
  color: yellowgreen;
`;

const ArtifactsListRow = (props: ArtifactsListRowProps): JSX.Element => {
  const { artifact } = props;

  const lang = useLanguage();

  const statsDisplay = (stats: Stat, value: number) =>
    [
      Stat.AttackPercent,
      Stat.CriticalDamage,
      Stat.CriticalRate,
      Stat.DefensePercent,
      Stat.HpPercent,
    ].includes(stats)
      ? `${value}%`
      : value;

  const subStatDisplay = (stat: StatsFull) => (
    <>
      {lang[`stat${stat.Stats}` as keyof Language]}
      {stat.Roll !== undefined && stat.Roll !== 0 && `(${stat.Roll})`}{" "}
      {stat.Value && statsDisplay(stat.Stats, stat.Value)}
      {stat.Rune !== undefined && stat.Rune !== 0 && (
        <Yellow>+{statsDisplay(stat.Stats, stat.Rune)}</Yellow>
      )}
    </>
  );

  const RarityName = {
    [Rarity.Common]: lang.rarityCommon,
    [Rarity.Uncommon]: lang.rarityUncommon,
    [Rarity.Rare]: lang.rarityRare,
    [Rarity.Epic]: lang.rarityEpic,
    [Rarity.Legendary]: lang.rarityLegendary,
  };

  return (
    <tr>
      <Cell>{lang[`slot${artifact.Slot}` as keyof Language]}</Cell>
      <Cell>{lang[`set${artifact.Set}` as keyof Language]}</Cell>
      <Cell>{RarityName[artifact.Rarity]}</Cell>

      <Cell>
        <StarDisplay stars={artifact.Quality} />
      </Cell>

      <Cell>{artifact.Level ?? 1}</Cell>
      <Cell>
        {lang[`stat${artifact.MainStats}` as keyof Language]}{" "}
        {artifact.MainStatsValue &&
          statsDisplay(artifact.MainStats, artifact.MainStatsValue)}
      </Cell>
      {[0, 1, 2, 3].map((statIndex) => {
        const stat = artifact.SubStats[statIndex];

        return (
          <Cell key={`sub-${statIndex}`}>{stat && subStatDisplay(stat)}</Cell>
        );
      })}
      <CellPortrait>
        {artifact.Champion && (
          <ChampionPortrait champion={artifact.Champion} size={70} />
        )}
      </CellPortrait>
      <Cell>
        <Wrapper>
          <ArtifactEditTable artifact={artifact} />
        </Wrapper>
      </Cell>
    </tr>
  );
};

export default ArtifactsListRow;
