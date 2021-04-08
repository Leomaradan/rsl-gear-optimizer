import type { ComponentType } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { useAuth } from "./AuthContext";

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
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={(props) =>
        isAuth ? (
          // eslint-disable-next-line react/jsx-props-no-spreading
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
