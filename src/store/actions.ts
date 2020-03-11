import React from 'react';
import { Action } from './';
import { ThunkAction} from 'redux-thunk';
import { AppState } from '../store';

export interface LoginResponse{
	jwt?: string;
	error?: string
}

export function attemptlogin(
	username: string, 
	password: string
) : (dispatch:React.Dispatch<Action>) => Promise<void> {
	return async function(dispatch: React.Dispatch<Action>){
		dispatch({type: "LOGIN_ATTEMPT_STARTED"})
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
			})
		}
		catch(e){
			dispatch({type: "LOGIN_ATTEMPT_FAILED", message: e.toString()})
		}
	}
}

export function PrayerSheepSearch(search: string): ThunkAction<{},AppState,{},Action> {
	return async function(dispatch){
		dispatch({type: "PRAYER_SEARCH_INIT"});
		const result = await fetch("/api/graphql",{body:"{"})
	}
}

export function logout(){
	return { type: "LOGOUT"};
}