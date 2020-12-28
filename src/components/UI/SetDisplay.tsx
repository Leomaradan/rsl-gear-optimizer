import Tooltip from "./Tooltip";

import { useLanguage } from "lang/LanguageContext";
import type { ISets } from "models";
import type { ILanguageSet } from "lang/language";
import { SetsIconName } from "data";

import React from "react";
import styled from "styled-components";

const Image = styled.img<{ size?: number }>`
  ${(props) => (props.size ? `width: ${props.size}px` : "")};
`;

interface ISetDisplayProps {
  set: ISets;
  size?: number;
}

const SetDisplay = ({ set, size }: ISetDisplayProps): JSX.Element => {
  const lang = useLanguage();
  return (
    <Tooltip id={set} text={lang.set[set as keyof ILanguageSet]}>
      <Image
        size={size}
        src={`assets/ItemSetIcons/${SetsIconName[set]}.png`}
        alt={`${set}`}
      />
    </Tooltip>
  );
};

export default SetDisplay;
