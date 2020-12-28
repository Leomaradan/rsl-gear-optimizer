import { Popover as BtPopover, OverlayTrigger } from "react-bootstrap";
import React from "react";
import { InfoCircle } from "react-bootstrap-icons";

interface IPopoverProps {
  id: string;
  title: string;
  content: string;
}

const Popover = ({ id, content, title }: IPopoverProps): JSX.Element => {
  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      placement="auto"
      overlay={
        <BtPopover id={id}>
          <BtPopover.Title as="h3">{title}</BtPopover.Title>
          <BtPopover.Content>{content}</BtPopover.Content>
        </BtPopover>
      }
    >
      <InfoCircle />
    </OverlayTrigger>
  );
};

export default Popover;
