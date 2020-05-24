import React from 'react';
import * as S from 'semantic-ui-react';
import { IActivity } from '../../ModelTypes';
import JoditEditor, {} from 'jodit-react';
import dayjs from 'dayjs';

export type IAddActivityMethod = (activity: IActivity) => void;

export interface IActivityFormProps{
	onAddActivity: IAddActivityMethod;
	activity?: IActivity;
}

export const blankActivity: IActivity = {
	body: "",
	created: dayjs().format("YYYY-MM-DD"),
	creator: "",
	updated: dayjs().format("YYYY-MM-DD"),
	updatedBy: ""
};

export function ActivityForm(props: IActivityFormProps){
	const [activity, setActivity] = React.useState(props.activity || blankActivity);
	const editor = React.useRef(null);
	const config = { readonly: false };
	return <>
		<JoditEditor ref={editor} config={config} value={activity.body}
			onChange={body => setActivity({...activity, body})} />
		<S.Button onClick={() => props.onAddActivity(activity)}>Save</S.Button>
	</>;
}

export interface IActivityListProps extends IActivityFormProps{
	modifyActivity: (key: number, activity: IActivity) => void;
	activities: IActivity[];
}

export function ActivityList(props: IActivityListProps){
	return <>
		<ActivityForm onAddActivity={props.onAddActivity} activity={props.activity} />
		{props.activities.map((activity, index) => <ActivityDisplay activity={activity}
			updateActivityRecord={activity => props.modifyActivity(index,activity)} />)}
	</>;
}

export interface IActivityDisplayProps {
	updateActivityRecord: IAddActivityMethod;
	activity: IActivity;
}

export function ActivityDisplay({activity}:IActivityDisplayProps) {
	return <>
		<p dangerouslySetInnerHTML={{__html: activity.body}}></p>
		<p>{activity.creator} - {activity.created}</p>
		<hr />
	</>;
}