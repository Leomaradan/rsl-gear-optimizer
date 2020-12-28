import { useAuth } from "./AuthContext";

import { useLanguage } from "lang/LanguageContext";
import logger from "process/logger";

import React, { FormEvent, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { Alert, Button } from "react-bootstrap";

const Signup = (): JSX.Element => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { setAuthToken } = useAuth();
  const lang = useLanguage();

  const postSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email === "" || email !== emailConfirm) {
      setError("Email mismatch");
      return;
    }

    if (password === "" || password !== passwordConfirm) {
      setError("Password mismatch");
      return;
    }

    axios
      .post(`${process.env.REACT_APP_END_POINT}/auth/create`, {
        userName,
        email,
        password,
      })
      .then((result) => {
        if (result.status === 200) {
          setAuthToken(result.data);
          setLoggedIn(true);
        } else {
          setError(result.data);
        }
      })
      .catch((e) => {
        logger.error(e);
        setError(String(e));
      });
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  const handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event?.target?.value);
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event?.target?.value);
  };

  const handleChangeEmailConfirm = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmailConfirm(event?.target?.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event?.target?.value);
  };

  const handleChangePasswordConfirm = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirm(event?.target?.value);
  };

  return (
    <form onSubmit={postSignup}>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="form-group row">
        <label htmlFor="inputUsername" className="col-sm-2 col-form-label">
          {lang.ui.title.username}
        </label>
        <div className="col-sm-10">
          <input
            type="text"
            required
            className="form-control"
            id="inputUsername"
            onChange={handleChangeUserName}
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="inputEmail" className="col-sm-2 col-form-label">
          {lang.ui.title.email}
        </label>
        <div className="col-sm-10">
          <input
            type="email"
            required
            className="form-control"
            id="inputEmail"
            onChange={handleChangeEmail}
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="inputEmailConfirm" className="col-sm-2 col-form-label">
          {lang.ui.title.emailConfirmation}
        </label>
        <div className="col-sm-10">
          <input
            type="email"
            required
            className="form-control"
            id="inputEmailConfirm"
            onChange={handleChangeEmailConfirm}
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
          {lang.ui.title.password}
        </label>
        <div className="col-sm-10">
          <input
            type="password"
            required
            className="form-control"
            id="inputPassword"
            onChange={handleChangePassword}
          />
        </div>
      </div>
      <div className="form-group row">
        <label
          htmlFor="inputPasswordConfirm"
          className="col-sm-2 col-form-label"
        >
          {lang.ui.title.passwordConfirmation}
        </label>
        <div className="col-sm-10">
          <input
            type="password"
            className="form-control"
            id="inputPasswordConfirm"
            required
            onChange={handleChangePasswordConfirm}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-10">
          <Button type="submit" variant="primary">
            {lang.ui.button.signup}
          </Button>
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-10">
          <Link to="/login">{lang.ui.message.accountExist}</Link>
        </div>
      </div>
    </form>
  );
};

export default Signup;
