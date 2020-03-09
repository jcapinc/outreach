import React, { KeyboardEvent } from 'react';
import {Card, FormGroup, InputGroup, Button, Callout} from '@blueprintjs/core';
import './Login.scss';
import {useDispatch, useSelector} from 'react-redux';
import { attemptlogin, AppState } from "../store";

export const Login: React.FC<{}> = () => {
	const [username, setUsername] = React.useState<string>();
	const [password, setPassword] = React.useState<string>();
	const dispatch = useDispatch();
	const error = useSelector((state: AppState) => state.login.error);
	console.log(error);
	const onchange = (dispatch:typeof setUsername) => (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(e.target.value);
	};

	const onsubmit = () => dispatch(attemptlogin(username || "", password || ""));
	const onkeypress = (e: KeyboardEvent<HTMLInputElement>) => {
		if(e.keyCode === 13) onsubmit();
	};
	
	return <Card className="LoginBox">
		<h1 className={"bp3-heading"}>Login</h1>
		<FormGroup label="Username" labelFor="username" labelInfo="(required)">
			<InputGroup id="username" autoFocus onChange={onchange(setUsername)} onKeyUp={onkeypress} />
		</FormGroup>
		<FormGroup label="Password" labelFor="password" labelInfo="(required)">
			<InputGroup id="password" type="password" onChange={onchange(setPassword)} onKeyUp={onkeypress} />
		</FormGroup>
		{error !== undefined ? <Callout intent="danger">
			<h4 className="bp3-heading">Error</h4>{error}
		</Callout>: ""}
		<Button className="loginSubmit" type="submit" onClick={onsubmit}>Submit</Button>
	</Card>;
}