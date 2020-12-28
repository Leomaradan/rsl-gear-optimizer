import ChampionsList from "components/Champions/ChampionsList";
import getProfile from "service/getProfileChampions";
import type { IProfile, IServiceStatus } from "models";
import type { ILanguageUiValidation } from "lang/language";
import { useLanguage } from "lang/LanguageContext";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";

const ProfileChampionsList = (): JSX.Element => {
  const [profile, updateProfile] = useState<IProfile>();
  const [status, setStatus] = useState<IServiceStatus>("Idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const lang = useLanguage();

  const { userName } = useParams<{ userName?: string }>();

  useEffect(() => {
    if (userName) {
      setStatus("Loading");
      getProfile({
        userName,
        success: (response) => {
          updateProfile(response);
          setStatus("Done");
        },
        fail: (error) => {
          if (error) {
            setErrorMessage(
              lang.ui.validation[error as keyof ILanguageUiValidation]
            );
          } else {
            setErrorMessage(lang.ui.validation.networkError);
          }

          setStatus("Error");
        },
      });
    }
  }, [lang.ui.validation, userName]);

  if (status === "Loading") {
    return <>{lang.ui.message.loading}</>;
  }

  if (status === "Error" || !profile) {
    return <Alert variant="danger">{errorMessage}</Alert>;
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ChampionsList {...profile} readOnly />;
};

export default ProfileChampionsList;
