import SelectArtifactDisplay from "./SelectArtifactDisplay";
import ImportExport from "./ImportExport";
import ImportRaidExtract from "./ImportRaidExtract";
import LanguageSelector from "components/UI/LanguageSelector";
import RadioButtons from "components/UI/RadioButtons";
import { useLanguage } from "lang/LanguageContext";
import { setOption } from "redux/configurationSlice";
import { State } from "redux/reducers";
import Toggle from "components/UI/Toggle";
import { GenerationMethod } from "models";
import Popover from "components/UI/Popover";
import Stack from "components/UI/Stack";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import React from "react";

const FormRow = styled.div.attrs(() => ({ className: "form-group row" }))``;
const FormLabel = styled.label.attrs(() => ({
  className: "col-sm-4 col-form-label",
}))``;
const FormInput = styled.div.attrs(() => ({ className: "col-sm-8" }))``;

export default (): JSX.Element => {
  const lang = useLanguage();

  const configuration = useSelector((state: State) => state.configuration);

  const dispatch = useDispatch();

  const handleChangeGenerationMethod = (value: GenerationMethod) => {
    dispatch(setOption({ option: "generationMethod", value }));
  };

  const handleChangeExcludeWorn = (value: boolean) => {
    dispatch(setOption({ option: "excludeWornArtifact", value }));
  };

  return (
    <>
      <h1>{lang.titleConfig}</h1>
      <form>
        <FormRow>
          <FormLabel>{lang.optionLanguage}</FormLabel>
          <FormInput>
            <LanguageSelector />
          </FormInput>
        </FormRow>
        <FormRow>
          <FormLabel>{lang.optionExcludeWornArtifacts}</FormLabel>
          <FormInput>
            <Toggle
              currentState={configuration.excludeWornArtifact}
              name="excludeWornArtifact"
              onToggle={handleChangeExcludeWorn}
            />
          </FormInput>
        </FormRow>
        <FormRow>
          <FormLabel>{lang.optionGenerationMethods}</FormLabel>
          <FormInput>
            <RadioButtons
              name="selectGenerationMethods"
              onChange={handleChangeGenerationMethod}
              selectedOption={configuration.generationMethod}
              options={[
                {
                  text: (
                    <>
                      {lang.optionGenerationEasyMode}{" "}
                      <Popover
                        id="optionGenerationEasyMode"
                        title={lang.optionGenerationEasyMode}
                        content={lang.optionGenerationEasyModeHelper}
                      />
                    </>
                  ),
                  value: GenerationMethod.Easy,
                },
                {
                  text: (
                    <>
                      {lang.optionGenerationRealValues}{" "}
                      <Popover
                        id="optionGenerationRealValues"
                        title={lang.optionGenerationRealValues}
                        content={lang.optionGenerationRealValuesHelper}
                      />
                    </>
                  ),
                  value: GenerationMethod.RealValue,
                },
                {
                  text: (
                    <>
                      {lang.optionGenerationTheoricalValues}{" "}
                      <Popover
                        id="optionGenerationEasyMode"
                        title={lang.optionGenerationTheoricalValues}
                        content={lang.optionGenerationTheoricalValuesHelper}
                      />
                    </>
                  ),
                  value: GenerationMethod.TheoricalValue,
                  disabled: true,
                },
              ]}
            />
          </FormInput>
        </FormRow>
        <FormRow>
          <FormLabel>{lang.optionArtifactsDisplayMode}</FormLabel>
          <FormInput>
            <SelectArtifactDisplay />
          </FormInput>
        </FormRow>
        <FormRow>
          <FormLabel>{lang.optionImportExport}</FormLabel>
          <FormInput>
            <Stack style={{ width: "300px" }}>
              <ImportExport />
              <ImportRaidExtract />
            </Stack>
          </FormInput>
        </FormRow>
      </form>
    </>
  );
};
