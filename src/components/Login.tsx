import React from 'react';
import {Card, FormGroup, InputGroup, Button, Callout} from '@blueprintjs/core';
import './Login.scss';
import {useDispatch} from 'react-redux';

export const Login: React.FC<{}> = () => {
	const [username, setUsername] = React.useState<string>();
	const [password, setPassword] = React.useState<string>();
	const [error, setError] = React.useState<string>()
	const dispatch = useDispatch();
	const onchange = (dispatch:typeof setUsername) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setError(undefined);
		dispatch(e.target.value);
	};
	
	return <Card className="LoginBox">
		<h1 className={"bp3-heading"}>Login</h1>
		<FormGroup label="Username" labelFor="username" labelInfo="(required)">
			<InputGroup id="username" autoFocus onChange={onchange(setUsername)} />
		</FormGroup>
		<FormGroup label="Password" labelFor="password" labelInfo="(required)">
			<InputGroup id="password" type="password" onChange={onchange(setPassword)} />
		</FormGroup>
		{typeof error === "string" ? <Callout intent="danger">
			<h4 className="bp3-heading">Error</h4>{error}
		</Callout>: ""}
		<Button className="loginSubmit" type="submit" onClick={}>Submit</Button>
	</Card>;
}