import LanguageContext, {
  ILanguageContextDefinition,
} from "../../lang/LanguageContext";
import { languageOptions } from "../../lang/language";

import localforage from "localforage";
import React, { ChangeEvent, useContext, useEffect } from "react";
import { Form } from "react-bootstrap";

const LanguageSelector = (): JSX.Element => {
  const {
    userLanguage,
    userLanguageChange,
  } = useContext<ILanguageContextDefinition>(LanguageContext);

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
    <Form.Control
      as="select"
      custom
      onChange={handleLanguageChange}
      value={userLanguage}
    >
      {Object.entries(languageOptions).map(([id, name]) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </Form.Control>
  );
};

export default LanguageSelector;
