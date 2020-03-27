import React from 'react';
import { Input, Button } from 'semantic-ui-react';
import { AppState } from '../store';
import { useSelector } from 'react-redux';
import * as S from 'semantic-ui-react';
import { IFamily } from '../../ModelTypes';

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
	const family = useSelector((state:AppState) => state.currentState.families.find(record => record.guid === id));
	if(family === undefined) return <S.Message>
		<S.Message.Header>Family Not Found</S.Message.Header>
		Could not find this family
	</S.Message>;
	return <FamilyFormMarkup family={family} onSave={() => null} />;
}

export interface IFamilyFormMarkupProps {
	family: IFamily;
	onSave: (family: IFamily) => void;
}

export function FamilyFormMarkup(props: IFamilyFormMarkupProps){
	const [family, setFamily] = React.useState(props.family);
	const updateRecord = (key: keyof IFamily) => (e: React.ChangeEvent<HTMLInputElement>) => 
		setFamily({...family,[key]: e.target.value})
	return <React.Fragment>
		<S.Input label="Surname" value={family.surname} onChange={updateRecord("surname")} />
		<Button primary onClick={() => props.onSave(family)}>Save</Button>
	</React.Fragment>;
}