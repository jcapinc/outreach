import React from "react";
import {Navbar, Alignment, Button} from "@blueprintjs/core";
import {Link} from 'react-router-dom';
import { useDispatch } from "react-redux";
import { logout } from "../store";

export const Navigation: React.FC<{}> = () => {
	const dispatch = useDispatch();
	return <Navbar>
		<Navbar.Group align={Alignment.LEFT}>
			<Navbar.Heading>Outreach</Navbar.Heading>
			<Navbar.Divider />
			<Link to="/"><Button className="bp3-minimal" icon="home" text="Home" /></Link>
			<Link to="/prayer"><Button className="bp3-minimal" icon="add" text="Add Prayer" /></Link>
		</Navbar.Group>
		<Navbar.Group align={Alignment.RIGHT}>
			<Button className="bp3-minimal" icon="log-out" text="Logout" onClick={() => dispatch(logout())} />
		</Navbar.Group>
	</Navbar>;
}