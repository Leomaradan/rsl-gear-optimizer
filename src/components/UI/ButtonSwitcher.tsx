import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";

interface IButtonSwitcherProps {
  name: string;
  options: string[];
  selectedOption: number;
  onChange(newValue: number): void;
}

const ButtonSwitcher = (props: IButtonSwitcherProps): JSX.Element => {
  const { name, onChange, options, selectedOption } = props;

  const value = selectedOption ?? 0;

  return (
    <ButtonGroup aria-label={name}>
      {options.map((option, index) => (
        <Button
          key={option}
          variant={value === index ? "primary" : "secondary"}
          onClick={() => {
            onChange(index);
          }}
        >
          {option}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default ButtonSwitcher;
