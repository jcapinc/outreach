import React from 'react';
import RichTextEditor, { EditorValue } from 'react-rte';
import { Card, FormGroup, InputGroup, Menu, MenuItem, Button, Tag } from '@blueprintjs/core';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, DeletePrayerRequest } from '../store';
import { IPrayerRequest, ISheep, IEventRecord } from '../../ModelTypes';
import { Redirect } from 'react-router-dom';
import uniqid from 'uniqid';

import './PrayerRequestForm.scss';

export interface IPrayerFormProps{
	record: IPrayerRequest;
	onSave: (req: IPrayerRequest) => void
}

export default function PrayerForm({record, onSave}: IPrayerFormProps){
	const [formState, setFormState] = React.useState<IPrayerRequest>(record);
	const [wysiwygState, setWysiwygState] = React.useState(RichTextEditor.createValueFromString(formState.body,"html"));
	const [editDescription, setEditDescription] = React.useState(record.body.length === 0);

	const update = (field: keyof IPrayerRequest, input: string) => {
		setFormState({...formState,[field]: input});
	};

	const genOnChange = (field: keyof IPrayerRequest) => (e:React.ChangeEvent<HTMLInputElement>) => 
		update(field, e.target.value);
	const genOnChangeRTE = (field: keyof IPrayerRequest) => (e:EditorValue) => {
		update(field as keyof IPrayerRequest, e.toString('html') || "");
		setWysiwygState(e);
	};

	const addSheep = (sheep:ISheep) => {
		if(formState.sheep.find(record => sheep.guid === record.guid) !== undefined) return;
		formState.sheep.push(sheep);
		setFormState({...formState});
	}

	const removeSheep = (index: number) => () => {
		console.log(formState);
		formState.sheep.splice(index,1);
		console.log(formState);
		setFormState({...formState});
	};

	return <Card className="PrayerCardContainer">
		<PrayerDeleteButton record={record} />
		<h1 className="bp3-heading oneline">
			Prayer Request{formState.topic !== undefined && formState.topic.length > 0 ? ": " + formState.topic : ""}
		</h1>
		<div className="AddPrayerFormContainer">
			<div className="cell">
				<PrayerFlockSearch addSheep={addSheep} />
				{formState.sheep.length > 0 ? <React.Fragment>
					<p>Related Sheep:</p>
						{formState.sheep.map((sheep, index) => 
							<Tag key={sheep.guid} onRemove={removeSheep(index)}>
								{sheep.firstname} {sheep.lastname}
							</Tag>)}
				</React.Fragment>: ""}
			</div>
			<div className="cell">
				<FormGroup label="Topic" labelFor="topic">
					<InputGroup id="topic" placeholder="Choose Topic for Prayer" onChange={genOnChange("topic")} value={formState.topic} />
				</FormGroup>
			</div>
			<div className="cell">
				{editDescription ? <FormGroup label="Summary" labelFor="body">
					<RichTextEditor onChange={genOnChangeRTE("body")} value={wysiwygState} className="body" />
				</FormGroup> : <React.Fragment>
					<Button style={{float:'right'}} onClick={() => setEditDescription(true)}>Edit Description</Button>
					<p dangerouslySetInnerHTML={{__html: record.body}}></p>
				</React.Fragment>}
			</div>
		</div>
		<Button intent="primary" onClick={() => {onSave(formState); setEditDescription(record.body.length === 0);}}>Save</Button>
		<PrayerFormEvents events={record.events} addEvent={event => {formState.events.push(event);setFormState({...formState});}}
			deleteEvent={() => undefined} editEvent={() => undefined} />
		<hr />
		<Button intent="primary" onClick={() => {onSave(formState); setEditDescription(record.body.length === 0);}}>Save</Button>
	</Card>;
}

export interface IPrayerFlockSearchProps {
	addSheep: (sheep:ISheep) => void;
}

