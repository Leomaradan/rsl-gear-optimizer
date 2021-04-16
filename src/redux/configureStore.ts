import {
  EnhancedStore,
  configureStore as configureStoreToolkit,
} from "@reduxjs/toolkit";
import logger from "redux-logger";

import rootReducer from "./reducers";

const configureStore = (): EnhancedStore =>
  configureStoreToolkit({
    reducer: rootReducer,
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

export default configureStore;
