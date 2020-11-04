import ResultsModal from "./ResultsModal";
import ProgressBar from "components/UI/ProgressBar";
import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";

import { State } from "redux/reducers";
import methodDisplay from "process/methodDisplay";
import ArtifactDisplay from "components/UI/ArtifactDisplay";
import ChampionPortrait from "components/UI/ChampionPortrait";
import SetDisplay from "components/UI/SetDisplay";

import { ChampionSetMethod } from "models";
import Wrapper from "components/UI/Wrapper";
import styled from "styled-components";
import { useSelector } from "react-redux";
import React from "react";

const NameContainer = styled.div`
  padding: 0.75rem;
`;

const ChampionContainer = styled.td`
  padding: 0 !important;
  display: flex;
  justify-content: space-between;
  border: none !important;
`;

export default (): JSX.Element => {
  const { data } = useSelector((state: State) => state.results);
  const lang = useLanguage();

  if (!data || data.length === 0) {
    return <></>;
  }

  const selectedItems: string[] = [];

  return (
    <table className="table table-bordered table-hover">
      <thead>
        <tr>
          <th>{lang.titleChampion}</th>
          <th colSpan={4}>{lang.titleArtifacts}</th>
          <th>{lang.titleActions}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((result) => {
          if (!result.artifacts) {
            return null;
          }

          result.artifacts.artifacts.forEach((artifact) => {
            selectedItems.push(artifact.Guid);
          });

          return (
            <React.Fragment key={result.name}>
              <tr>
                <td colSpan={5} />
              </tr>
              <tr>
                <ChampionContainer>
                  <NameContainer>
                    {
                      lang[
                        `champion${result.champion.champion}` as keyof Language
                      ]
                    }
                  </NameContainer>

                  <ChampionPortrait
                    champion={result.champion.champion}
                    size={84}
                  />
                </ChampionContainer>
                <td>
                  <ArtifactDisplay
                    size={60}
                    artifact={result.artifacts.artifacts[0]}
                  />
                </td>
                <td>
                  <ArtifactDisplay
                    size={60}
                    artifact={result.artifacts.artifacts[1]}
                  />
                </td>
                <td>
                  <ArtifactDisplay
                    size={60}
                    artifact={result.artifacts.artifacts[2]}
                  />
                </td>
                <td rowSpan={2}>
                  <Wrapper>
                    <ArtifactDisplay
                      size={60}
                      artifact={result.artifacts.artifacts[6]}
                    />
                    <ArtifactDisplay
                      size={60}
                      artifact={result.artifacts.artifacts[7]}
                    />
                    <ArtifactDisplay
                      size={60}
                      artifact={result.artifacts.artifacts[8]}
                    />
                  </Wrapper>
                </td>
                <td>
                  <ProgressBar
                    current={result.artifacts.score}
                    max={result.artifacts.maxScore}
                    label={`${lang.titleScore}: ${result.artifacts.score}`}
                  />
                  {result.artifacts.bonus.map((set, index) => (
                    <SetDisplay
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${result.name}-${index}-${set}`}
                      set={set}
                    />
                  ))}{" "}
                  {!result.artifacts.bonusComplete &&
                    result.champion.methods ===
                      ChampionSetMethod.RequireSets && (
                      <span className="badge badge-warning">
                        {lang.commonWarning}
                      </span>
                    )}
                </td>
              </tr>
              <tr>
                <td>{methodDisplay(lang, result.champion.methods)}</td>
                <td>
                  <ArtifactDisplay
                    size={60}
                    artifact={result.artifacts.artifacts[3]}
                  />
                </td>
                <td>
                  <ArtifactDisplay
                    size={60}
                    artifact={result.artifacts.artifacts[4]}
                  />
                </td>
                <td>
                  <ArtifactDisplay
                    size={60}
                    artifact={result.artifacts.artifacts[5]}
                  />
                </td>
                <td>
                  <ResultsModal result={result} selectedItems={selectedItems} />
                </td>
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};
