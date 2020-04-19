import React from 'react';
import * as S from 'semantic-ui-react';
import uniqid from "uniqid";
import { IAddress } from '../../ModelTypes';
import { SimpleTextField, contactTypes } from './Misc';

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

