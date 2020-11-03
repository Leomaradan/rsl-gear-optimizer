import { useLanguage } from "lang/LanguageContext";
import Artifact, { ArtifactDraft, StatsBySlots } from "models/Artifact";
import { Rarity } from "models/Quality";
import Sets from "models/Sets";
import Slots from "models/Slots";
import React, { useState } from "react";
import ArtifactForm from "./ArtifactForm";

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
