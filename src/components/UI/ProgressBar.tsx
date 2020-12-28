import React from "react";
import { ProgressBar as BtProgressBar } from "react-bootstrap";

interface IProgressBarProps {
  current: number;
  max: number;
  label?: string;
}

const ProgressBar = ({
  current,
  max,
  label,
}: IProgressBarProps): JSX.Element => {
  const percent = current === 0 ? 0 : Math.round((current / max) * 100);

  return (
    <BtProgressBar max={max} now={current} label={label || `${percent}%`} />
  );
};

export default ProgressBar;
