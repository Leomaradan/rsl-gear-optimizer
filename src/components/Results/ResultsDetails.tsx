import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageChampion } from "../../lang/language";
import type { IChampion } from "../../models";
import methodDisplay from "../../process/methodDisplay";
import ArtifactDisplay from "../UI/ArtifactDisplay";
import ChampionPortrait from "../UI/ChampionPortrait";
import ProgressBar from "../UI/ProgressBar";
import SetDisplay from "../UI/SetDisplay";
import Wrapper from "../UI/Wrapper";
import type { IState } from "../../redux/reducers";

import ResultsModal from "./ResultsModal";

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
    <Table bordered hover striped variant="dark">
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
                    artifact={result.artifacts.find((a) => a.Slot === "Weapon")}
                    size={60}
                  />
                </td>
                <td>
                  <ArtifactDisplay
                    artifact={result.artifacts.find((a) => a.Slot === "Helmet")}
                    size={60}
                  />
                </td>
                <td>
                  <ArtifactDisplay
                    artifact={result.artifacts.find((a) => a.Slot === "Shield")}
                    size={60}
                  />
                </td>
                <td rowSpan={2}>
                  <Wrapper>
                    <ArtifactDisplay
                      artifact={result.artifacts.find((a) => a.Slot === "Ring")}
                      size={60}
                    />
                    <ArtifactDisplay
                      artifact={result.artifacts.find(
                        (a) => a.Slot === "Amulet"
                      )}
                      size={60}
                    />
                    <ArtifactDisplay
                      artifact={result.artifacts.find(
                        (a) => a.Slot === "Banner"
                      )}
                      size={60}
                    />
                  </Wrapper>
                </td>
                <td>
                  <ProgressBar
                    current={result.score}
                    label={`${lang.ui.title.score}: ${result.score}`}
                    max={result.maxScore}
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
                    artifact={result.artifacts.find(
                      (a) => a.Slot === "Gauntlets"
                    )}
                    size={60}
                  />
                </td>
                <td>
                  <ArtifactDisplay
                    artifact={result.artifacts.find(
                      (a) => a.Slot === "Chestplate"
                    )}
                    size={60}
                  />
                </td>
                <td>
                  <ArtifactDisplay
                    artifact={result.artifacts.find((a) => a.Slot === "Boots")}
                    size={60}
                  />
                </td>
                <td>
                  <ResultsModal champion={sourceChampion} result={result} />
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
