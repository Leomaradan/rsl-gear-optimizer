import React from "react";
import styled from "styled-components";

import { MasteryIconName } from "../../data/Masteries";
import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageMastery } from "../../lang/language";
import type { IChampionMastery } from "../../models";

const Tooltip = React.lazy(() => import("./Tooltip"));

interface IDisplayMasteryProps {
  activated: boolean;
  disabled: boolean;
  mastery: IChampionMastery;
  size: number;
  onClick?(): void;
}

const Image = styled.img<Partial<IDisplayMasteryProps>>`
  ${(p) => (p.activated ? "" : "opacity: 0.2")};
  ${(p) => (p.disabled ? "filter: grayscale(100%);" : "")};
  ${(p) => (p.size ? `width: ${p.size}px` : "")};
`;

const DisplayMastery = ({
  activated,
  disabled,
  mastery,
  onClick,
  size,
}: IDisplayMasteryProps): JSX.Element => {
  const lang = useLanguage();

  return (
    <Tooltip
      id={mastery}
      text={lang.masteries[mastery as keyof ILanguageMastery]}
    >
      <Image
        activated={activated}
        alt={`${mastery}`}
        disabled={disabled}
        onClick={onClick}
        size={size}
        src={`assets/Masteries/${MasteryIconName[mastery]}.png`}
      />
    </Tooltip>
  );
};

DisplayMastery.defaultProps = {
  onClick: undefined,
};

export default DisplayMastery;
