import type { IState } from "redux/reducers";
import ChampionsList from "components/Champions/ChampionsList";

import { useSelector } from "react-redux";
import React from "react";

const OwnChampionsList = (): JSX.Element => {
  const champions = useSelector((state: IState) => state.champions);
  const artifacts = useSelector((state: IState) => state.artifacts);
  const { arenaRank, greatHallBonus: greatHall } = useSelector(
    (state: IState) => state.configuration
  );

  return (
    <ChampionsList
      champions={champions}
      artifacts={artifacts}
      gameProgression={{ arenaRank, greatHallBonus: greatHall }}
    />
  );
};

export default OwnChampionsList;
