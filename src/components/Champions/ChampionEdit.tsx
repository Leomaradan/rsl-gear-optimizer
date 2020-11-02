import React, { useState } from "react";
import { Pencil, Trash } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { deleteChampions } from "redux/championsSlice";
import { Champion } from "models/Champion";
import ChampionForm from "./ChampionForm";

export interface ChampionEditProps {
  champion: Champion;
}

const ChampionEdit = (props: ChampionEditProps): JSX.Element => {
  const { champion } = props;
  const { name } = champion;

  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatchDeleteChampion = () => {
    dispatch(deleteChampions({ name }));
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
        onClick={dispatchDeleteChampion}
      >
        <Trash />
      </button>
      <ChampionForm champion={champion} handleClose={handleClose} show={show} />
    </>
  );
};

export default ChampionEdit;
