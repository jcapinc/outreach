import React from 'react';
import { BrowserRouter as Router, Switch, Route, useParams, Link } from 'react-router-dom';
import { Home } from './Home';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, logout} from '../store';
import { Login } from './Login';
import { FamilyForm } from './Families';
import * as S from 'semantic-ui-react';
import { PersonForm } from './People';
import { Stale } from './Stale';

export function App(){
	const loggedIn = useSelector((state:AppState) => state.login.jwt !== undefined);
	return <Router>
		{ loggedIn ? <>
			<Navigation />
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/family/:familyid/member/:memberid" component={FamilyMemberRoute} />
				<Route exact path="/family/:id" component={FamilyRoute} />
				<Route exact path="/stale" component={StaleRoute} />
				<Route exact path="/logout" component={Logout} />
				<Route component={_404} />
			</Switch>
		</> : 
		<Login /> }
	</Router>;
}

const Navigation: React.FC<{}> = () => {
	const dispatch = useDispatch();
	return <S.Menu>
		<div className="brand">Outreach</div>
		<S.Menu.Item><Link to="/">Home</Link></S.Menu.Item>
		<S.Menu.Item><Link to="/stale">Stale Contacts</Link></S.Menu.Item>
		<S.Menu.Menu position="right">
			<S.Menu.Item>
				<a href="/login" onClick={() => {
					dispatch(logout());
				}}>Logout</a>
			</S.Menu.Item>
		</S.Menu.Menu>
	</S.Menu>;
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
	</>;
}



function FamilyRoute(){
	let {id} = useParams();
	const surname = useSelector((state: AppState) => state.currentState.families.find(rec => rec.guid === id)?.surname || "");
	return <>
			<FamilyBreadCrumb familyid={id} familysurname={surname} />
		<FamilyForm id={id || ""} />
	</>;
}

interface IFamilyBreadCrumbProps{
	children?: React.ReactNode;
	familyid: string | undefined;
	familysurname: string | undefined;
}

function FamilyBreadCrumb({children, familyid, familysurname}:IFamilyBreadCrumbProps){
	return <div>
		<S.Container>
			<S.Breadcrumb>
				<S.Breadcrumb.Section><Link to="/">Family</Link></S.Breadcrumb.Section>
				<S.Breadcrumb.Divider />
				<S.Breadcrumb.Section><Link to={"/family/" + familyid}>{familysurname} Family</Link></S.Breadcrumb.Section>
				{children || ""}
			</S.Breadcrumb>
		</S.Container>
		<hr />
	</div>;
}

interface IMemberBreadCrumbProps{
	familyid: string | undefined;
	membername: string | undefined;
	memberid: string | undefined;
}

function MemberBreadCrumb({familyid, membername, memberid}: IMemberBreadCrumbProps){
	const link = `/family/${familyid}/member/${memberid || ""}`;
	return <>
		<S.Breadcrumb.Divider />
		<S.Breadcrumb.Section><Link to={link}>{membername}</Link></S.Breadcrumb.Section>
	</>;
}

function StaleRoute(){
	return <>
		<BCContainer>
			<S.Breadcrumb.Section>
				<Link to={"/stale"}>Stale</Link>
			</S.Breadcrumb.Section>
		</BCContainer>
		<Stale />
	</>;
}

export interface BCContainerProps {
	children: JSX.Element | JSX.Element[];
}

export function BCContainer({children}: BCContainerProps){
	return <div>
		<S.Container>
			<S.Breadcrumb>
				{children || ''}
			</S.Breadcrumb>
		</S.Container>
		<hr />
	</div>;
}

function Logout(){
	useDispatch()(logout());

	return <div>
		<S.Header>Logging Out</S.Header>
	</div>;
}