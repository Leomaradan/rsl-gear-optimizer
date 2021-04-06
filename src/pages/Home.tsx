import { useLanguage } from "../lang/LanguageContext";

import React from "react";
import { Button, Jumbotron } from "react-bootstrap";

const Home = (): JSX.Element => {
  const lang = useLanguage();
  return (
    <Jumbotron>
      <h1 className="display-4">{lang.ui.title.siteTitle}</h1>
      <p className="lead">{lang.ui.title.siteDescription}</p>
      <hr className="my-4" />
      <p>{lang.ui.message.homeWarning}</p>
      <hr className="my-4" />
      <p>{lang.ui.message.homeContribute}</p>
      <Button
        variant="primary"
        size="lg"
        href="https://github.com/Leomaradan/rsl-gear-optimizer"
      >
        GitHub
      </Button>
    </Jumbotron>
  );
};

export default Home;
