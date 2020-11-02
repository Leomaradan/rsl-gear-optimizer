import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";

export interface AccordionSection {
  key: string;
  title: JSX.Element | string;
  content: JSX.Element | string;
  expanded?: boolean;
}

export interface AccordionProps {
  section: AccordionSection[];
}

const Card = styled.div.attrs(() => ({ className: "card" }))`
  background-color: inherit;
  border: 2px solid;
`;

const CardHeader = styled.div.attrs(() => ({ className: "card-header" }))`
  background-color: var(--white);
  border-bottom: 1px solid;
`;

const Accordion = ({ section }: AccordionProps): JSX.Element => {
  const listSection = section.map((s) => s.key);

  const [expanded, updateExanded] = useState(
    section.filter((s) => s.expanded !== false).map((s) => s.key)
  );

  const id = useMemo(() => uuidv4(), []);

  useEffect(() => {
    updateExanded(
      section.filter((s) => s.expanded !== false).map((s) => s.key)
    );
  }, [section]);

  const toggleExpanded = (key: string) => {
    if (expanded.includes(key)) {
      updateExanded(expanded.filter((e) => e !== key));
    } else {
      updateExanded([...expanded, key]);
    }
  };

  return (
    <div className="accordion" id={id}>
      {listSection.map((key) => {
        const filterItems = section.find((i) => i.key === key);

        if (filterItems) {
          const isExpanded = expanded.includes(key);

          return (
            <Card key={key}>
              <CardHeader id={`heading${key}`}>
                <button
                  className="btn btn-link btn-block text-left"
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`collapse${key}`}
                  onClick={() => {
                    toggleExpanded(key);
                  }}
                >
                  {filterItems.title}
                </button>
              </CardHeader>
              <div
                id={`collapse${key}`}
                className={classNames("collapse", { show: isExpanded })}
                aria-labelledby={`heading${key}`}
                data-parent={`#${id}`}
              >
                <div className="card-body">{filterItems.content}</div>
              </div>
            </Card>
          );
        }

        return null;
      })}
    </div>
  );
};

export default Accordion;
