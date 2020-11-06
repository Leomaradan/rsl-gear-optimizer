import Results from "./components/Results/Results";
import Artifacts from "./components/Artifacts/Artifacts";
import ChampionsList from "./components/Champions/ChampionsList";
import Home from "./Home";
import LanguageContext, {
  LanguageContextDefinition,
} from "lang/LanguageContext";
import Configuration from "components/Configuration/Configuration";
import localforage from "localforage";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import React, { useContext, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
} from "react-router-dom";

const Main = styled.main`
  padding-top: 100px;
`;

const App = (): JSX.Element => {
  const { userLanguageChange, dictionary: lang } = useContext<
    LanguageContextDefinition
  >(LanguageContext);

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

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{lang.siteTitle}</title>
        <meta name="description" content={lang.siteDescription} />
        <link rel="canonical" href="https://raid-gear-optimizer.com" />
      </Helmet>
      <Router>
        <Navbar bg="primary" expand="lg" variant="dark" fixed="top">
          <div className="container">
            <Link to="/" className="navbar-brand">
              <img
                alt=""
                src="./android-chrome-192x192.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              RAID Gear Optimizer
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <NavLink
                  to="/champions"
                  className="nav-link"
                  activeClassName="active"
                >
                  {lang.titleChampions}
                </NavLink>
                <NavLink
                  to="/artifacts"
                  className="nav-link"
                  activeClassName="active"
                >
                  {lang.titleArtifacts}
                </NavLink>
                <NavLink
                  to="/results"
                  className="nav-link"
                  activeClassName="active"
                >
                  {lang.titleResults}
                </NavLink>
                <NavLink
                  to="/config"
                  className="nav-link"
                  activeClassName="active"
                >
                  {lang.titleConfig}
                </NavLink>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
        <Main>
          <div className="container">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/champions">
                <ChampionsList />
              </Route>
              <Route path="/accessories">
                <Artifacts accessories />
              </Route>
              <Route path="/artifacts">
                <Artifacts />
              </Route>
              <Route path="/results">
                <Results />
              </Route>
              <Route path="/config">
                <Configuration />
              </Route>
            </Switch>
          </div>
        </Main>
      </Router>
    </>
  );
};

export default App;
