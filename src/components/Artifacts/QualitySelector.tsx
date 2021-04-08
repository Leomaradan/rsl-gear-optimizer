import type { IStars } from "../../models";

import type React from "react";
import styled from "styled-components";

interface IStatsSelectorProps {
  currentQuality?: IStars;
  disabled?: boolean;
  maxQuality?: IStars;
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
  currentQuality,
  disabled,
  maxQuality,
  onChange,
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
          alt={`${star} Star`}
          disabled={disabled ?? false}
          key={star}
          onClick={() => {
            if (!disabled) {
              onChange(star);
            }
          }}
          src="assets/Misc/regular_star.png"
          style={star <= (currentQuality ?? 1) ? {} : styleInactive}
        />
      ))}
    </Wrapper>
  );
};

QualitySelector.defaultProps = {
  currentQuality: 1,
  disabled: false,
  maxQuality: 6,
};

export default QualitySelector;
