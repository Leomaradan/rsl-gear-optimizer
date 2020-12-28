import ChampionAdd from "./ChampionConfigurationAdd";
import ChampionsListRow from "./ChampionConfigurationsListRow";

import BaseWrapper from "components/UI/Wrapper";
import type { IState } from "redux/reducers";
import { useLanguage } from "lang/LanguageContext";

import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Table } from "react-bootstrap";

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

  const lengthIndex = championConfigurations.length - 1;

  return (
    <>
      <Wrapper>
        <h1>{lang.ui.title.champions}</h1>
        <InnerWrapper>
          <ChampionAdd />
        </InnerWrapper>
      </Wrapper>
      <Table variant="dark" striped bordered hover>
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
          {championConfigurations.map((champion, index) => (
            <ChampionsListRow
              key={champion.Guid}
              champion={champion}
              index={index}
              lengthIndex={lengthIndex}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ChampionsList;
