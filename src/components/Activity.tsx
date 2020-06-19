import React from 'react';
import * as S from 'semantic-ui-react';
import { IActivity } from '../../ModelTypes';
import JoditEditor from 'jodit-react';
import dayjs from 'dayjs';

export type IAddActivityMethod = (activity: IActivity) => void;

export interface IActivityFormProps{
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

export function ActivityForm(props: IActivityFormProps){
	const [activity, setActivity] = React.useState(props.activity || blankActivity);
	const [clean, setClean] = React.useState(true);
	const config = { readonly: false };
	const editorBlur = (body: string) => {
		setActivity({...activity, body});
		setClean(false);
	};
	const editor = React.useRef(null);
	const buttonText = props.buttonText || "Add Activity";
	return <>
		<JoditEditor ref={editor} config={config} value={activity.body} onBlur={editorBlur} />
		<hr />
		<S.Button onClick={() => props.onAddActivity(activity)} disabled={clean}>{buttonText}</S.Button>
		<hr />
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