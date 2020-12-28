import { useLanguage } from "lang/LanguageContext";

import React from "react";
import { Form } from "react-bootstrap";

interface IToggleProps {
  currentState: boolean;
  name: string;
  label?: string;
  disabled?: boolean;
  onToggle(newState: boolean): void;
}

const Toggle = ({
  currentState,
  name,
  onToggle,
  label,
  disabled,
}: IToggleProps): JSX.Element => {
  const lang = useLanguage();

  const textLabel = currentState ? lang.ui.common.on : lang.ui.common.off;

  return (
    <Form.Check
      type="switch"
      id={name}
      checked={!!currentState}
      disabled={disabled}
      onChange={() => {
        onToggle(!currentState);
      }}
      label={label ?? textLabel}
    />
  );
};

export default Toggle;
