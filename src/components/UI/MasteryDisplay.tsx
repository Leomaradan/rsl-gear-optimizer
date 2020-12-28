import Tooltip from "./Tooltip";

import { MasteryIconName } from "data/Masteries";
import type { ILanguageMastery } from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import type { IChampionMastery } from "models";

import React from "react";
import styled from "styled-components";

interface IDisplayMasteryProps {
  mastery: IChampionMastery;
  activated: boolean;
  disabled: boolean;
  size: number;
  onClick?(): void;
}

const Image = styled.img<Partial<IDisplayMasteryProps>>`
  ${(p) => (p.activated ? "" : "opacity: 0.2")};
  ${(p) => (p.disabled ? "filter: grayscale(100%);" : "")};
  ${(p) => (p.size ? `width: ${p.size}px` : "")};
`;

const DisplayMastery = ({
  mastery,
  activated,
  disabled,
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
        size={size}
        activated={activated}
        disabled={disabled}
        src={`assets/Masteries/${MasteryIconName[mastery]}.png`}
        alt={`${mastery}`}
        onClick={onClick}
      />
    </Tooltip>
  );
};

export default DisplayMastery;
