/* eslint-disable @typescript-eslint/no-explicit-any */
import ArtifactFormBase from "./ArtifactFormBase";
import ArtifactFormStats from "./ArtifactFormStats";
import { createArtifacts, updateArtifacts } from "redux/artifactsSlice";

import { useLanguage } from "lang/LanguageContext";
import Stack from "components/UI/Stack";

import Modal from "components/UI/Modal";
import { Artifact, Clans, Errors, Sets, Stat } from "models";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";

interface ArtifactFormProps {
  artifact: Artifact;
  show: boolean;
  handleClose(): void;
}

export const validateArtifact = (
  artifact: Artifact,
  setErrors: (errors: Errors) => void
): boolean => {
  const errorsList: Errors = [];

  if ((artifact.Level as any) === "") {
    errorsList.push({
      slot: "Level",
      text: "set a level",
    });
  }

  if (artifact.MainStats === Stat.None) {
    errorsList.push({
      slot: "MainStats",
      text: "select a main stats",
    });
  }

  if (artifact.MainStatsValue === undefined) {
    errorsList.push({
      slot: "MainStatValue",
      text: "select a main stats value",
    });
  }

  if (!artifact.Quality) {
    errorsList.push({
      slot: "Quality",
      text: "select a quality",
    });
  }

  if (
    !artifact.isAccessory &&
    (!artifact.Set || (artifact.Set as any) === Sets.Null)
  ) {
    errorsList.push({
      slot: "Set",
      text: "select a set",
    });
  }

  if (
    artifact.isAccessory &&
    (!artifact.Clan || (artifact.Clan as any) === Clans.Null)
  ) {
    errorsList.push({
      slot: "Clan",
      text: "select a clan",
    });
  }

  const subStatMin = Math.max(Math.floor(artifact.Level / 4), artifact.Rarity);

  artifact.SubStats.forEach((stat, index) => {
    const statNumber = index + 1;
    if (
      (!stat || (!stat.Stats as any) === Stat.None) &&
      subStatMin >= statNumber
    ) {
      errorsList.push({
        slot: `SubStat${statNumber}`,
        text: `configure the stat ${statNumber}`,
      });
    }

    if (stat && (!stat.Stats as any) === Stat.None && !stat.Value) {
      errorsList.push({
        slot: `SubStatValue${statNumber}`,
        text: `configure the stat value ${statNumber}`,
      });
    }
  });

  setErrors(errorsList);

  return errorsList.length === 0;
};

const ArtifactForm = (props: ArtifactFormProps): JSX.Element => {
  const { show, handleClose, artifact } = props;

  const dispatch = useDispatch();

  const [state, setState] = useState<Readonly<Artifact>>(artifact);
  const [errors, setErrors] = useState<Errors>([]);

  const lang = useLanguage();

  useEffect(() => {
    setState(artifact);
    setErrors([]);
  }, [artifact, show]);

  const save = () => {
    const ok = validateArtifact(state, setErrors);

    if (ok) {
      if (state.Guid !== undefined) {
        dispatch(
          updateArtifacts({
            id: state.Guid as string,
            artifact: state as Artifact,
          })
        );
      } else {
        dispatch(createArtifacts(state));
      }

      handleClose();
    }
  };

  const content = (
    <Stack>
      <ArtifactFormBase errors={errors} setState={setState} state={state} />
      <ArtifactFormStats errors={errors} setState={setState} state={state} />
    </Stack>
  );

  return (
    <>
      <Modal
        title={lang.titleArtifacts}
        content={content}
        onClose={handleClose}
        onSave={save}
        show={show}
      />
    </>
  );
};

export default ArtifactForm;
