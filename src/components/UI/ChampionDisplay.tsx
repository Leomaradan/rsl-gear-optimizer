import React from "react";
import styled from "styled-components";

import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageChampion } from "../../lang/language";
import type { IChampion } from "../../models";
import getColour from "../../process/getColour";

const AffinityDisplay = React.lazy(() => import("./AffinityDisplay"));
const AuraDisplay = React.lazy(() => import("./AuraDisplay"));
const ChampionPortrait = React.lazy(() => import("./ChampionPortrait"));
const StarDisplay = React.lazy(() => import("./StarDisplay"));
const Tooltip = React.lazy(() => import("./Tooltip"));

interface IChampionDisplayProps {
  champion: IChampion;
  height?: number;
}

const ChampionWrapper = styled.div<{
  champion: IChampion;
  height: number;
  width: number;
}>`
  width: ${(p) => p.width}px;
  height: ${(p) => p.height}px;
  border: ${(p) => Math.ceil(p.height / 20)}px solid
    ${(p) => getColour(p.champion.Rarity)};
  background-color: white;
  position: relative;
`;

const Level = styled.div<{ size: number }>`
  position: absolute;
  font-family: sans-serif;
  bottom: ${(p) => Math.ceil(p.size / 60)}px;
  right: ${(p) => Math.ceil(p.size / 30)}px;
  color: white;
  font-size: ${(p) => Math.ceil(p.size / 7)}px;

  text-shadow: -${(p) => Math.ceil(p.size / 100)}px ${(p) =>
        Math.ceil(p.size / 100)}px 0 #000,
    ${(p) => Math.ceil(p.size / 100)}px ${(p) => Math.ceil(p.size / 100)}px 0
      #000,
    ${(p) => Math.ceil(p.size / 100)}px -${(p) => Math.ceil(p.size / 100)}px 0 #000,
    -${(p) => Math.ceil(p.size / 100)}px -${(p) => Math.ceil(p.size / 100)}px 0
      #000;
`;

const VaultContainer = styled.div<{ size: number }>`
  position: absolute;
  bottom: ${(p) => Math.ceil(p.size * 0.2)}px;
  right: ${(p) => Math.ceil(p.size / 60)}px;
`;

const VaultImage = styled.img<{ size: number }>`
  width: ${(p) => Math.ceil(p.size * 0.2)}px;
`;

const StarContainer = styled.div<{ width: number }>`
  width: ${(p) => p.width * 0.7}px;
  position: absolute;
  top: 0;
`;

const ImageContainer = styled.div<{ height: number }>`
  //height: ${(p) => p.height * 0.9}px;
  position: absolute;
  top: 0;
  overflow: hidden;
`;

const AuraContainer = styled.div<{ width: number }>`
  width: ${(p) => Math.round(p.width * 0.29)}px;
  position: absolute;
  top: -${(p) => Math.ceil(p.width / 19)}px;
  right: -${(p) => Math.ceil(p.width / 9)}px;
`;

const AffinityContainer = styled.div<{ width: number }>`
  width: ${(p) => Math.round(p.width * 0.135)}px;
  position: absolute;
  bottom: 0;
  left: ${(p) => Math.ceil(p.width / 25)}px;
`;

const ChampionDisplay = ({
  champion,
  height: baseHeight,
}: IChampionDisplayProps): JSX.Element => {
  const lang = useLanguage();
  //console.log({ baseHeight });

  const height = baseHeight ?? 100;

  const width = Math.round(0.76 * height);

  return (
    <Tooltip
      id={champion.Id}
      text={lang.champion[champion.Name as keyof ILanguageChampion]}
    >
      <ChampionWrapper champion={champion} height={height} width={width}>
        <ImageContainer height={height}>
          <ChampionPortrait size={height} champion={champion} />
        </ImageContainer>
        <StarContainer width={width}>
          <StarDisplay
            awaken={champion.Awaken}
            width={width / 4.4}
            stars={champion.Quality}
          />
        </StarContainer>

        {champion.Aura && (
          <AuraContainer width={width}>
            <AuraDisplay aura={champion.Aura} />
          </AuraContainer>
        )}

        {champion.InVault && (
          <VaultContainer size={height}>
            <VaultImage
              size={height}
              alt="Vault icon"
              src="assets/Misc/storage_roominess.png"
            />
          </VaultContainer>
        )}

        <AffinityContainer width={width}>
          <AffinityDisplay affinity={champion.Affinity} />
        </AffinityContainer>

        <Level size={height}>{champion.Level}</Level>
      </ChampionWrapper>
    </Tooltip>
  );
};

ChampionDisplay.defaultProps = {
  height: 100,
};

export default ChampionDisplay;
