import ArtifactForm from "./ArtifactForm";
import { useLanguage } from "lang/LanguageContext";
import {
  ArtifactDraft,
  StatsBySlots,
  Rarity,
  Slots,
  Sets,
  Artifact,
  Clans,
} from "models";

import React, { useState } from "react";

interface ArtifactAddProps {
  isAccessory?: boolean;
  set?: Sets;
  clan?: Clans;
  label?: string | JSX.Element;
}

const ArtifactAdd = ({
  isAccessory,
  clan,
  set,
  label,
}: ArtifactAddProps): JSX.Element => {
  const [show, setShow] = useState(false);
  const lang = useLanguage();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const emptyArtifact: ArtifactDraft = {
    Level: 0,
    MainStats: isAccessory ? StatsBySlots.Ring[0] : StatsBySlots.Weapon[0],
    Quality: 1,
    Rarity: Rarity.Common,
    Slot: isAccessory ? Slots.Ring : Slots.Weapon,
    Set: set ?? Sets.Null,
    Clan: clan ?? Clans.Null,
    SubStats: [],
    isAccessory: !!isAccessory,
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-info btn-sm"
        onClick={handleShow}
      >
        {label || lang.commonAddNew}
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
