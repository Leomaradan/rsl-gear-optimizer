import React from "react";
import { useSelector } from "react-redux";

import type { IState } from "../../redux/reducers";

const ResultsPage = React.lazy(
  () => import("../../components/Results/Results")
);
const LoadingScreen = React.lazy(
  () => import("../../components/UI/LoadingScreen")
);

const Results = (): JSX.Element => {
  const status = useSelector((state: IState) => state.account.status);

  if (status !== "Done" && status !== "Error") {
    return <LoadingScreen />;
  }

  return <ResultsPage />;
};

export default Results;
