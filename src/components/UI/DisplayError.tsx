import styled from "styled-components";

import type { IErrors } from "../../models";

interface IDisplayErrorProps {
  errors: IErrors;
  slot: string;
}

const Danger = styled.span`
  font-weight: bold;
  color: red;
`;

const DisplayError = ({ errors, slot }: IDisplayErrorProps): JSX.Element => {
  const error = errors.find((e) => e.slot === slot);

  if (error) {
    return <Danger>{error.text}</Danger>;
  }

  return <></>;
};

export default DisplayError;
