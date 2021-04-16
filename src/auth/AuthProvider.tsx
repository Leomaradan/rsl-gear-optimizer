import localforage from "localforage";
import React, { ReactNode, useState } from "react";

import AuthContext, { IAuthContextDefinition } from "./AuthContext";

interface IAuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: IAuthProviderProps): JSX.Element => {
  const [authToken, setAuthToken] = useState<string | undefined>();

  const provider: IAuthContextDefinition = {
    authToken,
    isAuth: authToken !== undefined,
    setAuthToken: (token) => {
      console.log("setAuthToken", { token });
      if (!token) {
        console.log("Removing auth-token");
        void localforage.removeItem("auth-token");
      } else {
        console.log("Set auth-token");
        void localforage.setItem("auth-token", token).then(() => {
          setAuthToken(token);
        });
      }
    },
  };

  return (
    <AuthContext.Provider value={provider}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
