import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { SetsIconName, SlotsIconName } from "../../data";
import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageStat } from "../../lang/language";
import type { IArtifact, IStat, IStatsFull } from "../../models";
import getColour from "../../process/getColour";
import type { IState } from "../../redux/reducers";

const ChampionPortrait = React.lazy(() => import("./ChampionPortrait"));
const StarDisplay = React.lazy(() => import("./StarDisplay"));
const Tooltip = React.lazy(() => import("./Tooltip"));

interface IArtifactDisplayProps {
  artifact?: IArtifact;
  faded?: boolean;
  showChampion?: false;
  size?: number;
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
  faded,
  showChampion,
  size,
}: Required<IArtifactDisplayProps>): JSX.Element => {
  const lang = useLanguage();

  const champion = useSelector((state: IState) =>
    state.champions.data.find((c) => c.Id === artifact?.Champion)
  );

  if (!artifact) {
    return <></>;
  }

  const filename = artifact.isAccessory
    ? `FactionAccessories/${artifact.Clan}_${SlotsIconName[artifact.Slot]}`
    : `ItemSets/${SetsIconName[artifact.Set]}_${SlotsIconName[artifact.Slot]}`;

  if (artifact.Rarity === "") {
    return (
      <ArtifactWrapper artifact={artifact} faded={!!faded} size={size}>
        <ArtifactImage
          alt={`${artifact.Set} ${artifact.Slot}`}
          src="./assets/UnknownItem.jpg"
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
    <Tooltip id={artifact.Id} text={tooltipMessage}>
      <ArtifactWrapper artifact={artifact} faded={!!faded} size={size}>
        <ArtifactImage
          alt={`${artifact.Set} ${artifact.Slot}`}
          src={`assets/${filename}.png`}
        />
        <StarContainer size={size}>
          <StarDisplay
            width={size / 6 - Math.ceil(size / 20)}
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

ArtifactDisplay.defaultProps = {
  artifact: undefined,
  faded: false,
  showChampion: undefined,
  size: undefined,
};

export default ArtifactDisplay;
