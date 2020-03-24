import React from 'react';
import { AppState } from '../store';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as S from 'semantic-ui-react';

export function Home(){
	//const requests = useSelector((state: AppState) => state.currentState.requests);
	return <div style={{textAlign:"center"}}>
		<S.Message  title="There are no prayer requests">
			Create a new prayer request to get started.
		</S.Message>}
	</div>;
}