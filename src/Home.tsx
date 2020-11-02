import { useLanguage } from "lang/LanguageContext";
import React from "react";

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
      <a
        className="btn btn-primary btn-lg"
        href="https://github.com/Leomaradan/rsl-gear-optimizer"
        role="button"
      >
        GitHub
      </a>
    </div>
  );
};
