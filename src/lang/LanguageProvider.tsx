import { dictionaryList, languageOptions } from "./language";
import LanguageContext, { ILanguageContextDefinition } from "./LanguageContext";

import React, { ReactNode, useState } from "react";
import localforage from "localforage";

interface ILanguageProviderProps {
  children: ReactNode;
}

const LanguageProvider = ({
  children,
}: ILanguageProviderProps): JSX.Element => {
  const [userLanguage, setUserLanguage] = useState<string>("en");

  const provider: ILanguageContextDefinition = {
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

export default LanguageProvider;
