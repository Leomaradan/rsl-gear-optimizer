import React from "react";
import { Route, Switch } from "react-router-dom";

const PrivateRoute = React.lazy(() => import("./auth/PrivateRoute"));

const Login = React.lazy(() => import("./pages/auth/Login"));
const Logout = React.lazy(() => import("./pages/auth/Logout"));
const Signup = React.lazy(() => import("./pages/auth/Signup"));
const Accessories = React.lazy(() => import("./pages/Accessories"));
const Artifacts = React.lazy(() => import("./pages/Artifacts"));
const Home = React.lazy(() => import("./pages/Home"));
const OwnChampionsList = React.lazy(() => import("./pages/ChampionsListPage"));
const SellList = React.lazy(() => import("./pages/SellList"));

const ChampionConfigurationsList = React.lazy(
  () => import("./pages/champions/ChampionConfigurationsList")
);

const Configuration = React.lazy(() => import("./pages/config/Configuration"));
const GameProgression = React.lazy(
  () => import("./pages/config/GameProgression")
);
const Import = React.lazy(() => import("./pages/config/Import"));

const Results = React.lazy(() => import("./pages/results/Results"));

const Routes = (): JSX.Element => (
  <Switch>
    <PrivateRoute
      component={ChampionConfigurationsList}
      exact
      path="/champions/configurations"
    />
    <PrivateRoute component={OwnChampionsList} exact path="/champions" />
    <PrivateRoute component={OwnChampionsList} exact path="/champions/:slug" />
    <PrivateRoute component={Accessories} exact path="/artifacts/accessories" />
    <PrivateRoute component={SellList} exact path="/artifacts/sell-list" />
    <PrivateRoute component={Artifacts} exact path="/artifacts" />
    <PrivateRoute component={Results} exact path="/results" />

    <PrivateRoute component={Import} exact path="/config/import" />
    <PrivateRoute component={GameProgression} exact path="/config/game" />
    <PrivateRoute component={Configuration} exact path="/config/profile" />
    <PrivateRoute component={Configuration} exact path="/config" />
    <Route component={Login} exact path="/auth/sign-in" />
    <Route component={Logout} exact path="/auth/sign-out" />
    <Route component={Signup} exact path="/auth/sign-up" />
    <Route component={Home} exact path="/" />
  </Switch>
);

export default Routes;
