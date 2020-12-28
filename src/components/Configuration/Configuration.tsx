import { FormRow, FormInput, FormLabel } from "./Layout";

import LanguageSelector from "components/UI/LanguageSelector";
import RadioButtons from "components/UI/RadioButtons";
import { useLanguage } from "lang/LanguageContext";
import { setOption } from "redux/configurationSlice";
import type { IState } from "redux/reducers";
import Toggle from "components/UI/Toggle";
import type { IArtifactsDisplayMode, IGenerationMethod } from "models";
import Popover from "components/UI/Popover";

import { useDispatch, useSelector } from "react-redux";
import React from "react";

const Configuration = (): JSX.Element => {
  const lang = useLanguage();

  const configuration = useSelector((state: IState) => state.configuration);

  const dispatch = useDispatch();

  const handleChangeGenerationMethod = (value: IGenerationMethod) => {
    dispatch(setOption({ option: "generationMethod", value }));
  };

  const handleChangeExcludeWorn = (value: boolean) => {
    dispatch(setOption({ option: "excludeWornArtifact", value }));
  };

  const handleChangeArtifactDisplay = (value: IArtifactsDisplayMode) => {
    switch (value) {
      case "Grid":
        dispatch(
          setOption({
            option: "artifactsDisplay",
            value: "Grid",
          })
        );
        break;
      case "Table":
      default:
        dispatch(
          setOption({
            option: "artifactsDisplay",
            value: "Table",
          })
        );
    }
  };

  return (
    <>
      <h1>{lang.ui.title.config}</h1>
      <form>
        <FormRow>
          <FormLabel>{lang.ui.title.language}</FormLabel>
          <FormInput>
            <LanguageSelector />
          </FormInput>
        </FormRow>
        <FormRow>
          <FormLabel>{lang.ui.option.excludeWornArtifacts}</FormLabel>
          <FormInput>
            <Toggle
              currentState={configuration.excludeWornArtifact}
              name="excludeWornArtifact"
              onToggle={handleChangeExcludeWorn}
            />
          </FormInput>
        </FormRow>
        <FormRow>
          <FormLabel>{lang.ui.title.generationMethods}</FormLabel>
          <FormInput>
            <RadioButtons
              name="selectGenerationMethods"
              onChange={handleChangeGenerationMethod}
              selectedOption={configuration.generationMethod}
              options={[
                {
                  text: (
                    <>
                      {lang.ui.option.generationEasyMode}{" "}
                      <Popover
                        id="optionGenerationEasyMode"
                        title={lang.ui.option.generationEasyMode}
                        content={lang.ui.option.generationEasyModeHelper}
                      />
                    </>
                  ),
                  value: "Easy",
                },
                {
                  text: (
                    <>
                      {lang.ui.option.generationRealValues}{" "}
                      <Popover
                        id="optionGenerationRealValues"
                        title={lang.ui.option.generationRealValues}
                        content={lang.ui.option.generationRealValuesHelper}
                      />
                    </>
                  ),
                  value: "RealValue",
                },
                {
                  text: (
                    <>
                      {lang.ui.option.generationTheoricalValues}{" "}
                      <Popover
                        id="optionGenerationEasyMode"
                        title={lang.ui.option.generationTheoricalValues}
                        content={lang.ui.option.generationTheoricalValuesHelper}
                      />
                    </>
                  ),
                  value: "TheoricalValue",
                },
              ]}
            />
          </FormInput>
        </FormRow>
        <FormRow>
          <FormLabel>{lang.ui.title.artifactsDisplayMode}</FormLabel>
          <FormInput>
            <RadioButtons
              name="selectArtifactDisplayMode"
              onChange={handleChangeArtifactDisplay}
              selectedOption={configuration.artifactsDisplay}
              inline
              options={[
                {
                  text: lang.ui.option.artifactsDisplayAsTable,
                  value: "Table",
                },
                {
                  text: lang.ui.option.artifactsDisplayAsGrid,
                  value: "Grid",
                },
              ]}
            />
          </FormInput>
        </FormRow>
      </form>
    </>
  );
};

export default Configuration;
