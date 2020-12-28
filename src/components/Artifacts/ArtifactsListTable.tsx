import ArtifactsListRow from "./ArtifactsListRow";

import { useLanguage } from "lang/LanguageContext";
import type { IArtifact } from "models";

import React from "react";
import { Table } from "react-bootstrap";

interface IArtifactsListTableProps {
  artifacts: IArtifact[];
  readOnly?: boolean;
}

const ArtifactsListTable = (props: IArtifactsListTableProps): JSX.Element => {
  const { artifacts, readOnly } = props;
  const lang = useLanguage();

  return (
    <Table variant="dark" striped bordered hover>
      <thead>
        <tr>
          <th>{lang.ui.title.artifacts}</th>

          <th>{lang.ui.title.mainStats}</th>

          <th>{lang.ui.title.stats1}</th>

          <th>{lang.ui.title.stats2}</th>

          <th>{lang.ui.title.stats3}</th>

          <th>{lang.ui.title.stats4}</th>

          <th>{lang.ui.title.champion}</th>

          {!readOnly && <th>{lang.ui.title.actions}</th>}
        </tr>
      </thead>
      <tbody>
        {artifacts.map((artifact) => (
          <ArtifactsListRow
            key={artifact.Guid}
            artifact={artifact}
            readOnly={readOnly}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default ArtifactsListTable;
