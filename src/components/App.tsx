import React from 'react';
import { Navigation } from './Navigation';
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom';
import { Home } from './Home';
import { useSelector } from 'react-redux';
import { AppState } from '../store';
import { Login } from './Login';
import PrayerForm from './PrayerRequestForm';
import { Callout } from '@blueprintjs/core';


export function App(){
	const loggedIn = useSelector((state:AppState) => state.login.jwt !== undefined);
	return <Router>
		{ loggedIn ? <React.Fragment>
			<Navigation />
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/prayer/:id" component={ParameterPrayerForm} />
			</Switch>
		</React.Fragment> : 
		<Login /> }
	</Router>;
}

function ParameterPrayerForm(){
	const state = useSelector((state:AppState) => state.requests);
	const {id} = useParams();
	const record = state?.find(record => record.guid === id);
	if(record !== undefined) return <PrayerForm record={record} />;
	return <Callout title="Could not find prayer record">There was a problem when loading the prayer record</Callout>;
}