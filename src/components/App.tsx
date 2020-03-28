import React from 'react';
import { Navigation } from './Navigation';
import { BrowserRouter as Router, Switch, Route, useParams, Link } from 'react-router-dom';
import { Home } from './Home';
import { useSelector } from 'react-redux';
import { AppState} from '../store';
import { Login } from './Login';
import { FamilyForm } from './Families';
import * as S from 'semantic-ui-react';
import { IPerson } from '../../ModelTypes';


export function App(){
	const loggedIn = useSelector((state:AppState) => state.login.jwt !== undefined);
	return <Router>
		{ loggedIn ? <React.Fragment>
			<Navigation />
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/family/:id/member/:memberid" component={FamilyRoute} />
				<Route path="/family/:id" component={FamilyRoute} />
			</Switch>
		</React.Fragment> : 
		<Login /> }
	</Router>;
}

export function FamilyRoute(){
	let {id} = useParams();
	const surname = useSelector((state: AppState) => state.currentState.families.find(rec => rec.guid === id)?.surname || "");
	return <React.Fragment>
		
			<FamilyBreadCrumb familyid={id} familysurname={surname} />
		
		<FamilyForm id={id || ""} />
	</React.Fragment>;
}

export function MemberRoute(){
	let {id,memberid} = useParams();
	const [surname,membername] = useSelector((state: AppState) => {
		const family = state.currentState.families.find(fam => fam.guid === id);
		if(family === undefined) return ["Unknown","Unknown"];
		const member = family.members.find(member => member.guid === memberid);
		return [family.surname,`${member?.firstname} ${member?.lastname}`];
	});
	return <React.Fragment>
		<FamilyBreadCrumb familyid={id} familysurname={surname}>
			<MemberBreadCrumb familyid={id} membername={membername} memberid={memberid} />
		</FamilyBreadCrumb>
	</React.Fragment>;
}

export interface IFamilyBreadCrumbProps{
	children?: React.ReactNode;
	familyid: string | undefined;
	familysurname: string | undefined;
}

export function FamilyBreadCrumb({children, familyid, familysurname}:IFamilyBreadCrumbProps){
	return <div>
		<S.Breadcrumb>
			<S.Breadcrumb.Section><Link to="/">Home</Link></S.Breadcrumb.Section>
			<S.Breadcrumb.Divider />
			<S.Breadcrumb.Section><Link to={"/family/" + familyid}>{familysurname} Family</Link></S.Breadcrumb.Section>
			{children || ""}
		</S.Breadcrumb>
		<hr />
	</div>
	;
}

export interface IMemberBreadCrumbProps{
	familyid: string | undefined;
	membername: string | undefined;
	memberid: string | undefined;
}

export function MemberBreadCrumb({familyid, membername, memberid}: IMemberBreadCrumbProps){
	const link = `/family/${familyid}/member/${memberid || ""}`;
	return <React.Fragment>
		<S.Breadcrumb.Divider />
		<S.Breadcrumb.Section><Link to={link}>{membername}</Link></S.Breadcrumb.Section>
	</React.Fragment>;
}