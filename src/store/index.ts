import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import thunk from "redux-thunk";
import { FetchState } from "./actions";
export * from './actions';
export * from './reducer';
export const store = createStore(reducer, applyMiddleware(thunk));

store.dispatch(FetchState() as any);