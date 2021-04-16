import React from "react";
import { DialogProvider } from "react-bootstrap-easy-dialog";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider as ReduxProvider } from "react-redux";

import AuthProvider from "./auth/AuthProvider";
import LoadingScreen from "./components/UI/LoadingScreen";
import LanguageProvider from "./lang/LanguageProvider";
import configureStore from "./redux/configureStore";
import { unregister } from "./serviceWorker";

// eslint-disable-next-line import/no-unassigned-import
import "./theme.scss";

const App = React.lazy(() => import("./App"));

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingScreen />}>
      <AuthProvider>
        <LanguageProvider>
          <HelmetProvider>
            <ReduxProvider store={store}>
              <DialogProvider>
                <App />
              </DialogProvider>
            </ReduxProvider>
          </HelmetProvider>
        </LanguageProvider>
      </AuthProvider>
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister();
