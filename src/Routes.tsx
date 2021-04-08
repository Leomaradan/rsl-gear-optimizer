import { Route, Switch } from "react-router-dom";

import Login from "./auth/Login";
import Logout from "./auth/Logout";
import PrivateRoute from "./auth/PrivateRoute";
import Signup from "./auth/Signup";
import ChampionConfigurationsList from "./components/ChampionConfigurations/ChampionConfigurationsList";
import Configuration from "./components/Configuration/Configuration";
import GameProgression from "./components/Configuration/GameProgression";
import ImportExport from "./components/Configuration/ImportExport";
import Results from "./components/Results/Results";
import Accessories from "./pages/Accessories";
import Artifacts from "./pages/Artifacts";
import Home from "./pages/Home";
import OwnChampionsList from "./pages/OwnChampionsList";
import ProfileChampionsList from "./pages/ProfileChampionsList";
import SellList from "./pages/SellList";

const Routes = (): JSX.Element => (
  <Switch>
    <Route component={ProfileChampionsList} exact path="/u/:username" />
    <Route component={ProfileChampionsList} exact path="/u/:username/:slug" />
    <Route
      component={ChampionConfigurationsList}
      exact
      path="/champions/configurations"
    />
    <Route component={OwnChampionsList} exact path="/champions" />
    <Route component={OwnChampionsList} exact path="/champions/:slug" />
    <Route component={Accessories} exact path="/artifacts/accessories" />
    <Route component={SellList} exact path="/artifacts/sell-list" />
    <Route component={Artifacts} exact path="/artifacts" />
    <Route component={Results} exact path="/results" />
    <Route component={Configuration} exact path="/config" />
    <Route component={ImportExport} exact path="/config/import" />
    <Route component={GameProgression} exact path="/config/game" />
    <PrivateRoute component={Configuration} exact path="/config/profile" />
    <Route component={Login} exact path="/auth/sign-in" />
    <Route component={Logout} exact path="/auth/sign-out" />
    <Route component={Signup} exact path="/auth/sign-up" />
    <Route component={Home} exact path="/" />
  </Switch>
);

export default Routes;
