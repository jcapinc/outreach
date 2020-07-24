import React from 'react';
import { IFamily, IPerson, TouchRecord } from '../../ModelTypes';
import { AppState } from '../store';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import * as S from 'semantic-ui-react';

export function Stale(){
	const [families, members] = useSelector((store: AppState) => [
		getStaleFamilies(store.currentState.families),
		getStaleMembers(store.currentState.families)
	]);
	return <StaleMarkup families={families} members={members} />;
}

export interface StaleMarkupProps extends StaleFamiliesProps, StaleMembersProps {
}

export function StaleMarkup(props: StaleMarkupProps){
	return <S.Container>
		<S.Grid columns={2}>
			<S.Grid.Column>
				<StaleFamilies families={props.families} />
			</S.Grid.Column>
			<S.Grid.Column>
				<StaleMembers members={props.members} families={props.families} />
			</S.Grid.Column>
		</S.Grid>
	</S.Container>;
	
}

interface StaleFamiliesProps {
	families: IFamily[];
}

const dateFormat = 'M/D/YY H:MM A';

function StaleFamilies(props: StaleFamiliesProps){
	return <S.Segment.Group attached>
		<S.Header as='h4' attached='top' block>Families by Oldest Touch Date</S.Header>
		{props.families.map(family => <S.Segment attached>
			<Link to={`/family/${family.guid}`}>{family.surname}</Link> &nbsp;
			<small>({dayjs(family.updated).format(dateFormat)})</small>
		</S.Segment>)}
	</S.Segment.Group>;
}

interface StaleMembersProps {
	members: IPerson[];
	families: IFamily[];
}

function StaleMembers(props: StaleMembersProps) {
	return <S.Segment.Group attached>
		<S.Header as='h4' attached='top' block>Members by Oldest Touch Date</S.Header>
		{props.members.map(member => <S.Segment attached>
			<Link to={staleMemberLink(member, props.families)}>{member.firstname} {member.lastname}</Link> &nbsp;
			<small>({dayjs(member.updated).format(dateFormat)})</small>
		</S.Segment>)}
	</S.Segment.Group>;
}

function staleMemberLink(member: IPerson, families: IFamily[]) {
	return `/family/${getFamilyByMember(member, families).guid}/member/${member.guid}`;
}

function getFamilyByMember(member: IPerson, families: IFamily[]) {
	return families.find(family => family.members.includes(member)) || families[0];
}

function getStaleFamilies(families: IFamily[]): IFamily[]{
	return families.sort(staleSortMethod);
}

function getStaleMembers(families: IFamily[]): IPerson[] {
	return families
		.reduce((carry, family) => carry.concat(family.members), [] as IPerson[])
		.sort(staleSortMethod);
}

function staleSortMethod(a: TouchRecord, b: TouchRecord) {
	if (a.updated === b.updated) return 0;
	if (a.updated > b.updated) return -1;
	return 1;
}