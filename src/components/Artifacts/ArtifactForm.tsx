/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useLanguage } from "../../lang/LanguageContext";
import type { IArtifact, IErrors, IRarity } from "../../models";
import { createArtifacts, updateArtifacts } from "../../redux/artifactsSlice";
import Modal from "../UI/Modal";
import Stack from "../UI/Stack";

import ArtifactFormBase from "./ArtifactFormBase";
import ArtifactFormStats from "./ArtifactFormStats";

interface IArtifactFormProps {
  artifact: IArtifact;
  lockedFields?: string[];
  moreButtons?: { title: string; variant?: string; action: () => void }[];
  show: boolean;
  handleClose(): void;
}

export interface IArtifactFormSubProps {
  errors: IErrors;
  lockedFields: string[];
  setState: Dispatch<SetStateAction<IArtifact>>;
  state: IArtifact;
}

const validateArtifact = (artifact: IArtifact): Record<string, string> => {
  const errors: Record<string, string> = {} as any;

  if ((artifact.Level as any) === "") {
    errors.Level = "set a level";
  }

  if (artifact.MainStats === "") {
    errors.MainStats = "Select a main stats";
  }

  if (artifact.MainStatsValue === undefined) {
    errors.MainStatsValue = "Select a main stats value";
  }

  if (!artifact.Quality) {
    errors.Quality = "select a quality";
  }

  if (
    !artifact.isAccessory &&
    (!artifact.Set || (artifact.Set as any) === "")
  ) {
    errors.Set = "Select a set";
  }

  if (
    artifact.isAccessory &&
    (!artifact.Clan || (artifact.Clan as any) === "")
  ) {
    errors.Clan = "Select a clan";
  }

  const raritySubStat = (rarity: IRarity) => {
    if (rarity === "Legendary") {
      return 4;
    }

    if (rarity === "Epic") {
      return 3;
    }

    if (rarity === "Rare") {
      return 2;
    }

    if (rarity === "Uncommon") {
      return 1;
    }

    return 0;
  };

  const subStatMin = Math.max(
    Math.floor(artifact.Level / 4),
    raritySubStat(artifact.Rarity)
  );

  artifact.SubStats.forEach((stat, index) => {
    const statNumber = index + 1;
    if ((!stat || (!stat.Stats as any) === "") && subStatMin >= statNumber) {
      errors[`SubStat${statNumber}`] = `configure the stat ${statNumber}`;
    }

    if (stat && (!stat.Stats as any) === "" && !stat.Value) {
      errors[
        `SubStatValue${statNumber}`
      ] = `configure the stat value ${statNumber}`;
    }
  });

  return errors;
};

const ArtifactForm = (props: IArtifactFormProps): JSX.Element => {
  const {
    artifact,
    handleClose,
    lockedFields: baseLockedFields,
    moreButtons,
    show,
  } = props;

  const lockedFields = baseLockedFields ?? [];

  const dispatch = useDispatch();

  const [state, setState] = useState<Readonly<IArtifact>>(artifact);
  const [errors, setErrors] = useState<IErrors>([]);

  const lang = useLanguage();

  useEffect(() => {
    setState(artifact);
    setErrors([]);
  }, [artifact, show]);

  const save = () => {
    const validation = validateArtifact(state);

    if (Object.keys(validation).length === 0) {
      if (state.Guid !== undefined) {
        dispatch(
          updateArtifacts({
            artifact: state as IArtifact,
            id: state.Guid as string,
          })
        );
      } else {
        dispatch(createArtifacts(state));
      }

      handleClose();
    } else {
      setErrors(
        Object.keys(validation).map((error) => ({
          slot: error,
          text: validation[error],
        }))
      );
    }
  };

  const content = (
    <Stack>
      <ArtifactFormBase
        errors={errors}
        lockedFields={lockedFields}
        setState={setState}
        state={state}
      />
      <ArtifactFormStats
        errors={errors}
        lockedFields={lockedFields}
        setState={setState}
        state={state}
      />
    </Stack>
  );

  return (
    <>
      <Modal
        content={content}
        moreButtons={moreButtons}
        onClose={handleClose}
        onSave={save}
        show={show}
        title={lang.ui.title.artifacts}
      />
    </>
  );
};

ArtifactForm.defaultProps = {
  lockedFields: [],
  moreButtons: [],
};

export default ArtifactForm;
