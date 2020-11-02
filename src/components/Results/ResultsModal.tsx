import Modal from "components/UI/Modal";
import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import { Results } from "models/Results";

import React, { useState } from "react";
import { ZoomIn } from "react-bootstrap-icons";
import ResultsList from "./ResultsList";

export interface ResultsModalProps {
  result: Results;
  selectedItems: string[];
}

export default (props: ResultsModalProps): JSX.Element => {
  const [show, setShow] = useState(false);
  const lang = useLanguage();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { result, selectedItems } = props;

  return (
    <>
      <button
        type="button"
        className="btn btn-success btn-sm"
        onClick={handleShow}
      >
        <ZoomIn />
      </button>
      <Modal
        title={lang[`champion${result.champion.champion}` as keyof Language]}
        content={<ResultsList result={result} selectedItems={selectedItems} />}
        onClose={handleClose}
        show={show}
      />
    </>
  );
};
