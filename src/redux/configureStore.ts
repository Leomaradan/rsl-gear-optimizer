import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, Persistor } from "redux-persist";
import localforage from "localforage";
import logger from "redux-logger";
import rootReducer from "./reducers";

const persistConfig = {
  key: "root",
  storage: localforage,
  blacklist: ["results"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default (): { store: EnhancedStore; persistor: Persistor } => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
      const middlewares = getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      });
      if (process.env.NODE_ENV !== "production") {
        return middlewares.concat(logger);
      }

      return middlewares;
    },
  });
  const persistor = persistStore(store);
  return { store, persistor };
};
