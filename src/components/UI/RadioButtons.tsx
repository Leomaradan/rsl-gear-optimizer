import React from "react";
import { Form } from "react-bootstrap";

interface IRadioButtonsProps {
  options: {
    value: string | number;
    text: string | JSX.Element;
    disabled?: boolean;
  }[];
  selectedOption: string | number;
  name: string;
  onChange(newValue: string | number): void;
  inline?: boolean;
}

const RadioButtons = ({
  name,
  options,
  selectedOption,
  onChange,
  inline,
}: IRadioButtonsProps): JSX.Element => {
  return (
    <>
      {options.map((option) => (
        <Form.Check
          key={`${name}-${option.value}`}
          custom
          inline={inline}
          id={`${name}-${option.value}`}
          label={option.text}
          type="radio"
          onChange={() => {
            onChange(option.value);
          }}
          checked={option.value === selectedOption}
          disabled={option.disabled}
        />
      ))}
    </>
  );
};

export default RadioButtons;
