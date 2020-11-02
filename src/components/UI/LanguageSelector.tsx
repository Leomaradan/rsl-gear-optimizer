import React, { ChangeEvent, useContext, useEffect } from "react";

import localforage from "localforage";
import LanguageContext, {
  LanguageContextDefinition,
} from "lang/LanguageContext";
import { languageOptions } from "lang/language";

export default (): JSX.Element => {
  const { userLanguage, userLanguageChange } = useContext<
    LanguageContextDefinition
  >(LanguageContext);

  // set selected language by calling context method
  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userLanguageChange(e.target.value as any);
  };

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
    <select
      onChange={handleLanguageChange}
      value={userLanguage}
      className="custom-select"
    >
      {Object.entries(languageOptions).map(([id, name]) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </select>
  );
};
