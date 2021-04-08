import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { useDispatch } from "react-redux";

import type { IArtifact } from "../../models";
import { updateArtifacts } from "../../redux/artifactsSlice";
import ArtifactForm from "../Artifacts/ArtifactForm";
import ArtifactDisplay from "../UI/ArtifactDisplay";

interface IArtifactPopupProps {
  artifact?: IArtifact;
  readOnly?: boolean;
}
const ArtifactPopup = ({ artifact, readOnly }: IArtifactPopupProps) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (!artifact) {
    return null;
  }

  if (readOnly) {
    return <ArtifactDisplay artifact={artifact} showChampion={false} />;
  }

  const unassign = () => {
    dispatch(
      updateArtifacts({
        artifact: { ...artifact, Champion: undefined },
        id: artifact.Guid,
      })
    );
  };

  return (
    <>
      <div onClick={handleShow} role="presentation">
        <ArtifactDisplay artifact={artifact} showChampion={false} />
      </div>

      <ArtifactForm
        artifact={artifact}
        handleClose={handleClose}
        lockedFields={["Champion"]}
        moreButtons={[
          { action: unassign, title: "Unassign", variant: "danger" },
        ]}
        show={show}
      />
    </>
  );
};

ArtifactPopup.defaultProps = {
  artifact: null,
  readOnly: false,
};

interface IChampionDetailsArtifactsProps {
  artifacts: IArtifact[];
  readOnly: boolean;
}

const ChampionDetailsArtifacts = ({
  artifacts,
  readOnly,
}: IChampionDetailsArtifactsProps): JSX.Element => {
  const weapon = artifacts.find((a) => a.Slot === "Weapon");
  const helmet = artifacts.find((a) => a.Slot === "Helmet");
  const shield = artifacts.find((a) => a.Slot === "Shield");
  const gauntlets = artifacts.find((a) => a.Slot === "Gauntlets");
  const chestplate = artifacts.find((a) => a.Slot === "Chestplate");
  const boots = artifacts.find((a) => a.Slot === "Boots");
  const ring = artifacts.find((a) => a.Slot === "Ring");
  const amulet = artifacts.find((a) => a.Slot === "Amulet");
  const banner = artifacts.find((a) => a.Slot === "Banner");

  return (
    <Table>
      <tbody>
        <tr>
          <td>
            <ArtifactPopup artifact={weapon} readOnly={readOnly} />
          </td>
          <td>
            <ArtifactPopup artifact={helmet} readOnly={readOnly} />
          </td>
          <td>
            <ArtifactPopup artifact={shield} readOnly={readOnly} />
          </td>
        </tr>
        <tr>
          <td>
            <ArtifactPopup artifact={gauntlets} readOnly={readOnly} />
          </td>
          <td>
            <ArtifactPopup artifact={chestplate} readOnly={readOnly} />
          </td>
          <td>
            <ArtifactPopup artifact={boots} readOnly={readOnly} />
          </td>
        </tr>
        <tr>
          <td>
            <ArtifactPopup artifact={ring} readOnly={readOnly} />
          </td>
          <td>
            <ArtifactPopup artifact={amulet} readOnly={readOnly} />
          </td>
          <td>
            <ArtifactPopup artifact={banner} readOnly={readOnly} />
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default ChampionDetailsArtifacts;
