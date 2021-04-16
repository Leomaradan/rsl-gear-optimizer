import React from "react";
import { useSelector } from "react-redux";

import type { IState } from "../redux/reducers";

const ChampionsList = React.lazy(
  () => import("../components/Champions/ChampionsList")
);
const LoadingScreen = React.lazy(
  () => import("../components/UI/LoadingScreen")
);

const ChampionsListPage = (): JSX.Element => {
  const champions = useSelector((state: IState) => state.champions);
  const artifacts = useSelector((state: IState) => state.artifacts);
  const { arenaRank, greatHallBonus: greatHall } = useSelector(
    (state: IState) => state.configuration
  );

  if (champions.status !== "Done" && champions.status !== "Error") {
    return <LoadingScreen />;
  }

  if (artifacts.status !== "Done" && artifacts.status !== "Error") {
    return <LoadingScreen />;
  }

  return (
    <ChampionsList
      champions={champions.data}
      artifacts={artifacts.data}
      gameProgression={{ arenaRank, greatHallBonus: greatHall }}
    />
  );
};

export default ChampionsListPage;
