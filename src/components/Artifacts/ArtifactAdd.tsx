import React, { useState } from "react";
import { Button } from "react-bootstrap";

import { StatsBySlots } from "../../data";
import { useLanguage } from "../../lang/LanguageContext";
import type { IArtifact, IArtifactDraft, IClans, ISets } from "../../models";

import ArtifactForm from "./ArtifactForm";

interface IArtifactAddProps {
  clan?: IClans;
  isAccessory?: boolean;
  label?: JSX.Element | string;
  set?: ISets;
}

const ArtifactAdd = ({
  clan,
  isAccessory,
  label,
  set,
}: IArtifactAddProps): JSX.Element => {
  const [show, setShow] = useState(false);
  const lang = useLanguage();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const emptyArtifact: IArtifactDraft = {
    Clan: clan ?? "",
    Level: 0,
    MainStats: isAccessory ? StatsBySlots.Ring[0] : StatsBySlots.Weapon[0],
    Power: 0,
    Quality: 1,
    Rarity: "Common",
    Set: set ?? "",
    Slot: isAccessory ? "Ring" : "Weapon",
    SubStats: [],
    isAccessory: !!isAccessory,
  };

  return (
    <>
      <Button onClick={handleShow} size="sm" variant="info">
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

ArtifactAdd.defaultProps = {
  clan: "",
  isAccessory: false,
  label: "",
  set: "",
};

export default ArtifactAdd;
