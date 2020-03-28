import { decode } from 'jsonwebtoken';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as S from 'semantic-ui-react';
import { Button, Input } from 'semantic-ui-react';
import uniqid from 'uniqid';
import { IFamily, IPerson, IUserRecord } from '../../ModelTypes';
import { AppState, DeleteFamily, SaveFamily } from '../store';
import { AddPersonForm, PersonList } from './People';

const emptyPersonRecord = (firstname: string, lastname: string, creatorID: string, primary = false): IPerson => ({
	activity: [],
	addresses: [],
	created: (new Date()).toString(),
	creator: creatorID,
	emails: [],
	familyPrimary: primary,
	firstname, lastname,
	gender: "Man",
	guid: uniqid(),
	phones:[],
	role: "Other",
	updated: (new Date()).toString(),
	updatedBy: creatorID
});

export type IOnCreateFamily = (name: string) => void;

export interface ICreateFamilyFormProps{
	onSubmit: IOnCreateFamily;
	initialValue?: string;
}

export function CreateFamilyForm(props: ICreateFamilyFormProps){
	const [value, setValue] = React.useState(props.initialValue || "");
	return <div>
		<Input placeholder="New Family Surname" onChange={(e) => setValue(e.target.value)} value={value} />
		<Button onClick={() => props.onSubmit(value)}>Create</Button>
	</div>;
}

export function FamilyForm({id}:{id: string}){
	const [family, creator] = useSelector((state:AppState) => [
		state.currentState.families.find(record => record.guid === id),
		(decode(state.login.jwt || "") as IUserRecord).guid
	]);
	const [state, setState] = React.useState({goHome: false});
	const dispatch = useDispatch();
	if(state.goHome) return <Redirect to="/" />;
	if(family === undefined) return <S.Message>
		<S.Message.Header>Family Not Found</S.Message.Header>
		Could not find this family
	</S.Message>;
	return <FamilyFormMarkup family={family} creator={creator} 
		onSave={(family) => dispatch(SaveFamily(family))}
		onDelete={(family) => { dispatch(DeleteFamily(family)); setState({...state, goHome: true}) }}/>;
}

export interface IFamilyFormMarkupProps {
	family: IFamily;
	creator: string;
	onSave: (family: IFamily) => void;
	onDelete:(family: IFamily) => void;
}

export function FamilyFormMarkup(props: IFamilyFormMarkupProps){
	const [state, setState] = React.useState({
		family: props.family,
		editSurname: false,
		confirmDelete: false,
		allowDelete: false
	});
	const deleteClick = () => {
		setState({...state, confirmDelete: true, allowDelete: false});
		setTimeout(() => setState({...state, confirmDelete: true, allowDelete: true}), 1000);
		setTimeout(() => setState({...state, confirmDelete: false, allowDelete: false}), 10000);
	};
	const updateRecord = (key: keyof IFamily) => (e: React.ChangeEvent<HTMLInputElement>) => 
		setState({...state,family: { ...state.family, [key]: e.target.value}});
	return <React.Fragment>
		<div style={{float:"right"}}>
		{state.confirmDelete ? 
			<Button onClick={() => props.onDelete(state.family)} color="red" disabled={!state.allowDelete}>Are You Sure You Want To Delete?</Button> : 
			<Button onClick={deleteClick}>Delete Family</Button>}
		</div>
		{state.editSurname ? <React.Fragment>
			<S.Input label="Surname" value={state.family.surname} onChange={updateRecord("surname")} /> 
			<Button primary onClick={() => {setState({...state,editSurname: false});props.onSave(state.family); }}>Save Surname</Button>
		</React.Fragment>: <React.Fragment>
			<S.Header as='h1'>
				{state.family.surname} Family &nbsp;
				<S.Icon name="edit" style={{cursor:"pointer",fontSize:"0.5em",lineHeight:"1em"}} onClick={() => setState({...state,editSurname: true})} />
			</S.Header>
		</React.Fragment>}
		{state.family.members.length === 0 ? <S.Message>
			<S.Message.Header>There Are No Members</S.Message.Header>
			Add a member to this family
		</S.Message> : <PersonList people={state.family.members} family={state.family.guid} />}
		<AddPersonForm onSubmit={firstname => setState({...state, family:{...state.family, members:[...state.family.members, 
			emptyPersonRecord(firstname, state.family.surname, props.creator, state.family.members.length === 0)
		]}})}/>
		<Button primary onClick={() => props.onSave(state.family)}>Save</Button>
	</React.Fragment>;
}