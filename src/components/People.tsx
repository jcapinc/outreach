import React from 'react';
import { IPerson } from '../../ModelTypes';
import * as S from 'semantic-ui-react';

export interface IPersonFormProps{
	person: IPerson;
	onChange: (person: IPerson) => void;
}

export function PersonFormMarkup(props: IPersonFormProps){
	return <div></div>;
}

export interface IPersonListProps{
	people: IPerson[];
}

export function PersonList(props: IPersonListProps){
	return <div></div>;
}

export interface IAddPersonFormProps{
	onSubmit: (name: string) => void;
}

export function AddPersonForm(props: IAddPersonFormProps){
	const [name, setName] = React.useState("");
	return <React.Fragment>
		<S.Input value={name} onChange={e => setName(e.target.value)} placeholder="Create New Person" />
		<S.Button onClick={() => props.onSubmit(name)}>Create New Person</S.Button>
	</React.Fragment>;
}