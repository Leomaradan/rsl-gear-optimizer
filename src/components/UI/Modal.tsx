import { useLanguage } from "lang/LanguageContext";
import React from "react";
import styled from "styled-components";
import BtModal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface ModalProps {
  title: JSX.Element | string;
  content: JSX.Element;
  show: boolean;
  onSave?(): void;
  onClose(): void;
}

const ModalBody = styled(BtModal.Body)`
  height: calc(100vh - 190px);
`;

export default ({
  title,
  content,
  show,
  onClose,
  onSave,
}: ModalProps): JSX.Element => {
  const lang = useLanguage();

  return (
    <BtModal size="xl" show={show} onHide={onClose}>
      <BtModal.Header>
        <BtModal.Title>{title}</BtModal.Title>
      </BtModal.Header>

      <ModalBody>{content}</ModalBody>
      <BtModal.Footer className="modal-footer">
        <Button variant="secondary" onClick={onClose}>
          {lang.commonClose}
        </Button>
        {onSave && (
          <Button variant="primary" onClick={onSave}>
            {lang.commonSave}
          </Button>
        )}
      </BtModal.Footer>
    </BtModal>
  );
};
