import { Action } from './';
import { ThunkAction} from 'redux-thunk';
import { AppState } from '../store';
import { IPrayerRequest, IUserAppState } from '../../ModelTypes';
import { diff } from 'deep-diff';

export interface LoginResponse{
	jwt?: string;
	error?: string
}

type MyThunk = ThunkAction<void, AppState, {}, Action>;

export function attemptlogin(username: string, password: string) : MyThunk {
	return async function(dispatch){
		dispatch({type: "LOGIN_ATTEMPT_STARTED"});
		try {
			const result = await fetch("/api/login", {
				method: "POST",
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({username, password})
			});
			const response: LoginResponse | undefined = await result.json();
			if(response === undefined) dispatch({
				type: "LOGIN_ATTEMPT_FAILED",
				message: "No response from login"
			});

			else if(result.ok) dispatch({
				type: "LOGIN_ATTEMPT_SUCCESS",
				response: result,
				message: response.jwt
			}); else dispatch({
				type: "LOGIN_ATTEMPT_FAIL",
				message: response.error?.toString() || ""
			});
		}
		catch(e){
			dispatch({type: "LOGIN_ATTEMPT_FAILED", message: e.toString()})
		}
	}
}

export function logout(): Action {
	return { type: "LOGOUT"};
}

export function FetchState(): MyThunk{
	return async function(dispatch, getState){
		const response = await fetch("/state",{
			headers:[["Authorization", "Bearer " + getState().login.jwt]]
		});
		if(!response.ok) return dispatch({type:"FETCH_STATE_ERROR", response});
		return dispatch({type:"FETCH_STATE_SUCCESS", payload: await response.json()});
	}
}

export function SendState(): MyThunk {
	return async function(dispatch, getState){
		dispatch({type:"SEND_STATE_INIT"});
		const state = getState();
		const diffs = diff(JSON.parse(state.initialState) as IUserAppState, state.currentState);
		if(diffs === undefined) return console.log("Saved with no differences, canceling");
		console.log(diffs);
		const response = await fetch("/state",{
			method:"POST",
			body:JSON.stringify(diffs),
			headers: [
				["Content-Type","application/json"],
				["Authorization","Bearer " + state.login.jwt]
			]
		});
		if(!response.ok) return dispatch({type:"SEND_STATE_FAILURE"})
		return dispatch(FetchState());
	}
}

export function SavePrayerRequest(req:IPrayerRequest): MyThunk{
	return async function(dispatch, getState){
		const state = getState();
		const requests = state.currentState.requests;
		const key = requests.findIndex(record => record.guid === req.guid);
		requests[key] = req;
		dispatch(SetPrayerRequests(requests));
		dispatch(SendState());
	}
}

export const SetPrayerRequests = (reqs:IPrayerRequest[]): Action => ({
	type: "SET_PRAYER_REQUESTS",
	payload: reqs
});

export function AddPrayerRequest(req:IPrayerRequest): Action {
	return {
		type: "ADD_PRAYER_REQUEST",
		payload: req
	};
}

