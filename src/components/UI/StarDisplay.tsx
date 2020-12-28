import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
`;

const Image = styled.img<{ size: number }>`
  width: ${(p) => p.size}px;
`;

const StarDisplay = ({
  stars,
  size,
  awaken,
}: {
  stars: number;
  size?: number;
  awaken?: number;
}): JSX.Element => {
  const starsJSX = [];

  for (let index = 0; index < stars; index += 1) {
    const isAwaken = index + 1 <= (awaken ?? 0);

    starsJSX.push(
      <Image
        size={size ?? 15}
        key={index}
        src={`assets/Misc/${isAwaken ? "awaken_star" : "regular_star"}.png`}
        alt="Stars"
      />
    );
  }

  return <Wrapper>{starsJSX}</Wrapper>;
};

export default StarDisplay;
