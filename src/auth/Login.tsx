import axios from "axios";
import React, { FormEvent, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";

import { useLanguage } from "../lang/LanguageContext";
import logger from "../process/logger";

import { useAuth } from "./AuthContext";

interface ILoginProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location: any;
}

const Login = ({ location }: ILoginProps): JSX.Element => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthToken } = useAuth();

  const lang = useLanguage();

  const referer = location?.state?.referer || "/";

  const postLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .post(`${process.env.REACT_APP_END_POINT}/auth/login`, {
        password,
        userName: email,
      })
      .then((result) => {
        if (result.status === 200) {
          setAuthToken(result.data);
          setLoggedIn(true);
        } else {
          setIsError(true);
        }
      })
      .catch((e) => {
        logger.error(e);
        setIsError(true);
      });
  };

  if (isLoggedIn) {
    return <Redirect to={referer} />;
  }

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event?.target?.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event?.target?.value);
  };

  return (
    <form onSubmit={postLogin}>
      {isError && (
        <Alert variant="danger">
          {lang.ui.validation.invalidLoginCredential}
        </Alert>
      )}
      <div className="form-group row">
        <label className="col-sm-2 col-form-label" htmlFor="inputEmail">
          {lang.ui.title.email}
        </label>
        <div className="col-sm-10">
          <input
            className="form-control"
            id="inputEmail"
            onChange={handleChangeEmail}
            required
            type="email"
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label" htmlFor="inputPassword">
          {lang.ui.title.password}
        </label>
        <div className="col-sm-10">
          <input
            className="form-control"
            id="inputPassword"
            onChange={handleChangePassword}
            required
            type="password"
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-10">
          <Button type="submit" variant="primary">
            {lang.ui.button.login}
          </Button>
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-10">
          <Link to="/signup">{lang.ui.message.needAccount}</Link>
        </div>
      </div>
    </form>
  );
};

export default Login;
