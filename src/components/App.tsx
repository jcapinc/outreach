import React from 'react';
import { Navigation } from './Navigation';
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom';
import { Home } from './Home';
import { useSelector } from 'react-redux';
import { AppState } from '../store';
import { Login } from './Login';
import PrayerForm from './PrayerRequestForm';


export function App(){
	const loggedIn = useSelector((state:AppState) => state.login.jwt !== undefined);
	return <Router>
		{ loggedIn ? <React.Fragment>
			<Navigation />
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/prayer/:id" component={PrayerForm} />
			</Switch>
		</React.Fragment> : 
		<Login /> }
	</Router>;
}

function ParameterPrayerForm(){
	let {id} = useParams();
	return <PrayerForm id={id || ""} />
}