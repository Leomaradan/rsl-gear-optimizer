import ChampionPortrait from "./ChampionPortrait";
import StarDisplay from "./StarDisplay";
import Tooltip from "./Tooltip";

import type { IChampion } from "models";
import getColour from "process/getColour";
import { useLanguage } from "lang/LanguageContext";
import type { ILanguageChampion } from "lang/language";

import styled from "styled-components";
import React from "react";

interface IChampionDisplayProps {
  champion: IChampion;
  size?: number;
}

const ChampionWrapper = styled.div<{
  champion: IChampion;
  size: number;
}>`
  width: ${(p) => p.size * 0.79}px;
  height: ${(p) => p.size}px;
  border: ${(p) => Math.ceil(p.size / 20)}px solid
    ${(p) => getColour(p.champion.Rarity)};
  background-color: white;
  position: relative;
`;

const Level = styled.div<{ size: number }>`
  position: absolute;
  bottom: -${(p) => Math.ceil(p.size / 60)}px;
  right: ${(p) => Math.ceil(p.size / 30)}px;
  color: white;
  font-size: ${(p) => Math.ceil(p.size / 4)}px;
  text-shadow: ${(p) => Math.ceil(p.size / 60)}px
    ${(p) => Math.ceil(p.size / 60)}px black;
`;

const StarContainer = styled.div<{ size: number }>`
  width: ${(p) => p.size - Math.ceil(p.size / 20)}px;
  position: absolute;
  top: 0;
`;

const ImageContainer = styled.div<{ size: number }>`
  height: ${(p) => p.size * 0.9}px;
  position: absolute;
  top: 0;
  overflow: hidden;
`;

const ChampionDisplay = ({
  champion,
  size: baseSize,
}: IChampionDisplayProps): JSX.Element => {
  const lang = useLanguage();
  const size = baseSize ?? 100;
  const hSize = size * 0.79;
  return (
    <Tooltip
      id={champion.Guid}
      text={lang.champion[champion.Name as keyof ILanguageChampion]}
    >
      <ChampionWrapper champion={champion} size={size}>
        <ImageContainer size={size}>
          <ChampionPortrait champion={champion} autoWidth />
        </ImageContainer>
        <StarContainer size={hSize}>
          <StarDisplay
            size={hSize / 6}
            stars={champion.Quality}
            awaken={champion.Awaken}
          />
        </StarContainer>

        <Level size={hSize}>{champion.Level}</Level>
      </ChampionWrapper>
    </Tooltip>
  );
};

export default ChampionDisplay;
