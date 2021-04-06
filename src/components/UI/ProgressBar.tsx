import React from "react";
import { ProgressBar as BtProgressBar } from "react-bootstrap";

interface IProgressBarProps {
  current: number;
  label?: string;
  max: number;
}

const ProgressBar = ({
  current,
  label,
  max,
}: IProgressBarProps): JSX.Element => {
  const percent = current === 0 ? 0 : Math.round((current / max) * 100);

  return (
    <BtProgressBar label={label || `${percent}%`} max={max} now={current} />
  );
};

ProgressBar.defaultProps = {
  label: undefined,
};

export default ProgressBar;
