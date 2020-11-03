import { Sets, SetsIconName } from "models";
import React from "react";
import styled from "styled-components";

const Image = styled.img<{ size?: number }>`
  ${(props) => (props.size ? `width: ${props.size}px` : "")};
`;

export default ({ set, size }: { set: Sets; size?: number }): JSX.Element => (
  <Image
    size={size}
    src={`assets/ItemSetIcons/${SetsIconName[set]}.png`}
    alt={`${set}`}
  />
);
