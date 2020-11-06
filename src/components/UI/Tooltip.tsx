import BtTooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { FunctionComponent } from "react";

interface TooltipProps {
  id: string;
  text: string;
}

// eslint-disable-next-line react/prop-types
const Tooltip: FunctionComponent<TooltipProps> = ({ id, text, children }) => {
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
