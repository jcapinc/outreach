import React from "react";
import {Link} from 'react-router-dom';
import { useDispatch } from "react-redux";
import { logout } from "../store";
import * as S from 'semantic-ui-react';

export const Navigation: React.FC<{}> = () => {
	// const dispatch = useDispatch();
	return <S.Menu>
		<S.Menu.Header>Outreach</S.Menu.Header>
		<S.Menu.Item><Link to="/">Home</Link></S.Menu.Item>
	</S.Menu>;
}