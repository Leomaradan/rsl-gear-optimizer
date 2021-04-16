import React, { FormEvent, useCallback, useContext, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

import LanguageContext, {
  ILanguageContextDefinition,
  useLanguage,
} from "../../lang/LanguageContext";
import { loginWithCredentialThunk } from "../../redux/accountSlice";

interface ILoginProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location: any;
}

const Login = ({ location }: ILoginProps): JSX.Element => {
  //const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthToken, isAuth } = useAuth();

  const { userLanguageChange } = useContext<ILanguageContextDefinition>(
    LanguageContext
  );

  const lang = useLanguage();

  const dispatch = useDispatch();
  //const loginStatus = useSelector((state: IState) => state.account.status);

  const referer = location?.state?.referer || "/";

  const postLogin = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();

      dispatch(
        loginWithCredentialThunk(
          email,
          password,
          (data) => {
            setAuthToken(data.token);

            userLanguageChange(data.language);
          },
          () => {
            setIsError(true);
          }
        )
      );
    },
    [dispatch, email, password, setAuthToken, userLanguageChange]
  );

  const handleChangeEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event?.target?.value);
    },
    []
  );

  const handleChangePassword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event?.target?.value);
    },
    []
  );

  console.log({ referer, isAuth });
  if (isAuth) {
    return <Redirect to={referer} />;
  }

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
