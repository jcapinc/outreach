import React from 'react';
import * as S from 'semantic-ui-react';

export const contactTypes = ["Home","Office","Cell"];

export interface SimpleTextFieldProps{
	label: string;
	value: string | undefined;
	onChange: (value: string) => void;
	input?: S.InputProps;
}

export function SimpleTextField(props: SimpleTextFieldProps){
	const {label,value, onChange, input = {fluid: undefined}} = props;
	return <S.FormField>
		<label>{label}</label>
		<S.Input value={value} onChange={e => onChange(e.target.value)} {...input} />
	</S.FormField>;
}
