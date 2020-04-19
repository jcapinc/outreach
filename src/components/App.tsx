import React from 'react';
import { Navigation } from './Navigation';
import { BrowserRouter as Router, Switch, Route, useParams, Link } from 'react-router-dom';
import { Home } from './Home';
import { useSelector } from 'react-redux';
import { AppState} from '../store';
import { Login } from './Login';
import { FamilyForm } from './Families';
import * as S from 'semantic-ui-react';
import { PersonForm } from './People';

export function App(){
	const loggedIn = useSelector((state:AppState) => state.login.jwt !== undefined);
	return <Router>
		{ loggedIn ? <>
			<Navigation />
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/family/:familyid/member/:memberid" component={FamilyMemberRoute} />
				<Route exact path="/family/:id" component={FamilyRoute} />
				<Route component={_404} />
			</Switch>
		</> : 
		<Login /> }
	</Router>;
}

function _404(){
	return <S.Message><S.Message.Header>Route Does Not Exist</S.Message.Header></S.Message>
}

function FamilyMemberRoute(){
	const {familyid, memberid} = useParams();
	console.log(familyid, memberid);
	const [member, surname] = useSelector((state: AppState) => [state.currentState.families.find(family => 
		family.guid === familyid)?.members.find(member => member.guid === memberid),
		state.currentState.families.find(family => family.guid === familyid)?.surname]);
	if(member === undefined) return <S.Message>
		<S.Message.Header>Could Not Find Family Member</S.Message.Header>
		This family member does not appear to exist
		<Link to={"/family/"+familyid}>Return to Family</Link>
	</S.Message>
	return <>
		<FamilyBreadCrumb familyid={familyid || ""} familysurname={surname}>
			<MemberBreadCrumb familyid={familyid} memberid={memberid} 
				membername={`${member.firstname} ${member.lastname}`}/>
		</FamilyBreadCrumb>
		<PersonForm familyID={familyid || ""} person={member} />
	</>
}

export function FamilyRoute(){
	let {id} = useParams();
	const surname = useSelector((state: AppState) => state.currentState.families.find(rec => rec.guid === id)?.surname || "");
	return <>
			<FamilyBreadCrumb familyid={id} familysurname={surname} />
		<FamilyForm id={id || ""} />
	</>;
}

export function MemberRoute(){
	let {id,memberid} = useParams();
	const [surname,membername] = useSelector((state: AppState) => {
		const family = state.currentState.families.find(fam => fam.guid === id);
		if(family === undefined) return ["Unknown","Unknown"];
		const member = family.members.find(member => member.guid === memberid);
		return [family.surname,`${member?.firstname} ${member?.lastname}`];
	});
	return <>
		<FamilyBreadCrumb familyid={id} familysurname={surname}>
			<MemberBreadCrumb familyid={id} membername={membername} memberid={memberid} />
		</FamilyBreadCrumb>
	</>;
}

export interface IFamilyBreadCrumbProps{
	children?: React.ReactNode;
	familyid: string | undefined;
	familysurname: string | undefined;
}

export function FamilyBreadCrumb({children, familyid, familysurname}:IFamilyBreadCrumbProps){
	return <div>
		<S.Container>
			<S.Breadcrumb>
				<S.Breadcrumb.Section><Link to="/">Home</Link></S.Breadcrumb.Section>
				<S.Breadcrumb.Divider />
				<S.Breadcrumb.Section><Link to={"/family/" + familyid}>{familysurname} Family</Link></S.Breadcrumb.Section>
				{children || ""}
			</S.Breadcrumb>
		</S.Container>
		<hr />
	</div>;
}

export interface IMemberBreadCrumbProps{
	familyid: string | undefined;
	membername: string | undefined;
	memberid: string | undefined;
}

export function MemberBreadCrumb({familyid, membername, memberid}: IMemberBreadCrumbProps){
	const link = `/family/${familyid}/member/${memberid || ""}`;
	return <>
		<S.Breadcrumb.Divider />
		<S.Breadcrumb.Section><Link to={link}>{membername}</Link></S.Breadcrumb.Section>
	</>;
}