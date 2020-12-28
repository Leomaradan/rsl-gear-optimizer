import ResultsModal from "./ResultsModal";

import ProgressBar from "components/UI/ProgressBar";
import { useLanguage } from "lang/LanguageContext";
import type { IState } from "redux/reducers";
import methodDisplay from "process/methodDisplay";
import ArtifactDisplay from "components/UI/ArtifactDisplay";
import ChampionPortrait from "components/UI/ChampionPortrait";
import SetDisplay from "components/UI/SetDisplay";
import type { IChampion } from "models";
import Wrapper from "components/UI/Wrapper";
import type { ILanguageChampion } from "lang/language";

import styled from "styled-components";
import { useSelector } from "react-redux";
import React from "react";
import { Table } from "react-bootstrap";

const NameContainer = styled.div`
  padding: 0.75rem;
`;

const ChampionContainer = styled.td`
  padding: 0 !important;
  display: flex;
  justify-content: space-between;
  border: none !important;
`;

const ResultsDetails = (): JSX.Element => {
  const { data } = useSelector((state: IState) => state.results);
  const champions = useSelector((state: IState) => state.champions);
  const lang = useLanguage();

  if (!data || data.length === 0) {
    return <></>;
  }

  return (
    <Table variant="dark" striped bordered hover>
      <thead>
        <tr>
          <th>{lang.ui.title.champion}</th>
          <th colSpan={4}>{lang.ui.title.artifacts}</th>
          <th>{lang.ui.title.actions}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((result) => {
          if (!result.artifacts) {
            return null;
          }

          const sourceChampion = champions.find(
            (c) => c.Guid === result.champion.SourceChampion
          ) as IChampion;

          return (
            <React.Fragment key={result.name}>
              <tr>
                <td colSpan={5} />
              </tr>
              <tr>
                <ChampionContainer>
                  <NameContainer>
                    {
                      lang.champion[
                        sourceChampion.Name as keyof ILanguageChampion
                      ]
                    }
                  </NameContainer>

                  <ChampionPortrait champion={sourceChampion} size={84} />
                </ChampionContainer>
                <td>
                  <ArtifactDisplay
                    size={60}
                    artifact={result.artifacts.find((a) => a.Slot === "Weapon")}
                  />
                </td>
                <td>
                  <ArtifactDisplay
                    size={60}
                    artifact={result.artifacts.find((a) => a.Slot === "Helmet")}
                  />
                </td>
                <td>
                  <ArtifactDisplay
                    size={60}
                    artifact={result.artifacts.find((a) => a.Slot === "Shield")}
                  />
                </td>
                <td rowSpan={2}>
                  <Wrapper>
                    <ArtifactDisplay
                      size={60}
                      artifact={result.artifacts.find((a) => a.Slot === "Ring")}
                    />
                    <ArtifactDisplay
                      size={60}
                      artifact={result.artifacts.find(
                        (a) => a.Slot === "Amulet"
                      )}
                    />
                    <ArtifactDisplay
                      size={60}
                      artifact={result.artifacts.find(
                        (a) => a.Slot === "Banner"
                      )}
                    />
                  </Wrapper>
                </td>
                <td>
                  <ProgressBar
                    current={result.score}
                    max={result.maxScore}
                    label={`${lang.ui.title.score}: ${result.score}`}
                  />
                  {result.bonus.map((set, index) => (
                    <SetDisplay
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${result.name}-${index}-${set}`}
                      set={set}
                    />
                  ))}{" "}
                  {!result.bonusComplete &&
                    result.champion.Methods === "ListSets" && (
                      <span className="badge badge-warning">
                        {lang.ui.common.warning}
                      </span>
                    )}
                </td>
              </tr>
              <tr>
                <td>{methodDisplay(lang, result.champion.Methods)}</td>
                <td>
                  <ArtifactDisplay
                    size={60}
                    artifact={result.artifacts.find(
                      (a) => a.Slot === "Gauntlets"
                    )}
                  />
                </td>
                <td>
                  <ArtifactDisplay
                    size={60}
                    artifact={result.artifacts.find(
                      (a) => a.Slot === "Chestplate"
                    )}
                  />
                </td>
                <td>
                  <ArtifactDisplay
                    size={60}
                    artifact={result.artifacts.find((a) => a.Slot === "Boots")}
                  />
                </td>
                <td>
                  <ResultsModal result={result} champion={sourceChampion} />
                </td>
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </Table>
  );
};

export default ResultsDetails;
