import React from 'react';
import { IPerson, IPhone, IEmail } from '../../ModelTypes';
import * as S from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { GetPrimaryContact } from '../store';

export interface IPersonFormProps{
	person: IPerson;
	onChange: (person: IPerson) => void;
}

export function PersonFormMarkup(props: IPersonFormProps){
	return <div></div>;
}

export interface IPersonListProps{
	people: IPerson[];
	family: string;
}

export function PersonList(props: IPersonListProps){
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
						<Link to={"/family/"+props.family+"/person/"+person.guid}>
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

export function PhoneCell({phone}:{phone: IPhone | undefined}){
	if(phone === undefined) return <S.Table.Cell>
		<i>No Phone Number Saved</i>
	</S.Table.Cell>;
	return <S.Table.Cell>
		<a href={"phone:"+phone.number} target="new">>{phone.number}</a>
	</S.Table.Cell>;
}

export function EmailCell({email}:{email: IEmail | undefined}){
	if(email === undefined) return <S.TableCell>
		<i>No Email Address Defined</i>
	</S.TableCell>;
	return <S.TableCell>
		<a href={"mailto:"+email.address} target="new">{email.address}</a>
	</S.TableCell>
}

export interface IAddPersonFormProps{
	onSubmit: (name: string) => void;
}

export function AddPersonForm(props: IAddPersonFormProps){
	const [name, setName] = React.useState("");
	return <React.Fragment>
		<S.Input value={name} onChange={e => setName(e.target.value)} placeholder="Create New Person" />
		<S.Button onClick={() => {props.onSubmit(name);setName("");}}>Create New Person</S.Button>
	</React.Fragment>;
}