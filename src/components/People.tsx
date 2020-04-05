import React from 'react';
import { IPerson, IPhone, IEmail, IMemberFamilyRole, IContactType } from '../../ModelTypes';
import * as S from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { GetPrimaryContact, UpdateFamilyPerson } from '../store';
import { useDispatch } from 'react-redux';
import uniqid from "uniqid";
import dayjs from "dayjs";

export interface IPersonFormProps{
	person:IPerson;
	familyID: string;
}

export function PersonForm(props: IPersonFormProps){
	const dispatch = useDispatch();
	return <PersonFormMarkup person={props.person} 
		onChange={person => dispatch(UpdateFamilyPerson(props.familyID,person))}/>
}

export interface IPersonFormMarkupProps{
	person: IPerson;
	onChange: (person: IPerson) => void;
}

export function PersonFormMarkup(props: IPersonFormMarkupProps) {
	const [state, setState] = React.useState({person: props.person})
	const setPerson = (field: keyof IPerson,value: any) => {
		const newstate = {...state, person: {...state.person, [field]: value}};
		setState(newstate);
	}
	const update = (field: keyof IPerson) => (e: React.ChangeEvent<HTMLInputElement>) => 
		setPerson(field, e.target.value);
	const updateGender = (_: React.SyntheticEvent<HTMLElement>, data: S.DropdownProps) => 
		setPerson("gender", data.value);
	const updateRole = (_:React.SyntheticEvent<HTMLElement>, data: S.DropdownProps) =>
		setPerson("role", data.value);
	const updateFamilyPrimary = () => 
		setPerson("familyPrimary", !state.person.familyPrimary)

	const editEmail = (email: IEmail) => {
		const id = state.person.emails.findIndex(compareEmail => compareEmail.guid === email.guid);
		if(id === -1) return setPerson("emails", [...state.person.emails,email]);
		const newEmails = Array.from(state.person.emails);
		newEmails[id] = email;
		setPerson("emails", newEmails);
	}

	const editPhone = (phone:IPhone, index: number) =>{
		const newPhones = Array.from(state.person.phones);
		newPhones[index] = phone;
		setPerson("phones",newPhones);
	}
	
	const quarter: S.GridColumnProps = {computer: 4, tablet: 4, mobile: 16};
	const TextField = ({label, field}:{label: string, field: keyof IPerson}) => <S.Grid.Column {...quarter}>
		<S.Form.Field>
			<label>{label}</label>
			<S.Input value={state.person[field]} onChange={update(field)} fluid />
		</S.Form.Field>
	</S.Grid.Column>;

	const genderOptions = ["Man","Woman"].map(key => ({key,value: key,text: key}));
	const roleOptions = (["Father","Mother","Child","Other"] as IMemberFamilyRole[]).map(key => ({key,value:key, text:key}));
	return <S.Form>
		<S.Grid>
			<TextField label="First Name" field="firstname" />
			<TextField label="Last Name" field="lastname" />
			<S.Grid.Column {...quarter}>
				<S.Form.Field>
					<label>Gender</label>
					<S.Dropdown label="Gender" labeled value={state.person.gender} 
						onChange={updateGender} options={genderOptions} fluid selection />
				</S.Form.Field>
			</S.Grid.Column>
			<S.Grid.Column {...quarter}>
				<S.Form.Field>
					<label>Family Role</label>
					<S.Dropdown label="role" labeled value={state.person.role} onChange={updateRole} 
						options={roleOptions} fluid selection/>
				</S.Form.Field>
			</S.Grid.Column>
			<S.Grid.Column {...quarter}>
				<S.Form.Field>
					<label>Primary Family Contact?</label>
					<S.Checkbox toggle checked={state.person.familyPrimary} onChange={updateFamilyPrimary} />
				</S.Form.Field>
			</S.Grid.Column>
			<S.Grid.Column {...quarter}>
				<S.Form.Field>
					<label>Date of Birth</label>
					<S.Input type="date" value={dayjs(state.person.dob).format("YYYY-MM-DD")} />
				</S.Form.Field>
			</S.Grid.Column>
			<S.Grid.Column {...quarter}>
				<EmailList emails={state.person.emails} onEditEmail={editEmail} 
					onDeleteEmail={(index) => setPerson("emails", state.person.emails.filter((_,i) => index !== i))}
					onAddEmail={email => setPerson("emails",[...state.person.emails, email])} />
			</S.Grid.Column>
			<S.Grid.Column {...quarter}>
				<PhoneList phones={state.person.phones} onEditPhone={editPhone}
					onDeletePhone={index => setPerson("phones", state.person.phones.filter((_,i) => index !== i))}
					onAddPhone={phone => setPerson("phones", [...state.person.phones, phone])} />
			</S.Grid.Column>
		</S.Grid>
		<S.Button primary onClick={() => props.onChange(state.person)}>Save Person</S.Button>
	</S.Form>;
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

export function PhoneCell({phone}:{phone: IPhone | undefined}) {
	if(phone === undefined) return <S.Table.Cell>
		<i>No Phone Number Saved</i>
	</S.Table.Cell>;
	return <S.Table.Cell>
		<a href={"tel:"+phone.number}>{phone.number}</a>
	</S.Table.Cell>;
}

export function EmailCell({email}:{email: IEmail | undefined}) {
	if(email === undefined) return <S.TableCell>
		<i>No Email Address Defined</i>
	</S.TableCell>;
	return <S.TableCell>
		<a href={"mailto:"+email.address} target="new">{email.address}</a>
	</S.TableCell>
}

export interface IEmailListProps{
	emails: IEmail[];
	onAddEmail: (email: IEmail) => void;
	onEditEmail: (email: IEmail, index: number) => void;
	onDeleteEmail: (index: number) => void;
}

export function EmailList(props: IEmailListProps){
	const addressChange = (email: IEmail, index: number) => (e: React.ChangeEvent<HTMLInputElement>) => 
		props.onEditEmail({...email, address: e.target.value}, index)
	const typeChange = (email: IEmail, index: number) => (_: any, e: S.DropdownProps) => {
		email.type = e.value as IContactType;
		props.onEditEmail(email,index);
	};
	const EmailTypeOptions: S.DropdownItemProps[] = ["Home","Office","Cell"].map((name, index) => ({key:index,value:name,text:name}));
	return <>
		<S.FormField>
			<label>Email Addresses</label>
			<AddEmail onSubmit={props.onAddEmail} />
		</S.FormField>
		{props.emails.map((email, index) => <S.FormField key={index}>
			<S.Input value={email.address} onChange={addressChange(email, index)} labelPosition="right"
				label={<>
					<S.Dropdown selection compact value={email.type} onChange={typeChange(email, index)} options={EmailTypeOptions} />
					<S.Button compact color="red" onClick={() => props.onDeleteEmail(index)} icon="trash"></S.Button>
				</>} />
		</S.FormField>)}
	</>;
}

export interface IAddEmailProps{
	onSubmit: (email: IEmail) => void;
}

export function AddEmail(props: IAddEmailProps){
	const [email, setEmail] = React.useState("");
	const makeNewEmail = (address: string) => ({guid: uniqid(),address: address,primary: false,type: "Home"}) as IEmail;
	return <S.Input value={email} onChange={e => setEmail(e.target.value)} 
		labelPosition="right" placeholder="Add New Phone Number" 
		label={<S.Button onClick={() => { props.onSubmit(makeNewEmail(email)); setEmail("");}}>Add</S.Button>} />;
}

export interface IPhoneListProps{
	phones: IPhone[];
	onEditPhone: (phone: IPhone, index: number) => void;
	onAddPhone: (phone: IPhone) => void;
	onDeletePhone: (index: number) => void;
}

export function PhoneList(props: IPhoneListProps){
	const numberChange = (phone: IPhone, index: number) => (e: React.ChangeEvent<HTMLInputElement>) => 
		props.onEditPhone({...phone, number: e.target.value}, index)
	const typeChange = (phone: IPhone, index: number) => (_: any, e: S.DropdownProps) => {
		phone.type = e.value as IContactType;
		props.onEditPhone(phone,index);
	};
	const EmailTypeOptions: S.DropdownItemProps[] = ["Home","Office","Cell"].map((name, index) => ({key:index,value:name,text:name}));
	return <>
		<S.FormField>
			<label>Email Addresses</label>
			<AddPhone onSubmit={props.onAddPhone} />
		</S.FormField>
		{props.phones.map((phone, index) => <S.FormField key={index}>
			<S.Input value={phone.number} onChange={numberChange(phone, index)} labelPosition="right"
				label={<>
					<S.Dropdown selection compact value={phone.type} onChange={typeChange(phone, index)} options={EmailTypeOptions} />
					<S.Button compact color="red" onClick={() => props.onDeletePhone(index)} icon="trash" title="Delete" />
				</>} />
		</S.FormField>)}
	</>;
}

export function AddPhone({onSubmit}: {onSubmit: (phone:IPhone) => void}){
	const [email, setEmail] = React.useState("");
	const makeNewPhone = (number: string): IPhone => ({guid: uniqid(),number ,primary: false,type: "Home"});
	return <S.Input value={email} onChange={e => setEmail(e.target.value)} 
		labelPosition="right" placeholder="Add New Email Address" 
		label={<S.Button onClick={() => { onSubmit(makeNewPhone(email)); setEmail("");}}>Add</S.Button>} />;
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