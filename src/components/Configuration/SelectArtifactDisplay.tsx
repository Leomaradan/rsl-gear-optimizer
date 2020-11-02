import RadioButtons from "components/UI/RadioButtons";
import { useLanguage } from "lang/LanguageContext";
import { ArtifactsDisplayMode } from "models/Configuration";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOption } from "redux/configurationSlice";
import { State } from "redux/reducers";

export default ({ inline }: { inline?: boolean }): JSX.Element => {
  const lang = useLanguage();

  const configuration = useSelector((state: State) => state.configuration);

  const dispatch = useDispatch();

  const handleChangeArtifactDisplay = (value: ArtifactsDisplayMode) => {
    switch (value) {
      case ArtifactsDisplayMode.Grid:
        dispatch(
          setOption({
            option: "artifactsDisplay",
            value: ArtifactsDisplayMode.Grid,
          })
        );
        break;
      case ArtifactsDisplayMode.Table:
      default:
        dispatch(
          setOption({
            option: "artifactsDisplay",
            value: ArtifactsDisplayMode.Table,
          })
        );
    }
  };

  return (
    <RadioButtons
      name="selectArtifactDisplayMode"
      onChange={handleChangeArtifactDisplay}
      selectedOption={configuration.artifactsDisplay}
      inline={inline}
      options={[
        {
          text: lang.optionArtifactsDisplayAsTable,
          value: ArtifactsDisplayMode.Table,
        },
        {
          text: lang.optionArtifactsDisplayAsGrid,
          value: ArtifactsDisplayMode.Grid,
        },
      ]}
    />
  );
};
