import ArtifactsListRow from "./ArtifactsListRow";
import { useLanguage } from "lang/LanguageContext";
import { Artifact } from "models";
import React from "react";

interface ArtifactsListTableProps {
  artifacts: Artifact[];
}

export default (props: ArtifactsListTableProps): JSX.Element => {
  const { artifacts } = props;
  const lang = useLanguage();

  return (
    <table className="table table-dark table-striped table-bordered table-hover">
      <thead>
        <tr>
          <th>{lang.titleArtifacts}</th>

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
