import ChampionAdd from "./ChampionAdd";
import ChampionsListRow from "./ChampionsListRow";
import Wrapper from "components/UI/Wrapper";
import { State } from "redux/reducers";
import { useLanguage } from "lang/LanguageContext";
import React from "react";
import { useSelector } from "react-redux";

const ChampionsList = (): JSX.Element => {
  const champions = useSelector((state: State) => state.champions);
  const lang = useLanguage();

  const lengthIndex = champions.length - 1;

  return (
    <>
      <h1>{lang.titleChampions}</h1>
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>{lang.titleChampion}</th>
            <th>{lang.titleActiveSets}</th>
            <th>{lang.titleStatsPriority}</th>
            <th>{lang.titleGauntletsStats}</th>
            <th>{lang.titleChestplateStats}</th>
            <th>{lang.titleBootsStats}</th>
            <th>{lang.titleMethod}</th>
            <th>{lang.titleActions}</th>
          </tr>
        </thead>
        <tbody>
          {champions.map((champion, index) => (
            <ChampionsListRow
              key={champion.name}
              champion={champion}
              index={index}
              lengthIndex={lengthIndex}
            />
          ))}

          <tr>
            <td colSpan={7} />
            <td>
              <Wrapper>
                <ChampionAdd />
              </Wrapper>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default ChampionsList;
