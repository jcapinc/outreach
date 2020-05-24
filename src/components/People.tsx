import React from 'react';
import { IPerson, IPhone, IEmail, IMemberFamilyRole, IGender, IAddress } from '../../ModelTypes';
import * as S from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { GetPrimaryContact, UpdateFamilyPerson, DeleteFamilyPerson } from '../store';
import { useDispatch } from 'react-redux';
import { EmailList, EmailCell } from './Emails';
import { PhoneList, PhoneCell } from './Phones';
import { AddressList } from './Addresses';
import { ActivityList } from './Activity';


export interface IPersonFormProps{
	person:IPerson;
	familyID: string;
}

export function PersonForm(props: IPersonFormProps){
	const dispatch = useDispatch();
	return <PersonFormMarkup person={props.person} onDelete={person => dispatch(DeleteFamilyPerson(props.familyID, person))}
		onChange={person => dispatch(UpdateFamilyPerson(props.familyID,person))}/>
}

export interface IPersonFormMarkupProps{
	person: IPerson;
	onChange: (person: IPerson) => void;
	onDelete: (person: IPerson) => void;
	showActivity?: boolean;
}

export function PersonFormMarkup(props: IPersonFormMarkupProps) {
	const [state, setState] = React.useState({
		person: props.person,
		addresses: [] as IAddress[],
		emails: [] as IEmail[],
		phones: [] as IPhone[],
		confirmDelete: false,
		deleted: false,
		email: "",
		number: ""
	});
	const setPerson = (field: keyof IPerson,value: any) => {
		const newstate = {...state, person: {...state.person, [field]: value}};
		setState(newstate);
	}
	const update = (field: keyof IPerson) => (e: React.ChangeEvent<HTMLInputElement>) => 
		setPerson(field, e.target.value);
	const updateFamilyPrimary = () => 
		setPerson("familyPrimary", !state.person.familyPrimary)

	const editEmail = (email: IEmail) => {
		const id = state.person.emails.findIndex(compareEmail => compareEmail.guid === email.guid);
		if(id === -1) return setPerson("emails", [...state.person.emails,email]);
		const newEmails = Array.from(state.person.emails);
		newEmails[id] = email;
		setPerson("emails", newEmails);
	}

	const editPhone = (phone:IPhone, index: number) => {
		const newPhones = Array.from(state.person.phones);
		newPhones[index] = phone;
		setPerson("phones",newPhones);
	}
	const genders: IGender[] = ["Male","Female"];
	const roles:IMemberFamilyRole[] = ["Father","Mother","Child","Grandparent","Aunt/Uncle","Neice/Nephew/Cousin","Other"];
	return <S.Container>
		<S.Form>
			<S.Grid>
				<S.Grid.Column computer={8} tablet={8} mobile={16}>
					<S.Form.Field>
						<label>First Name</label>
						<S.Input value={state.person.firstname} onChange={update("firstname")} />
					</S.Form.Field>
					<S.Form.Field>
						<label>Last Name</label>
						<S.Input value={state.person.lastname} onChange={update("lastname")} />
					</S.Form.Field>
					<S.Form.Field>
						<label>Date of Birth</label>
						<S.Input type="date" value={state.person.dob} onChange={update("dob")} />
					</S.Form.Field>
					<S.Grid>
						<S.Grid.Column computer={8} table={8} mobile={16}>
							<S.Form.Field>
								<label>Gender</label>
							</S.Form.Field>
							{genders.map((gender, index) => <S.Form.Field key={index}>
								<S.Checkbox radio label={gender} value={gender} checked={state.person.gender === gender} 
									onChange={(_,{value}) => setPerson("gender", value)} />
							</S.Form.Field>)}
							<S.Form.Field>
								<label>Primary Family Contact?</label>
								<S.Checkbox toggle onChange={updateFamilyPrimary} checked={state.person.familyPrimary} />
							</S.Form.Field>
						</S.Grid.Column>
						<S.Grid.Column computer={8} table={8} mobile={16}>
							<S.Form.Field>
								<label>Family Role</label>
							</S.Form.Field>
							{roles.map((role, index) => <S.Form.Field key={index}>
								<S.Checkbox radio label={role} value={role} checked={state.person.role === role}
									onChange={(_,{value}) => setPerson("role",value)} />
							</S.Form.Field>)}
						</S.Grid.Column>
					</S.Grid>
				</S.Grid.Column>
				<S.Grid.Column computer={8} tablet={8} mobile={16}>
					<AddressList addresses={state.person.addresses} 
						onDeleteAddress={index => {state.person.addresses.splice(index, 1); setPerson("addresses",Array.from(state.person.addresses));}}
						onAddAddress={address => setPerson("addresses",[...Array.from(state.person.addresses), address])} 
						onChange={(key, field, value) => {
							const newAddresses = Array.from(state.person.addresses);
							Object.assign(newAddresses[key], {[field]: value});
							setPerson("addresses", newAddresses);
						}} />
				</S.Grid.Column>
			</S.Grid>
			<S.Grid>
				<S.Grid.Column computer={8} tablet={8} mobile={16}>
					<EmailList emails={state.person.emails} onEditEmail={editEmail} 
						onDeleteEmail={(index) => setPerson("emails", state.person.emails.filter((_,i) => index !== i))}
						onAddEmail={email => setPerson("emails",[...state.person.emails, email])} />
				</S.Grid.Column>
				<S.Grid.Column computer={8} tablet={8} mobile={16}>
					<PhoneList phones={state.person.phones} onEditPhone={editPhone} 
						onDeletePhone={index => setPerson("phones", state.person.phones.filter((_,i) => index !== i))}
						onAddPhone={phone => {setPerson("phones", Array.from([...state.person.phones, phone]));	}} />
				</S.Grid.Column>
			</S.Grid>
			<hr />
			<ActivityList modifyActivity={() => null} activities={[]} onAddActivity={() => null} />
			<div style={{display:"flex", flexFlow:"row nowrap", justifyContent:"space-between"}}>
				<S.Button primary onClick={() => props.onChange(state.person)}>Save Person</S.Button>
				{state.confirmDelete ? <S.Button color="red">Are You Sure? Delete?</S.Button> : 
					<S.Button secondary onClick={() => setState({...state, confirmDelete: true})}>Delete Person</S.Button>}
			</div>
			<hr />
		</S.Form>
	</S.Container>;
}

