import React from 'react';
import {Card, FormGroup, InputGroup, Button, Callout} from '@blueprintjs/core';
import './Login.scss';
import {useDispatch, useSelector} from 'react-redux';
import { attemptlogin, AppState } from "../store";

export const Login: React.FC<{}> = () => {
	const [username, setUsername] = React.useState<string>();
	const [password, setPassword] = React.useState<string>();
	const dispatch = useDispatch();
	const state = useSelector((state: AppState) => state.login);
	const onchange = (dispatch:typeof setUsername) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
		{state.error ? <Callout intent="danger">
			<h4 className="bp3-heading">Error</h4>{state.error}
		</Callout>: ""}
		<Button className="loginSubmit" type="submit" onClick={() => dispatch(attemptlogin(username || "", password || ""))}>Submit</Button>
	</Card>;
}