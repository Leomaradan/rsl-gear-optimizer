import StarDisplay from "./StarDisplay";
import ChampionPortrait from "./ChampionPortrait";
import Tooltip from "./Tooltip";

import getColour from "process/getColour";
import { useLanguage } from "lang/LanguageContext";
import type { IState } from "redux/reducers";
import type { ILanguageStat } from "lang/language";
import { SlotsIconName, SetsIconName } from "data";
import type { IArtifact, IStat, IStatsFull } from "models";

import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

interface IArtifactDisplayProps {
  artifact?: IArtifact;
  size?: number;
  faded?: boolean;
  showChampion?: false;
}

const ArtifactWrapper = styled.div<{
  artifact: IArtifact;
  size: number;
  faded: boolean;
}>`
  width: ${(p) => p.size ?? 100}px;
  height: ${(p) => p.size ?? 100}px;
  border: ${(p) => Math.ceil(p.size / 20)}px solid
    ${(p) => getColour(p.artifact.Rarity)};
  background-color: white;
  position: relative;
  ${(p) => (p.faded ? "opacity: 0.5;" : "")}
`;

const ArtifactImage = styled.img`
  width: 100%;
  position: absolute;
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
`;

const ChampionContainer = styled.div<{ size: number }>`
  top: ${(p) => p.size / 6}px;
  left: -${(p) => Math.ceil(p.size / 20)}px;
  border: ${(p) => Math.ceil(p.size / 60)}px solid white;
  position: absolute;
`;

const Yellow = styled.span`
  color: yellowgreen;
`;

const ArtifactDisplay = ({
  artifact,
  size: baseSize,
  faded,
  showChampion,
}: IArtifactDisplayProps): JSX.Element => {
  const lang = useLanguage();

  const champion = useSelector((state: IState) =>
    state.champions.find((c) => c.Guid === artifact?.Champion)
  );

  if (!artifact) {
    return <></>;
  }

  const filename = artifact.isAccessory
    ? `FactionAccessories/${artifact.Clan}_${SlotsIconName[artifact.Slot]}`
    : `ItemSets/${SetsIconName[artifact.Set]}_${SlotsIconName[artifact.Slot]}`;
  const size = baseSize ?? 100;

  if (artifact.Rarity === "") {
    return (
      <ArtifactWrapper artifact={artifact} size={size} faded={!!faded}>
        <ArtifactImage
          src="./assets/UnknownItem.jpg"
          alt={`${artifact.Set} ${artifact.Slot}`}
        />
      </ArtifactWrapper>
    );
  }

  const statsDisplay = (stats: IStat, value: number) =>
    ["ATK%", "C.DMG", "C.RATE", "DEF%", "HpPercent"].includes(stats)
      ? `${value}%`
      : value;

  const subStatDisplay = (stat: IStatsFull) => (
    <>
      {lang.stat.short[stat.Stats as keyof ILanguageStat]}
      {stat.Roll !== undefined && stat.Roll !== 0 && `(${stat.Roll})`}{" "}
      {stat.Value && statsDisplay(stat.Stats, stat.Value)}
      {stat.Rune !== undefined && stat.Rune !== 0 && (
        <Yellow>+{statsDisplay(stat.Stats, stat.Rune)}</Yellow>
      )}
    </>
  );

  const tooltipMessage = (
    <ul>
      <li>
        <strong>
          {lang.stat.short[artifact.MainStats as keyof ILanguageStat]}{" "}
          {artifact.MainStatsValue &&
            statsDisplay(artifact.MainStats, artifact.MainStatsValue)}
        </strong>
      </li>
      {[0, 1, 2, 3].map((statIndex) => {
        const stat = artifact.SubStats[statIndex];

        return <li key={`sub-${statIndex}`}>{stat && subStatDisplay(stat)}</li>;
      })}
    </ul>
  );

  return (
    <Tooltip id={artifact.Guid} text={tooltipMessage}>
      <ArtifactWrapper artifact={artifact} size={size} faded={!!faded}>
        <ArtifactImage
          src={`assets/${filename}.png`}
          alt={`${artifact.Set} ${artifact.Slot}`}
        />
        <StarContainer size={size}>
          <StarDisplay
            size={size / 6 - Math.ceil(size / 20)}
            stars={artifact.Quality}
          />
        </StarContainer>
        {champion && showChampion !== false && (
          <ChampionContainer size={size}>
            <ChampionPortrait champion={champion} size={size / 2.5} />
          </ChampionContainer>
        )}

        <Level size={size}>
          {artifact.Level > 0 ? `+${artifact.Level}` : ""}
        </Level>
      </ArtifactWrapper>
    </Tooltip>
  );
};

export default ArtifactDisplay;
