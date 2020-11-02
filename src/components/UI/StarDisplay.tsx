import React from "react";
import styled from "styled-components";
import star from "raid-data/images/Misc/regular_star.png";

const Wrapper = styled.div`
  display: flex;
`;

const Image = styled.img<{ size: number }>`
  width: ${(p) => p.size}px;
`;

export default ({
  stars,
  size,
}: {
  stars: number;
  size?: number;
}): JSX.Element => {
  const starsJSX = [];

  for (let index = 0; index < stars; index += 1) {
    starsJSX.push(
      <Image size={size ?? 15} key={index} src={star} alt="Stars" />
    );
  }

  return <Wrapper>{starsJSX}</Wrapper>;
};
