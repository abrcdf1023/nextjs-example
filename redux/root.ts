import { combineEpics } from "redux-observable";
import { combineReducers } from "redux";

import { dialogs } from "@e-group/redux-modules/dialogs";
import { snackbars } from "@e-group/redux-modules/snackbars";
import { entities } from "@e-group/redux-modules/entities";
import { apis } from "@e-group/redux-modules/apis";

export const rootEpic = combineEpics();

// root reducer
export const rootReducer = combineReducers({
  dialogs,
  snackbars,
  entities,
  apis,
});
export type RootState = ReturnType<typeof rootReducer>;
