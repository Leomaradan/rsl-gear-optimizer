import ResultsDetailsStats from "./ResultsDetailsStats";

import Modal from "components/UI/Modal";
import { useLanguage } from "lang/LanguageContext";
import type { IChampion, IResults } from "models";
import type { ILanguageChampion } from "lang/language";

import { Button } from "react-bootstrap";
import React, { useState } from "react";
import { ZoomIn } from "react-bootstrap-icons";

interface IResultsModalProps {
  result: IResults;
  champion: IChampion;
}

const ResultsModal = (props: IResultsModalProps): JSX.Element => {
  const [show, setShow] = useState(false);
  const lang = useLanguage();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { result, champion } = props;

  return (
    <>
      <Button variant="success" size="sm" onClick={handleShow}>
        <ZoomIn />
      </Button>
      <Modal
        title={lang.champion[champion.Name as keyof ILanguageChampion]}
        content={<ResultsDetailsStats result={result} champion={champion} />}
        onClose={handleClose}
        show={show}
      />
    </>
  );
};

export default ResultsModal;
