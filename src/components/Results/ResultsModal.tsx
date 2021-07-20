import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { ZoomIn } from "react-bootstrap-icons";

import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageChampion } from "../../lang/language";
import type { IChampion, IResults } from "../../models";
import Modal from "../UI/Modal";

const Modal = React.lazy(() => import("../UI/Modal"));
const ResultsDetailsStats = React.lazy(() => import("./ResultsDetailsStats"));

interface IResultsModalProps {
  champion: IChampion;
  result: IResults;
}

const ResultsModal = (props: IResultsModalProps): JSX.Element => {
  const [show, setShow] = useState(false);
  const lang = useLanguage();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { champion, result } = props;

  return (
    <>
      <Button onClick={handleShow} size="sm" variant="success">
        <ZoomIn />
      </Button>
      <Modal
        content={<ResultsDetailsStats result={result} champion={champion} />}
        onClose={handleClose}
        show={show}
        title={lang.champion[champion.Name as keyof ILanguageChampion]}
      />
    </>
  );
};

export default ResultsModal;
