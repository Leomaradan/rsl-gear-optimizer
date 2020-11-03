import classNames from "classnames";
import React from "react";

interface RadioButtonsProps {
  options: { value: string | number; text: string; disabled?: boolean }[];
  selectedOption: string | number;
  name: string;
  onChange(newValue: string | number): void;
  inline?: boolean;
}

export default ({
  name,
  options,
  selectedOption,
  onChange,
  inline,
}: RadioButtonsProps): JSX.Element => {
  return (
    <>
      {options.map((option) => (
        <div
          key={option.value}
          className={classNames("form-check custom-control custom-radio", {
            "custom-control-inline": inline,
          })}
        >
          <input
            type="radio"
            id={String(option.value)}
            name={name}
            className="custom-control-input"
            onChange={() => {
              onChange(option.value);
            }}
            checked={option.value === selectedOption}
            disabled={option.disabled}
          />
          <label
            className="custom-control-label"
            htmlFor={String(option.value)}
          >
            {option.text}
          </label>
        </div>
      ))}
    </>
  );
};
