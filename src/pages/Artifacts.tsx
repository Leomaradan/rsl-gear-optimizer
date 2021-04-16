import React from "react";
import { Spinner } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import styled from "styled-components";

import type { IAccordionSection } from "../components/UI/Accordion";

import { SortedExistingSets, AdvancedSets } from "../data";
import { useLanguage } from "../lang/LanguageContext";
import type { ILanguageSet } from "../lang/language";
import type { IState } from "../redux/reducers";

const ArtifactAdd = React.lazy(
  () => import("../components/Artifacts/ArtifactAdd")
);
const ArtifactsList = React.lazy(
  () => import("../components/Artifacts/ArtifactsList")
);
const Accordion = React.lazy(() => import("../components/UI/Accordion"));
const SetDisplay = React.lazy(() => import("../components/UI/SetDisplay"));
const Stack = React.lazy(() => import("../components/UI/Stack"));
const BaseWrapper = React.lazy(() => import("../components/UI/Wrapper"));
const LoadingScreen = React.lazy(
  () => import("../components/UI/LoadingScreen")
);

const Wrapper = styled(BaseWrapper)`
  justify-content: space-between;
`;

const InnerWrapper = styled(Wrapper)`
  height: 30px;
  align-items: center;
  gap: 15px;
`;

const Artifacts = (): JSX.Element => {
  const artifacts = useSelector((state: IState) => state.artifacts);

  const lang = useLanguage();
  const sectionArtifacts: IAccordionSection[] = [];

  SortedExistingSets.forEach((set) => {
    const filterArtifacts = artifacts.data.filter(
      (i) => i.Set === set && i.Clan === ""
    );

    if (filterArtifacts.length > 0) {
      sectionArtifacts.push({
        key: set,
        title: (
          <>
            <SetDisplay set={set} size={30} />{" "}
            {lang.set[set as keyof ILanguageSet]} (
            {AdvancedSets.includes(set) ? 4 : 2})
          </>
        ),
        widget: <ArtifactAdd set={set} label={<Plus />} />,
        content: <ArtifactsList artifacts={filterArtifacts} />,
      });
    }
  });

  if (artifacts.status !== "Done" && artifacts.status !== "Error") {
    return <LoadingScreen />;
  }

  return (
    <Stack>
      <Wrapper>
        <h1>{lang.ui.title.artifacts}</h1>
        <InnerWrapper>
          <ArtifactAdd />
        </InnerWrapper>
      </Wrapper>
      <Accordion section={sectionArtifacts} />
    </Stack>
  );
};

export default Artifacts;
