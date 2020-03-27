import React from 'react';
import { Navigation } from './Navigation';
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom';
import { Home } from './Home';
import { useSelector } from 'react-redux';
import { AppState} from '../store';
import { Login } from './Login';
import { FamilyForm } from './Families';


export function App(){
	const loggedIn = useSelector((state:AppState) => state.login.jwt !== undefined);
	return <Router>
		{ loggedIn ? <React.Fragment>
			<Navigation />
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/family/:id" component={() => <div></div>} />
			</Switch>
		</React.Fragment> : 
		<Login /> }
	</Router>;
}

export function FamilyRoute(){
	let {id} = useParams();
	return <FamilyForm id={id || ""} />;
}