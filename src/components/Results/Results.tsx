import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import { GenerationMethod } from "models/Configuration";
import { ResultsStatus } from "models/Results";
import generateCombination from "process/runWorker";
import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { State } from "redux/reducers";
import ResultsDetails from "./ResultsDetails";

const Results = (): JSX.Element => {
  const lang = useLanguage();
  const dispatch = useDispatch();
  const champions = useSelector((state: State) => state.champions);
  const artifacts = useSelector((state: State) => state.artifacts);
  const configuration = useSelector((state: State) => state.configuration);
  const results = useSelector((state: State) => state.results);

  const [progress, updateProgress] = useState("");

  const filteredArtifacts = configuration.excludeWornArtifact
    ? artifacts.filter((c) => c.Champion === "" || !c.Champion)
    : artifacts;

  const filteredChampions = champions.filter((c) => c.activated);

  const updateProgressMessage = (task: string, value: number): void => {
    updateProgress(`${lang[task as keyof Language]}: ${value}`);
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
        </tbody>
      </table>
      {results.status === ResultsStatus.Processing && (
        <div className="progress">
          <div
            className="progress-bar progress-bar-striped bg-warning progress-bar-animated"
            role="progressbar"
            style={{ width: "100%" }}
          >
            {progress}
          </div>
        </div>
      )}
      <button
        type="button"
        className="btn btn-primary"
        onClick={generate}
        disabled={results.status === ResultsStatus.Processing}
      >
        {lang.btnGenerateCombination}
      </button>
    </>
  );
};

export default Results;
