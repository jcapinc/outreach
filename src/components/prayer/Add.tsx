import React from 'react';
import { Card, FormGroup, InputGroup, Menu, MenuItem, Spinner, Button } from '@blueprintjs/core';
import { useSelector, useDispatch } from 'react-redux';
import RichTextEditor, { EditorValue } from 'react-rte';
import { 
	AppState, 
	PrayerSheepSearch, 
	IAddPrayerFormValues, 
	UpdatePrayerRequestForm, 
	UpdatePrayerRequestServer 
} from '../../store';
import './Add.scss';

let timeout = setTimeout(() => null, 0);

export default function AddPrayer(){
	const state = useSelector((app: AppState) => app.addprayer.form);
	const [formState, setFormState] = React.useState<IAddPrayerFormValues>({topic: "",body: "",guid: "",...state});
	const [wysiwygState, setWysiwygState] = React.useState(RichTextEditor.createValueFromString(formState.body,"html"));
	const dispatch = useDispatch();

	const update = (field: keyof IAddPrayerFormValues, input: string) => {
		setFormState({...formState,[field]: input});
		dispatch(UpdatePrayerRequestForm({[field]: input}));
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			dispatch(UpdatePrayerRequestServer(formState));
		}, 2000);
	};

	const genOnChange = (field: keyof IAddPrayerFormValues) => (e:React.ChangeEvent<HTMLInputElement>) => {
		update(field, e.target.value);
	};
	const genOnChangeRTE = (field: keyof IAddPrayerFormValues) => (e:EditorValue) => {
		update(field, e.toString('html'));
		setWysiwygState(e);
	};

	return <Card className="AddPrayerCardContainer">
		<h1 className="bp3-heading">Add Prayer</h1>
		<div className="AddPrayerFormContainer">
			<div className="cell">
				<AddPrayerFlockSearch />
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
	</Card>;
}

export function AddPrayerFlockSearch(){
	let timeout: NodeJS.Timeout;
	const dispatch = useDispatch();
	const onSearchChange = function(e: React.ChangeEvent<HTMLInputElement>){
		if(timeout !== undefined){
			clearTimeout(timeout)
		}
		e.persist();
		timeout = setTimeout(function(){
			dispatch(PrayerSheepSearch(e.target.value));
		},500);
	};
	const [sheepSearch] = useSelector((app: AppState) => [app.addprayer.sheepSearch]);
	const shouldAdd = sheepSearch.found.length === 0 && sheepSearch.search.length > 0 && sheepSearch.shepherdWorking === false;
	return <React.Fragment>
			<FormGroup label="Prayer Targets" labelFor="sheep" labelInfo="(required)">
			<InputGroup id="sheep" placeholder="Flock Member" onChange={onSearchChange} leftIcon="search" />
		</FormGroup>
		{sheepSearch.shepherdWorking ? <Spinner></Spinner> : ""}
		{sheepSearch.found.length > 0 ? <Card>
			<Menu className="SearchResults">
				{sheepSearch.found.map(sheep => 
					<MenuItem text={`${sheep.firstname} ${sheep.lastname}`} icon="add"  />)}
			</Menu>
		</Card> : "" }
		{shouldAdd ? <Button>Add Sheep Named '{sheepSearch.search}'?</Button> : ""}
	</React.Fragment>;
}