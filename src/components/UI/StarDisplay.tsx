import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
`;

const offsetByIndex = [0, 0.4, 0.935, 1.46, 1.935, 2.35];

const Image = styled.img<{ height: number; width: number; index: number }>`
  height: ${(p) => p.height}px;
  width: ${(p) => p.width}px;
  position: absolute;
  left: ${(p) => p.width * offsetByIndex[p.index]}px;
`;

const StarDisplay = ({
  awaken,
  width: baseWidth,
  stars,
}: {
  stars: number;
  width?: number;
  awaken?: number;
}): JSX.Element => {
  const starsJSX = [];

  for (let index = 0; index < stars; index += 1) {
    const isAwaken = index + 1 <= (awaken ?? 0);

    const width = baseWidth ?? 15;
    const height = width * 0.9;

    starsJSX.push(
      <Image
        alt="Stars"
        key={index}
        height={height}
        width={width}
        index={index}
        src={`assets/Misc/${isAwaken ? "awaken_star" : "regular_star"}.png`}
      />
    );
  }

  return <Wrapper>{starsJSX}</Wrapper>;
};

StarDisplay.defaultProps = {
  width: 15,
  awaken: 0,
};

export default StarDisplay;
