import Tooltip from "./Tooltip";

import { SetsIconName } from "../../data";
import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageSet } from "../../lang/language";
import type { ISets } from "../../models";

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
        alt={`${set}`}
        size={size}
        src={`assets/ItemSetIcons/${SetsIconName[set]}.png`}
      />
    </Tooltip>
  );
};

SetDisplay.defaultProps = {
  size: undefined,
};

export default SetDisplay;
