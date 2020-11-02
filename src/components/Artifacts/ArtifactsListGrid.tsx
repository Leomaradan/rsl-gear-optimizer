import React from "react";
import styled from "styled-components";
import Artifact from "models/Artifact";
import ArtifactDisplay from "components/UI/ArtifactDisplay";
import Stack from "components/UI/FlexStack";
import Wrapper from "components/UI/FlexWrapper";
import ArtifactEditGrid from "./ArtifactEditGrid";

export interface ArtifactsListGridProps {
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
