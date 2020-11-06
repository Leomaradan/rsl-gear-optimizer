import ResultsList from "./ResultsList";
import Modal from "components/UI/Modal";
import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import { Results } from "models";
import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import { ZoomIn } from "react-bootstrap-icons";

interface ResultsModalProps {
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
      <Button variant="success" size="sm" onClick={handleShow}>
        <ZoomIn />
      </Button>
      <Modal
        title={lang[`champion${result.champion.Champion}` as keyof Language]}
        content={<ResultsList result={result} selectedItems={selectedItems} />}
        onClose={handleClose}
        show={show}
      />
    </>
  );
};
