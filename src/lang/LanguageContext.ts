import { Language, dictionaryList } from "./language";
import React, { useContext } from "react";

export interface LanguageContextDefinition {
  userLanguage: string;
  dictionary: Language;
  userLanguageChange: (selected: string) => void;
}

const LanguageContext = React.createContext<LanguageContextDefinition>({
  userLanguage: "en",
  dictionary: dictionaryList.en,
  userLanguageChange: () => {},
});

export const useLanguage = (): Language => {
  const languageContext = useContext(LanguageContext);

  return languageContext.dictionary;
};

export default LanguageContext;
