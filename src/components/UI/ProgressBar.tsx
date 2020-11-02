import React from "react";
import styled from "styled-components";

export interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
}

const DivWidth = styled.div`
  width: 100%;
`;
export default ({ current, max, label }: ProgressBarProps): JSX.Element => {
  const percent = Math.round((current / max) * 100);

  return (
    <DivWidth className="progress">
      <div
        className="progress-bar"
        role="progressbar"
        style={{ width: `${percent}%` }}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {label || `${percent}%`}
      </div>
    </DivWidth>
  );
};
