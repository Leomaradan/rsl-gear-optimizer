/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import Artifact from "models/Artifact";
import { SetsIconName } from "models/Sets";
import { SlotsIconName } from "models/Slots";
import getColour from "process/getColour";
import React from "react";
import styled from "styled-components";

export interface ArtifactIconProps {
  item: Artifact;
  size?: number;
}

const ArtifactIconWrapper = styled.img<ArtifactIconProps>`
  width: ${(props) => props.size ?? 100}px;
  height: ${(props) => props.size ?? 100}px;
  border: 3px solid ${(props) => getColour(props.item.Rarity)};
`;

export default ({ item, size }: ArtifactIconProps): JSX.Element => {
  try {
    return (
      <ArtifactIconWrapper
        item={item}
        size={size}
        src={require(`raid-data/images/ItemSets/${SetsIconName[item.Set]}_${
          SlotsIconName[item.Slot]
        }.png`)}
        alt={`${item.Set} ${item.Slot}`}
      />
    );
  } catch {
    return (
      <ArtifactIconWrapper
        item={item}
        size={size}
        alt={`${item.Set} ${item.Slot}`}
      />
    );
  }
};
