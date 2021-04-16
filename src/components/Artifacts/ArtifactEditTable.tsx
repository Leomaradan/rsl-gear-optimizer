import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { DialogProvider, useDialog } from "react-bootstrap-easy-dialog";
import { Pencil, Trash } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";

import type { IArtifact } from "../../models";
import { deleteArtifactsThunk } from "../../redux/artifactsSlice";

import ArtifactForm from "./ArtifactForm";

interface IArtifactEditTableProps {
  artifact: IArtifact;
}

const ArtifactEditTable = (props: IArtifactEditTableProps): JSX.Element => {
  const { artifact } = props;
  const { Id } = artifact;

  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const dialog = useDialog();

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
      <Button onClick={handleShow} size="sm" variant="success">
        <Pencil />
      </Button>
      <Button onClick={dispatchDeleteArtifact} size="sm" variant="danger">
        <Trash />
      </Button>
      <ArtifactForm artifact={artifact} handleClose={handleClose} show={show} />
    </>
  );
};

export default ArtifactEditTable;
