import Stack from "./Stack";
import React, { useState } from "react";
import styled from "styled-components";
import BtAccordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

export interface AccordionSection {
  key: string;
  title: JSX.Element | string;
  content: JSX.Element | string;
  expanded?: boolean;
  widget?: JSX.Element;
}
const CardHeader = styled(Card.Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface AccordionProps {
  section: AccordionSection[];
}

const InnerAccordion = ({ filterItems }: { filterItems: AccordionSection }) => {
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
          <button className="btn btn-link text-left" type="button">
            {filterItems.title}
          </button>
          {filterItems.widget && <div>{filterItems.widget}</div>}
        </BtAccordion.Toggle>
        <BtAccordion.Collapse eventKey="0">
          <Card.Body>{show && filterItems.content}</Card.Body>
        </BtAccordion.Collapse>
      </Card>
    </BtAccordion>
  );
};

const Accordion = ({ section }: AccordionProps): JSX.Element => {
  const listSection = section.map((s) => s.key);

  return (
    <Stack>
      {listSection.map((key) => {
        const filterItems = section.find((i) => i.key === key);
        if (filterItems) {
          return <InnerAccordion key={key} filterItems={filterItems} />;
        }
        return null;
      })}
    </Stack>
  );
};

export default Accordion;
