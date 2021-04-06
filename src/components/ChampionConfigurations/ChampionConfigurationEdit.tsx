import ChampionForm from "./ChampionConfigurationForm";

import type { IChampionConfiguration } from "../../models";
import { deleteChampionConfigurations } from "../../redux/championConfigurationsSlice";

import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";

interface IChampionEditProps {
  champion: IChampionConfiguration;
}

const ChampionEdit = (props: IChampionEditProps): JSX.Element => {
  const { champion } = props;
  const { Guid: name } = champion;

  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatchDeleteChampion = () => {
    dispatch(deleteChampionConfigurations({ id: name }));
  };

  return (
    <>
      <Button onClick={handleShow} size="sm" variant="primary">
        <Pencil />
      </Button>
      <Button onClick={dispatchDeleteChampion} size="sm" variant="danger">
        <Trash />
      </Button>
      <ChampionForm champion={champion} handleClose={handleClose} show={show} />
    </>
  );
};

export default ChampionEdit;
