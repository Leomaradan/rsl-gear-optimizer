import ChampionDetailsStats from "./ChampionDetailsStats";
import ChampionDetailsMasteries from "./ChampionDetailsMasteries";
import ChampionDetailsArtifacts from "./ChampionDetailsArtifacts";

import type { IChampion, IProfile } from "models";
import Tabs from "components/UI/Tabs";
import ChampionPortrait from "components/UI/ChampionPortrait";
import { useLanguage } from "lang/LanguageContext";
import type {
  ILanguageAffinity,
  ILanguageRarity,
  ILanguageRole,
} from "lang/language";
import StarDisplay from "components/UI/StarDisplay";

import styled from "styled-components";
import React from "react";

export interface IChampionDetailsProps {
  champion: IChampion;
  profile: IProfile;
}

const Container = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 150px 150px auto;
  grid-template-areas:
    "portrait . ."
    "portrait . ."
    "portrait . ."
    "tabs tabs tabs";
`;

const PortraitContainer = styled.div`
  grid-area: portrait;
`;

const TabsContainer = styled.div`
  grid-area: tabs;
`;

const ChampionDetails = ({
  profile,
  champion,
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
      <div>{lang.rarity[champion.Rarity as keyof ILanguageRarity]}</div>
      <div>
        {lang.ui.title.level}: {champion.Level}
      </div>
      <div>
        <StarDisplay stars={champion.Quality} awaken={champion.Awaken} />
      </div>
      <div>{lang.affinity[champion.Affinity as keyof ILanguageAffinity]}</div>
      <div>{lang.role[champion.Role as keyof ILanguageRole]}</div>
      <div>
        {lang.ui.title.power}: {champion.Power}
      </div>
      <TabsContainer>
        <Tabs
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
          ]}
          defaultTabs="stats"
        />
      </TabsContainer>
    </Container>
  );
};

export default ChampionDetails;
