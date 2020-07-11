import React from 'react';
import * as S from 'semantic-ui-react';
import { IActivity } from '../../ModelTypes';
import JoditEditor from 'jodit-react';
import dayjs from 'dayjs';
import sanitize from 'sanitize-html';

export type IAddActivityMethod = (activity: IActivity) => void;

export interface IActivityFormProps {
	onAddActivity: IAddActivityMethod;
	activity?: IActivity;
	buttonText?: string;
}

export const blankActivity: IActivity = {
	body: "",
	created: dayjs().format("YYYY-MM-DD"),
	creator: "",
	updated: dayjs().format("YYYY-MM-DD"),
	updatedBy: "",
};

export function ActivityForm(props: IActivityFormProps) {
	const [activity, setActivity] = React.useState(props.activity || blankActivity);
	const config = { readonly: false };
	const editorBlur = (body: string) => {
		setActivity({...activity, body});
	};
	const editor = React.useRef(null);
	const buttonText = props.buttonText || "Add Activity";
	const activityFormSubmit = () => {
		if (activity.body !== '') {
			props.onAddActivity(activity);
		}
	};
	return <>
		<JoditEditor ref={editor} config={config} value={activity.body} onBlur={editorBlur} />
		<hr />
		<S.Button onClick={activityFormSubmit}>{buttonText}</S.Button>
		<hr />
	</>;
}

export interface IActivityListProps extends IActivityFormProps{
	modifyActivity: (key: number, activity: IActivity) => void;
	deleteActivity: (key: number) => void;
	activities: IActivity[];
}

export function ActivityList(props: IActivityListProps){
	return <>
		<ActivityForm onAddActivity={props.onAddActivity} activity={props.activity} />
		{props.activities.map((activity, index) => <ActivityDisplay activity={activity}
			deleteActivityRecord={() => props.deleteActivity(index)}
			updateActivityRecord={activity => props.modifyActivity(index,activity)} />)}
	</>;
}

export interface IActivityDisplayProps {
	updateActivityRecord: IAddActivityMethod;
	deleteActivityRecord: () => void;
	activity: IActivity;
}

export function ActivityDisplay({activity, updateActivityRecord, deleteActivityRecord}:IActivityDisplayProps) {
	const [edit, setEdit] = React.useState(false);
	const [confirm, setConfirmDelete] = React.useState(false);
	const [disabled, setDisabled] = React.useState(false);
	if (edit) {
		return <ActivityForm activity={activity} onAddActivity={activity => {
			updateActivityRecord(activity);
			setEdit(false);
		}} />
	}
	const confirmDelete = () => {
		setTimeout(() => setConfirmDelete(false), 10000);
		setTimeout(() => setDisabled(false), 1000);
		setDisabled(true);
		setConfirmDelete(true);
	};
	return <S.Segment style={{display:'flex', flexFlow:'row nowrap', alignItems:'flex-start'}}>
		<div style={{flex:'1 0', padding: '5px'}}>
			<p dangerouslySetInnerHTML={{__html: sanitize(activity.body)}}></p>
			<div style={{fontStyle:'italic'}}>{activity.creator} - {activity.created}</div>
		</div>
		<S.Button.Group style={{gridArea:'right'}}>
			<S.Button onClick={() => setEdit(true)} icon="edit" />
			{confirm 
				? <S.Button color="red" onClick={deleteActivityRecord} disabled={disabled}>
					Are you Sure you want to delete this?
				</S.Button> 
				: <S.Button color="red" onClick={confirmDelete} icon="delete" />}
		</S.Button.Group>
	</S.Segment>;
}