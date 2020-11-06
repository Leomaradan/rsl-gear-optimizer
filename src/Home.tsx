import { useLanguage } from "lang/LanguageContext";
import React from "react";
import Button from "react-bootstrap/Button";

export default (): JSX.Element => {
  const lang = useLanguage();
  return (
    <div className="jumbotron">
      <h1 className="display-4">{lang.siteTitle}</h1>
      <p className="lead">{lang.siteDescription}</p>
      <hr className="my-4" />
      <p>{lang.messageHomeWarning}</p>
      <hr className="my-4" />
      <p>{lang.messageHomeContribute}</p>
      <Button
        variant="primary"
        size="lg"
        href="https://github.com/Leomaradan/rsl-gear-optimizer"
      >
        GitHub
      </Button>
    </div>
  );
};
