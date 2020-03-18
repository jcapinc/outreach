import React from 'react';
import { AppState } from '../store';
import { useSelector } from 'react-redux';
import { Callout } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

export function Home(){
	const requests = useSelector((state: AppState) => state.currentState.requests);
	return <React.Fragment>
		{requests.length > 0 ? <ul>
			{requests.map(request => <li key={request.guid}>
				<Link to={"/prayer/" + request.guid}>{request.topic.length > 0 ? request.topic : request.guid}</Link>
			</li>)}
		</ul>: <Callout intent="none" title="There are no prayer requests">
			Create a new prayer request to get started.
		</Callout>}
	</React.Fragment>;
}