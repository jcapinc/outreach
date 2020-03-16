import React from 'react';
import { Action } from './';
import { ThunkAction} from 'redux-thunk';
import { AppState } from '../store';
import { ApolloError } from 'apollo-server-express';
import { IPrayerRequest,  } from '../../ModelTypes';

export interface LoginResponse{
	jwt?: string;
	error?: string
}

type MyThunk = ThunkAction<void, AppState, {}, Action>;

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

export function PrayerSheepSearch(search: string): MyThunk {
	
}

export function UpdatePrayerRequestForm(values: Partial<IPrayerFormValues>): Action{
	return {type:"ADD_PRAYER_FORM_UPDATE", payload: values};
}

export function UpdatePrayerRequestList(prs:IPrayerRequest[]): Action {
	return {type:"FETCH_PRAYER_REQUESTS_SUCCESS", payload: prs};
}

export function FetchPrayerRequests(): MyThunk{
	return async function(dispatch, getState){
		try{
			const jwt = getState().login.jwt;
			const graphql = `query{getPrayerRequests{guid,topic,body}}`;
			dispatch({type:"FETCH_PRAYER_REQUESTS_INIT"});
			const fetchResult = await fetch("/graphql", graphqlFetchOptions(jwt || "",graphql));
			if(!fetchResult.ok) return dispatch({
				type:"FETCH_PRAYER_REQUESTS_FAILURE", 
				response: fetchResult,
				message: fetchResult.statusText
			});
			const jsonResult = await fetchResult.json() as ApolloResponse<{getPrayerRequests:IPrayerRequest[]}>;
			return dispatch(UpdatePrayerRequestList(jsonResult.data.getPrayerRequests));
		}
		catch(err){
			dispatch({type:"FETCH_PRAYER_REQUESTS_FAILURE",message: err.toString(), payload: err});
		}
	}
}

export function setFormPrayerRequest(request: IPrayerRequest): Action{
	return {type: "SET_FORM_PRAYER_REQUEST", payload: request};
}

export function loadFormPrayerRequest(id: string): MyThunk {
	return async function(dispatch, getState){
		const records = getState().prayerRequests.requests;
		if(records !== undefined) for(let i = 0; i < records.length; i++) if(records[i].guid === id){
			console.log("Found Record!");
			return dispatch(setFormPrayerRequest(records[i]));
		}
		console.log("Record not found", id);
	};
}