import React from "react";
import {Navbar, Alignment, Button} from "@blueprintjs/core";

export const Navigation: React.FC<{}> = () => <Navbar>
	<Navbar.Group align={Alignment.LEFT}>
		<Navbar.Heading>Outreach</Navbar.Heading>
		<Navbar.Divider />
		<Button className="bp3-minimal" icon="home" text="Home" />
		<Button className="bp3-minimal" icon="document" text="Files" />
	</Navbar.Group>
</Navbar>;