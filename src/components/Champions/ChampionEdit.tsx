import ChampionForm from "./ChampionForm";
import { Champion } from "models";
import { deleteChampions } from "redux/championsSlice";
import React, { useState } from "react";
import { Pencil, Trash } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";

interface ChampionEditProps {
  champion: Champion;
}

const ChampionEdit = (props: ChampionEditProps): JSX.Element => {
  const { champion } = props;
  const { Guid: name } = champion;

  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatchDeleteChampion = () => {
    dispatch(deleteChampions({ id: name }));
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleShow}>
        <Pencil />
      </Button>
      <Button variant="danger" size="sm" onClick={dispatchDeleteChampion}>
        <Trash />
      </Button>
      <ChampionForm champion={champion} handleClose={handleClose} show={show} />
    </>
  );
};

export default ChampionEdit;
