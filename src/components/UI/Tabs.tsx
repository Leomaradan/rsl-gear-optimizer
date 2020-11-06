import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

export interface TabProps {
  id: string;
  title: string;
  page: JSX.Element;
  disable?: boolean;
}

interface TabsProps {
  tabs: TabProps[];
  defaultTabs?: string;
  widget?: JSX.Element;
  onChange?(id: string): void;
}

export default (props: TabsProps): JSX.Element => {
  const { tabs, defaultTabs, widget, onChange } = props;

  const lang = useLanguage();

  const onSelect = (key: string | null) => {
    if (key && onChange) {
      onChange(key);
    }
  };

  return (
    <Tabs defaultActiveKey={defaultTabs} onSelect={onSelect}>
      {tabs.map((tab) => (
        <Tab eventKey={tab.id} title={lang[tab.title as keyof Language]}>
          {tab.page}
        </Tab>
      ))}
      <form className="form-inline my-2 my-lg-0">{widget}</form>
    </Tabs>
  );
};
