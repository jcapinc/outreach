import React from 'react';
import * as S from 'semantic-ui-react';
import uniqid from "uniqid";
import { contactTypes } from './Misc';
import { IPhone, IContactType } from '../../ModelTypes';

export function PhoneCell({phone}:{phone: IPhone | undefined}) {
	if(phone === undefined) return <S.Table.Cell>
		<i>No Phone Number Saved</i>
	</S.Table.Cell>;
	return <S.Table.Cell>
		<a href={"tel:"+phone.number}>{phone.number}</a>
	</S.Table.Cell>;
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