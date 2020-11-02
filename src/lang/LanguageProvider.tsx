import React, { ReactNode, useState } from "react";

import localforage from "localforage";
import { dictionaryList, languageOptions } from "./language";
import LanguageContext, { LanguageContextDefinition } from "./LanguageContext";

export default ({ children }: { children: ReactNode }): JSX.Element => {
  const [userLanguage, setUserLanguage] = useState<string>("en");

  const provider: LanguageContextDefinition = {
    userLanguage,
    dictionary: dictionaryList[userLanguage],
    userLanguageChange: (selected) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newLanguage = (languageOptions as any)[selected] ? selected : "en";

      localforage.setItem("rcml-lang", newLanguage).then(() => {
        setUserLanguage(newLanguage);
        document.body.parentElement?.setAttribute("lang", newLanguage);
      });
    },
  };

  return (
    <LanguageContext.Provider value={provider}>
      {children}
    </LanguageContext.Provider>
  );
};
