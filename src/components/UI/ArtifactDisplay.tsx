import StarDisplay from "./StarDisplay";
import ChampionPortrait from "./ChampionPortrait";
import getColour from "process/getColour";
import { Artifact, SetsIconName, SlotsIconName } from "models";
import React from "react";
import styled from "styled-components";

interface ArtifactDisplayProps {
  artifact: Artifact;
  size?: number;
  faded?: boolean;
}

const ArtifactWrapper = styled.div<{
  artifact: Artifact;
  size: number;
  faded: boolean;
}>`
  width: ${(p) => p.size ?? 100}px;
  height: ${(p) => p.size ?? 100}px;
  border: ${(p) => Math.ceil(p.size / 20)}px solid
    ${(p) => getColour(p.artifact.Rarity)};
  background-color: white;
  position: relative;
  ${(p) => (p.faded ? "opacity: 0.5;" : "")}
`;

const ArtifactImage = styled.img`
  width: 100%;
  position: absolute;
`;

const Level = styled.div<{ size: number }>`
  position: absolute;
  bottom: -${(p) => Math.ceil(p.size / 60)}px;
  right: ${(p) => Math.ceil(p.size / 30)}px;
  color: white;
  font-size: ${(p) => Math.ceil(p.size / 4)}px;
  text-shadow: ${(p) => Math.ceil(p.size / 60)}px
    ${(p) => Math.ceil(p.size / 60)}px black;
`;

const StarContainer = styled.div<{ size: number }>`
  width: ${(p) => p.size - Math.ceil(p.size / 20)}px;
  position: absolute;
`;

const ChampionContainer = styled.div<{ size: number }>`
  top: ${(p) => p.size / 6}px;
  left: -${(p) => Math.ceil(p.size / 20)}px;
  border: ${(p) => Math.ceil(p.size / 60)}px solid white;
  position: absolute;
`;

const ArtifactDisplay = ({
  artifact,
  size: baseSize,
  faded,
}: ArtifactDisplayProps): JSX.Element => {
  const filename = artifact.isAccessory
    ? `FactionAccessories/${artifact.Clan}_${SlotsIconName[artifact.Slot]}`
    : `ItemSets/${SetsIconName[artifact.Set]}_${SlotsIconName[artifact.Slot]}`;
  const size = baseSize ?? 100;

  if (artifact.Rarity === -1) {
    return (
      <ArtifactWrapper artifact={artifact} size={size} faded={!!faded}>
        <ArtifactImage
          src="assets/UnknownItem.jpg"
          alt={`${artifact.Set} ${artifact.Slot}`}
        />
      </ArtifactWrapper>
    );
  }

  return (
    <ArtifactWrapper artifact={artifact} size={size} faded={!!faded}>
      <ArtifactImage
        src={`assets/${filename}.png`}
        alt={`${artifact.Set} ${artifact.Slot}`}
      />
      <StarContainer size={size}>
        <StarDisplay
          size={size / 6 - Math.ceil(size / 20)}
          stars={artifact.Quality}
        />
      </StarContainer>
      {artifact.Champion && (
        <ChampionContainer size={size}>
          <ChampionPortrait champion={artifact.Champion} size={size / 2.5} />
        </ChampionContainer>
      )}

      <Level size={size}>
        {artifact.Level > 0 ? `+${artifact.Level}` : ""}
      </Level>
    </ArtifactWrapper>
  );
};

export default ArtifactDisplay;
