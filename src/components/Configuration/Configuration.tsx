import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { useLanguage } from "../../lang/LanguageContext";
import type { IArtifactsDisplayMode, IGenerationMethod } from "../../models";
import { setOption } from "../../redux/configurationSlice";
import type { IState } from "../../redux/reducers";
import LanguageSelector from "../UI/LanguageSelector";
import Popover from "../UI/Popover";
import RadioButtons from "../UI/RadioButtons";
import Toggle from "../UI/Toggle";

import { FormInput, FormLabel, FormRow } from "./Layout";

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
              selectedOption={configuration.generationMethod}
            />
          </FormInput>
        </FormRow>
        <FormRow>
          <FormLabel>{lang.ui.title.artifactsDisplayMode}</FormLabel>
          <FormInput>
            <RadioButtons
              inline
              name="selectArtifactDisplayMode"
              onChange={handleChangeArtifactDisplay}
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
              selectedOption={configuration.artifactsDisplay}
            />
          </FormInput>
        </FormRow>
      </form>
    </>
  );
};

export default Configuration;
