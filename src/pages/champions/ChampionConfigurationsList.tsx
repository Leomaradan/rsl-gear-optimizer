import React from "react";
import { useSelector } from "react-redux";

import type { IState } from "../../redux/reducers";

const ChampionConfigurationsListPage = React.lazy(
  () =>
    import("../../components/ChampionConfigurations/ChampionConfigurationsList")
);
const LoadingScreen = React.lazy(
  () => import("../../components/UI/LoadingScreen")
);

const ChampionConfigurationsList = (): JSX.Element => {
  const statusAccount = useSelector((state: IState) => state.account.status);
  const statusChampions = useSelector(
    (state: IState) => state.champions.status
  );
  const statusChampionsConfiguration = useSelector(
    (state: IState) => state.championConfigurations.status
  );

  if (statusAccount !== "Done" && statusAccount !== "Error") {
    return <LoadingScreen />;
  }

  if (statusChampions !== "Done" && statusChampions !== "Error") {
    return <LoadingScreen />;
  }

  if (
    statusChampionsConfiguration !== "Done" &&
    statusChampionsConfiguration !== "Error"
  ) {
    return <LoadingScreen />;
  }

  return <ChampionConfigurationsListPage />;
};

export default ChampionConfigurationsList;
