import { ClansIconName } from "data";
import type { IClans } from "models";

import React from "react";
import styled from "styled-components";

const Image = styled.img<{ size?: number }>`
  ${(props) => (props.size ? `width: ${props.size}px` : "")};
`;

interface IClanDisplayProps {
  clan: IClans;
  size?: number;
}

const ClanDisplay = ({ clan, size }: IClanDisplayProps): JSX.Element => (
  <Image
    size={size}
    src={`assets/Factions/${ClansIconName[clan]}.png`}
    alt={`${clan}`}
  />
);

export default ClanDisplay;
