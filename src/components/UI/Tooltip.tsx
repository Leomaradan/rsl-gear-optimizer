import { Tooltip as BtTooltip, OverlayTrigger } from "react-bootstrap";
import React, { FunctionComponent } from "react";

interface ITooltipProps {
  id: string;
  text: string | JSX.Element;
}

// eslint-disable-next-line react/prop-types
const Tooltip: FunctionComponent<ITooltipProps> = ({ id, text, children }) => {
  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      placement="top"
      overlay={<BtTooltip id={id}>{text}</BtTooltip>}
    >
      <span>{children}</span>
    </OverlayTrigger>
  );
};

export default Tooltip;
