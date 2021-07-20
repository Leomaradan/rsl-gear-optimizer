import React from "react";
import { Redirect } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext";

const Logout = (): JSX.Element => {
  const { setAuthToken } = useAuth();

  setAuthToken();

  return <Redirect to="/" />;
};

export default Logout;
