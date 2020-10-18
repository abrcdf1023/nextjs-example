import { createEpicMiddleware } from "redux-observable";
import { configureStore } from "@reduxjs/toolkit";
import createHandleApisMiddleware from "@e-group/redux-modules/createHandleApisMiddleware";

import { rootEpic, rootReducer } from "./root";

function configureAppStore() {
  // create middlewares
  const epicMiddleware = createEpicMiddleware();
  const store = configureStore({
    reducer: rootReducer,
    // Correct typings for the Dispatch type
    // https://redux-toolkit.js.org/usage/usage-with-typescript
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(
        epicMiddleware,
        createHandleApisMiddleware()
      ),
    devTools: process.env.NODE_ENV !== "production",
  });

  // epicMiddleware need run after create store
  epicMiddleware.run(rootEpic);

  return store;
}

export const store = configureAppStore();
export type AppDispatch = typeof store.dispatch;
