import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { useLanguage } from "../../lang/LanguageContext";
import type { IState } from "../../redux/reducers";

const BaseWrapper = React.lazy(() => import("../UI/Wrapper"));

const ChampionAdd = React.lazy(() => import("./ChampionConfigurationAdd"));
const ChampionsListRow = React.lazy(
  () => import("./ChampionConfigurationsListRow")
);

const Wrapper = styled(BaseWrapper)`
  justify-content: space-between;
`;

const InnerWrapper = styled(Wrapper)`
  height: 30px;
  align-items: center;
  gap: 15px;
`;

const ChampionsList = (): JSX.Element => {
  const championConfigurations = useSelector(
    (state: IState) => state.championConfigurations
  );
  const lang = useLanguage();

  const lengthIndex = championConfigurations.data.length - 1;

  return (
    <>
      <Wrapper>
        <h1>{lang.ui.title.champions}</h1>
        <InnerWrapper>
          <ChampionAdd />
        </InnerWrapper>
      </Wrapper>
      <Table bordered hover striped variant="dark">
        <thead>
          <tr>
            <th>{lang.ui.title.champion}</th>
            <th>{lang.ui.title.activeSets}</th>
            <th>{lang.ui.title.statsPriority}</th>
            <th>{lang.ui.title.method}</th>
            <th>{lang.ui.title.actions}</th>
          </tr>
        </thead>
        <tbody>
          {championConfigurations.data.map((champion, index) => (
            <ChampionsListRow
              champion={champion}
              index={index}
              key={champion.Id}
              lengthIndex={lengthIndex}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ChampionsList;
