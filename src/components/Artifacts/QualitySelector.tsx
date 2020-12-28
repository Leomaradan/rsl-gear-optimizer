import type { IStars } from "models";

import React from "react";
import styled from "styled-components";

interface IStatsSelectorProps {
  maxQuality?: IStars;
  currentQuality?: IStars;
  disabled?: boolean;
  onChange: (quality: IStars) => void;
}

const Image = styled.img<{ disabled: boolean }>`
  width: 15px;
  height: 15px;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
`;

const Wrapper = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  width: 125px;
`;

const QualitySelector = ({
  maxQuality,
  currentQuality,
  onChange,
  disabled,
}: IStatsSelectorProps): JSX.Element => {
  const styleInactive: React.CSSProperties = {
    filter: "grayscale(100%)",
  };

  const stars = [1, 2, 3, 4, 5, 6].filter(
    (n) => n <= (maxQuality ?? 6)
  ) as IStars[];

  return (
    <Wrapper id="selectQuality">
      {stars.map((star) => (
        <Image
          disabled={disabled ?? false}
          key={star}
          src="assets/Misc/regular_star.png"
          style={star <= (currentQuality ?? 1) ? {} : styleInactive}
          alt={`${star} Star`}
          onClick={() => {
            if (!disabled) {
              onChange(star);
            }
          }}
        />
      ))}
    </Wrapper>
  );
};

export default QualitySelector;
