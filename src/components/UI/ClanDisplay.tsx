import { Clans, ClansIconName } from "models";
import React from "react";
import styled from "styled-components";

const Image = styled.img<{ size?: number }>`
  ${(props) => (props.size ? `width: ${props.size}px` : "")};
`;

export default ({
  clan,
  size,
}: {
  clan: Clans;
  size?: number;
}): JSX.Element => (
  <Image
    size={size}
    src={`assets/Factions/${ClansIconName[clan]}.png`}
    alt={`${clan}`}
  />
);
