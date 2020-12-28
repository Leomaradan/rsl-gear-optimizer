import ArtifactEditGrid from "./ArtifactEditGrid";

import ArtifactDisplay from "components/UI/ArtifactDisplay";
import Stack from "components/UI/Stack";
import Wrapper from "components/UI/Wrapper";
import type { IArtifact } from "models";

import styled from "styled-components";
import React from "react";

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
          <ArtifactDisplay size={120} artifact={artifact} />
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

export default ArtifactsListGrid;
