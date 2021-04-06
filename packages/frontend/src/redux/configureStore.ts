import rootReducer from "./reducers";

import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

export default (): EnhancedStore =>
  configureStore({
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
