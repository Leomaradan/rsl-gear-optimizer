import { useCallback } from "react";
import { Form } from "react-bootstrap";

import { useLanguage } from "../../lang/LanguageContext";

interface IToggleProps {
  currentState: boolean;
  disabled?: boolean;
  label?: string;
  name: string;
  onToggle(newState: boolean): void;
}

const Toggle = ({
  currentState,
  disabled,
  label,
  name,
  onToggle,
}: IToggleProps): JSX.Element => {
  const lang = useLanguage();

  const textLabel = currentState ? lang.ui.common.on : lang.ui.common.off;

  const onChangeHandler = useCallback(() => {
    onToggle(!currentState);
  }, [currentState, onToggle]);

  return (
    <Form.Check
      checked={!!currentState}
      disabled={disabled}
      id={name}
      label={label ?? textLabel}
      onChange={onChangeHandler}
      type="switch"
    />
  );
};

Toggle.defaultProps = {
  disabled: false,
  label: undefined,
};

export default Toggle;
