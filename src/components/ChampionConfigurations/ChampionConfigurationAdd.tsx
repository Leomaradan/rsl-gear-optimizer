import React, { useState } from "react";
import { Button } from "react-bootstrap";

import { useLanguage } from "../../lang/LanguageContext";
import type { IChampionConfiguration } from "../../models";

import ChampionForm from "./ChampionConfigurationForm";

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
      <Button onClick={handleShow} size="sm" variant="primary">
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
