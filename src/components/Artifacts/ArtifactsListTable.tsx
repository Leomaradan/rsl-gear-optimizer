import React from "react";
import { Table } from "react-bootstrap";

import { useLanguage } from "../../lang/LanguageContext";
import type { IArtifact } from "../../models";

import ArtifactsListRow from "./ArtifactsListRow";

interface IArtifactsListTableProps {
  artifacts: IArtifact[];
  readOnly?: boolean;
}

const ArtifactsListTable = (props: IArtifactsListTableProps): JSX.Element => {
  const { artifacts, readOnly } = props;
  const lang = useLanguage();

  return (
    <Table bordered hover striped variant="dark">
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
            artifact={artifact}
            key={artifact.Guid}
            readOnly={readOnly}
          />
        ))}
      </tbody>
    </Table>
  );
};

ArtifactsListTable.defaultProps = {
  readOnly: false,
};

export default ArtifactsListTable;
