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
import { SortedExistingSets, AdvancedSets } from "models";
import styled from "styled-components";
import { useSelector } from "react-redux";
import React from "react";

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
  const section: AccordionSection[] = [];

  SortedExistingSets.forEach((set) => {
    const filterArtifacts = artifacts.filter((i) => i.Set === set);

    if (filterArtifacts.length > 0) {
      section.push({
        key: set,
        title: (
          <>
            <SetDisplay set={set} size={30} />{" "}
            {lang[`set${set}` as keyof Language]} (
            {AdvancedSets.includes(set) ? 4 : 2})
          </>
        ),
        content: <ArtifactsList artifacts={filterArtifacts} />,
      });
    }
  });

  return (
    <Stack>
      <Wrapper>
        <h1>{lang.titleArtifacts}</h1>
        <InnerWrapper>
          <ArtifactAdd />
          <SelectArtifactDisplay inline />
        </InnerWrapper>
      </Wrapper>
      <Accordion section={section} />
    </Stack>
  );
};

export default Artifacts;
