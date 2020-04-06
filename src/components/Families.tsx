import { decode } from 'jsonwebtoken';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import * as S from 'semantic-ui-react';
import { Button, Input } from 'semantic-ui-react';
import uniqid from 'uniqid';
import { IFamily, IPerson, IUserRecord } from '../../ModelTypes';
import { AppState, DeleteFamily, SaveFamily, GetPrimaryMember, GetPrimaryContact, DeleteFamilyPerson } from '../store';
import { AddPersonForm, PersonList, PersonFormMarkup } from './People';	
import dayjs from 'dayjs';

const emptyPersonRecord = (firstname: string, lastname: string, creatorID: string, primary = false): IPerson => ({
	activity: [],
	addresses: [],
	created: dayjs().subtract(20,"year").format("YYYY-MM-DD"),
	creator: creatorID,
	dob: dayjs().subtract(18,"year").toDate().toString(),
	emails: [],
	familyPrimary: primary,
	firstname, lastname,
	gender: "Man",
	guid: uniqid(),
	phones:[],
	role: "Other",
	updated: dayjs().toString(),
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

export interface IFamilyListProps{
	families: IFamily[];
}

export function FamilyList({families}: IFamilyListProps){
	return <>
		<S.Responsive>
			<S.Table>
				<S.Table.Header>
					<S.Table.Row>
						<S.Table.HeaderCell>Surname</S.Table.HeaderCell>
						<S.Table.HeaderCell>Primary Contact</S.Table.HeaderCell>
						<S.Table.HeaderCell>Primary Contact Phone</S.Table.HeaderCell>
						<S.Table.HeaderCell>Primary Contact Email</S.Table.HeaderCell>
						<S.Table.HeaderCell>Member Count</S.Table.HeaderCell>
					</S.Table.Row>
				</S.Table.Header>
				<S.Table.Body>
					{families.map(family => {
						const primary = GetPrimaryMember(family.members);
						const primaryEmail = GetPrimaryContact(primary?.emails);
						const primaryPhone = GetPrimaryContact(primary?.phones);
						return <S.Table.Row key={family.guid}>
							<S.Table.Cell><Link to={"/family/"+family.guid}>{family.surname}</Link></S.Table.Cell>
							<S.Table.Cell>{primary ? `${primary.firstname} ${primary.lastname}` : <i>No Primary Contact</i>}</S.Table.Cell>
							<S.Table.Cell>{primaryPhone ? <a href={"tel:" + primaryPhone.number}>{primaryPhone.number}</a> : <i>No Primary Phone</i>}</S.Table.Cell>
							<S.Table.Cell>{primaryEmail ? <a href={"mailto:" + primaryEmail.address}>{primaryEmail.address}</a> : <i>No Primary Email</i>}</S.Table.Cell>
							<S.Table.Cell>{family.members.length}</S.Table.Cell>
					</S.Table.Row>;
					})}
				</S.Table.Body>
			</S.Table>
		</S.Responsive>
	</>;
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
		onDeleteMember={(familyID: string, member: IPerson) => dispatch(DeleteFamilyPerson(familyID, member))}
		onSave={(family) => dispatch(SaveFamily(family))}
		onDelete={(family) => { dispatch(DeleteFamily(family)); setState({...state, goHome: true}) }}/>;
}

export interface IFamilyFormMarkupProps {
	family: IFamily;
	creator: string;
	onSave: (family: IFamily) => void;
	onDelete:(family: IFamily) => void;
	onDeleteMember: (familyID: string, member: IPerson) => void;
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

		const primaryMember = GetPrimaryMember(state.family.members);

	const primaryMemberOnChange = (person: IPerson) => {
		const newArray = Array.from(state.family.members);
		const keyof = newArray.findIndex(member => person.guid === member.guid);
		if(keyof === -1) throw new Error("Could not find member to change by id");
		newArray[keyof] = person;
		const newstate = {...state, family: Object.assign({},state.family, {members: newArray} as Partial<IFamily>)};
		setState(newstate);
		props.onSave(newstate.family);
	};

	const addPerson = (firstname: string) => {
		const newperson = emptyPersonRecord(firstname, state.family.surname, props.creator, state.family.members.length === 0)
		const newstate = {...state, family:{...state.family, members:[...state.family.members, newperson]}};
		setState(newstate);
		props.onSave(newstate.family);
	}
	return <>
		{state.editSurname ? <>
			<S.Input label="Surname" value={state.family.surname} onChange={updateRecord("surname")} /> 
			<Button primary onClick={() => {setState({...state,editSurname: false});props.onSave(state.family); }}>Save Surname</Button>
		</>: <S.Header as='h1'>
			{state.family.surname} Family &nbsp;
			<S.Icon name="edit" style={{cursor:"pointer",fontSize:"0.5em",lineHeight:"1em"}} onClick={() => setState({...state,editSurname: true})} />
		</S.Header>}
		{primaryMember === undefined ? "" : <>
			<S.Header as="h2">Primary Contact</S.Header>
			<PersonFormMarkup person={primaryMember} onChange={primaryMemberOnChange} 
				onDelete={(person) => props.onDeleteMember(state.family.guid, person)} />
		</>}
		{state.family.members.length === 0 ? <S.Message>
			<S.Message.Header>There Are No Members</S.Message.Header>
			Add a member to this family
		</S.Message> : <PersonList people={state.family.members} family={state.family.guid} />}
		<AddPersonForm onSubmit={addPerson}/>
		<hr />
		<div style={{display:"flex", justifyContent:"space-between"}}>
			<Button primary onClick={() => props.onSave(state.family)}>Save</Button>
			{state.confirmDelete ? 
				<Button onClick={() => props.onDelete(state.family)} color="red" disabled={!state.allowDelete}>Are You Sure You Want To Delete?</Button> : 
				<Button secondary onClick={deleteClick}>Delete Family</Button>}
		</div>
		<hr />
	</>;
}