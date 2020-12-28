import { useLanguage } from "lang/LanguageContext";

import React from "react";
import styled from "styled-components";
import { Modal as BtModal, Button } from "react-bootstrap";

interface IModalProps {
  title: JSX.Element | string;
  content: JSX.Element;
  show: boolean;
  onSave?(): void;
  onClose(): void;
  moreButtons?: { title: string; variant?: string; action: () => void }[];
}

const ModalBody = styled(BtModal.Body)`
  height: calc(100vh - 200px);
`;

const Modal = ({
  title,
  content,
  show,
  onClose,
  onSave,
  moreButtons,
}: IModalProps): JSX.Element => {
  const lang = useLanguage();

  return (
    <BtModal size="xl" show={show} onHide={onClose}>
      <BtModal.Header>
        <BtModal.Title>{title}</BtModal.Title>
      </BtModal.Header>

      <ModalBody>{content}</ModalBody>
      <BtModal.Footer className="modal-footer">
        <Button variant="secondary" onClick={onClose}>
          {lang.ui.common.close}
        </Button>
        {onSave && (
          <Button variant="primary" onClick={onSave}>
            {lang.ui.common.save}
          </Button>
        )}
        {moreButtons &&
          moreButtons.map((button) => (
            <Button
              key={button.title}
              variant={button.variant ?? "primary"}
              onClick={button.action}
            >
              {button.title}
            </Button>
          ))}
      </BtModal.Footer>
    </BtModal>
  );
};

export default Modal;
