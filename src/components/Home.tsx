import React from 'react';
import * as S from 'semantic-ui-react';
import { IFamily } from '../../ModelTypes';
import * as families from './Families';
import { useDispatch, useSelector } from 'react-redux';
import { CreateFamily, AppState } from '../store';
import uniqid from "uniqid";
import { Redirect } from 'react-router-dom';

export function Home(){
	const dispatch = useDispatch();
	const families = useSelector((state: AppState) => state.currentState.families);
	const [state, setState] = React.useState({
		familyRedirect: ""
	});
	const onCreateFamily = (name: string) => {
		const id = uniqid();
		dispatch(CreateFamily(name, id));
		setState({familyRedirect: id})
	}
	if(state.familyRedirect.length > 0) 
		return <Redirect to={"/family/" + state.familyRedirect} />
	return <HomeMarkup families={families} onCreateFamily={onCreateFamily} />
}

export interface IHomeMarkupProps{
	families: IFamily[]
	onCreateFamily: families.IOnCreateFamily;
}

export function HomeMarkup(props: IHomeMarkupProps) {
	return <div style={{textAlign:"center"}}>
		{props.families.length === 0 ? <S.Message>
			<S.Message.Header>There are No Families</S.Message.Header>
			Create a new family to get started.
		</S.Message> : <families.FamilyList families={props.families} />}
		<families.CreateFamilyForm onSubmit={props.onCreateFamily} />
	</div>;
}