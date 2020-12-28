import ChampionConfigurationsList from "./components/ChampionConfigurations/ChampionConfigurationsList";

import Login from "auth/Login";
import Logout from "auth/Logout";
import Signup from "auth/Signup";
import Artifacts from "pages/Artifacts";
import Accessories from "pages/Accessories";
import SellList from "pages/SellList";
import Configuration from "components/Configuration/Configuration";
import Results from "components/Results/Results";
import Home from "pages/Home";
import PrivateRoute from "auth/PrivateRoute";
import ImportExport from "components/Configuration/ImportExport";
import GameProgression from "components/Configuration/GameProgression";
import OwnChampionsList from "pages/OwnChampionsList";
import ProfileChampionsList from "pages/ProfileChampionsList";

import React from "react";
import { Route, Switch } from "react-router-dom";

const Routes = (): JSX.Element => (
  <Switch>
    <Route exact path="/u/:username" component={ProfileChampionsList} />
    <Route exact path="/u/:username/:slug" component={ProfileChampionsList} />
    <Route
      exact
      path="/champions/configurations"
      component={ChampionConfigurationsList}
    />
    <Route exact path="/champions" component={OwnChampionsList} />
    <Route exact path="/champions/:slug" component={OwnChampionsList} />
    <Route exact path="/artifacts/accessories" component={Accessories} />
    <Route exact path="/artifacts/sell-list" component={SellList} />
    <Route exact path="/artifacts" component={Artifacts} />
    <Route exact path="/results" component={Results} />
    <Route exact path="/config" component={Configuration} />
    <Route exact path="/config/import" component={ImportExport} />
    <Route exact path="/config/game" component={GameProgression} />
    <PrivateRoute exact path="/config/profile" component={Configuration} />
    <Route exact path="/auth/sign-in" component={Login} />
    <Route exact path="/auth/sign-out" component={Logout} />
    <Route exact path="/auth/sign-up" component={Signup} />
    <Route exact path="/" component={Home} />
  </Switch>
);

export default Routes;
