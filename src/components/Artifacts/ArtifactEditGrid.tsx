import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { DialogProvider, useDialog } from "react-bootstrap-easy-dialog";

import type { IArtifact } from "../../models";
import { deleteArtifactsThunk } from "../../redux/artifactsSlice";

import ArtifactForm from "./ArtifactForm";

import type { IArtifact } from "../../models";
import { deleteArtifacts } from "../../redux/artifactsSlice";

import ArtifactForm from "./ArtifactForm";

interface IArtifactEditGridProps {
  artifact: IArtifact;
}

const ArtifactEditGrid = (props: IArtifactEditGridProps): JSX.Element => {
  const { artifact } = props;
  const { Id } = artifact;
  const dialog = useDialog();

  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatchDeleteArtifact = () => {
    dialog.confirm("Confirm delete ?").then((confirm) => {
      if (confirm) {
        dispatch(deleteArtifactsThunk(Id));
      }
    });
  };

  return (
    <>
      <Button onClick={handleShow} variant="success">
        <Pencil />
      </Button>
      <Button onClick={dispatchDeleteArtifact} variant="danger">
        <Trash />
      </Button>
      <ArtifactForm artifact={artifact} handleClose={handleClose} show={show} />
    </>
  );
};

export default ArtifactEditGrid;
