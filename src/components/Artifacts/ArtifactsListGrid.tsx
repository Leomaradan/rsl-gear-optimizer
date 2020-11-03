import ArtifactEditGrid from "./ArtifactEditGrid";
import ArtifactDisplay from "components/UI/ArtifactDisplay";

import Stack from "components/UI/Stack";
import Wrapper from "components/UI/Wrapper";
import { Artifact } from "models";
import styled from "styled-components";
import React from "react";

interface ArtifactsListGridProps {
  artifacts: Artifact[];
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
`;

export default (props: ArtifactsListGridProps): JSX.Element => {
  const { artifacts } = props;

  return (
    <Grid>
      {artifacts.map((artifact) => (
        <Stack>
          <ArtifactDisplay size={120} artifact={artifact} />
          <Wrapper>
            <ArtifactEditGrid artifact={artifact} />
          </Wrapper>
        </Stack>
      ))}
    </Grid>
  );
};
