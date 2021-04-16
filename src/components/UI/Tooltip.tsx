import type { FunctionComponent, ReactNode } from "react";
import { OverlayTrigger, Tooltip as BtTooltip } from "react-bootstrap";

interface ITooltipProps {
  children: ReactNode;
  id: string | number;
  text: JSX.Element | string;
}

const Tooltip: FunctionComponent<ITooltipProps> = ({
  children,
  id,
  text,
}: ITooltipProps) => {
  return (
    <OverlayTrigger
      overlay={<BtTooltip id={String(id)}>{text}</BtTooltip>}
      placement="top"
      trigger={["hover", "focus"]}
    >
      <span>{children}</span>
    </OverlayTrigger>
  );
};

export default Tooltip;
