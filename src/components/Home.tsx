import React from 'react';
import { AppState } from '../store';
import { useSelector } from 'react-redux';
import { Callout, Tag } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

export function Home(){
	const requests = useSelector((state: AppState) => state.currentState.requests);
	return <div style={{textAlign:"center"}}>

		{requests.length > 0 ? requests.map(request => <Link to={"/prayer/" + request.guid}>
				<Tag large={true} round={true} key={request.guid}>
					{request.topic.length > 0 ? request.topic : request.guid}
				</Tag>
		</Link>): 
		<Callout intent="none" title="There are no prayer requests">
			Create a new prayer request to get started.
		</Callout>}
	</div>;
}