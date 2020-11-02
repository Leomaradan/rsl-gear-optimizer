import React, { useState } from "react";
import { Pencil, Trash } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import Artifact from "models/Artifact";
import { deleteArtifacts } from "redux/artifactsSlice";
import ArtifactForm from "./ArtifactForm";

export interface ArtifactEditGridProps {
  artifact: Artifact;
}

const ArtifactEditGrid = (props: ArtifactEditGridProps): JSX.Element => {
  const { artifact } = props;
  const { Guid } = artifact;

  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatchDeleteArtifact = () => {
    dispatch(deleteArtifacts({ id: Guid }));
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-success btn-sm"
        onClick={handleShow}
      >
        <Pencil />
      </button>
      <button
        type="button"
        className="btn btn-danger btn-sm"
        onClick={dispatchDeleteArtifact}
      >
        <Trash />
      </button>
      <ArtifactForm artifact={artifact} handleClose={handleClose} show={show} />
    </>
  );
};

export default ArtifactEditGrid;
