import React from 'react';
import { Action } from './';
import { ThunkAction} from 'redux-thunk';
import { AppState } from '../store';
import { ApolloError } from 'apollo-server-express';

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

export function PrayerSheepSearch(search: string): ThunkAction<void,AppState,{},Action> {
	return async function(dispatch, getState){
		dispatch({type: "ADD_PRAYER_SEARCH_INIT", message: search});
		if(search === ""){
			dispatch({type: "ADD_PRAYER_SEARCH_CLEAR"});
			return;
		}

		const jwt: string = (getState() as AppState).login.jwt || "";
		if(jwt === "") {
			dispatch({type:"ADD_PRAYER_SEARCH_ERROR",message: "Cannot search for sheep when you are not logged in"});
			return
		}
		
		const graphql = `query {getFlockFuzzy(search:"${search}"){guid,firstname,lastname}}`;
		const reqinit = {
			body: JSON.stringify({'query':graphql}), 
			method: "POST", 
			headers:[
				['content-type','application/json'],
				['Authorization', `Bearer ${jwt}`]
			]
		};
		const result = await fetch("/graphql",reqinit);
		if(!result.ok){
			console.log(result.statusText);
		}
		const decoded = await result.json();

		if(decoded.error !== undefined) {
			const error: ApolloError = decoded.error;
			dispatch({
				type:"ADD_PRAYER_SEARCH_ERROR",
				response: result,
				message: error.message,
				payload: decoded
			});
			return;
		}
		
		dispatch({
			type: "ADD_PRAYER_SEARCH_COMPLETED",
			response: result,
			payload: decoded
		});
	}
}

export function logout(): Action {
	return { type: "LOGOUT"};
}