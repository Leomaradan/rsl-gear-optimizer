import { Form } from "react-bootstrap";

interface IRadioButtonsProps {
  inline?: boolean;
  name: string;
  options: {
    value: string | number;
    text: string | JSX.Element;
    disabled?: boolean;
  }[];
  selectedOption: number | string;
  onChange(newValue: number | string): void;
}

const RadioButtons = ({
  inline,
  name,
  onChange,
  options,
  selectedOption,
}: IRadioButtonsProps): JSX.Element => {
  return (
    <>
      {options.map((option) => (
        <Form.Check
          checked={option.value === selectedOption}
          custom
          disabled={option.disabled}
          id={`${name}-${option.value}`}
          inline={inline}
          key={`${name}-${option.value}`}
          label={option.text}
          onChange={() => {
            onChange(option.value);
          }}
          type="radio"
        />
      ))}
    </>
  );
};

RadioButtons.defaultProps = {
  inline: false,
};

export default RadioButtons;
