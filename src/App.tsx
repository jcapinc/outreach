import React from 'react';
import './App.css';
import {Navbar, Alignment, Button} from '@blueprintjs/core'

function App() {
  return (
    <div>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Outreach</Navbar.Heading>
          <Navbar.Divider />
          <Button className="bp3-minimal" icon="home" text="Home" />
          <Button className="bp3-minimal" icon="document" text="Files" />
        </Navbar.Group>
      </Navbar>
    </div>
  );
}

export default App;
