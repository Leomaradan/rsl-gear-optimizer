/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from "react";
import styled from "styled-components";

const Image = styled.img<{ size?: number }>`
  ${(props) => (props.size ? `height: ${props.size}px` : "")};
`;

export default ({
  champion,
  size,
}: {
  champion: string;
  size?: number;
}): JSX.Element => (
  <Image size={size} src={`assets/avatar/${champion}.png`} alt={champion} />
);
