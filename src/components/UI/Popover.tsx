import { OverlayTrigger, Popover as BtPopover } from "react-bootstrap";
import { InfoCircle } from "react-bootstrap-icons";

interface IPopoverProps {
  content: string;
  id: string;
  title: string;
}

const Popover = ({ content, id, title }: IPopoverProps): JSX.Element => {
  return (
    <OverlayTrigger
      overlay={
        <BtPopover id={id}>
          <BtPopover.Title as="h3">{title}</BtPopover.Title>
          <BtPopover.Content>{content}</BtPopover.Content>
        </BtPopover>
      }
      placement="auto"
      trigger={["hover", "focus"]}
    >
      <InfoCircle />
    </OverlayTrigger>
  );
};

export default Popover;
