import React from 'react';
import { IPerson, IPhone, IEmail, IMemberFamilyRole, IContactType, IGender, IAddress } from '../../ModelTypes';
import * as S from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { GetPrimaryContact, UpdateFamilyPerson, DeleteFamilyPerson } from '../store';
import { useDispatch } from 'react-redux';
import uniqid from "uniqid";

const contactTypes = ["Home","Office","Cell"];

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
	return <S.Message>
		<S.Message.Header>Email Addresses</S.Message.Header>
		<hr />
		<S.FormField>
			<label>Add Email</label>
			<AddEmail onSubmit={props.onAddEmail} />
		</S.FormField>
		{props.emails.map((email, index) => <S.FormField key={index}>
			<label><S.Dropdown value={email.type} onChange={typeChange(email, index)} options={EmailTypeOptions} /></label>
			<S.Input value={email.address} onChange={addressChange(email, index)} labelPosition="right"
				label={<S.Button compact color="red" onClick={() => props.onDeleteEmail(index)} icon="trash"></S.Button>} />
		</S.FormField>)}
	</S.Message>;
}

export interface IAddEmailProps{
	onSubmit: (email: IEmail) => void;
}

export function AddEmail(props: IAddEmailProps){
	const [email, setEmail] = React.useState("");
	const makeNewEmail = (address: string) => ({guid: uniqid(),address: address,primary: false,type: "Home"}) as IEmail;
	return <S.Input type="email" value={email} labelPosition="right" placeholder="Add New Email Address" 
		onChange={e => {setEmail(e.target.value);}} 
		onBlur={() => { 
			if(email.length === 0) return; 
			props.onSubmit(makeNewEmail(email)); 
			setEmail(""); 
		}}
		label={<S.Button title="Add" icon="plus" primary></S.Button>} />;
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
	const PhoneTypeOptions: S.DropdownItemProps[] = contactTypes.map((name, index) => ({key:index,value:name,text:name}));
	return <S.Message>
		<S.Message.Header>Phone Numbers</S.Message.Header>
		<hr />
		<S.FormField>
			<label>Add Phone Number</label>
			<AddPhone onSubmit={props.onAddPhone} />
		</S.FormField>
		{props.phones.map((phone, index) => <S.FormField key={index}>
			<label><S.Dropdown value={phone.type} onChange={typeChange(phone, index)} options={PhoneTypeOptions} /></label>
			<S.Input value={phone.number} onChange={numberChange(phone, index)} labelPosition="right"
				label={<S.Button compact color="red" onClick={() => props.onDeletePhone(index)} icon="trash" title="Delete" />} />
		</S.FormField>)}
	</S.Message>;
}

export interface IAddPhoneProps{
	onSubmit: (phone:IPhone) => void;
	onChange?: (number: string) => void;
}

export function AddPhone({onSubmit, onChange = () => null}: IAddPhoneProps){
	const [phone, setPhone] = React.useState("");
	const makeNewPhone = (number: string): IPhone => ({guid: uniqid(),number ,primary: false,type: "Home"});
	const onBlur = () => {
		if(phone.length === 0) return;
		onSubmit(makeNewPhone(phone));
		setPhone("");
		onChange("");
	};
	return <S.Input value={phone} labelPosition="right" placeholder="Add New Phone Number" 
		onChange={e => {setPhone(e.target.value);onChange(e.target.value);}} onBlur={onBlur}
		label={<S.Button primary icon="plus"></S.Button>} />;
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

export interface IAddressListProps{
	addresses: IAddress[];
	onAddAddress: (address: IAddress) => void;
	onChange: (index: number, key: keyof IAddress, value: any) => void;
	onDeleteAddress: (index: number) => void;
}

const blankAddress = (address: Partial<IAddress> = {}) => ({...{
	apptNo: "",
	city: "",
	guid: uniqid(),
	line1: "",
	line2: "",
	primary: false,
	state: "",
	type: "Home",
	zip: ""
}, ...address});

export function AddressList(props: IAddressListProps){
	const [newAddress, setNewAddress] = React.useState<IAddress>(blankAddress({primary: props.addresses.length === 0}));
	const changeNew = (field: keyof IAddress) => (value: string) => 
		setNewAddress({...newAddress, [field]: value});
	return <S.Message>
		<S.Message.Header>Mailing Addresses</S.Message.Header>
		<hr />
		{props.addresses.map((address, index) => <div key={index}>
			<AddressFormMarkup onChange={(field, value) => props.onChange(index,field,value)} address={address} 
				controls={<S.Button color="red" icon="trash" onClick={() => props.onDeleteAddress(index)}
				title={`Delete ${address.type.toLowerCase()} address starting with '${address.line1}'`} />} />
			<hr />
		</div>)}
		<AddressFormMarkup onChange={(field, value) => changeNew(field)(value)} address={newAddress} title={<>
			<S.Message.Header as="h3">Add New Address</S.Message.Header>
			<hr />
		</>} controls={<S.Button primary icon="plus" title="Add New Address" onClick={() => {
			props.onAddAddress(newAddress); 
			setNewAddress(blankAddress());
		}}/>}/>
		
	</S.Message>
}

export interface IAddressFormMarkupProps{
	address: IAddress;
	onChange: (field: keyof IAddress, value: string) => void;
	title?: JSX.Element;
	controls?: JSX.Element
}

export function AddressFormMarkup(props:IAddressFormMarkupProps){
	const {address, onChange, title, controls} = props;
	const change = (field: keyof IAddress) => (value: string) => {onChange(field,value)};
	return <>
		{title}
		<S.Form.Group widths="2">
			<SimpleTextField label="Address Line 1" onChange={change("line1")} value={address.line1} />
			<SimpleTextField label="Address Line 2" onChange={change("line2")} value={address.line2} />
		</S.Form.Group>
		<S.Form.Group widths="2">
			{([["city","City"],["state","State"],["zip","Zip Code"]] as [keyof IAddress, string][]).map(([field, label], index) => 
				<SimpleTextField label={label} onChange={change(field)} value={address[field]} key={index} />)}
		</S.Form.Group>
		<S.Form.Group>
			<S.FormField>
				<label>Address Type: </label>
			</S.FormField>
			{contactTypes.map((contactType, index) => <S.Form.Field key={index}>
				<S.Checkbox radio checked={address.type === contactType} label={contactType}
					onChange={() => change("type")(contactType)} />
			</S.Form.Field>)}
			<div style={{marginLeft:"auto"}}>{controls}</div>
		</S.Form.Group>
	</>;
}

interface SimpleTextFieldProps{
	label: string;
	value: string | undefined;
	onChange: (value: string) => void;
	input?: S.InputProps;
}

function SimpleTextField(props: SimpleTextFieldProps){
	const {label,value, onChange, input = {fluid: undefined}} = props;
	return <S.FormField>
		<label>{label}</label>
		<S.Input value={value} onChange={e => onChange(e.target.value)} {...input} />
	</S.FormField>;
}