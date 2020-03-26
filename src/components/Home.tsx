import React from 'react';
import * as S from 'semantic-ui-react';

export function Home(){
	//const requests = useSelector((state: AppState) => state.currentState.requests);
	return <HomeMarkup />
}

export interface IHomeMarkupProps{}

export function HomeMarkup(props: IHomeMarkupProps) {
	return <div style={{textAlign:"center"}}>
		
	<S.Message>
		<S.Message.Header>There are No Families</S.Message.Header>
		Create a new prayer request to get started.
	</S.Message>}
</div>;
}