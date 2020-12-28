import { useAuth } from "./AuthContext";

import React from "react";
import { Redirect } from "react-router-dom";

const Logout = (): JSX.Element => {
  const { setAuthToken } = useAuth();

  setAuthToken();

  return <Redirect to="/" />;
};

export default Logout;
