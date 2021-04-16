import React from "react";
import { useSelector } from "react-redux";

import type { IState } from "../../redux/reducers";

const GameProgressionPage = React.lazy(
  () => import("../../components/Configuration/GameProgression")
);
const LoadingScreen = React.lazy(
  () => import("../../components/UI/LoadingScreen")
);

const GameProgression = (): JSX.Element => {
  const status = useSelector((state: IState) => state.account.status);

  if (status !== "Done" && status !== "Error") {
    return <LoadingScreen />;
  }

  return <GameProgressionPage />;
};

export default GameProgression;
