import Results from "./components/Results/Results";
import Artifacts from "./components/Artifacts/Artifacts";
import ChampionsList from "./components/Champions/ChampionsList";
import Home from "./Home";
import Tabs, { TabProps } from "./components/UI/Tabs";
import LanguageContext, {
  LanguageContextDefinition,
} from "lang/LanguageContext";
import Configuration from "components/Configuration/Configuration";
import localforage from "localforage";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import React, { useContext, useEffect } from "react";

const Layout = styled.div.attrs(() => ({ className: "container" }))`
  padding: 30px;
  padding-top: 5rem;
  max-width: calc(100vw - 50px);
  background-color: var(--container);
  min-height: calc(100vh - 30px);
`;

const App = (): JSX.Element => {
  const { userLanguageChange, dictionary: lang } = useContext<
    LanguageContextDefinition
  >(LanguageContext);

  const tabs: TabProps[] = [
    {
      id: "home",
      title: "titleHome",
      page: (
        <Layout>
          <Home />
        </Layout>
      ),
    },
    {
      id: "champions",
      title: "titleChampions",
      page: (
        <Layout>
          <ChampionsList />
        </Layout>
      ),
    },
    {
      id: "artifacts",
      title: "titleArtifacts",
      page: (
        <Layout>
          <Artifacts />
        </Layout>
      ),
    },
    {
      id: "results",
      title: "titleResults",
      page: (
        <Layout>
          <Results />
        </Layout>
      ),
    },
    {
      id: "config",
      title: "titleConfig",
      page: (
        <Layout>
          <Configuration />
        </Layout>
      ),
    },
  ];

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
      <Tabs tabs={tabs} main defaultTabs="home" />
    </>
  );
};

export default App;
