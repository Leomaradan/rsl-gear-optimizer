import React from "react";
import { useSelector } from "react-redux";

import type { IState } from "../../redux/reducers";

const ImportPage = React.lazy(
  () => import("../../components/Configuration/ImportExport")
);
const LoadingScreen = React.lazy(
  () => import("../../components/UI/LoadingScreen")
);

const Import = (): JSX.Element => {
  const status = useSelector((state: IState) => state.account.status);

  if (status !== "Done" && status !== "Error") {
    return <LoadingScreen />;
  }

  return <ImportPage />;
};

export default Import;
