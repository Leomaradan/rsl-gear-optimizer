/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from "react";
import styled from "styled-components";

const Image = styled.img<{ size?: number }>`
  ${(props) => (props.size ? `height: ${props.size}px` : "")};
`;

const MissinImage = styled.div<{ size?: number }>`
  ${(props) => (props.size ? `height: ${props.size}px` : "")};
`;

export default ({
  champion,
  size,
}: {
  champion: string;
  size?: number;
}): JSX.Element => {
  try {
    return (
      <Image
        size={size}
        src={require(`raid-data/images/avatar/${champion}.png`)}
        alt={champion}
      />
    );
  } catch {
    return <MissinImage />;
  }
};
