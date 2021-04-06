import App from "./App";
import configureStore from "./redux/configureStore";
import { unregister } from "./serviceWorker";
import AuthProvider from "./auth/AuthProvider";
import LanguageProvider from "./lang/LanguageProvider";

import React from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider as ReduxProvider } from "react-redux";
import "./theme.scss";

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <HelmetProvider>
          <ReduxProvider store={store}>
            <App />
          </ReduxProvider>
        </HelmetProvider>
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

/*
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
*/
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister();
