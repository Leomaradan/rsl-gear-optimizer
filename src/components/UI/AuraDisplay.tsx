import { AuraIconName } from "../../data";
import type { IAura } from "../../models";

import styled from "styled-components";

const Image = styled.img<{ size?: number }>`
  width: ${(p) => (p.size ? `${p.size}px` : "100%")};
`;

interface IAuraDisplayProps {
  aura: IAura;
  size?: number;
}

const AuraDisplay = ({ aura, size }: IAuraDisplayProps): JSX.Element => {
  return (
    <Image
      alt={`${aura.type}`}
      size={size}
      src={`assets/Aura/${AuraIconName[aura.type]}.png`}
    />
  );
};

AuraDisplay.defaultProps = {
  size: undefined,
};

export default AuraDisplay;
