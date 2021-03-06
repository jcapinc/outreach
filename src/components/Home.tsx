import React from 'react';
import * as S from 'semantic-ui-react';
import { IFamily } from '../../ModelTypes';
import * as families from './Families';
import { useDispatch, useSelector } from 'react-redux';
import { CreateFamily, AppState } from '../store';
import uniqid from "uniqid";
import { Redirect, Link } from 'react-router-dom';

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
	return <>
		<div>
			<S.Container>
				<S.Breadcrumb>
					<S.Breadcrumb.Section><Link to="/">Family</Link></S.Breadcrumb.Section>
				</S.Breadcrumb>
			</S.Container>
			<hr />
		</div>
		<S.Container>
			<S.Header as="h2">Families</S.Header>
			{props.families.length === 0 ? <S.Message>
				<S.Message.Header>There are No Families</S.Message.Header>
				Create a new family to get started.
			</S.Message> : <families.FamilyList families={props.families} />}
			<S.Header as="h3">Add New Family</S.Header>
			<families.CreateFamilyForm onSubmit={props.onCreateFamily} />
		</S.Container>
	</>;
}