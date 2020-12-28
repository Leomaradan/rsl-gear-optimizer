import type { IArtifact, IChampion, IProfile, IStat } from "models";
import { useLanguage } from "lang/LanguageContext";
import calculateChampionStats from "process/calculateChampionStats";
import type { ILanguageStat } from "lang/language";

import React from "react";
import styled from "styled-components";
import { Table } from "react-bootstrap";

const Yellow = styled.span`
  color: yellowgreen;
`;

const displayValue = (stat: number, isPercent = false) => {
  if (!stat) {
    return "";
  }

  if (isPercent) {
    return `+${stat}%`;
  }

  return `+${stat}`;
};

const returnRow = (
  title: string,
  isPercent: boolean,
  baseStat: number,
  artifactStat: number,
  masteryStat = 0,
  hallStat = 0,
  arenaStat = 0
) => (
  <tr>
    <td>{title}</td>
    <td>{displayValue(Math.round(baseStat), isPercent)}</td>
    <td>
      <Yellow>{displayValue(Math.round(artifactStat), isPercent)}</Yellow>
    </td>
    <td>{displayValue(Math.round(hallStat), isPercent)}</td>
    <td>{displayValue(Math.round(arenaStat))}</td>
    <td>{displayValue(Math.round(masteryStat), isPercent)}</td>
    <td>
      {displayValue(
        Math.round(
          baseStat + artifactStat + hallStat + arenaStat + masteryStat
        ),
        isPercent
      )}
    </td>
  </tr>
);

interface IChampionDetailsStatsProps {
  champion: IChampion;
  artifacts: IArtifact[];
  profile: IProfile;
}

const ChampionDetailsStats = ({
  champion,
  artifacts,
  profile,
}: IChampionDetailsStatsProps): JSX.Element => {
  const lang = useLanguage();

  const stats = calculateChampionStats(
    champion,
    artifacts,
    profile.gameProgression
  );

  const statsPercent: IStat[] = ["C.RATE", "C.DMG"];

  return (
    <Table variant="dark" striped bordered hover>
      <thead>
        <tr>
          <th colSpan={2}>{lang.ui.title.stat}</th>
          <th>{lang.ui.title.artifacts}</th>
          <th>{lang.ui.title.greatHall}</th>
          <th>{lang.ui.title.arenaRank}</th>
          <th>Masteries</th>
          <th>{lang.ui.common.total}</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(stats).map((statKey) => {
          const stat = stats[statKey];
          return returnRow(
            lang.stat[statKey as keyof ILanguageStat],
            statsPercent.includes(statKey as IStat),
            stat.base,
            stat.artifacts,
            stat.mastery,
            stat.hall,
            stat.arena
          );
        })}
      </tbody>
    </Table>
  );
};

export default ChampionDetailsStats;
