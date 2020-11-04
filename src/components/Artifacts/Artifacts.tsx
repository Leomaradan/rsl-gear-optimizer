import ArtifactsList from "./ArtifactsList";
import ArtifactAdd from "./ArtifactAdd";
import { State } from "redux/reducers";

import SetDisplay from "components/UI/SetDisplay";
import Accordion, { AccordionSection } from "components/UI/Accordion";
import { useLanguage } from "lang/LanguageContext";
import { Language } from "lang/language";
import BaseWrapper from "components/UI/Wrapper";
import Stack from "components/UI/Stack";
import SelectArtifactDisplay from "components/Configuration/SelectArtifactDisplay";
import {
  SortedExistingSets,
  AdvancedSets,
  SortedExistingClans,
  Clans,
  Sets,
} from "models";
import Tabs from "components/UI/Tabs";
import ClanDisplay from "components/UI/ClanDisplay";
import styled from "styled-components";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { Plus } from "react-bootstrap-icons";

const Wrapper = styled(BaseWrapper)`
  justify-content: space-between;
`;

const InnerWrapper = styled(Wrapper)`
  height: 30px;
  align-items: center;
  gap: 15px;
`;

const Artifacts = (): JSX.Element => {
  const artifacts = useSelector((state: State) => state.artifacts);

  const lang = useLanguage();
  const sectionArtifacts: AccordionSection[] = [];
  const sectionAccessories: AccordionSection[] = [];

  const [isAccessory, setAccessory] = useState(false);

  SortedExistingSets.forEach((set) => {
    const filterArtifacts = artifacts.filter(
      (i) => i.Set === set && i.Clan === Clans.Null
    );

    if (filterArtifacts.length > 0) {
      sectionArtifacts.push({
        key: set,
        title: (
          <>
            <SetDisplay set={set} size={30} />{" "}
            {lang[`set${set}` as keyof Language]} (
            {AdvancedSets.includes(set) ? 4 : 2})
          </>
        ),
        widget: <ArtifactAdd set={set} label={<Plus />} />,
        content: <ArtifactsList artifacts={filterArtifacts} />,
      });
    }
  });

  SortedExistingClans.forEach((clan) => {
    const filterArtifacts = artifacts.filter(
      (i) => i.Clan === clan && i.Set === Sets.Null
    );

    if (filterArtifacts.length > 0) {
      sectionAccessories.push({
        key: clan,
        title: (
          <>
            <ClanDisplay clan={clan} size={30} />{" "}
            {lang[`clan${clan}` as keyof Language]}
          </>
        ),
        widget: <ArtifactAdd isAccessory clan={clan} label={<Plus />} />,
        content: <ArtifactsList artifacts={filterArtifacts} />,
      });
    }
  });

  return (
    <Stack>
      <Wrapper>
        <h1>{lang.titleArtifacts}</h1>
        <InnerWrapper>
          <ArtifactAdd isAccessory={isAccessory} />
          <SelectArtifactDisplay inline />
        </InnerWrapper>
      </Wrapper>
      <Tabs
        onChange={(id) => {
          setAccessory(id === "accessories");
        }}
        tabs={[
          {
            id: "artifacts",
            title: "titleArtifacts",
            page: <Accordion section={sectionArtifacts} />,
          },
          {
            id: "accessories",
            title: "titleAccessories",
            page: <Accordion section={sectionAccessories} />,
          },
        ]}
      />
    </Stack>
  );
};

export default Artifacts;
