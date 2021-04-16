import React from "react";
import { useSelector } from "react-redux";

import type { IState } from "../../redux/reducers";

const ConfigurationPage = React.lazy(
  () => import("../../components/Configuration/Configuration")
);
const LoadingScreen = React.lazy(
  () => import("../../components/UI/LoadingScreen")
);

const Configuration = (): JSX.Element => {
  const status = useSelector((state: IState) => state.account.status);

  if (status !== "Done" && status !== "Error") {
    return <LoadingScreen />;
  }

  return <ConfigurationPage />;
};

export default Configuration;
