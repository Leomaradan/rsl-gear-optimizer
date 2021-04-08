import React from "react";
import styled from "styled-components";

import type { IArtifact } from "../../models";
import ArtifactDisplay from "../UI/ArtifactDisplay";
import Stack from "../UI/Stack";
import Wrapper from "../UI/Wrapper";

import ArtifactEditGrid from "./ArtifactEditGrid";

interface IArtifactsListGridProps {
  artifacts: IArtifact[];
  readOnly?: boolean;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
`;

const ArtifactsListGrid = (props: IArtifactsListGridProps): JSX.Element => {
  const { artifacts, readOnly } = props;

  return (
    <Grid>
      {artifacts.map((artifact) => (
        <Stack key={artifact.Guid}>
          <ArtifactDisplay artifact={artifact} size={120} />
          {!readOnly && (
            <Wrapper>
              <ArtifactEditGrid artifact={artifact} />
            </Wrapper>
          )}
        </Stack>
      ))}
    </Grid>
  );
};

ArtifactsListGrid.defaultProps = {
  readOnly: false,
};

export default ArtifactsListGrid;