export function PrayerFlockSearch({addSheep}:IPrayerFlockSearchProps){
	const sheep = useSelector((state: AppState) => state.currentState.requests.reduce((current, req) => {
		req.sheep.map(sheep => current.push(sheep));
		return current;
	}, [] as ISheep[]));
	const [found, setFound] = React.useState<ISheep[]>([])
	const [search, setSearch] = React.useState("");

	const onSearchChange = function(e: React.ChangeEvent<HTMLInputElement>){
		setSearch(e.target.value);
		if(e.target.value === "") return setFound([]);
		const regex = new RegExp(".*" + e.target.value.toLowerCase() + ".*");
		setFound(Object.values(sheep.reduce(function(records, sheep){
			[sheep.firstname, sheep.lastname, `${sheep.firstname} ${sheep.lastname}`].map(name => {
				console.log(name, regex.test(name.toLowerCase()), regex.exec(name.toLowerCase()));
				if(regex.test(name.toLowerCase())) records[sheep.guid] = sheep;
			});
			return records;
		},{} as Record<string, ISheep>)));
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
			<FormGroup label="Related Sheep" labelFor="sheep">
			<InputGroup id="sheep" placeholder="Flock Member" onChange={onSearchChange} leftIcon="search" value={search} autoComplete="off" />
		</FormGroup>
		{found.length > 0 ? <Card>
			<Menu className="SearchResults">{found.map(sheep => 
				<MenuItem onClick={() => {addSheep(sheep); setSearch(""); setFound([])}} key={sheep.guid} icon="add" 
					text={`${sheep.firstname} ${sheep.lastname}`}  />)}
			</Menu>
		</Card> : "" }
		{search.length > 0 ? <Button onClick={createSheep}>Add Sheep Named '{search}'?</Button> : ""}
	</React.Fragment>;
}

export type EventMethod = (record:IEventRecord) => void;

export interface IPrayerFormEventsProps{
	events: IEventRecord[];
	addEvent: EventMethod;
	editEvent: EventMethod;
	deleteEvent: EventMethod;
}

export function PrayerFormEvents({events, addEvent, editEvent,deleteEvent}:IPrayerFormEventsProps) {
	const [wysiwygState, setWysiwygState] = React.useState(RichTextEditor.createEmptyValue());
	const createEvent = () => {
		addEvent({
			date: (new Date()).toUTCString(),
			guid: uniqid(),
			message: wysiwygState.toString("html")
		});
		setWysiwygState(RichTextEditor.createEmptyValue());
	}
	return <React.Fragment>
		<h2 className="bp3-header">Add Update</h2>
		<RichTextEditor onChange={setWysiwygState} value={wysiwygState} className="body" />
		<Button onClick={createEvent}>Add Update</Button>
		{Array.from(events).reverse().map(event => <PrayerFormEvent event={event} editEvent={editEvent} />)}
	</React.Fragment>;
}

export interface IPrayerFormEventProps{
	event: IEventRecord;
	editEvent: EventMethod;
}

export function PrayerFormEvent({event, editEvent}: IPrayerFormEventProps){
	const [edit,setEdit] = React.useState(false);
	const [wysiwygState, setWysiwygState] = React.useState(RichTextEditor.createValueFromString(event.message,"html"));
	const save = () => {
		editEvent(Object.assign({}, event, {message: wysiwygState.toString("html")}));
		setEdit(false);
	};
	return <React.Fragment key={event.guid}>
		<hr />
		<p className="eventDate">{event.date}</p>
		{edit ? <React.Fragment>
			<RichTextEditor onChange={setWysiwygState} value={wysiwygState} className="body" />
			<Button onClick={save}>Save</Button>
		</React.Fragment> : <React.Fragment>
			<Button small onClick={() => setEdit(true)} style={{float:"right"}}>Edit</Button>
			<p dangerouslySetInnerHTML={{__html:event.message}}></p>
		</React.Fragment>}
	</React.Fragment>
}

export interface IPrayerDeleteButtonProps {
	record: IPrayerRequest;
	redirect?: string;
}

export function PrayerDeleteButton({record, redirect = "/"}: IPrayerDeleteButtonProps) {
	const [confirm, setConfirm] = React.useState(false);
	const [clickable, setClickable] = React.useState(false);
	const [deleted, setDeleted] = React.useState(false);
	const dispatch = useDispatch();
	let confirmedTimeout: NodeJS.Timeout = setTimeout(() => null, 0);
	const deleteClick = () => {
		setConfirm(true);
		setTimeout(() => setClickable(true), 1000);
		confirmedTimeout = setTimeout(() => setConfirm(false), 10000);
	}
	const confirmClick = () => {
		clearTimeout(confirmedTimeout);
		setDeleted(true);
		dispatch(DeletePrayerRequest(record) );
	}
	if(deleted) return <Redirect to={redirect} />
	if(confirm) return <Button style={{float:'right'}} onClick={confirmClick} disabled={!clickable} intent="primary">Are You Sure You Want To Delete?</Button>;
	else return <Button style={{float:'right'}}  onClick={deleteClick} intent="danger">Delete Prayer Request</Button>;
}