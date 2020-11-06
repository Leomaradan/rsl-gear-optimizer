import App from "./App";
import { unregister } from "./serviceWorker";
import configureStore from "./redux/configureStore";
import LanguageProvider from "lang/LanguageProvider";
import React from "react";
import ReactDOM from "react-dom";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from "react-helmet-async";
import "./theme.scss";
import { Provider } from "react-redux";

const { store, persistor } = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <LanguageProvider>
      <HelmetProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </HelmetProvider>
    </LanguageProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister();
