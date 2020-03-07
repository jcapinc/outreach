import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import thunk from "redux-thunk";

export const store = createStore(reducer, applyMiddleware(thunk));

export * from './actions';
export * from './reducer';