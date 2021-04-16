import localforage from "localforage";
import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import styled from "styled-components";

import AuthContext, { IAuthContextDefinition } from "./auth/AuthContext";
import LanguageContext, {
  ILanguageContextDefinition,
} from "./lang/LanguageContext";
import { loginWithTokenThunk } from "./redux/accountSlice";
import { loadArtifactsThunk } from "./redux/artifactsSlice";
import { loadConfigurationsThunk } from "./redux/championConfigurationsSlice";
import { loadChampionsThunk } from "./redux/championsSlice";
import type { IState } from "./redux/reducers";

const Menu = React.lazy(() => import("./Menu"));
const Routes = React.lazy(() => import("./Routes"));

const Main = styled.main`
  padding-top: 100px;
`;

const App = (): JSX.Element => {
  const {
    dictionary: lang,
    userLanguageChange,
  } = useContext<ILanguageContextDefinition>(LanguageContext);

  const { setAuthToken, authToken } = useContext<IAuthContextDefinition>(
    AuthContext
  );

  const dispatch = useDispatch();

  const loginStatus = useSelector((state: IState) => state.account.status);
  const championStatus = useSelector((state: IState) => state.champions.status);
  const artifactStatus = useSelector((state: IState) => state.artifacts.status);
  const configurationStatus = useSelector(
    (state: IState) => state.championConfigurations.status
  );

  console.log({
    loginStatus,
    championStatus,
    artifactStatus,
    configurationStatus,
  });

  useEffect(() => {
    void localforage.getItem<string>("rcml-lang").then((defaultLanguage) => {
      let language = defaultLanguage as string;
      if (!defaultLanguage) {
        language = window.navigator.language.substring(0, 2);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userLanguageChange(language as any);
    });
  }, [userLanguageChange]);

  useEffect(() => {
    void localforage.getItem<string>("auth-token").then((token) => {
      setAuthToken(token ?? undefined);
    });
  }, [setAuthToken]);

  /**
   * Retreive the account
   */
  useEffect(() => {
    if (loginStatus === "Idle") {
      dispatch(
        loginWithTokenThunk(
          authToken,
          (data) => {
            console.log("Account receive", { data });

            setAuthToken(data.token);

            userLanguageChange(data.language);
          },
          () => {
            console.log("Account not receive");

            setAuthToken();
          }
        )
      );
    }
  }, [authToken, dispatch, loginStatus, setAuthToken, userLanguageChange]);

  /**
   * Load the champions
   */
  useEffect(() => {
    if (championStatus === "Idle") {
      // Call the thunk
      dispatch(loadChampionsThunk());
    }
  }, [authToken, championStatus, dispatch, loginStatus]);

  /**
   * Load the artifacts
   */
  useEffect(() => {
    if (artifactStatus === "Idle") {
      // Call the thunk
      dispatch(loadArtifactsThunk());
    }
  }, [artifactStatus, authToken, championStatus, dispatch, loginStatus]);

  /**
   * Load the config
   */
  useEffect(() => {
    if (configurationStatus === "Idle") {
      // Call the thunk
      dispatch(loadConfigurationsThunk());
    }
  }, [
    artifactStatus,
    authToken,
    championStatus,
    configurationStatus,
    dispatch,
    loginStatus,
  ]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{lang.ui.title.siteTitle}</title>
        <meta content={lang.ui.title.siteDescription} name="description" />
        <link href="https://raid-gear-optimizer.com" rel="canonical" />
      </Helmet>
      <Router basename={process.env.PUBLIC_URL}>
        <Menu />
        <Main>
          <Container>
            <Routes />
          </Container>
        </Main>
      </Router>
    </>
  );
};

export default App;
