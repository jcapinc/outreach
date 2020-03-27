import React from 'react';
import * as S from 'semantic-ui-react';
import { IFamily } from '../../ModelTypes';
import * as families from './Families';
import { useDispatch } from 'react-redux';

export function Home(){
	const dispatch = useDispatch();
	return <HomeMarkup families={[]} onCreateFamily={() => null} />
}

export interface IHomeMarkupProps{
	families: IFamily[]
	onCreateFamily: families.IOnCreateFamily;
}

export function HomeMarkup(props: IHomeMarkupProps) {
	return <div style={{textAlign:"center"}}>
	{props.families.length === 0 ? <React.Fragment>
		<S.Message>
			<S.Message.Header>There are No Families</S.Message.Header>
			Create a new family to get started.
		</S.Message> 
		<families.CreateFamilyForm onSubmit={props.onCreateFamily} />
	</React.Fragment>: ""}
</div>;
}