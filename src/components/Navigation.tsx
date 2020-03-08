import React from "react";
import {Navbar, Alignment, Button} from "@blueprintjs/core";
import {Link} from 'react-router-dom';

export const Navigation: React.FC<{}> = () => <Navbar>
	<Navbar.Group align={Alignment.LEFT}>
		<Navbar.Heading>Outreach</Navbar.Heading>
		<Navbar.Divider />
		<Link to="/"><Button className="bp3-minimal" icon="home" text="Home" /></Link>
		<Link to="/flock"><Button className="bp3-minimal" icon="document" text="Flock" /></Link>
	</Navbar.Group>
</Navbar>;