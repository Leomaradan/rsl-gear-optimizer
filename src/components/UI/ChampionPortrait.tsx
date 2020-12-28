import type { IChampion } from "models";

import React from "react";
import styled from "styled-components";

const Image = styled.img<{ size?: number; autoWidth?: boolean }>`
  ${(props) => (props.size ? `height: ${props.size}px` : "")};
  ${(props) => (props.autoWidth ? `width: 100%` : "")};
`;

interface IChampionPortraitProps {
  champion: IChampion;
  size?: number;
  autoWidth?: boolean;
}

const ChampionPortrait = ({
  champion,
  size,
  autoWidth,
}: IChampionPortraitProps): JSX.Element => (
  <Image
    size={size}
    autoWidth={autoWidth}
    src={`assets/avatar/${champion.Name}.png`}
    alt={champion.Name}
  />
);

export default ChampionPortrait;
