import React from "react";
import { Tabs as BtTabs, Tab, Form } from "react-bootstrap";

export interface ITabProps {
  id: string;
  title: string;
  page: JSX.Element;
  disable?: boolean;
}

interface ITabsProps {
  tabs: ITabProps[];
  defaultTabs?: string;
  widget?: JSX.Element;
  onChange?(id: string): void;
}

const Tabs = (props: ITabsProps): JSX.Element => {
  const { tabs, defaultTabs, widget, onChange } = props;

  const onSelect = (key: string | null) => {
    if (key && onChange) {
      onChange(key);
    }
  };

  return (
    <BtTabs defaultActiveKey={defaultTabs} onSelect={onSelect}>
      {tabs.map((tab) => (
        <Tab key={tab.id} eventKey={tab.id} title={tab.title}>
          {tab.page}
        </Tab>
      ))}
      <Form inline className="my-2 my-lg-0">
        {widget}
      </Form>
    </BtTabs>
  );
};

export default Tabs;
