import Tooltip from "./Tooltip";
import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import { Sets, SetsIconName } from "models";
import React from "react";
import styled from "styled-components";

const Image = styled.img<{ size?: number }>`
  ${(props) => (props.size ? `width: ${props.size}px` : "")};
`;

export default ({ set, size }: { set: Sets; size?: number }): JSX.Element => {
  const lang = useLanguage();
  return (
    <Tooltip id={set} text={lang[`set${set}` as keyof Language]}>
      <Image
        size={size}
        src={`assets/ItemSetIcons/${SetsIconName[set]}.png`}
        alt={`${set}`}
      />
    </Tooltip>
  );
};
