import type { IChampion } from "../../models";

import React from "react";
import styled from "styled-components";

const Image = styled.img<{ size?: number; autoWidth?: boolean }>`
  ${(props) => (props.size ? `height: ${props.size}px` : "")};
  ${(props) => (props.autoWidth ? `width: 100%` : "")};
`;

interface IChampionPortraitProps {
  autoWidth?: boolean;
  champion: IChampion;
  size?: number;
}

const ChampionPortrait = ({
  autoWidth,
  champion,
  size,
}: IChampionPortraitProps): JSX.Element => (
  <Image
    alt={champion.Name}
    autoWidth={autoWidth}
    size={size}
    src={`assets/avatar/${champion.Name}.png`}
  />
);

ChampionPortrait.defaultProps = {
  autoWidth: false,
  size: undefined,
};

export default ChampionPortrait;
