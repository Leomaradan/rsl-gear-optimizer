import type { FunctionComponent, ReactNode } from "react";
import { OverlayTrigger, Tooltip as BtTooltip } from "react-bootstrap";

interface ITooltipProps {
  children: ReactNode;
  id: string;
  text: JSX.Element | string;
}

const Tooltip: FunctionComponent<ITooltipProps> = ({
  children,
  id,
  text,
}: ITooltipProps) => {
  return (
    <OverlayTrigger
      overlay={<BtTooltip id={id}>{text}</BtTooltip>}
      placement="top"
      trigger={["hover", "focus"]}
    >
      <span>{children}</span>
    </OverlayTrigger>
  );
};

export default Tooltip;
