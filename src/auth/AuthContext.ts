import emptyFunction from "process/emptyFunction";

import { createContext, useContext } from "react";

export interface IAuthContextDefinition {
  isAuth: boolean;
  authToken?: string;
  username?: string;
  setAuthToken: (token?: string) => void;
}

const AuthContext = createContext<IAuthContextDefinition>({
  isAuth: false,
  setAuthToken: emptyFunction,
});

export const useAuth = (): IAuthContextDefinition => useContext(AuthContext);

export default AuthContext;
