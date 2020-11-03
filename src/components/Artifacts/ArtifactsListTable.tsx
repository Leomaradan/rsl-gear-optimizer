import ArtifactsListRow from "./ArtifactsListRow";
import { useLanguage } from "lang/LanguageContext";
import { Artifact } from "models";
import React from "react";

export interface ArtifactsListTaleProps {
  artifacts: Artifact[];
}

export default (props: ArtifactsListTaleProps): JSX.Element => {
  const { artifacts } = props;
  const lang = useLanguage();

  return (
    <table className="table table-striped table-bordered table-hover">
      <thead>
        <tr>
          <th>{lang.titleSlot}</th>

          <th>{lang.titleSet}</th>

          <th>{lang.titleRarity}</th>

          <th>{lang.titleQuality}</th>

          <th>{lang.titleLevel}</th>

          <th>{lang.titleMainStats}</th>

          <th>{lang.titleStats1}</th>

          <th>{lang.titleStats2}</th>

          <th>{lang.titleStats3}</th>

          <th>{lang.titleStats4}</th>

          <th>{lang.titleChampion}</th>

          <th>{lang.titleActions}</th>
        </tr>
      </thead>
      <tbody>
        {artifacts.map((artifact) => (
          <ArtifactsListRow key={artifact.Guid} artifact={artifact} />
        ))}
      </tbody>
    </table>
  );
};
