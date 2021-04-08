import React from "react";
import { Plus } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import styled from "styled-components";

import ArtifactAdd from "../components/Artifacts/ArtifactAdd";
import ArtifactsList from "../components/Artifacts/ArtifactsList";
import Accordion, { IAccordionSection } from "../components/UI/Accordion";
import ClanDisplay from "../components/UI/ClanDisplay";
import Stack from "../components/UI/Stack";
import BaseWrapper from "../components/UI/Wrapper";
import { SortedExistingClans } from "../data";
import { useLanguage } from "../lang/LanguageContext";
import type { ILanguageClan } from "../lang/language";
import type { IState } from "../redux/reducers";

const Wrapper = styled(BaseWrapper)`
  justify-content: space-between;
`;

const InnerWrapper = styled(Wrapper)`
  height: 30px;
  align-items: center;
  gap: 15px;
`;

const Accessories = (): JSX.Element => {
  const artifacts = useSelector((state: IState) => state.artifacts);

  const lang = useLanguage();
  const sectionAccessories: IAccordionSection[] = [];

  SortedExistingClans.forEach((clan) => {
    const filterArtifacts = artifacts.filter(
      (i) => i.Clan === clan && i.Set === ""
    );

    if (filterArtifacts.length > 0) {
      sectionAccessories.push({
        key: clan,
        title: (
          <>
            <ClanDisplay clan={clan} size={30} />{" "}
            {lang.clan[clan as keyof ILanguageClan]}
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
        <h1>{lang.ui.title.artifacts}</h1>
        <InnerWrapper>
          <ArtifactAdd isAccessory />
        </InnerWrapper>
      </Wrapper>
      <Accordion section={sectionAccessories} />
    </Stack>
  );
};

export default Accessories;
