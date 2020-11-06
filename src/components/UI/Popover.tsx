import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React from "react";
import { InfoCircle } from "react-bootstrap-icons";

interface PopoverProps {
  id: string;
  title: string;
  content: string;
}

export default ({ id, content, title }: PopoverProps): JSX.Element => {
  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      placement="auto"
      overlay={
        <Popover id={id}>
          <Popover.Title as="h3">{title}</Popover.Title>
          <Popover.Content>{content}</Popover.Content>
        </Popover>
      }
    >
      <InfoCircle />
    </OverlayTrigger>
  );
};
