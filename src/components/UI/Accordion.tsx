import React, { useState } from "react";
import { Accordion as BtAccordion, Button, Card } from "react-bootstrap";
import styled from "styled-components";

import Stack from "./Stack";

export interface IAccordionSection {
  content: JSX.Element | string;
  expanded?: boolean;
  key: string;
  title: JSX.Element | string;
  widget?: JSX.Element;
}
const CardHeader = styled(Card.Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface IAccordionProps {
  section: IAccordionSection[];
}

interface IInnerAccordionProps {
  filterItems: IAccordionSection;
}

const InnerAccordion = ({ filterItems }: IInnerAccordionProps) => {
  const [show, setShow] = useState(filterItems.expanded ?? false);

  return (
    <BtAccordion
      defaultActiveKey={filterItems.expanded ? "0" : undefined}
      onSelect={(e) => {
        setShow(e === "0");
      }}
    >
      <Card>
        <BtAccordion.Toggle as={CardHeader} eventKey="0">
          <Button variant="link">{filterItems.title}</Button>
          {filterItems.widget && <div>{filterItems.widget}</div>}
        </BtAccordion.Toggle>
        <BtAccordion.Collapse eventKey="0">
          <Card.Body>{show && filterItems.content}</Card.Body>
        </BtAccordion.Collapse>
      </Card>
    </BtAccordion>
  );
};

const Accordion = ({ section }: IAccordionProps): JSX.Element => {
  const listSection = section.map((s) => s.key);

  return (
    <Stack>
      {listSection.map((key) => {
        const filterItems = section.find((i) => i.key === key);
        if (filterItems) {
          return <InnerAccordion filterItems={filterItems} key={key} />;
        }
        return null;
      })}
    </Stack>
  );
};

export default Accordion;
