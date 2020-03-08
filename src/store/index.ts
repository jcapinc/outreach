import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import thunk from "redux-thunk";
export * from './actions';
export * from './reducer';
export const store = createStore(reducer, applyMiddleware(thunk));