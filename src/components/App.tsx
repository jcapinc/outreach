import React from 'react';
import { Navigation } from './Navigation';
import { BrowserRouter as Router, Switch, Route, useParams, Link } from 'react-router-dom';
import { Home } from './Home';
import { useSelector } from 'react-redux';
import { AppState} from '../store';
import { Login } from './Login';
import { FamilyForm } from './Families';
import * as S from 'semantic-ui-react';


export function App(){
	const loggedIn = useSelector((state:AppState) => state.login.jwt !== undefined);
	return <Router>
		{ loggedIn ? <React.Fragment>
			<Navigation />
			<Switch>
				<Route exact path="/" component={Home} />
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
		<div>
			<S.Breadcrumb>
				<S.Breadcrumb.Section><Link to="/">Home</Link></S.Breadcrumb.Section>
				<S.Breadcrumb.Divider />
				<S.Breadcrumb.Section><Link to={"/family/" + id}>{surname} Family</Link></S.Breadcrumb.Section>
			</S.Breadcrumb>
			<hr />
		</div>
		<FamilyForm id={id || ""} />
	</React.Fragment>;
}