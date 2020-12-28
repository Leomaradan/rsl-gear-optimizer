import ResultsDetails from "./ResultsDetails";

import { useLanguage } from "lang/LanguageContext";
import type { IClans, ISets } from "models";
import generateCombination from "process/runWorker";
import type { IState } from "redux/reducers";
import ProgressBar from "components/UI/ProgressBar";
import ClanDisplay from "components/UI/ClanDisplay";
import SetDisplay from "components/UI/SetDisplay";
import type { ILanguageUiTask } from "lang/language";

import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

const Results = (): JSX.Element => {
  const lang = useLanguage();
  const dispatch = useDispatch();
  const championConfigurations = useSelector(
    (state: IState) => state.championConfigurations
  );
  const champions = useSelector((state: IState) => state.champions);
  const artifacts = useSelector((state: IState) => state.artifacts);
  const configuration = useSelector((state: IState) => state.configuration);
  const results = useSelector((state: IState) => state.results);

  const [progress, updateProgress] = useState({
    label: "",
    current: 0,
    max: 0,
  });

  const filteredChampions = championConfigurations.filter((c) => c.Activated);

  const activesSets = new Set<ISets>();
  const activesClans = new Set<IClans>();

  filteredChampions.forEach((champion) => {
    const sourceChampion = champions.find(
      (c) => c.Guid === champion.SourceChampion
    );
    if (sourceChampion) {
      activesClans.add(sourceChampion.Clan);
    }

    champion.Sets.forEach((sets) => {
      sets.forEach((set) => {
        activesSets.add(set);
      });
    });
  });

  const updateProgressMessage = (
    task: string,
    value: number,
    max: number
  ): void => {
    const label =
      max !== 0
        ? `${lang.ui.task[task as keyof ILanguageUiTask]} : ${value} / ${max}`
        : `${lang.ui.task[task as keyof ILanguageUiTask]} : ${value}`;
    const current = max ? value : 100;
    updateProgress({ label, current, max });
  };

  const generate = () => {
    generateCombination(
      dispatch,
      champions,
      filteredChampions,
      artifacts,
      configuration.generationMethod,
      configuration.excludeWornArtifact,
      updateProgressMessage
    );
  };

  return (
    <>
      <h1>{lang.ui.title.results}</h1>
      <ResultsDetails />
      <h2>{lang.ui.title.generationOptions}</h2>
      <Table variant="dark" striped bordered hover>
        <tbody>
          <tr>
            <td>{lang.ui.option.excludeWornArtifacts}</td>
            <td>
              {configuration.excludeWornArtifact
                ? lang.ui.common.yes
                : lang.ui.common.no}
            </td>
          </tr>
          <tr>
            <td>{lang.ui.title.generationMethods}</td>
            <td>
              {configuration.generationMethod === "Easy" &&
                lang.ui.option.generationEasyMode}
              {configuration.generationMethod === "RealValue" &&
                lang.ui.option.generationRealValues}
              {configuration.generationMethod === "TheoricalValue" &&
                lang.ui.option.generationTheoricalValues}
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <small>
                {configuration.generationMethod === "Easy" &&
                  lang.ui.option.generationEasyModeHelper}
                {configuration.generationMethod === "RealValue" &&
                  lang.ui.option.generationRealValuesHelper}
                {configuration.generationMethod === "TheoricalValue" &&
                  lang.ui.option.generationTheoricalValuesHelper}
              </small>
            </td>
          </tr>
          <tr>
            <td>{lang.ui.title.numberOfChampions}</td>
            <td>{filteredChampions.length}</td>
          </tr>
          <tr>
            <td>{lang.ui.title.numberOfArtifacts}</td>
            <td>{artifacts.length}</td>
          </tr>
          <tr>
            <td>{lang.ui.title.activeSets}</td>
            <td>
              {Array.from(activesSets).map((set) => (
                <SetDisplay key={set} set={set} size={30} />
              ))}
            </td>
          </tr>
          <tr>
            <td>{lang.ui.title.clan}</td>
            <td>
              {Array.from(activesClans).map((clan) => (
                <ClanDisplay key={clan} clan={clan} size={30} />
              ))}
            </td>
          </tr>
        </tbody>
      </Table>
      {results.status === "Processing" && (
        <ProgressBar
          current={progress.current}
          max={progress.max}
          label={progress.label}
        />
      )}
      <Button
        className="btn btn-primary"
        onClick={generate}
        disabled={results.status === "Processing"}
      >
        {lang.ui.button.generateCombination}
      </Button>
    </>
  );
};

export default Results;
