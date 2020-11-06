import ResultsDetails from "./ResultsDetails";
import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import { Clans, GenerationMethod, ResultsStatus, Sets } from "models";

import generateCombination from "process/runWorker";
import { State } from "redux/reducers";
import ProgressBar from "components/UI/ProgressBar";
import ClanDisplay from "components/UI/ClanDisplay";
import SetDisplay from "components/UI/SetDisplay";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";

const Results = (): JSX.Element => {
  const lang = useLanguage();
  const dispatch = useDispatch();
  const champions = useSelector((state: State) => state.champions);
  const artifacts = useSelector((state: State) => state.artifacts);
  const configuration = useSelector((state: State) => state.configuration);
  const results = useSelector((state: State) => state.results);

  const [progress, updateProgress] = useState({
    label: "",
    current: 0,
    max: 0,
  });

  const filteredArtifacts = configuration.excludeWornArtifact
    ? artifacts.filter((c) => c.Champion === "" || !c.Champion)
    : artifacts;

  const filteredChampions = champions.filter((c) => c.Activated);

  const activesSets = new Set<Sets>();
  const activesClans = new Set<Clans>();

  filteredChampions.forEach((champion) => {
    activesClans.add(champion.Clan);
    champion.Sets.forEach((set) => {
      activesSets.add(set);
    });
  });

  const updateProgressMessage = (
    task: string,
    value: number,
    max: number
  ): void => {
    const label =
      max !== 0
        ? `${lang[task as keyof Language]} : ${value} / ${max}`
        : `${lang[task as keyof Language]} : ${value}`;
    const current = max ? value : 100;
    updateProgress({ label, current, max });
  };

  const generate = () => {
    generateCombination(
      dispatch,
      filteredChampions,
      filteredArtifacts,
      configuration.generationMethod,
      updateProgressMessage
    );
  };

  return (
    <>
      <h1>{lang.titleResults}</h1>
      <ResultsDetails />
      <h2>{lang.titleGenerationOptions}</h2>
      <table className="table table-bordered table-hover">
        <tbody>
          <tr>
            <td>{lang.optionExcludeWornArtifacts}</td>
            <td>
              {configuration.excludeWornArtifact
                ? lang.commonYes
                : lang.commonNo}
            </td>
          </tr>
          <tr>
            <td>{lang.optionGenerationMethods}</td>
            <td>
              {configuration.generationMethod === GenerationMethod.Easy &&
                lang.optionGenerationEasyMode}
              {configuration.generationMethod === GenerationMethod.RealValue &&
                lang.optionGenerationRealValues}
              {configuration.generationMethod ===
                GenerationMethod.TheoricalValue &&
                lang.optionGenerationTheoricalValues}
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <small>
                {configuration.generationMethod === GenerationMethod.Easy &&
                  lang.optionGenerationEasyModeHelper}
                {configuration.generationMethod ===
                  GenerationMethod.RealValue &&
                  lang.optionGenerationRealValuesHelper}
                {configuration.generationMethod ===
                  GenerationMethod.TheoricalValue &&
                  lang.optionGenerationTheoricalValuesHelper}
              </small>
            </td>
          </tr>
          <tr>
            <td>{lang.titleNumberOfChampions}</td>
            <td>{filteredChampions.length}</td>
          </tr>
          <tr>
            <td>{lang.titleNumberOfArtifacts}</td>
            <td>{filteredArtifacts.length}</td>
          </tr>
          <tr>
            <td>{lang.titleActiveSets}</td>
            <td>
              {Array.from(activesSets).map((set) => (
                <SetDisplay key={set} set={set} size={30} />
              ))}
            </td>
          </tr>
          <tr>
            <td>{lang.titleClan}</td>
            <td>
              {Array.from(activesClans).map((clan) => (
                <ClanDisplay key={clan} clan={clan} size={30} />
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      {results.status === ResultsStatus.Processing && (
        <ProgressBar
          current={progress.current}
          max={progress.max}
          label={progress.label}
        />
      )}
      <Button
        className="btn btn-primary"
        onClick={generate}
        disabled={results.status === ResultsStatus.Processing}
      >
        {lang.btnGenerateCombination}
      </Button>
    </>
  );
};

export default Results;
