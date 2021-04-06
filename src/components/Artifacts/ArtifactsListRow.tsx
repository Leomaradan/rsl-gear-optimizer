import ArtifactEditTable from "./ArtifactEditTable";

import ArtifactDisplay from "../UI/ArtifactDisplay";
import ChampionPortrait from "../UI/ChampionPortrait";
import Wrapper from "../UI/Wrapper";
import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageStat } from "../../lang/language";
import type { IArtifact, IStat, IStatsFull } from "../../models";
import type { IState } from "../../redux/reducers";

import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

interface IArtifactsListRowProps {
  artifact: IArtifact;
  readOnly?: boolean;
}

const Cell = styled.td``;

const Yellow = styled.span`
  color: yellowgreen;
`;

const ArtifactsListRow = (props: IArtifactsListRowProps): JSX.Element => {
  const { artifact, readOnly } = props;

  const champion = useSelector((state: IState) =>
    state.champions.find((c) => c.Guid === artifact.Champion)
  );

  const lang = useLanguage();

  const statsDisplay = (stats: IStat, value: number) =>
    ["ATK%", "C.DMG", "C.RATE", "DEF%", "HpPercent"].includes(stats)
      ? `${value}%`
      : value;

  const subStatDisplay = (stat: IStatsFull) => (
    <>
      {lang.stat.short[stat.Stats as keyof ILanguageStat]}
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
        <ArtifactDisplay artifact={artifact} showChampion={false} size={50} />(
        {artifact.Power})
      </Cell>
      <Cell>
        {lang.stat.short[artifact.MainStats as keyof ILanguageStat]}{" "}
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
        {champion && <ChampionPortrait champion={champion} size={50} />}
      </Cell>
      {!readOnly && (
        <Cell>
          <Wrapper>
            <ArtifactEditTable artifact={artifact} />
          </Wrapper>
        </Cell>
      )}
    </tr>
  );
};

ArtifactsListRow.defaultProps = {
  readOnly: false,
};

export default ArtifactsListRow;
