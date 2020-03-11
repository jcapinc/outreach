import React from 'react';
import { Navigation } from './Navigation';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home } from './Home';
import { useSelector } from 'react-redux';
import { AppState } from '../store';
import { Login } from './Login';
import AddPrayer from './prayer/Add';


export function App(){
	const loggedIn = useSelector((state:AppState) => state.login.jwt !== undefined);
	return <Router>
		{ loggedIn ? <React.Fragment>
			<Navigation />
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/add-prayer" component={AddPrayer} />
			</Switch>
		</React.Fragment> : 
		<Login /> }
	</Router>;
}

function flock(){
	return <h2>Flock</h2>;
}