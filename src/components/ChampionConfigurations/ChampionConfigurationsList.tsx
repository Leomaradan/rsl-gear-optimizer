import ChampionAdd from "./ChampionConfigurationAdd";
import ChampionsListRow from "./ChampionConfigurationsListRow";

import BaseWrapper from "../UI/Wrapper";
import { useLanguage } from "../../lang/LanguageContext";
import type { IState } from "../../redux/reducers";

import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import styled from "styled-components";

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
          {championConfigurations.map((champion, index) => (
            <ChampionsListRow
              champion={champion}
              index={index}
              key={champion.Guid}
              lengthIndex={lengthIndex}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ChampionsList;