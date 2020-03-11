import React from 'react';
import { Card, FormGroup, InputGroup, Menu } from '@blueprintjs/core';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import './Add.scss';

export default function AddPrayer(){
	const state = useSelector((app: AppState) => ({}));
	return <Card>
		<h1 className="bp3-heading">Add Prayer</h1>
		<div className="AddPrayerFormContainer">
			<div className="cell">
				<FormGroup label="Primary Prayer Target Name" labelFor="sheep" labelInfo="(required)">
					<InputGroup id="sheep" placeholder="Flock Member" />
				</FormGroup>
				<Menu className={}>

				</Menu>
			</div>
			<div className="cell">
				<FormGroup label="Primary Prayer Target Name" labelFor="sheep" labelInfo="(required)">
					<InputGroup id="sheep" placeholder="Flock Member" />
				</FormGroup>
			</div>
		</div>
	</Card>
}