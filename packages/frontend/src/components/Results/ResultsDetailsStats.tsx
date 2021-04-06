import Stack from "../UI/Stack";
import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageStat } from "../../lang/language";
import type { IChampion, IResults, IStat } from "../../models";
import calculateChampionStats from "../../process/calculateChampionStats";
import calculateScoreRealStats from "../../process/calculateScoreRealStats";
import generateTheoricalArtifact from "../../process/generateTheoricalArtifact";
import type { IState } from "../../redux/reducers";

import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import styled from "styled-components";

interface IResultsDetailsStatsProps {
  champion: IChampion;
  result: IResults;
  theoricalArtifacts?: boolean;
}

const displayValue = (stat: number, isPercent = false) => {
  if (!stat) {
    return "";
  }

  if (isPercent) {
    return `${stat}%`;
  }

  return `${stat}`;
};

const Yellow = styled.span`
  color: yellowgreen;
`;

const Red = styled.span`
  color: red;
`;

const ResultsDetailsStats = (props: IResultsDetailsStatsProps): JSX.Element => {
  const { champion, result, theoricalArtifacts } = props;
  const lang = useLanguage();

  const artifacts = useSelector((state: IState) =>
    state.artifacts.filter((a) => a.Champion === champion.Guid)
  );
  const { arenaRank, greatHallBonus: greatHall } = useSelector(
    (state: IState) => state.configuration
  );

  const statsPercent: IStat[] = ["C.RATE", "C.DMG"];

  const baseArtifact = theoricalArtifacts
    ? artifacts.map((a) => generateTheoricalArtifact(a))
    : artifacts;

  const resultArtifact = theoricalArtifacts
    ? result.artifacts.map((a) => generateTheoricalArtifact(a))
    : result.artifacts;

  const currentStats = calculateChampionStats(champion, baseArtifact, {
    arenaRank,
    greatHallBonus: greatHall,
  });
  const newStats = calculateChampionStats(champion, resultArtifact, {
    arenaRank,
    greatHallBonus: greatHall,
  });
  // table table-dark table-striped table-bordered table-hover
  return (
    <Stack>
      <Table bordered hover striped variant="dark">
        <thead>
          <tr>
            <th colSpan={2}>{lang.ui.title.stat}</th>
            <th>{lang.ui.title.oldStats}</th>
            <th>{lang.ui.title.newStats}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2}>{lang.ui.title.score}</td>
            <td>
              {baseArtifact.reduce(
                (sum, artifact) =>
                  sum + calculateScoreRealStats(artifact, result.champion),
                0
              )}
            </td>
            <td>
              {resultArtifact.reduce(
                (sum, artifact) =>
                  sum + calculateScoreRealStats(artifact, result.champion),
                0
              )}
            </td>
          </tr>
          {Object.keys(currentStats).map((statKey) => {
            const currentStat = currentStats[statKey];
            const newStat = newStats[statKey];

            const isPercent = statsPercent.includes(statKey as IStat);
            const diff = Math.round(newStat.total - currentStat.total);

            let newStatDisplay: JSX.Element | string;
            if (diff > 0) {
              newStatDisplay = (
                <>
                  {displayValue(Math.round(newStat.total), isPercent)}{" "}
                  {/* eslint-disable-next-line react/jsx-no-literals */}
                  <Yellow>(+{diff})</Yellow>
                </>
              );
            } else if (diff < 0) {
              newStatDisplay = (
                <>
                  {displayValue(Math.round(newStat.total), isPercent)}{" "}
                  <Red>({diff})</Red>
                </>
              );
            } else {
              newStatDisplay = displayValue(
                Math.round(newStat.total),
                isPercent
              );
            }

            return (
              <tr key={statKey}>
                <td>{lang.stat[statKey as keyof ILanguageStat]}</td>
                <td>{displayValue(Math.round(currentStat.base), isPercent)}</td>
                <td>
                  {displayValue(Math.round(currentStat.total), isPercent)}
                </td>
                <td>{newStatDisplay}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Stack>
  );
};

ResultsDetailsStats.defaultProps = {
  theoricalArtifacts: false,
};

export default ResultsDetailsStats;
