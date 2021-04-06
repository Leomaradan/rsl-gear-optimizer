import React from "react";
import { Form, Tab, Tabs as BtTabs } from "react-bootstrap";

export interface ITabProps {
  disable?: boolean;
  id: string;
  page: JSX.Element;
  title: string;
}

interface ITabsProps {
  defaultTabs?: string;
  tabs: ITabProps[];
  widget?: JSX.Element;
  onChange?(id: string): void;
}

const Tabs = (props: ITabsProps): JSX.Element => {
  const { defaultTabs, onChange, tabs, widget } = props;

  const onSelect = (key: null | string) => {
    if (key && onChange) {
      onChange(key);
    }
  };

  return (
    <BtTabs defaultActiveKey={defaultTabs} onSelect={onSelect}>
      {tabs.map((tab) => (
        <Tab eventKey={tab.id} key={tab.id} title={tab.title}>
          {tab.page}
        </Tab>
      ))}
      <Form className="my-2 my-lg-0" inline>
        {widget}
      </Form>
    </BtTabs>
  );
};

Tabs.defaultProps = {
  defaultTabs: undefined,
  widget: undefined,
  onChange: undefined,
};

export default Tabs;
