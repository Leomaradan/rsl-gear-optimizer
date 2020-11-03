import { Stars } from "models";
import React from "react";
import styled from "styled-components";

interface StatsSelectorProps {
  maxQuality?: Stars;
  currentQuality?: Stars;
  onChange: (quality: Stars) => void;
}

const Image = styled.img`
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  width: 125px;
`;

export default ({
  maxQuality,
  currentQuality,
  onChange,
}: StatsSelectorProps): JSX.Element => {
  const styleInactive: React.CSSProperties = {
    filter: "grayscale(100%)",
  };

  const stars = [1, 2, 3, 4, 5, 6].filter(
    (n) => n <= (maxQuality ?? 6)
  ) as Stars[];

  return (
    <Wrapper id="selectQuality">
      {stars.map((star) => (
        <Image
          key={star}
          src="assets/Misc/regular_star.png"
          style={star <= (currentQuality ?? 1) ? {} : styleInactive}
          alt={`${star} Star`}
          onClick={() => {
            onChange(star);
          }}
        />
      ))}
    </Wrapper>
  );
};
