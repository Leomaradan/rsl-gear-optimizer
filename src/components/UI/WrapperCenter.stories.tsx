import type { Meta, Story } from "@storybook/react";
import React from "react";
import styled from "styled-components";

import WrapperCenterComponent from "./WrapperCenter";

export default {
  title: "UI",
  component: WrapperCenterComponent,
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

export const WrapperCenter: Story = () => {
  return (
    <WrapperCenterComponent>
      <Element num={1} />
      <Element num={2} />
      <Element num={3} />
    </WrapperCenterComponent>
  );
};
