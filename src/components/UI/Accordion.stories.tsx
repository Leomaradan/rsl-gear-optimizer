import type { Meta, Story } from "@storybook/react";
import React from "react";
import styled from "styled-components";

import AccordionComponent from "./Accordion";
import Stack from "./Stack";

export default {
  title: "UI",
  component: AccordionComponent,
} as Meta;

const ElementContainer = styled.div`
  background-color: lightblue;
  padding: 5px;
  border: 5px solid red;
`;

const Element = ({ num }: { num: number }): JSX.Element => (
  // eslint-disable-next-line react/jsx-no-literals
  <ElementContainer>Element {num}</ElementContainer>
);

export const Accordion: Story = () => {
  return (
    <Stack>
      <AccordionComponent
        section={[
          {
            content: <Element num={1} />,
            key: "1",
            title: "Title 1",
          },
          {
            content: <Element num={2} />,
            key: "2",
            title: "Title 2",
          },
          {
            content: <Element num={3} />,
            key: "3",
            title: "Title 3",
          },
        ]}
      />
    </Stack>
  );
};
