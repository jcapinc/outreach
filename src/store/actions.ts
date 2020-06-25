import { Action } from './';
import { ThunkAction} from 'redux-thunk';
import { AppState } from '../store';
import * as MT from '../../ModelTypes';
import { diff } from 'deep-diff';
import uniqid from 'uniqid';
import { decode } from 'jsonwebtoken';

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
		if(getState().login.jwt === undefined) return;
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
		const diffs = diff(JSON.parse(state.initialState) as MT.IUserAppState, state.currentState);
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

export function CreateFamily(surname: string, id: string = uniqid()): MyThunk {
	return async function(dispatch, getState){
		const state = getState();
		const user = decode(state.login.jwt || "") as MT.IUserRecord
		const family: MT.IFamily = {
			surname,
			creator: user.guid,
			guid: id,
			members: [],
			created: (new Date()).toUTCString(),
			updated: (new Date()).toUTCString(),
			updatedBy: user.guid
		};
		dispatch({type: "CREATE_FAMILY", payload: family});
		return dispatch(SendState());
	}
}

export function SaveFamily(family: MT.IFamily): MyThunk {
	return async function(dispatch){
		dispatch({type: "UPDATE_FAMILY", payload: family});
		return dispatch(SendState());
	}
}

export function DeleteFamily(family: Pick<MT.IFamily, "guid">): MyThunk {
	return async function(dispatch){
		dispatch({type:"DELETE_FAMILY", payload: family});
		return dispatch(SendState());
	}
}

export function GetPrimaryMember(people:MT.IPerson[] | undefined){
	if(people === undefined) return undefined;
	if(people.length === 0) return undefined;
	const found = people.find(person => person.familyPrimary);
	return found || people[0];
}

export function GetPrimaryContact<T extends MT.IContact>(contactList:T[] | undefined): T | undefined{
	if(contactList === undefined) return undefined;
	if(contactList.length === 0) return undefined;
	const found = contactList.find(contact => contact.primary);
	return found || contactList[0];
}

export function UpdateFamilyPerson(familyID: string, person:MT.IPerson): MyThunk{
	return async function(dispatch,getState){
		const family = getState().currentState.families.find(family => family.guid === familyID);
		if(family === undefined) return false;
		const personKey = family.members.findIndex(member => member.guid === person.guid);
		if(personKey === -1) family.members.push(person);
		else family.members[personKey] = person;
		let hasPrimary = false;
		family.members = family.members.map(member => {
			if(hasPrimary) return {...member, familyPrimary: false};
			if(member.familyPrimary) hasPrimary = true;
			return member;
		});
		return dispatch(SaveFamily(Object.assign({}, family)));
	}
}

export function DeleteFamilyPerson(familyID: string, person: Pick<MT.IPerson, "guid">): MyThunk{
	return async function(dispatch, getState){
		const family = getState().currentState.families.find(family => family.guid === familyID);
		if(family === undefined){
			console.log("Could not find family to delete family member", familyID, person);
			return false;
		}
		const memberlist = Array.from(family.members);
		const memberIndex = memberlist.findIndex(member => member.guid === person.guid);
		memberlist.splice(memberIndex,1);
		family.members = memberlist;
		return dispatch(SaveFamily(family));
	}
}

function SelectPersonAndSaveFamily(familyID: string, personID: string, cb: (family: MT.IFamily, personKey: number) => MT.IFamily): MyThunk {
	return async function(dispatch, getState) {
		const family = getState().currentState.families.find(family => family.guid === familyID);
		if (family === undefined) {
			console.log("Error when selecting person, could not find family");
			return false;
		}
		const personKey = family.members.findIndex(person => person.guid === personID);
		if (personKey === -1) {
			console.log("Error when selecting person, could not find person on family");
			return false;
		}
		const newFamily = cb(family, personKey);
		return dispatch(SaveFamily(newFamily));
	};
}

export function ModifyActivity(key: number, familyID: string, personID: string, newActivity: MT.IActivity): MyThunk {
	return SelectPersonAndSaveFamily(familyID, personID, (family, personKey) => {
		family.members[personKey].activity[key] = newActivity;
		return family;
	})
}

export function AddActivity(familyID: string, personID: string, newActivity: MT.IActivity): MyThunk {
	return SelectPersonAndSaveFamily(familyID, personID, (family, personKey) => {
		family.members[personKey].activity.push(newActivity);
		return family;
	})
}

export function DeleteActivity(ActivityID: number, familyID: string, personID: string): MyThunk {
	return SelectPersonAndSaveFamily(familyID, personID, (family, personKey) => {
		family.members[personKey].activity = family.members[personKey].activity.filter((member, index) => index !== ActivityID);
		return family;
	})
}