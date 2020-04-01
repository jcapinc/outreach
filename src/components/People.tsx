import React from 'react';
import { IPerson, IPhone, IEmail } from '../../ModelTypes';
import * as S from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { GetPrimaryContact, UpdateFamilyPerson } from '../store';
import { useDispatch } from 'react-redux';

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
	const update = (field: keyof IPerson) => (e: React.ChangeEvent<HTMLInputElement>) => 
		setState({...state, person: {...state.person, [field]: e.target.value}});
	const updateGender = (e: React.SyntheticEvent<HTMLElement>, data: S.DropdownProps) => 
		setState({...state, person: {...state.person, gender: data.value as "Man" | "Woman"}});
	const TextField = ({label, field}:{label: string, field: keyof IPerson}) => <S.Grid.Column>
		<S.Form.Field>
			<label>{label}</label>
			<S.Input value={state.person[field]} onchange={update(field)} fluid />
		</S.Form.Field>
	</S.Grid.Column>;
	const genderOptions = ["Man","Woman"].map(key => ({key,value: key,text: key}))
	return <S.Form>
		<S.Grid columns={3}>
			<TextField label="First Name" field="firstname" />
			<TextField label="Last Name" field="lastname" />
			<S.Grid.Column>
				<S.Form.Field>
					<label>Gender</label>
					<S.Dropdown label="Gender" labeled value={state.person.gender} 
						onChange={updateGender} options={genderOptions} fluid selection />
				</S.Form.Field>
			</S.Grid.Column>
		</S.Grid>
		<S.Grid Columns={4}></S.Grid>
	</S.Form>;
}

export interface IPersonListProps {
	people: IPerson[];
	family: string;
}

export function PersonList(props: IPersonListProps) {
	return <React.Fragment>
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
	</React.Fragment>;
}

export function PhoneCell({phone}:{phone: IPhone | undefined}) {
	if(phone === undefined) return <S.Table.Cell>
		<i>No Phone Number Saved</i>
	</S.Table.Cell>;
	return <S.Table.Cell>
		<a href={"tel:"+phone.number} target="new">>{phone.number}</a>
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

export interface IAddPersonFormProps {
	onSubmit: (name: string) => void;
}

export function AddPersonForm(props: IAddPersonFormProps){
	const [name, setName] = React.useState("");
	return <React.Fragment>
		<S.Input value={name} onChange={e => setName(e.target.value)} placeholder="Create New Person" />
		<S.Button onClick={() => {props.onSubmit(name);setName("");}}>Create New Person</S.Button>
	</React.Fragment>;
}