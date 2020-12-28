import LanguageContext, {
  ILanguageContextDefinition,
} from "lang/LanguageContext";
import AuthContext, { IAuthContextDefinition } from "auth/AuthContext";
import Menu from "Menu";
import Routes from "Routes";

import localforage from "localforage";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Container } from "react-bootstrap";

const Main = styled.main`
  padding-top: 100px;
`;

const App = (): JSX.Element => {
  const { userLanguageChange, dictionary: lang } = useContext<
    ILanguageContextDefinition
  >(LanguageContext);

  const { setAuthToken } = useContext<IAuthContextDefinition>(AuthContext);

  useEffect(() => {
    localforage.getItem<string>("rcml-lang").then((defaultLanguage) => {
      let language = defaultLanguage as string;
      if (!defaultLanguage) {
        language = window.navigator.language.substring(0, 2);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userLanguageChange(language as any);
    });
  }, [userLanguageChange]);

  useEffect(() => {
    localforage.getItem<string>("auth-token").then((token) => {
      setAuthToken(token ?? undefined);
    });
  }, [setAuthToken]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{lang.ui.title.siteTitle}</title>
        <meta name="description" content={lang.ui.title.siteDescription} />
        <link rel="canonical" href="https://raid-gear-optimizer.com" />
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
