import ArtifactForm from "./ArtifactForm";
import { useLanguage } from "lang/LanguageContext";
import {
  ArtifactDraft,
  StatsBySlots,
  Rarity,
  Slots,
  Sets,
  Artifact,
} from "models";

import React, { useState } from "react";

const ArtifactAdd = (): JSX.Element => {
  const [show, setShow] = useState(false);
  const lang = useLanguage();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const emptyArtifact: ArtifactDraft = {
    Level: 0,
    MainStats: StatsBySlots.Weapon[0],
    Quality: 1,
    Rarity: Rarity.Common,
    Slot: Slots.Weapon,
    Set: Sets.Null,
    SubStats: [],
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-info btn-sm"
        onClick={handleShow}
      >
        {lang.commonAddNew}
      </button>
      <ArtifactForm
        artifact={emptyArtifact as Artifact}
        handleClose={handleClose}
        show={show}
      />
    </>
  );
};

export default ArtifactAdd;
