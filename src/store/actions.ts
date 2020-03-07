import React from 'react';
import { Action } from './';

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
			const stream = await result.body?.getReader().read();
			const message = stream?.value.toString();
			if(message === undefined) dispatch({
				type: "LOGIN_ATTEMPT_FAILED",
				message: "No response from login"
			});
			else if(result.ok) dispatch({
				type: "LOGIN_ATTEMPT_SUCCESS",
				response: result,
				message
			}); else dispatch({
				type: "LOGIN_ATTEMPT_FAIL",
				message: JSON.parse(message).error?.toString() || ""
			})
		}
		catch(e){
			dispatch({type: "LOGIN_ATTEMPT_FAILED", message: e.toString()})
		}
	}
}