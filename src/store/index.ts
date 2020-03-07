import { combineReducers, createStore } from "redux";
import loginReducer from "./login";


const reducers = combineReducers({
  login: loginReducer
});

export const store = createStore(reducers);

export type AppStore = ReturnType<typeof reducers>;
