import { useLanguage } from "lang/LanguageContext";
import React, { useState } from "react";

export interface Toggle {
  currentState: boolean;
  name: string;
  label?: string;
  onToggle(newState: boolean): void;
}

export default ({
  currentState,
  name,
  onToggle,
  label,
}: Toggle): JSX.Element => {
  const [state, setState] = useState(currentState);
  const lang = useLanguage();

  const onClick = () => setState(!state);

  return (
    <div className="custom-control custom-switch">
      <input
        type="checkbox"
        id={name}
        className="custom-control-input"
        checked={!!state}
        onChange={() => {
          onToggle(state);
        }}
      />
      <label
        role="presentation"
        className="custom-control-label"
        htmlFor={name}
        onClick={onClick}
        onKeyPress={onClick}
      >
        {label || currentState ? lang.commonOn : lang.commonOff}
      </label>
    </div>
  );
};
