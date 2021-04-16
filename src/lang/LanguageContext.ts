import { createContext, useContext } from "react";

import emptyFunction from "../process/emptyFunction";

import { ILanguage, dictionaryList } from "./language";

export interface ILanguageContextDefinition {
  userLanguage: string;
  dictionary: ILanguage;
  userLanguageChange: (selected: string) => void;
}

const LanguageContext = createContext<ILanguageContextDefinition>({
  userLanguage: "en",
  dictionary: dictionaryList.en,
  userLanguageChange: emptyFunction,
});

export const useLanguage = (): ILanguage => {
  const languageContext = useContext(LanguageContext);

  return languageContext.dictionary;
};

export default LanguageContext;
