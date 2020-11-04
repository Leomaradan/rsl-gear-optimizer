import ChampionForm from "./ChampionForm";
import { ChampionDraft } from "models";
import React, { useState } from "react";
import { Plus } from "react-bootstrap-icons";

const ChampionAdd = (): JSX.Element => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const emptyChampion = {
    order: -1,
    bootsStats: [],
    chestplateStats: [],
    gauntletStats: [],
    methods: -1,
    champion: "",
    sets: [],
    statsPriority: {},
    activated: true,
    accessories: "",
  } as ChampionDraft;

  return (
    <>
      <button
        type="button"
        className="btn btn-info btn-sm"
        onClick={handleShow}
      >
        <Plus />
      </button>
      <ChampionForm
        champion={emptyChampion}
        handleClose={handleClose}
        show={show}
      />
    </>
  );
};

export default ChampionAdd;
