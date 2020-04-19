import React from 'react';
import * as S from 'semantic-ui-react';
import { IEmail, IContactType } from '../../ModelTypes';
import uniqid from "uniqid";

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