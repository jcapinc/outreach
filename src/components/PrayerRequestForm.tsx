import React from 'react';
import { Card, FormGroup, InputGroup, Menu, MenuItem, Button } from '@blueprintjs/core';
import { useSelector } from 'react-redux';
import RichTextEditor, { EditorValue } from 'react-rte';
import { AppState } from '../store';
import { IPrayerRequest, ISheep } from '../../ModelTypes';
import uniqid from 'uniqid';

import './PrayerRequestForm.scss';

export interface IPrayerFormProps{
	record: IPrayerRequest;
	onSave: (req: IPrayerRequest) => void
}

export default function PrayerForm({record, onSave}: IPrayerFormProps){
	const [formState, setFormState] = React.useState<IPrayerRequest>(record);
	const [wysiwygState, setWysiwygState] = React.useState(RichTextEditor.createValueFromString(formState.body,"html"));

	const update = (field: keyof IPrayerRequest, input: string) => {
		setFormState({...formState,[field]: input});
	};

	const genOnChange = (field: keyof IPrayerRequest) => (e:React.ChangeEvent<HTMLInputElement>) => 
		update(field, e.target.value);
	const genOnChangeRTE = (field: keyof IPrayerRequest) => (e:EditorValue) => {
		update(field as keyof IPrayerRequest, e.toString('html'));
		setWysiwygState(e);
	};

	const addSheep = (sheep:ISheep) => {
		formState.sheep.push(sheep);
		setFormState({...formState});
	}

	return <Card className="PrayerCardContainer">
		<h1 className="bp3-heading oneline">
			Prayer Request{formState.topic !== undefined && formState.topic.length > 0 ? ": " + formState.topic : ""}
		</h1>
		<div className="AddPrayerFormContainer">
			<div className="cell">
				<PrayerFlockSearch addSheep={addSheep} />
				{formState.sheep.length > 0 ? <React.Fragment>
					<p>Related Sheep:</p>
					<ul>
						{formState.sheep.map(sheep => 
							<li key={sheep.guid}>{sheep.firstname} {sheep.lastname}</li>)}
					</ul>
				</React.Fragment>: ""}
			</div>
			<div className="cell">
				<FormGroup label="Topic" labelFor="topic">
					<InputGroup id="topic" placeholder="Choose Topic for Prayer" onChange={genOnChange("topic")} value={formState.topic} />
				</FormGroup>
			</div>
			<div className="cell">
				<FormGroup label="Summary" labelFor="body">
					<RichTextEditor onChange={genOnChangeRTE("body")} value={wysiwygState} className="body" />
				</FormGroup>
			</div>
		</div>
		<button onClick={() => onSave(formState)}>Save</button>
	</Card>;
}

export interface PrayerFlockSearchProps{
	addSheep: (sheep:ISheep) => void;
}

export function PrayerFlockSearch({addSheep}:PrayerFlockSearchProps){
	let timeout: NodeJS.Timeout;
	const sheep = useSelector((state: AppState) => state.currentState.requests.reduce((current, req) => {
		req.sheep.map(sheep => current.push(sheep));
		return current;
	}, [] as ISheep[]));
	let found: ISheep[] = [];
	const [search, setSearch] = React.useState("");

	const onSearchChange = function(e: React.ChangeEvent<HTMLInputElement>){
		setSearch(e.target.value);
		if(timeout !== undefined){
			clearTimeout(timeout)
		}
		e.persist();
		timeout = setTimeout(function(){
			const regex = new RegExp("/.*" + search.toLowerCase() + ".*/");
			found = Object.values(sheep.reduce(function(records, sheep){
				[sheep.firstname, sheep.lastname, `${sheep.firstname} ${sheep.lastname}`].map(name => {
					if(regex.test(name)) records[sheep.guid] = sheep;
				});
				return records;
			},{} as Record<string, ISheep>))
		},500);
	};
	
	const createSheep = () => {
		const parts = search.split(' ');
		const sheep:ISheep = {
			firstname: parts[0],
			lastname: parts[1],
			guid: uniqid()
		};
		setSearch("");
		addSheep(sheep);
	};
	return <React.Fragment>
			<FormGroup label="Prayer Targets" labelFor="sheep" labelInfo="(required)">
			<InputGroup id="sheep" placeholder="Flock Member" onChange={onSearchChange} leftIcon="search" value={search} />
		</FormGroup>
		{found.length > 0 ? <Card>
			<Menu className="SearchResults">{found.map(sheep => 
				<MenuItem onClick={() => addSheep(sheep)} icon="add" 
					text={`${sheep.firstname} ${sheep.lastname}`}  />)}
			</Menu>
		</Card> : "" }
		{search.length > 0 ? <Button onClick={createSheep}>Add Sheep Named '{search}'?</Button> : ""}
	</React.Fragment>;
}