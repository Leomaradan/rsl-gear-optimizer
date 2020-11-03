import { useLanguage } from "lang/LanguageContext";
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

interface ModalProps {
  title: JSX.Element | string;
  content: JSX.Element;
  show: boolean;
  onSave?(): void;
  onClose(): void;
}

const Body = styled.div`
  height: calc(100vh - 190px);
  background-color: var(--container);
`;

export default ({
  title,
  content,
  show,
  onClose,
  onSave,
}: ModalProps): JSX.Element => {
  const backdropClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const lang = useLanguage();

  if (!show) {
    return <></>;
  }

  const modalFrame = (
    <>
      <div className="fade modal-backdrop show" />
      <div
        role="presentation"
        className="fade modal show"
        style={{ display: "block" }}
        onClick={backdropClose}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="close" onClick={onClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <Body className="modal-body">{content}</Body>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={onClose}
              >
                {lang.commonClose}
              </button>
              {onSave && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onSave}
                >
                  {lang.commonSave}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(modalFrame, document.body);
};
