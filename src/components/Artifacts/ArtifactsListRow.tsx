import ArtifactEditTable from "./ArtifactEditTable";
import { Artifact, Stat, StatsFull } from "models";

import Wrapper from "components/UI/Wrapper";

import { useLanguage } from "lang/LanguageContext";
import { Language } from "lang/language";

import ChampionPortrait from "components/UI/ChampionPortrait";
import ArtifactDisplay from "components/UI/ArtifactDisplay";
import styled from "styled-components";
import React from "react";

interface ArtifactsListRowProps {
  artifact: Artifact;
}

const Cell = styled.td``;

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
      {lang[`stat${stat.Stats}Short` as keyof Language]}
      {stat.Roll !== undefined && stat.Roll !== 0 && `(${stat.Roll})`}{" "}
      {stat.Value && statsDisplay(stat.Stats, stat.Value)}
      {stat.Rune !== undefined && stat.Rune !== 0 && (
        <Yellow>+{statsDisplay(stat.Stats, stat.Rune)}</Yellow>
      )}
    </>
  );

  return (
    <tr>
      <Cell>
        <ArtifactDisplay artifact={artifact} champion={false} size={50} />
      </Cell>
      <Cell>
        {lang[`stat${artifact.MainStats}Short` as keyof Language]}{" "}
        {artifact.MainStatsValue &&
          statsDisplay(artifact.MainStats, artifact.MainStatsValue)}
      </Cell>
      {[0, 1, 2, 3].map((statIndex) => {
        const stat = artifact.SubStats[statIndex];

        return (
          <Cell key={`sub-${statIndex}`}>{stat && subStatDisplay(stat)}</Cell>
        );
      })}
      <Cell>
        {artifact.Champion && (
          <ChampionPortrait champion={artifact.Champion} size={50} />
        )}
      </Cell>
      <Cell>
        <Wrapper>
          <ArtifactEditTable artifact={artifact} />
        </Wrapper>
      </Cell>
    </tr>
  );
};

export default ArtifactsListRow;
