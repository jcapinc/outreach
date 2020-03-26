import React from "react";
import {Link} from 'react-router-dom';
import * as S from 'semantic-ui-react';
import "./Navigation.scss";

export const Navigation: React.FC<{}> = () => {
	// const dispatch = useDispatch();
	return <S.Menu>
		<div className="brand">Outreach</div>
		<S.Menu.Item><Link to="/">Home</Link></S.Menu.Item>
	</S.Menu>;
}