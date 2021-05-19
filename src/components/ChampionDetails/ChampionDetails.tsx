import React from "react";
import styled from "styled-components";

import { useLanguage } from "../../lang/LanguageContext";
import type {
  ILanguageAffinity,
  ILanguageRarity,
  ILanguageRole,
} from "../../lang/language";
import type { IChampion, IProfile } from "../../models";
import ChampionPortrait from "../UI/ChampionPortrait";
import StarDisplay from "../UI/StarDisplay";
import Tabs from "../UI/Tabs";

import ChampionDetailsArtifacts from "./ChampionDetailsArtifacts";
import ChampionDetailsMasteries from "./ChampionDetailsMasteries";
import ChampionDetailsStats from "./ChampionDetailsStats";
import ChampionProgression from "./ChampionProgression";
import ChampionDetailsStatsChart from "./ChampionDetailsStatsChart";

export interface IChampionDetailsProps {
  champion: IChampion;
  profile: IProfile;
}

const Container = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 150px 150px auto;
  grid-template-areas:
    "portrait . . progression"
    "portrait . . progression"
    "portrait . . progression"
    "tabs tabs tabs tabs";
`;

const PortraitContainer = styled.div`
  grid-area: portrait;
`;

const ProgressionContainer = styled.div`
  grid-area: progression;
`;

const TabsContainer = styled.div`
  grid-area: tabs;
`;

const ChampionDetails = ({
  champion,
  profile,
}: IChampionDetailsProps): JSX.Element => {
  const artifacts = profile.artifacts.filter(
    (a) => a.Champion === champion.Guid
  );

  const lang = useLanguage();

  return (
    <Container>
      <PortraitContainer>
        <ChampionPortrait champion={champion} size={100} />
      </PortraitContainer>
      <ProgressionContainer>
        <ChampionProgression champion={champion} />
      </ProgressionContainer>
      <div>{lang.rarity[champion.Rarity as keyof ILanguageRarity]}</div>
      <div>
        {lang.ui.title.level}: {champion.Level}
      </div>
      <div>
        <StarDisplay awaken={champion.Awaken} stars={champion.Quality} />
      </div>
      <div>{lang.affinity[champion.Affinity as keyof ILanguageAffinity]}</div>
      <div>{lang.role[champion.Role as keyof ILanguageRole]}</div>
      <div>
        {lang.ui.title.power}: {champion.Power}
      </div>
      <TabsContainer>
        <Tabs
          defaultTabs="stats"
          tabs={[
            {
              id: "stats",
              page: (
                <ChampionDetailsStats
                  champion={champion}
                  artifacts={artifacts}
                  profile={profile}
                />
              ),
              title: lang.ui.title.stat,
            },
            {
              id: "artifacts",
              page: (
                <ChampionDetailsArtifacts
                  artifacts={artifacts}
                  readOnly={!!profile.readOnly}
                />
              ),
              title: lang.ui.title.artifacts,
            },
            {
              id: "masteries",
              page: (
                <ChampionDetailsMasteries
                  champion={champion}
                  readOnly={!!profile.readOnly}
                />
              ),
              title: "Masteries",
            },
            {
              id: "chart",
              page: (
                <ChampionDetailsStatsChart
                  champion={champion}
                  artifacts={artifacts}
                  profile={profile}
                />
              ),
              title: "Charts",
            },
          ]}
        />
      </TabsContainer>
    </Container>
  );
};

export default ChampionDetails;
