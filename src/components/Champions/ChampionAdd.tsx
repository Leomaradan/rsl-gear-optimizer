import ChampionForm from "./ChampionForm";
import { ChampionDraft } from "models";
import { useLanguage } from "lang/LanguageContext";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";

const ChampionAdd = (): JSX.Element => {
  const [show, setShow] = useState(false);
  const lang = useLanguage();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const emptyChampion = {
    order: -1,
    BootsStats: [],
    ChestplateStats: [],
    GauntletStats: [],
    Methods: -1,
    Champion: "",
    Sets: [],
    StatsPriority: {},
    Activated: true,
    Accessories: "",
  } as ChampionDraft;

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleShow}>
        {lang.commonAddNew}
      </Button>
      <ChampionForm
        champion={emptyChampion}
        handleClose={handleClose}
        show={show}
      />
    </>
  );
};

export default ChampionAdd;
