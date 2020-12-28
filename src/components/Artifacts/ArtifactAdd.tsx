import ArtifactForm from "./ArtifactForm";

import { useLanguage } from "lang/LanguageContext";
import type { IArtifactDraft, ISets, IArtifact, IClans } from "models";
import { StatsBySlots } from "data";

import { Button } from "react-bootstrap";
import React, { useState } from "react";

interface IArtifactAddProps {
  isAccessory?: boolean;
  set?: ISets;
  clan?: IClans;
  label?: string | JSX.Element;
}

const ArtifactAdd = ({
  isAccessory,
  clan,
  set,
  label,
}: IArtifactAddProps): JSX.Element => {
  const [show, setShow] = useState(false);
  const lang = useLanguage();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const emptyArtifact: IArtifactDraft = {
    Level: 0,
    MainStats: isAccessory ? StatsBySlots.Ring[0] : StatsBySlots.Weapon[0],
    Quality: 1,
    Rarity: "Common",
    Slot: isAccessory ? "Ring" : "Weapon",
    Set: set ?? "",
    Clan: clan ?? "",
    SubStats: [],
    isAccessory: !!isAccessory,
    Power: 0,
  };

  return (
    <>
      <Button variant="info" size="sm" onClick={handleShow}>
        {label || lang.ui.common.addNew}
      </Button>
      <ArtifactForm
        artifact={emptyArtifact as IArtifact}
        handleClose={handleClose}
        show={show}
      />
    </>
  );
};

export default ArtifactAdd;
