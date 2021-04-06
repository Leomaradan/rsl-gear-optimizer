import { AuraIconName } from "../../data";
import type { IAura, IChampionAffinity } from "../../models";

import styled from "styled-components";

const Image = styled.img<{ width?: number }>`
  width: ${(p) => (p.width ? `${p.width}px` : "100%")};
  filter: drop-shadow(1px 1px 1px #222);
`;

interface IAffinityDisplayProps {
  affinity: IChampionAffinity;
  width?: number;
}

const AffinityDisplay = ({
  affinity,
  width,
}: IAffinityDisplayProps): JSX.Element => {
  return (
    <Image
      alt={affinity}
      width={width}
      src={`assets/Affinity/${affinity.toLowerCase()}.png`}
    />
  );
};

AffinityDisplay.defaultProps = {
  width: undefined,
};

export default AffinityDisplay;
