import { Button, Modal as BtModal } from "react-bootstrap";
import styled from "styled-components";

import { useLanguage } from "../../lang/LanguageContext";

interface IModalProps {
  content: JSX.Element;
  moreButtons?: { title: string; variant?: string; action: () => void }[];
  show: boolean;
  title: JSX.Element | string;
  freeze?: boolean;
  onClose(): void;
  onSave?(): void;
}

const ModalBody = styled(BtModal.Body)`
  height: calc(100vh - 200px);
`;

const Modal = ({
  content,
  moreButtons,
  onClose,
  onSave,
  show,
  title,
  freeze,
}: IModalProps): JSX.Element => {
  const lang = useLanguage();

  return (
    <BtModal onHide={onClose} show={show} size="xl">
      <BtModal.Header>
        <BtModal.Title>{title}</BtModal.Title>
      </BtModal.Header>

      <ModalBody>{content}</ModalBody>
      <BtModal.Footer className="modal-footer">
        <Button onClick={onClose} variant="secondary" disabled={freeze}>
          {lang.ui.common.close}
        </Button>
        {onSave && (
          <Button onClick={onSave} variant="primary" disabled={freeze}>
            {lang.ui.common.save}
          </Button>
        )}
        {moreButtons &&
          moreButtons.map((button) => (
            <Button
              key={button.title}
              onClick={button.action}
              variant={button.variant ?? "primary"}
              disabled={freeze}
            >
              {button.title}
            </Button>
          ))}
      </BtModal.Footer>
    </BtModal>
  );
};

Modal.defaultProps = {
  moreButtons: [],
  onSave: undefined,
};

export default Modal;
