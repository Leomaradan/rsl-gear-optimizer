import { Artifact, SetsIconName, SlotsIconName } from "models";
import getColour from "process/getColour";
import React from "react";
import styled from "styled-components";

interface ArtifactIconProps {
  item: Artifact;
  size?: number;
}

const ArtifactIconWrapper = styled.img<ArtifactIconProps>`
  width: ${(props) => props.size ?? 100}px;
  height: ${(props) => props.size ?? 100}px;
  border: 3px solid ${(props) => getColour(props.item.Rarity)};
`;

export default ({ item, size }: ArtifactIconProps): JSX.Element => (
  <ArtifactIconWrapper
    item={item}
    size={size}
    src={`assets/ItemSets/${SetsIconName[item.Set]}_${
      SlotsIconName[item.Slot]
    }.png`}
    alt={`${item.Set} ${item.Slot}`}
  />
);