export interface IPersonListProps {
	people: IPerson[];
	family: string;
}

export function PersonList(props: IPersonListProps) {
	return <>
		<S.Header as="h2">People</S.Header>
		<S.Table singleLine>
			<S.Table.Header>
				<S.Table.Row>
					<S.Table.HeaderCell>Name</S.Table.HeaderCell>
					<S.Table.HeaderCell>Phone</S.Table.HeaderCell>
					<S.Table.HeaderCell>Email</S.Table.HeaderCell>
				</S.Table.Row>
			</S.Table.Header>
			<S.Table.Body>
				{props.people.map(person => <S.Table.Row key={person.guid}>
					<S.Table.Cell>
						<Link to={"/family/"+props.family+"/member/"+person.guid}>
							{person.firstname} {person.lastname}
						</Link>
					</S.Table.Cell>
					<PhoneCell phone={GetPrimaryContact(person.phones)} />
					<EmailCell email={GetPrimaryContact(person.emails)} /> 
				</S.Table.Row>)}
			</S.Table.Body>
		</S.Table>
	</>;
}

export interface IAddPersonFormProps {
	onSubmit: (name: string) => void;
}

export function AddPersonForm(props: IAddPersonFormProps){
	const [name, setName] = React.useState("");
	return <>
		<S.Input value={name} onChange={e => setName(e.target.value)} placeholder="Create New Person" />
		<S.Button onClick={() => {props.onSubmit(name);setName("");}}>Create New Person</S.Button>
	</>;
}

