import ChampionForm from "./ChampionConfigurationForm";

import type { IChampionConfiguration } from "models";
import { useLanguage } from "lang/LanguageContext";

import React, { useState } from "react";
import { Button } from "react-bootstrap";

const ChampionAdd = (): JSX.Element => {
  const [show, setShow] = useState(false);
  const lang = useLanguage();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const emptyChampion = {
    Guid: "",
    order: -1,
    BootsStats: [],
    ChestplateStats: [],
    GauntletStats: [],
    Methods: "AllSets",
    SourceChampion: "",
    Sets: [[]],
    StatsPriority: {},
    Activated: true,
    Locked: false,
    Accessories: "",
  } as IChampionConfiguration;

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleShow}>
        {lang.ui.common.addNew}
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
