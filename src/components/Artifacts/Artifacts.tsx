import ArtifactsList from "./ArtifactsList";
import ArtifactAdd from "./ArtifactAdd";
import { State } from "redux/reducers";

import SetDisplay from "components/UI/SetDisplay";
import BtAccordion, { AccordionSection } from "components/UI/Accordion";
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
import ClanDisplay from "components/UI/ClanDisplay";
import styled from "styled-components";
import { useSelector } from "react-redux";
import React from "react";
import { Plus } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

const Wrapper = styled(BaseWrapper)`
  justify-content: space-between;
`;

const InnerWrapper = styled(Wrapper)`
  height: 30px;
  align-items: center;
  gap: 15px;
`;

const Artifacts = ({ accessories }: { accessories?: boolean }): JSX.Element => {
  const artifacts = useSelector((state: State) => state.artifacts);

  const lang = useLanguage();
  const sectionArtifacts: AccordionSection[] = [];
  const sectionAccessories: AccordionSection[] = [];

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
          <ArtifactAdd isAccessory={accessories} />
          <SelectArtifactDisplay inline />
        </InnerWrapper>
      </Wrapper>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <NavLink
            to="/artifacts"
            className="nav-link"
            activeClassName="active"
          >
            {lang.titleArtifacts}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/accessories"
            className="nav-link"
            activeClassName="active"
          >
            {lang.titleAccessories}
          </NavLink>
        </li>
      </ul>
      {!accessories && <BtAccordion section={sectionArtifacts} />}
      {accessories && <BtAccordion section={sectionAccessories} />}
    </Stack>
  );
};

export default Artifacts;
