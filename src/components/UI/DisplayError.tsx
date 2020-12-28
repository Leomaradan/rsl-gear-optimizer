import type { IErrors } from "models";

import React from "react";
import styled from "styled-components";

interface IDisplayErrorProps {
  slot: string;
  errors: IErrors;
}

const Danger = styled.span`
  font-weight: bold;
  color: red;
`;

const DisplayError = ({ slot, errors }: IDisplayErrorProps): JSX.Element => {
  const error = errors.find((e) => e.slot === slot);

  if (error) {
    return <Danger>{error.text}</Danger>;
  }

  return <></>;
};

export default DisplayError;
