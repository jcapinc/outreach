import React, { KeyboardEvent } from 'react';
import './Login.scss';
import {useDispatch, useSelector} from 'react-redux';
import { attemptlogin, AppState } from "../store";
import * as S from 'semantic-ui-react';

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
	
	return <S.Card className="LoginBox">
		<h1 className={"bp3-heading"}>Login</h1>
		<S.FormGroup label="Username" labelFor="username" labelInfo="(required)">
			<S.Input id="username" type="text" autoFocus onChange={onchange(setUsername)} onKeyUp={onkeypress} />
		</S.FormGroup>
		<S.FormGroup label="Password" labelFor="password" labelInfo="(required)">
			<S.Input id="password" type="password" onChange={onchange(setPassword)} onKeyUp={onkeypress} />
		</S.FormGroup>
		{error !== undefined ? <S.Message negative={true}>
			<S.Message.Header>Error</S.Message.Header>{error}
		</S.Message>: ""}
		<S.Button className="loginSubmit" type="submit" onClick={onsubmit}>Submit</S.Button>
	</S.Card>;
}