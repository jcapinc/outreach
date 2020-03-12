import React from 'react';
import { Card, FormGroup, InputGroup, Menu, MenuItem } from '@blueprintjs/core';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, PrayerSheepSearch } from '../../store';
import './Add.scss';

export default function AddPrayer(){
	const state = useSelector((app: AppState) => app.addprayer);
	const dispatch = useDispatch();
	let timeout: NodeJS.Timeout;
	const onSearchChange = function(e: React.ChangeEvent<HTMLInputElement>){
		if(timeout !== undefined){
			clearTimeout(timeout)
		}
		e.persist();
		timeout = setTimeout(function(){
			dispatch(PrayerSheepSearch(e.target.value));
		},500);
	}
	return <Card className="AddPrayerCardContainer">
		<h1 className="bp3-heading">Add Prayer</h1>
		<div className="AddPrayerFormContainer">
			<div className="cell">
				<FormGroup label="Primary Prayer Target Name" labelFor="sheep" labelInfo="(required)">
					<InputGroup id="sheep" placeholder="Flock Member" onChange={onSearchChange} leftIcon="search" />
				</FormGroup>
				<Menu className="">
					{state.sheepSearch.found.map(sheep => 
						<MenuItem text={`${sheep.firstname} ${sheep.lastname}`} icon="add" />)}
				</Menu>
			</div>
		</div>
	</Card>
}