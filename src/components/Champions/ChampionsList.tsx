import ChampionAdd from "./ChampionAdd";
import ChampionsListRow from "./ChampionsListRow";
import BaseWrapper from "components/UI/Wrapper";
import { State } from "redux/reducers";
import { useLanguage } from "lang/LanguageContext";
import React from "react";
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
  const champions = useSelector((state: State) => state.champions);
  const lang = useLanguage();

  const lengthIndex = champions.length - 1;

  return (
    <>
      <Wrapper>
        <h1>{lang.titleChampions}</h1>
        <InnerWrapper>
          <ChampionAdd />
        </InnerWrapper>
      </Wrapper>
      <table className="table table-dark table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>{lang.titleChampion}</th>
            <th>{lang.titleActiveSets}</th>
            <th>{lang.titleStatsPriority}</th>
            <th>{lang.titleMethod}</th>
            <th>{lang.titleActions}</th>
          </tr>
        </thead>
        <tbody>
          {champions.map((champion, index) => (
            <ChampionsListRow
              key={champion.Guid}
              champion={champion}
              index={index}
              lengthIndex={lengthIndex}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ChampionsList;
