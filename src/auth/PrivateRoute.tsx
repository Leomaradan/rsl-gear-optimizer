/* eslint-disable react/jsx-props-no-spreading */
import { useAuth } from "./AuthContext";

import React, { ComponentType } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface IPrivateRouteProps extends RouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
}

const PrivateRoute = ({
  component: Component,
  ...rest
}: IPrivateRouteProps): JSX.Element => {
  const { isAuth } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { referer: props.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
